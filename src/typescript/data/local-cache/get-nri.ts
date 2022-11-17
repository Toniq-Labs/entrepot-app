import {wait} from 'augment-vir';
import {NriData} from '../models/nri-data';
import {getCachedWithUpdate} from './get-cached-with-update';
import {removeUnknownKeys} from './cache-cleanup';

export async function getThrottledNriDataForCanisters(
    canisterIds: string[],
): Promise<Record<string, NriData>> {
    const allNriCacheItems = await Promise.all(
        canisterIds.map(async (canisterId, waitIndex) => {
            return {
                canisterId,
                data: await getCachedWithUpdate({
                    databaseTableName: 'nriCache',
                    rowKey: canisterId,
                    fetchValueCallback: async () => {
                        const throttleTime = waitIndex + (Math.random() * waitIndex || 1) / 10;
                        return await fetchCanisterNriData(canisterId, throttleTime);
                    },
                }),
            };
        }),
    );

    const nriDataByCanisterId = allNriCacheItems.reduce((accum, nriCacheItem) => {
        accum[nriCacheItem.canisterId] = nriCacheItem.data;
        return accum;
    }, {} as Record<string, NriData>);

    // don't await this, it'll execute in the background
    removeUnknownKeys('nriCache', Object.keys(nriDataByCanisterId));

    return nriDataByCanisterId;
}

async function fetchCanisterNriData(canisterId: string, throttleTime: number): Promise<NriData> {
    // only throttle when we actually make a network request
    await wait(throttleTime);
    const response = await fetch('/nri/' + canisterId + '.json');
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        return jsonData;
    } else {
        return undefined;
    }
}
