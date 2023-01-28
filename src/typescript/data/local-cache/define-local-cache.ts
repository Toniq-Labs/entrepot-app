import {LocalCacheOptions} from './cache-options';
import {} from 'element-vir';
import {
    AnyFunction,
    areJsonEqual,
    assertRuntimeTypeOf,
    awaitedForEach,
    extractErrorMessage,
    isRuntimeTypeOf,
    JsonCompatibleValue,
    Overwrite,
    UnPromise,
} from '@augment-vir/common';
import {Promisable} from 'type-fest';
import localForage from 'localforage';
import {maskOptionsWithGlobalOptions} from './global-cache-enable';

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
    SubKeyGeneric extends string,
> = SubKeyRequirementGeneric extends SubKeyRequirementEnum.Blocked
    ? () => Promisable<UnPromise<ValueGeneric>>
    : SubKeyRequirementGeneric extends SubKeyRequirementEnum.Required
    ? (subKey: SubKeyGeneric) => Promisable<UnPromise<ValueGeneric>>
    : (subKey?: SubKeyGeneric | undefined) => Promisable<UnPromise<ValueGeneric>>;

export type LocalCacheDefinitionSetup<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = {
    cacheName: string;
    subKeyRequirement: SubKeyRequirementGeneric;
    valueUpdater: CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>;
} & Partial<LocalCacheOptions>;

type ListenerOutput<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = SubKeyRequirementGeneric extends SubKeyRequirementEnum.Blocked
    ? {
          newValue: UnPromise<ValueGeneric>;
      }
    : SubKeyRequirementGeneric extends SubKeyRequirementEnum.Required
    ? {
          subKey: SubKeyGeneric;
          newValue: UnPromise<ValueGeneric>;
      }
    : {
          subKey?: SubKeyGeneric;
          newValue: UnPromise<ValueGeneric>;
      };

type Listener<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = (
    output: ListenerOutput<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
) => Promise<void> | void;

type UnSubscribe = () => void;

export type SubscribeToCache<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = (listener: Listener<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>) => UnSubscribe;

export type LocalCacheDefinition<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = {
    get: CacheAccessCallback<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>;
    forceImmediateUpdate: CacheAccessCallback<
        ValueGeneric,
        SubKeyRequirementGeneric,
        SubKeyGeneric
    >;
    subscribe: SubscribeToCache<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>;
};

const defaultSubKey = Symbol('default-sub-key');

type MemoryEntry<ValueGeneric extends JsonCompatibleValue> = {
    /** If memory cache is disabled, this data property will not get set. */
    cachedData?: Partial<Record<string | typeof defaultSubKey, UnPromise<ValueGeneric>>>;
    lastUpdate: number;
    cachedKeys: Set<string | typeof defaultSubKey>;
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
    SubKeyGeneric extends string,
>(
    rawInputs: LocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
): LocalCacheDefinition<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric> {
    const setup = {
        ...rawInputs,
        ...maskOptionsWithGlobalOptions(rawInputs),
    };

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
            const cachedKeys = Array.from(memoryEntry.cachedKeys) as ReadonlyArray<
                SubKeyGeneric | typeof defaultSubKey
            >;

            await awaitedForEach(cachedKeys, async subKey => {
                const accessorKey = subKey === defaultSubKey ? undefined : subKey;
                const lastValue = await getValue(
                    {...setup, enableLogging: false},
                    accessorKey,
                    memoryEntry,
                    false,
                );
                const newValue = await updateValue(setup, accessorKey, memoryEntry);
                if (!lastValue || !areJsonEqual(lastValue, newValue)) {
                    const listenerOutput: ListenerOutput<
                        ValueGeneric,
                        SubKeyRequirementGeneric,
                        SubKeyGeneric
                    > = (
                        setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
                            ? {
                                  newValue,
                              }
                            : subKey === defaultSubKey
                            ? {
                                  newValue,
                              }
                            : {
                                  subKey,
                                  newValue,
                              }
                    ) as ListenerOutput<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>;
                    listeners.forEach(listener => listener(listenerOutput));
                }
            });
        }, setup.minUpdateInterval);
    }

    async function forceUpdate(subKey?: SubKeyGeneric | undefined) {
        setNextUpdate();
        return await updateValue(setup, subKey, memoryEntry);
    }

    setNextUpdate();

    const listeners = new Set<Listener<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>>();

    return {
        get: (async (subKey?: SubKeyGeneric | undefined) =>
            getValue(setup, subKey, memoryEntry, true)) as CacheAccessCallback<
            ValueGeneric,
            SubKeyRequirementGeneric,
            SubKeyGeneric
        >,
        forceImmediateUpdate: (async (subKey?: SubKeyGeneric | undefined) =>
            forceUpdate(subKey)) as CacheAccessCallback<
            ValueGeneric,
            SubKeyRequirementGeneric,
            SubKeyGeneric
        >,
        subscribe: ((listener: Listener<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>) => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        }) as SubscribeToCache<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    };
}

