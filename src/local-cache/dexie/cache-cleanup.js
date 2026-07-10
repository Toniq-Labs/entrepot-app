import {getEntrepotCacheDatabase} from './cache-database';

const extractErrorMessage = error =>
    error instanceof Error ? error.message : error == null ? '' : String(error);

export async function removeUnknownKeys(databaseTableName, knownKeys) {
    const database = await getEntrepotCacheDatabase();
    try {
        const allValues = await database[databaseTableName].toArray();

        const toBeRemovedValues = allValues
            .map(value => (knownKeys.includes(value.rowKey) ? undefined : value.rowKey))
            .filter(Boolean);

        if (toBeRemovedValues.length) {
            database[databaseTableName].bulkDelete(toBeRemovedValues);
        }
    } catch (error) {
        throw new Error(
            `Failed to remove unknown keys for "${databaseTableName}": ${extractErrorMessage(
                error,
            )}`,
        );
    }
}
