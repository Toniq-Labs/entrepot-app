import {extractErrorMessage, PropertyValueType} from '@augment-vir/common';
import Dexie, {Table} from 'dexie';
import {BaseCollection, Collection} from '../../models/collection';
import {NriData} from '../../models/nri-data';
import {deleteDatabase} from './delete-database';

export type NriCacheItem = {
    /** CanisterId */
    rowKey: string;
    data: NriData;
};

export type CollectionStatsCacheItem = {
    /** CanisterId */
    rowKey: string;
    data: Collection['stats'];
};

export type AllBaseCollectionsCacheItem = {
    /** Source of data. Right now the only key for this is 'entrepot'. */
    rowKey: string;
    data: ReadonlyArray<BaseCollection>;
};

const databaseName = 'EntrepotDatabase';

class InternalEntrepotDatabaseClass extends Dexie {
    public nriCache!: Table<NriCacheItem, string>;
    public collectionsStatsCache!: Table<CollectionStatsCacheItem, string>;
    public allBaseCollectionsCache!: Table<AllBaseCollectionsCacheItem, string>;

    public constructor() {
        super(databaseName);
        this.version(3).stores({
            /** & designates the unique key: https://dexie.org/docs/Version/Version.stores() */
            nriCache: '&rowKey',
            collectionsStatsCache: '&rowKey',
            allBaseCollectionsCache: '&rowKey',
        });
    }
}

export type EntrepotCacheDatabase = InternalEntrepotDatabaseClass;

export type EntrepotCacheTableName = PropertyValueType<{
    [Prop in keyof EntrepotCacheDatabase]: EntrepotCacheDatabase[Prop] extends Table ? Prop : never;
}>;

export type EntrepotCacheTable<TableNameGeneric extends EntrepotCacheTableName> =
    EntrepotCacheDatabase[TableNameGeneric];

export type EntrepotCacheTableCacheItem<TableNameGeneric extends EntrepotCacheTableName> =
    Parameters<EntrepotCacheDatabase[TableNameGeneric]['put']>[0];

export type EntrepotCacheTableData<TableNameGeneric extends EntrepotCacheTableName> =
    EntrepotCacheTableCacheItem<TableNameGeneric>['data'];

const putTestKey = `dummy-entrepot-row-entry-testing-data` as const;
async function createDatabase(): Promise<InternalEntrepotDatabaseClass> {
    try {
        const database = new InternalEntrepotDatabaseClass();
        // query all the tables to make sure they work
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
        /** If there was an error for some reason, just reset the database. */
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
