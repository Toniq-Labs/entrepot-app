import {ObjectValueType} from 'augment-vir';
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

class InternalEntrepotDatabaseClass extends Dexie {
    public nriCache!: Table<NriCacheItem, string>;
    public collectionsStatsCache!: Table<CollectionStatsCacheItem, string>;
    public allBaseCollectionsCache!: Table<AllBaseCollectionsCacheItem, string>;

    public constructor() {
        super('EntrepotDatabase');
        this.version(2).stores({
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

export const entrepotCacheDatabase = new InternalEntrepotDatabaseClass();
