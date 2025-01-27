import {extractErrorMessage} from '@augment-vir/common';
import Dexie from 'dexie';
import {deleteDatabase} from './delete-database';

const databaseName = 'EntrepotDatabase';

class InternalEntrepotDatabaseClass extends Dexie {
    constructor() {
        super(databaseName);
        this.version(4).stores({
            nriCache: '&rowKey', // & designates the unique key
            collectionsStatsCache: '&rowKey',
            allBaseCollectionsCache: '&rowKey',
        });
    }
}

const putTestKey = 'dummy-entrepot-row-entry-testing-data';

async function createDatabase() {
    try {
        const database = new InternalEntrepotDatabaseClass();
        // Query all the tables to make sure they work
        database.nriCache.toArray();
        await database.nriCache.put({
            data: undefined,
            rowKey: putTestKey,
        });
        await database.nriCache.delete(putTestKey);

        database.collectionsStatsCache.toArray();
        await database.collectionsStatsCache.put({
            data: undefined,
            rowKey: putTestKey,
        });
        await database.collectionsStatsCache.delete(putTestKey);

        database.allBaseCollectionsCache.toArray();
        await database.allBaseCollectionsCache.put({
            data: [],
            rowKey: putTestKey,
        });
        await database.allBaseCollectionsCache.delete(putTestKey);

        return database;
    } catch (error) {
        // Reset the database if an error occurs
        console.warn(
            `Resetting cache database due to error from creating database: ${extractErrorMessage(
                error,
            )}`,
        );
        await deleteDatabase(databaseName);
        return new InternalEntrepotDatabaseClass();
    }
}

const entrepotCacheDatabase = createDatabase();

export async function getEntrepotCacheDatabase() {
    return await entrepotCacheDatabase;
}