function setupMemoryEntry<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
): MemoryEntry<ValueGeneric> {
    const initCachedKeys: MemoryEntry<ValueGeneric>['cachedKeys'] =
        setup.subKeyRequirement === SubKeyRequirementEnum.Required
            ? new Set()
            : new Set([defaultSubKey]);
    const newCacheEntry: MemoryEntry<ValueGeneric> = {
        lastUpdate: 0,
        cachedKeys: initCachedKeys,
    };

    return newCacheEntry;
}

type MaskedLocalCacheDefinitionSetup<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
> = Overwrite<
    LocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    LocalCacheOptions
>;

async function updateValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
): Promise<UnPromise<ValueGeneric>> {
    const newValue: UnPromise<ValueGeneric> =
        setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
            ? await (setup.valueUpdater as AnyFunction)()
            : await (setup.valueUpdater as AnyFunction)(subKey);
    const accessorKey = subKey ?? defaultSubKey;

    memoryEntry.lastUpdate = Date.now();
    memoryEntry.cachedKeys.add(accessorKey);

    if (setup.enableMemoryCache) {
        addInMemoryValue(setup, subKey, newValue, memoryEntry);
    }

    if (setup.enableBrowserStorageCache) {
        try {
            const lastItem: NonNullable<MemoryEntry<ValueGeneric>['cachedData']> =
                (await localForage.getItem(setup.cacheName)) || {};

            lastItem[accessorKey] = newValue;

            logIf(setup, `Saving to in-browser cache for '${setup.cacheName}:${subKey}'`);
            localForage.setItem(setup.cacheName, lastItem);
        } catch (error) {
            logIf(
                setup,
                `Failed to save to in-browser storage for '${
                    setup.cacheName
                }' with subKey '${subKey}': ${extractErrorMessage(error)}`,
            );
        }
    }

    return newValue as UnPromise<ValueGeneric>;
}

function addInMemoryValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
    newValue: UnPromise<ValueGeneric>,
    memoryEntry: MemoryEntry<ValueGeneric>,
): void {
    const accessorKey = subKey ?? defaultSubKey;

    memoryEntry.cachedKeys.add(accessorKey);

    if (!memoryEntry.cachedData) {
        memoryEntry.cachedData = {};
    }
    memoryEntry.lastUpdate = Date.now();
    logIf(setup, `Saving to in-memory cache for '${setup.cacheName}:${subKey}'`);
    memoryEntry.cachedData[accessorKey] = newValue;
}

async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    allowUpdate: true,
): Promise<UnPromise<ValueGeneric>>;
async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    allowUpdate: false,
): Promise<UnPromise<ValueGeneric> | undefined>;
async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
    memoryEntry: MemoryEntry<ValueGeneric>,
    allowUpdate: boolean,
): Promise<UnPromise<ValueGeneric> | undefined> {
    const accessorKey = subKey ?? defaultSubKey;

    if (setup.enableMemoryCache) {
        if ('cachedData' in memoryEntry && memoryEntry.cachedData) {
            logIf(setup, `Accessing in-memory cache for '${setup.cacheName}:${subKey}'`);
            return memoryEntry.cachedData[accessorKey];
        }
    }

    if (setup.enableBrowserStorageCache) {
        try {
            const inBrowserStorage: NonNullable<MemoryEntry<ValueGeneric>['cachedData']> | null =
                await localForage.getItem(setup.cacheName);
            if (inBrowserStorage !== null && accessorKey in inBrowserStorage) {
                logIf(setup, `Accessing in-browser storage for '${setup.cacheName}:${subKey}'`);

                const cachedData = inBrowserStorage[accessorKey] as UnPromise<ValueGeneric>;

                if (setup.enableMemoryCache) {
                    addInMemoryValue(setup, subKey, cachedData, memoryEntry);
                }

                return cachedData;
            }
        } catch (error) {
            logIf(
                setup,
                `Failed to access in-browser storage for '${
                    setup.cacheName
                }:${subKey}': ${extractErrorMessage(error)}`,
            );
        }
    }

    logIf(setup, `No cached value to get for '${setup.cacheName}:${subKey}'`);
    if (allowUpdate) {
        return await updateValue(setup, subKey, memoryEntry);
    } else {
        return undefined;
    }
}
