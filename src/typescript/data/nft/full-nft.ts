import {Collection} from '../models/collection';
import {NftExtraData} from './nft-extra-data';
import {UserNft} from './user-nft';

export type FullNft = UserNft & NftExtraData & {collection: Collection};
