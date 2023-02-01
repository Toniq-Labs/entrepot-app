import {LocalCacheOptions} from './cache-options';
import {
    AnyFunction,
    areJsonEqual,
    awaitedForEach,
    extractErrorMessage,
    JsonCompatibleValue,
    Overwrite,
    UnPromise,
    wait,
} from '@augment-vir/common';
import {Promisable} from 'type-fest';
import {maskOptionsWithGlobalOptions} from './global-cache-options';
import {localForage} from './localforage-shim';

export enum SubKeyRequirementEnum {
    // sub keys are always required to be passed into cache get methods
    Required = 'required',
    // sub keys can be omitted when calling cache get methods
    Optional = 'optional',
    // sub keys must never be provided when calling cache get methods
    Blocked = 'blocked',
}

type CacheAccessCallback<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
> = SubKeyRequirementGeneric extends SubKeyRequirementEnum.Blocked
    ? () => Promisable<UnPromise<ValueGeneric>>
    : SubKeyRequirementGeneric extends SubKeyRequirementEnum.Required
    ? (keyInputs: KeyInputsGeneric) => Promisable<UnPromise<ValueGeneric>>
    : (keyInputs?: KeyInputsGeneric | undefined) => Promisable<UnPromise<ValueGeneric>>;

export type LocalCacheDefinitionSetup<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
> = {
    cacheName: string;
    subKeyRequirement: SubKeyRequirementGeneric;
    valueUpdater: CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>;
    keyGenerator: (keyInputs: KeyInputsGeneric) => string;
} & Partial<LocalCacheOptions>;

type ListenerOutput<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
> = SubKeyRequirementGeneric extends SubKeyRequirementEnum.Blocked
    ? {
          newValue: UnPromise<ValueGeneric>;
      }
    : SubKeyRequirementGeneric extends SubKeyRequirementEnum.Required
    ? {
          generatedKey: string;
          newValue: UnPromise<ValueGeneric>;
      }
    : {
          generatedKey?: string;
          newValue: UnPromise<ValueGeneric>;
      };

type Listener<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
> = (output: ListenerOutput<ValueGeneric, SubKeyRequirementGeneric>) => Promise<void> | void;

type UnSubscribe = () => void;

export type SubscribeToCache<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
> = (listener: Listener<ValueGeneric, SubKeyRequirementGeneric>) => UnSubscribe;

type GenerateKeyProp<
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
> = SubKeyRequirementGeneric extends SubKeyRequirementEnum.Blocked
    ? {}
    : {
          generateKey: (inputs: KeyInputsGeneric) => string;
      };

export type LocalCacheDefinition<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
> = {
    get: CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>;
    forceImmediateUpdate: CacheAccessCallback<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >;
    subscribe: SubscribeToCache<ValueGeneric, SubKeyRequirementGeneric>;
} & GenerateKeyProp<SubKeyRequirementGeneric, KeyInputsGeneric>;

const defaultSubKey = Symbol('default-sub-key');

type MemoryEntry<ValueGeneric extends JsonCompatibleValue> = {
    /** If memory cache is disabled, this data property will not get set. */
    cachedData: Partial<Record<string | typeof defaultSubKey, UnPromise<ValueGeneric>>>;
    lastUpdate: number;
    generatedKeys: Set<string | typeof defaultSubKey>;
    lastGeneratedKeyInputs: Map<string | typeof defaultSubKey, object>;
};

function logIf(setup: Pick<LocalCacheOptions, 'enableLogging'>, ...inputs: unknown[]) {
    if (setup.enableLogging) {
        console.info(...inputs);
    }
}

const memoryCache: {[cacheName: string]: MemoryEntry<any>} = {};
// for debugging
(globalThis as any).InMemoryEntrepotCache = memoryCache;

