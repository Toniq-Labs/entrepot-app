import {removeUnknownKeys} from './cache-cleanup';
import {getCachedWithUpdate} from './get-cached-with-update';
import extjs from '../../ic/extjs';

const isDevEnv = () => {
    if (window.location.hostname === 'localhost') return true;
    if (window.location.host.indexOf('deploy-preview') === 0) return true;
    if (window.location.host.indexOf('friendly-raman-30db7b') >= 0) return true;
    return false;
};

const collectionsEndpoint = isDevEnv()
    ? 'https://us-central1-entrepot-api.cloudfunctions.net/api/collectionsDev'
    : 'https://us-central1-entrepot-api.cloudfunctions.net/api/collections';

export function isCanisterId(canisterId) {
    return canisterId.length === 27 && canisterId.split('-').length === 5;
}

export async function getBaseCollections() {
    return await getCachedWithUpdate({
        databaseTableName: 'allBaseCollectionsCache',
        rowKey: 'entrepot',
        fetchValueCallback: async () => {
            const response = await fetch(collectionsEndpoint);
            const baseCollectionArray = await response.json();

            /** Filter collections based on canister ID check. */
            return baseCollectionArray
                .map(collection => ({...collection, canister: collection.id}))
                .filter(collection => isCanisterId(collection.id));
        },
    });
}

export async function getAllCollectionsWithCaching() {
    try {
        const baseCollections = (await getBaseCollections()).filter(collection => !collection.dev);

        const collectionStats = await getCollectionsStats(baseCollections);

        const collectionsById = baseCollections.reduce(
            (accum, currentCollection, collectionIndex) => {
                accum[currentCollection.id] = {
                    ...currentCollection,
                    stats: collectionStats[collectionIndex],
                };
                return accum;
            },
            {},
        );

        // Execute in the background, no need to await
        removeUnknownKeys('collectionsStatsCache', Object.keys(collectionsById));
        return collectionsById;
    } catch (error) {
        console.error(`Failed: ${error}`);
        throw error;
    }
}

export async function getCollectionsStats(baseCollections) {
    return await Promise.all(
        baseCollections.map(async baseCollection => {
            return await getCachedWithUpdate({
                databaseTableName: 'collectionsStatsCache',
                rowKey: baseCollection.id,
                fetchValueCallback: async () => {
                    if (baseCollection.market) {
                        try {
                            const stats = await extjs
                                .connect('https://icp0.io/')
                                .token(baseCollection.id)
                                .stats();
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
