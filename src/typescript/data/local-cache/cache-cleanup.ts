import {extractErrorMessage, isTruthy} from '@augment-vir/common';
import {EntrepotCacheTableName, getEntrepotCacheDatabase} from './cache-database';

export async function removeUnknownKeys<TableNameGeneric extends EntrepotCacheTableName>(
    databaseTableName: TableNameGeneric,
    knownKeys: ReadonlyArray<string>,
): Promise<void> {
    const database = await getEntrepotCacheDatabase();
    try {
        const allValues: ReadonlyArray<{rowKey: string}> = await database[
            databaseTableName
        ].toArray();

        const toBeRemovedValues = allValues
            .map(value => {
                return knownKeys.includes(value.rowKey) ? undefined : value.rowKey;
            })
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