export function defineAutomaticallyUpdatingCache<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    rawInputs: LocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>,
): LocalCacheDefinition<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric> {
    const setup = {
        ...rawInputs,
        ...maskOptionsWithGlobalOptions(rawInputs),
    };

    if (memoryCache[setup.cacheName]) {
        throw new Error(`Tried to setup '${setup.cacheName}' cache but it is already setup.`);
    }

    const memoryEntry: MemoryEntry<ValueGeneric> = setupMemoryEntry(setup);
    memoryCache[setup.cacheName] = memoryEntry;

    let lastTimeoutId: number | undefined;

    function setNextUpdate() {
        if (!setup.enableAutomaticUpdating) {
            return;
        }

        globalThis.clearTimeout(lastTimeoutId);
        lastTimeoutId = (globalThis.setTimeout as Window['setTimeout'])(async () => {
            setNextUpdate();
            logIf(setup, `Updating '${setup.cacheName}' cache`);
            const cachedKeys = Array.from(memoryEntry.generatedKeys);

            await awaitedForEach(cachedKeys, async generatedKey => {
                fireListeners(generatedKey);
            });
        }, setup.minUpdateInterval);
    }

    async function fireListeners(generatedKey: string | typeof defaultSubKey) {
        const accessorKey = generatedKey === defaultSubKey ? undefined : generatedKey;
        const lastInputs = memoryEntry.lastGeneratedKeyInputs.get(generatedKey);

        const lastValue = await getValue(
            {...setup, enableLogging: false},
            accessorKey,
            memoryEntry,
            lastInputs as KeyInputsGeneric,
            false,
        );
        const newValue = await updateValue(
            setup,
            accessorKey,
            memoryEntry,
            lastInputs as KeyInputsGeneric,
        );
        try {
            if (!lastValue || !areJsonEqual(lastValue, newValue)) {
                const listenerOutput: ListenerOutput<ValueGeneric, SubKeyRequirementGeneric> = (
                    setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
                        ? {
                              newValue,
                          }
                        : generatedKey === defaultSubKey
                        ? {
                              newValue,
                          }
                        : {
                              generatedKey,
                              newValue,
                          }
                ) as ListenerOutput<ValueGeneric, SubKeyRequirementGeneric>;
                listeners.forEach(listener => listener(listenerOutput));
            }
        } catch (error) {
            console.error('errored data:', {
                cacheName: setup.cacheName,
                lastValue,
                newValue,
            });
            throw error;
        }
    }

    async function forceUpdate(generatedKey: string | undefined) {
        setNextUpdate();
        const lastInputs = memoryEntry.lastGeneratedKeyInputs.get(generatedKey || defaultSubKey);

        const newValue = await updateValue(
            setup,
            generatedKey,
            memoryEntry,
            lastInputs as KeyInputsGeneric,
        );
        fireListeners(generatedKey ?? defaultSubKey);
        return newValue;
    }

    setNextUpdate();

    const listeners = new Set<Listener<ValueGeneric, SubKeyRequirementGeneric>>();

    function generateKey(keysInput: KeyInputsGeneric | undefined): string | undefined {
        if (keysInput == undefined) {
            return undefined;
        } else {
            return setup.keyGenerator(keysInput);
        }
    }

    const keyGenerator: GenerateKeyProp<SubKeyRequirementGeneric, KeyInputsGeneric> =
        setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
            ? ({} as GenerateKeyProp<SubKeyRequirementGeneric, KeyInputsGeneric>)
            : ({
                  generateKey: generateKey,
              } as GenerateKeyProp<SubKeyRequirementGeneric, KeyInputsGeneric>);

    return {
        get: (async (keyInputs?: KeyInputsGeneric | undefined) => {
            const generatedKey = generateKey(keyInputs);

            if (keyInputs) {
                memoryEntry.lastGeneratedKeyInputs.set(generatedKey || defaultSubKey, keyInputs);
            }

            const results = await getValue(
                setup,
                generatedKey,
                memoryEntry,
                keyInputs as KeyInputsGeneric,
                true,
            );
            if (results.shouldUpdateCache) {
                logIf(setup, `Updating '${setup.cacheName}' in the background.`);
                // don't await this, it needs to happen in the background
                wait(
                    /**
                     * Random wait done to stagger loads and push them back off of the initial page
                     * load.
                     */
                    Math.random() * 2000,
                ).then(() => forceUpdate(generatedKey));
            }

            return results.value;
        }) as CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>,
        forceImmediateUpdate: (async (keyInputs?: KeyInputsGeneric | undefined) => {
            const generatedKey = generateKey(keyInputs);

            if (keyInputs) {
                memoryEntry.lastGeneratedKeyInputs.set(generatedKey || defaultSubKey, keyInputs);
            }

            return forceUpdate(generatedKey);
        }) as CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>,
        subscribe: ((listener: Listener<ValueGeneric, SubKeyRequirementGeneric>) => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        }) as SubscribeToCache<ValueGeneric, SubKeyRequirementGeneric>,
        ...keyGenerator,
    };
}

function setupMemoryEntry<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
): MemoryEntry<ValueGeneric> {
    const initCachedKeys: MemoryEntry<ValueGeneric>['generatedKeys'] =
        setup.subKeyRequirement === SubKeyRequirementEnum.Required
            ? new Set()
            : new Set([defaultSubKey]);
    const newCacheEntry: MemoryEntry<ValueGeneric> = {
        lastUpdate: 0,
        generatedKeys: initCachedKeys,
        lastGeneratedKeyInputs: new Map(),
        cachedData: {},
    };

    return newCacheEntry;
}

