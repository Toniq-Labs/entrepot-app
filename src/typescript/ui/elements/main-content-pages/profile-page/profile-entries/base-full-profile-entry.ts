import {Collection} from '../../../../../data/models/collection';
import {NftExtraData} from '../../../../../data/nft/nft-extra-data';

export type BaseFullProfileEntry = NftExtraData & {nftNri: number | undefined} & {
    collection:
        | Collection
        // the union with undefined here is in case the NFT data shows up before the collection data does
        | undefined;
};
