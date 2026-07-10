import {extractErrorMessage, isTruthy} from '@augment-vir/common';
import {getEntrepotCacheDatabase} from './cache-database';

export async function removeUnknownKeys(databaseTableName, knownKeys) {
    const database = await getEntrepotCacheDatabase();
    try {
        const allValues = await database[databaseTableName].toArray();

        const toBeRemovedValues = allValues
            .map(value => (knownKeys.includes(value.rowKey) ? undefined : value.rowKey))
            .filter(isTruthy);

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