type MaskedLocalCacheDefinitionSetup<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
> = Overwrite<
    LocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, KeyInputsGeneric>,
    LocalCacheOptions
>;

async function updateValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
    generatedKey: string | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    inputs: KeyInputsGeneric,
): Promise<UnPromise<ValueGeneric>> {
    const newValue: UnPromise<ValueGeneric> =
        setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
            ? await (setup.valueUpdater as AnyFunction)()
            : await setup.valueUpdater(inputs);
    const accessorKey = generatedKey || defaultSubKey;

    memoryEntry.lastUpdate = Date.now();
    memoryEntry.generatedKeys.add(accessorKey);

    addInMemoryValue(setup, generatedKey, newValue, memoryEntry);

    if (setup.enableCacheBrowserStorage) {
        try {
            const lastItem: NonNullable<MemoryEntry<ValueGeneric>['cachedData']> =
                (await localForage.getItem(setup.cacheName)) || {};

            lastItem[accessorKey] = newValue;

            logIf(setup, `Saving to in-browser cache for '${setup.cacheName}:${generatedKey}'`);
            localForage.setItem(setup.cacheName, lastItem);
        } catch (error) {
            logIf(
                setup,
                `Failed to save to in-browser storage for '${
                    setup.cacheName
                }' with generatedKey '${generatedKey}': ${extractErrorMessage(error)}`,
            );
        }
    }

    return newValue as UnPromise<ValueGeneric>;
}

function addInMemoryValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
    generatedKey: string | undefined,
    newValue: UnPromise<ValueGeneric>,
    memoryEntry: MemoryEntry<ValueGeneric>,
): void {
    const accessorKey = generatedKey || defaultSubKey;

    memoryEntry.generatedKeys.add(accessorKey);

    if (!memoryEntry.cachedData) {
        memoryEntry.cachedData = {};
    }
    memoryEntry.lastUpdate = Date.now();
    logIf(setup, `Saving to in-memory cache for '${setup.cacheName}:${generatedKey}'`);
    memoryEntry.cachedData[accessorKey] = newValue;
}

async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
    generatedKey: string | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    keyInputs: KeyInputsGeneric,
    allowUpdate: true,
): Promise<{value: UnPromise<ValueGeneric>; shouldUpdateCache: boolean}>;
async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
    generatedKey: string | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    keyInputs: KeyInputsGeneric,
    allowUpdate: false,
): Promise<{value: UnPromise<ValueGeneric> | undefined; shouldUpdateCache: boolean}>;
async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    KeyInputsGeneric extends object,
>(
    setup: MaskedLocalCacheDefinitionSetup<
        ValueGeneric,
        SubKeyRequirementGeneric,
        KeyInputsGeneric
    >,
    generatedKey: string | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    keyInputs: KeyInputsGeneric,
    allowUpdate: boolean,
): Promise<{value: UnPromise<ValueGeneric> | undefined; shouldUpdateCache: boolean}> {
    const accessorKey = generatedKey || defaultSubKey;

    if (accessorKey in memoryEntry.cachedData) {
        logIf(setup, `Accessing in-memory cache for '${setup.cacheName}:${generatedKey}'`);
        return {
            value: memoryEntry.cachedData[accessorKey],
            shouldUpdateCache: false,
        };
    }

    if (setup.enableCacheBrowserStorage) {
        try {
            const inBrowserStorage: NonNullable<MemoryEntry<ValueGeneric>['cachedData']> | null =
                await localForage.getItem(setup.cacheName);
            if (inBrowserStorage !== null && accessorKey in inBrowserStorage) {
                logIf(
                    setup,
                    `Accessing in-browser storage for '${setup.cacheName}:${generatedKey}'`,
                );

                const cachedData = inBrowserStorage[accessorKey] as UnPromise<ValueGeneric>;

                addInMemoryValue(setup, generatedKey, cachedData, memoryEntry);
                return {value: cachedData, shouldUpdateCache: true};
            }
        } catch (error) {
            logIf(
                setup,
                `Failed to access in-browser storage for '${
                    setup.cacheName
                }:${generatedKey}': ${extractErrorMessage(error)}`,
            );
        }
    }

    logIf(setup, `No cached value to get for '${setup.cacheName}:${generatedKey}'`);
    if (allowUpdate) {
        return {
            value: await updateValue(setup, generatedKey, memoryEntry, keyInputs),
            shouldUpdateCache: false,
        };
    } else {
        return {value: undefined, shouldUpdateCache: false};
    }
}
