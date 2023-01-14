import {isCanisterId} from '../canisters/canister-id';
import {Collection, BaseCollection, CollectionStats} from '../models/collection';
import {defaultEntrepotApi} from '../../api/entrepot-data-api';
import {removeUnknownKeys} from './cache-cleanup';
import {getCachedWithUpdate} from './get-cached-with-update';
import {isProd} from '../../environment/environment-by-url';
import {extractErrorMessage} from '@augment-vir/common';

const cloudFunctionsApiEndpoint = `https://us-central1-entrepot-api.cloudfunctions.net/api`;
const collectionsEndpoint = isProd
    ? `${cloudFunctionsApiEndpoint}/collections`
    : `${cloudFunctionsApiEndpoint}/collectionsDev`;

async function getBaseCollections() {
    return await getCachedWithUpdate({
        databaseTableName: 'allBaseCollectionsCache',
        rowKey: 'entrepot',
        fetchValueCallback: async () => {
            const response = await fetch(collectionsEndpoint);
            const baseCollectionArray: ReadonlyArray<BaseCollection> = await response.json();

            /**
             * At the time of this writing, every collection passes this filter. However, the old
             * code makes this check so I'm propagating it to here as well.
             */
            return baseCollectionArray
                .map(collection => ({...collection, canister: collection.id}))
                .filter(collection => isCanisterId(collection.id));
        },
    });
}

export async function getAllCollectionsWithCaching(): Promise<
    Readonly<Record<string, Collection>>
> {
    try {
        const baseCollections = (await getBaseCollections()).filter(collection => !collection.dev);

        const collectionStats: ReadonlyArray<CollectionStats | undefined> =
            await getCollectionsStats(baseCollections);

        const collectionsById = [...baseCollections].reduce(
            (accum, currentCollection, collectionIndex) => {
                accum[currentCollection.id] = {
                    ...currentCollection,
                    stats: collectionStats[collectionIndex],
                };
                return accum;
            },
            {} as Record<string, Collection>,
        );

        // don't await this, it'll execute in the background
        removeUnknownKeys('collectionsStatsCache', Object.keys(collectionsById));
        return collectionsById;
    } catch (error) {
        console.error(`failed: ${extractErrorMessage(error)}`);
        throw error;
    }
}

async function getCollectionsStats(
    baseCollections: ReadonlyArray<BaseCollection>,
): Promise<ReadonlyArray<Collection['stats']>> {
    return await Promise.all(
        baseCollections.map(async baseCollection => {
            return await getCachedWithUpdate({
                databaseTableName: 'collectionsStatsCache',
                rowKey: baseCollection.id,
                fetchValueCallback: async (): Promise<Collection['stats']> => {
                    if (baseCollection.market) {
                        try {
                            const stats = await defaultEntrepotApi.token(baseCollection.id).stats();
                            return stats;
                        } catch (error) {
                            return undefined;
                        }
                    } else {
                        return undefined;
                    }
                },
            });
        }),
    );
}
