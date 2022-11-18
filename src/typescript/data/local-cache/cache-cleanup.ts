import {extractErrorMessage, isTruthy} from 'augment-vir';
import {EntrepotCacheTableName, entrepotCacheDatabase} from './cache-database';

export async function removeUnknownKeys<TableNameGeneric extends EntrepotCacheTableName>(
    databaseTableName: TableNameGeneric,
    knownKeys: ReadonlyArray<string>,
): Promise<void> {
    try {
        const allValues: ReadonlyArray<{rowKey: string}> = await entrepotCacheDatabase[
            databaseTableName
        ].toArray();

        const toBeRemovedValues = allValues
            .map(value => {
                return knownKeys.includes(value.rowKey) ? undefined : value.rowKey;
            })
            .filter(isTruthy);

        if (toBeRemovedValues.length) {
            entrepotCacheDatabase[databaseTableName].bulkDelete(toBeRemovedValues);
        }
    } catch (error) {
        throw new Error(
            `Failed to remove unknown keys for "${databaseTableName}": ${extractErrorMessage(
                error,
            )}`,
        );
    }
}
