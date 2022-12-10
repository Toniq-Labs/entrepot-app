import {ObjectValueType} from '@augment-vir/common';
import Dexie, {Table} from 'dexie';
import {BaseCollection, Collection} from '../models/collection';
import {NriData} from '../models/nri-data';

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

export type EntrepotCacheTableName = ObjectValueType<{
    [Prop in keyof EntrepotCacheDatabase]: EntrepotCacheDatabase[Prop] extends Table ? Prop : never;
}>;

export type EntrepotCacheTable<TableNameGeneric extends EntrepotCacheTableName> =
    EntrepotCacheDatabase[TableNameGeneric];

export type EntrepotCacheTableCacheItem<TableNameGeneric extends EntrepotCacheTableName> =
    Parameters<EntrepotCacheDatabase[TableNameGeneric]['put']>[0];

export type EntrepotCacheTableData<TableNameGeneric extends EntrepotCacheTableName> =
    EntrepotCacheTableCacheItem<TableNameGeneric>['data'];

async function createDatabase(): Promise<InternalEntrepotDatabaseClass> {
    try {
        const database = new InternalEntrepotDatabaseClass();
        // query all the tables to make sure they work
        database.nriCache.toArray();
        database.collectionsStatsCache.toArray();
        database.allBaseCollectionsCache.toArray();
        return database;
    } catch (error) {
        /** If there was an error for some reason, just reset the database. */
        console.error({error});
        await Dexie.delete(databaseName);
        return new InternalEntrepotDatabaseClass();
    }
}

const entrepotCacheDatabase = createDatabase();

export async function getEntrepotCacheDatabase() {
    return await entrepotCacheDatabase;
}
