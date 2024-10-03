import {getEntrepotCacheDatabase} from './cache-database';

const inProgressFetches = new Map();

function getInProgressFetch(databaseTableName, rowKey) {
    return inProgressFetches.get(databaseTableName)?.get(rowKey);
}

export async function getCachedWithUpdate({databaseTableName, rowKey, fetchValueCallback}) {
    const alreadyInProgress = getInProgressFetch(databaseTableName, rowKey);
    if (alreadyInProgress) {
        return alreadyInProgress;
    }

    let cached;
    try {
        cached = await (await getEntrepotCacheDatabase())[databaseTableName].get(rowKey);
    } catch (error) {
        console.error(`Database error`);
    }

    if (cached) {
        // update later in the background
        setTimeout(
            async () => {
                await updateDatabase({databaseTableName, rowKey, fetchValueCallback});
            },
            5000, // 5 seconds to avoid impacting initial load times
        );
        return cached.data;
    } else {
        const tableMap =
            inProgressFetches.get(databaseTableName) ||
            (inProgressFetches.set(databaseTableName, new Map()) &&
                inProgressFetches.get(databaseTableName));

        const getDataPromise = updateDatabase({databaseTableName, rowKey, fetchValueCallback});
        tableMap.set(rowKey, getDataPromise);

        return await getDataPromise;
    }
}

async function updateDatabase({databaseTableName, rowKey, fetchValueCallback}) {
    const data = await fetchValueCallback(rowKey);

    await (
        await getEntrepotCacheDatabase()
    )[databaseTableName].put({
        rowKey,
        data: data,
    });

    inProgressFetches.get(databaseTableName)?.delete(rowKey);

    return data;
}
