import {isTruthy, wait} from '@augment-vir/common';
import {CollectionNriData} from '../../models/collection-nri-data';
import {getCachedWithUpdate} from './get-cached-with-update';
import {removeUnknownKeys} from './cache-cleanup';
import {CanisterId} from '../../models/canister-id';

export async function getThrottledNriDataForCanisters(
    canisterIds: string[],
): Promise<Record<string, CollectionNriData>> {
    const allNriCacheItems = (
        await Promise.all(
            canisterIds.map(async (canisterId, waitIndex) => {
                const collectionNriData = await getCachedWithUpdate({
                    databaseTableName: 'nriCache',
                    rowKey: canisterId,
                    fetchValueCallback: async () => {
                        const throttleTime = waitIndex + (Math.random() * waitIndex || 1) / 10;
                        return await fetchCanisterNriData(canisterId, throttleTime);
                    },
                });

                return collectionNriData;
            }),
        )
    ).filter(isTruthy);

    const nriDataByCanisterId = allNriCacheItems.reduce((accum, nriCacheItem) => {
        accum[nriCacheItem?.collectionId] = nriCacheItem;
        return accum;
    }, {} as Record<string, CollectionNriData>);

    // don't await this, it'll execute in the background
    removeUnknownKeys('nriCache', Object.keys(nriDataByCanisterId));

    return nriDataByCanisterId;
}

async function fetchCanisterNriData(
    canisterId: string,
    throttleTime: number,
): Promise<CollectionNriData> {
    // only throttle when we actually make a network request
    await wait(throttleTime);
    const response = await fetch('/nri/' + canisterId + '.json');
    const contentType = response.headers.get('content-type');

    const isJson = contentType && contentType.includes('application/json');

    let nriData = undefined;
    try {
        nriData = isJson ? await response.json() : undefined;
    } catch (error) {
        console.error(`Failed to read NRI data for '${canisterId}':`, error);
    }

    return {
        collectionId: canisterId as CanisterId,
        nriData,
    };
}
