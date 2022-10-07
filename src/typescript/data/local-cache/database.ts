import Dexie, {Table} from 'dexie';
import {NriData} from '../models/nri-data';

export type NriCacheItem = {
    canisterId: string;
    data: NriData;
};

class EntrepotDatabase extends Dexie {
    public nriCache!: Table<NriCacheItem, string>;

    public constructor() {
        super('EntrepotDatabase');
        this.version(1).stores({
            // & = unique key: https://dexie.org/docs/Version/Version.stores()
            nriCache: '&canisterId',
        });
    }
}

export const entrepotDatabase = new EntrepotDatabase();
