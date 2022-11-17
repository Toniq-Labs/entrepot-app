import {extractErrorMessage} from 'augment-vir';
import {
    entrepotCacheDatabase,
    EntrepotCacheTableName,
    EntrepotCacheTableCacheItem,
    EntrepotCacheTableData,
} from './cache-database';

const inProgressFetches = new Map<
    EntrepotCacheTableName,
    Map<string, Promise<EntrepotCacheTableData<EntrepotCacheTableName>>>
>();

function getInProgressFetch<TableNameGeneric extends EntrepotCacheTableName>(
    databaseTableName: TableNameGeneric,
    rowKey: string,
): Promise<EntrepotCacheTableData<TableNameGeneric>> | undefined {
    return inProgressFetches.get(databaseTableName)?.get(rowKey);
}

export async function getCachedWithUpdate<TableNameGeneric extends EntrepotCacheTableName>({
    databaseTableName,
    rowKey,
    fetchValueCallback,
}: {
    databaseTableName: TableNameGeneric;
    /** This is usually the canister id. */
    rowKey: string;
    fetchValueCallback: (rowKey: string) => Promise<EntrepotCacheTableData<TableNameGeneric>>;
    asyncUpdateFinishedCallback?: () => Promise<void>;
}): Promise<EntrepotCacheTableData<TableNameGeneric>> {
    const alreadyInProgress = getInProgressFetch(databaseTableName, rowKey);
    if (alreadyInProgress) {
        return alreadyInProgress;
    }

    let cached: EntrepotCacheTableCacheItem<TableNameGeneric> | undefined = undefined;
    try {
        cached = await entrepotCacheDatabase[databaseTableName].get(rowKey);
    } catch (error) {}
    if (cached) {
        // update later in the background
        setTimeout(
            async () => {
                await updateDatabase({databaseTableName, rowKey, fetchValueCallback});
            },
            /**
             * Wait some seconds so fetching all this data to update the cache doesn't impede
             * initial loading times.
             */
            5_000,
        );
        return cached.data;
    } else {
        const tableMap =
            inProgressFetches.get(databaseTableName) ??
            (inProgressFetches.set(databaseTableName, new Map()) &&
                inProgressFetches.get(databaseTableName)!);

        const getDataPromise = updateDatabase({databaseTableName, rowKey, fetchValueCallback});
        tableMap.set(rowKey, getDataPromise);

        return await getDataPromise;
    }
}

async function updateDatabase<TableNameGeneric extends EntrepotCacheTableName>({
    databaseTableName,
    rowKey,
    fetchValueCallback,
}: {
    databaseTableName: TableNameGeneric /** This is usually the canister id. */;
    rowKey: string;
    fetchValueCallback: (rowKey: string) => Promise<EntrepotCacheTableData<TableNameGeneric>>;
}): Promise<EntrepotCacheTableData<TableNameGeneric>> {
    const data: EntrepotCacheTableCacheItem<EntrepotCacheTableName>['data'] =
        await fetchValueCallback(rowKey);
    await entrepotCacheDatabase[databaseTableName].put({
        rowKey,
        // as cast here because the database table types are not sufficiently typed
        data: data as EntrepotCacheTableCacheItem<EntrepotCacheTableName>['data'] as any,
    });
    inProgressFetches.get(databaseTableName)?.delete(rowKey);

    return data;
}
