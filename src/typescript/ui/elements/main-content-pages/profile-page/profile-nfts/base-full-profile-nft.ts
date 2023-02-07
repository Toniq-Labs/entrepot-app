import {Collection} from '../../../../../data/models/collection';
import {NftListing} from '../../../../../data/nft/nft-listing';

export type BaseFullProfileNft = NftListing & {nftNri: number | undefined} & {
    collection:
        | Collection
        // the union with undefined here is in case the NFT data shows up before the collection data does
        | undefined;
};
