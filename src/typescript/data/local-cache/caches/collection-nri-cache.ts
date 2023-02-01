import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../define-local-cache';
import {wait} from '@augment-vir/common';
import {CollectionNriData} from '../../models/collection-nri-data';
import {CanisterId} from '../../models/canister-id';

export type CollectionNriCacheInputs = {
    collectionId: CanisterId;
    waitIndex: number;
};

export function makeNriCacheKey({collectionId}: CollectionNriCacheInputs) {
    return collectionId;
}

async function updateCollectionNriData({
    collectionId,
    waitIndex,
}: CollectionNriCacheInputs): Promise<CollectionNriData> {
    await wait(waitIndex + (Math.random() * waitIndex || 1) / 10);

    const response = await fetch(`/nri/${collectionId}.json`);
    const contentType = response.headers.get('content-type');

    const isJson = contentType && contentType.includes('application/json');

    let nriData = undefined;
    try {
        nriData = isJson ? await response.json() : undefined;
    } catch (error) {
        console.error(`Failed to read NRI data for '${collectionId}':`, error);
    }

    return {
        collectionId: collectionId,
        nriData,
    };
}

export const collectionNriCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateCollectionNriData>>,
    SubKeyRequirementEnum.Required,
    CollectionNriCacheInputs
>({
    cacheName: 'collection-nri',
    valueUpdater: updateCollectionNriData,
    keyGenerator: makeNriCacheKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
    minUpdateInterval: 120_000,
    enableLogging: true,
});
