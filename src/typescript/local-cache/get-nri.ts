import {wait} from 'augment-vir';
import {entrepotDatabase, NriCacheItem} from './database';
import {NriData} from '../data/models/nri-data';

export async function getThrottledNriDataForCanisters(
    canisterIds: string[],
): Promise<Record<string, NriData>> {
    const allNriData = await Promise.all(
        canisterIds.map(async (canisterId, waitIndex) => {
            return {
                canisterId,
                data: await getCanisterNriData(
                    canisterId,
                    waitIndex + (Math.random() * waitIndex || 1) / 10,
                ),
            };
        }),
    );

    return allNriData.reduce((accum, nriData) => {
        accum[nriData.canisterId] = nriData.data;
        return accum;
    }, {} as Record<string, NriData>);
}

async function getCanisterNriData(canisterId: string, throttleTime: number): Promise<NriData> {
    const alreadyInProgress = inProgressFetches.get(canisterId);
    if (alreadyInProgress) {
        return alreadyInProgress;
    }

    const cached = await entrepotDatabase.nriCache.get(canisterId);
    if (cached) {
        // do not await this, it will update in the background
        setTimeout(() => {
            fetchAndSetNriData(canisterId, throttleTime);
        }, 100);
        return cached.data;
    } else {
        const fetchPromise = fetchAndSetNriData(canisterId, throttleTime);
        inProgressFetches.set(canisterId, fetchPromise);
        return await fetchPromise;
    }
}

async function fetchAndSetNriData(canisterId: string, throttleTime: number): Promise<NriData> {
    const fetchedData = await fetchCanisterNriData(canisterId, throttleTime);
    // intentionally do not await this, it can happen in the background
    updateDatabase({canisterId, data: fetchedData});
    return fetchedData;
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

async function updateDatabase(cacheItem: NriCacheItem) {
    await entrepotDatabase.nriCache.put(cacheItem);
    // don't remove the in progress item until the database has been updated
    inProgressFetches.delete(cacheItem.canisterId);
}

const inProgressFetches = new Map<string, Promise<NriData>>();
