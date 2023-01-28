import {LocalCacheOptions} from './cache-options';
import {} from 'element-vir';
import {
    AnyFunction,
    awaitedForEach,
    extractErrorMessage,
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
};

const defaultSubKey = Symbol('default-sub-key');

type CacheEntry<ValueGeneric extends JsonCompatibleValue> = {
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

const memoryCache: Record<string, CacheEntry<any>> = {};
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

    let lastTimeoutId: number | undefined;

    function setNextUpdate() {
        if (!setup.enableAutomaticUpdating) {
            return;
        }

        globalThis.clearTimeout(lastTimeoutId);
        lastTimeoutId = (globalThis.setTimeout as Window['setTimeout'])(async () => {
            setNextUpdate();
            logIf(setup, `Updating '${setup.cacheName}' cache`);
            const inMemoryEntry = memoryCache[setup.cacheName];
            if (!inMemoryEntry) {
                logIf(setup, `Failed to access sub-keys for updating '${setup.cacheName}' cache`);
                return;
            }
            const keys = Array.from(inMemoryEntry.cachedKeys) as ReadonlyArray<
                SubKeyGeneric | typeof defaultSubKey
            >;
            await awaitedForEach(keys, async key => {
                if (key === defaultSubKey) {
                    await updateValue(setup, undefined);
                } else {
                    await updateValue(setup, key);
                }
            });
        }, setup.minUpdateInterval);
    }

    async function forceUpdate(subKey?: SubKeyGeneric | undefined) {
        setNextUpdate();
        return await updateValue(setup, subKey);
    }

    setNextUpdate();

    return {
        get: (async (subKey?: SubKeyGeneric | undefined) =>
            getValue(setup, subKey)) as CacheAccessCallback<
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
    };
}

function setupCacheEntry<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
): CacheEntry<ValueGeneric> {
    const initCachedKeys: CacheEntry<ValueGeneric>['cachedKeys'] =
        setup.subKeyRequirement === SubKeyRequirementEnum.Required
            ? new Set()
            : new Set([defaultSubKey]);
    const newCacheEntry: CacheEntry<ValueGeneric> = {
        lastUpdate: 0,
        cachedKeys: initCachedKeys,
    };

    return newCacheEntry;
}

function setupMemoryCacheEntry<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
): CacheEntry<ValueGeneric> {
    if (!memoryCache[setup.cacheName]) {
        memoryCache[setup.cacheName] = setupCacheEntry(setup);
    }
    return memoryCache[setup.cacheName]!;
}

async function setupBrowserStorageCacheEntry<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
): Promise<CacheEntry<ValueGeneric>> {
    if (!localForage.getItem(setup.cacheName)) {
        await localForage.setItem(setup.cacheName, setupCacheEntry(setup));
    }
    return localForage.getItem(setup.cacheName) as Promise<CacheEntry<ValueGeneric>>;
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
): Promise<UnPromise<ValueGeneric>> {
    const newValue: UnPromise<ValueGeneric> =
        setup.subKeyRequirement === SubKeyRequirementEnum.Blocked
            ? await (setup.valueUpdater as AnyFunction)()
            : await (setup.valueUpdater as AnyFunction)(subKey);

    const inMemoryEntry = setupMemoryCacheEntry(setup);

    inMemoryEntry.lastUpdate = Date.now();
    const accessorKey = subKey ?? defaultSubKey;
    inMemoryEntry.cachedKeys.add(accessorKey);

    if (setup.enableMemoryCache) {
        addInMemoryValue(setup, subKey, newValue);
    }

    if (setup.enableBrowserStorageCache) {
        try {
            const lastItem: NonNullable<CacheEntry<ValueGeneric>['cachedData']> =
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
): void {
    const accessorKey = subKey ?? defaultSubKey;

    const inMemoryEntry = setupMemoryCacheEntry(setup);
    inMemoryEntry.cachedKeys.add(accessorKey);

    if (!inMemoryEntry.cachedData) {
        inMemoryEntry.cachedData = {};
    }
    logIf(setup, `Saving to in-memory cache for '${setup.cacheName}:${subKey}'`);
    inMemoryEntry.cachedData[accessorKey] = newValue;
}

async function getValue<
    ValueGeneric extends JsonCompatibleValue,
    SubKeyRequirementGeneric extends SubKeyRequirementEnum,
    SubKeyGeneric extends string,
>(
    setup: MaskedLocalCacheDefinitionSetup<ValueGeneric, SubKeyRequirementGeneric, SubKeyGeneric>,
    subKey: SubKeyGeneric | undefined,
): Promise<UnPromise<ValueGeneric>> {
    console.log('getting');
    const accessorKey = subKey ?? defaultSubKey;

    if (setup.enableMemoryCache) {
        const inMemory = memoryCache[setup.cacheName];
        if (inMemory != undefined && 'cachedData' in inMemory && inMemory.cachedData) {
            logIf(setup, `Accessing in-memory cache for '${setup.cacheName}:${subKey}'`);
            return inMemory.cachedData[accessorKey];
        }
    }

    if (setup.enableBrowserStorageCache) {
        try {
            const inBrowserStorage: NonNullable<CacheEntry<ValueGeneric>['cachedData']> | null =
                await localForage.getItem(setup.cacheName);
            if (inBrowserStorage !== null && accessorKey in inBrowserStorage) {
                logIf(setup, `Accessing in-browser storage for '${setup.cacheName}:${subKey}'`);

                const cachedData = inBrowserStorage[accessorKey] as UnPromise<ValueGeneric>;

                if (setup.enableMemoryCache) {
                    addInMemoryValue(setup, subKey, cachedData);
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
    return await updateValue(setup, subKey);
}
