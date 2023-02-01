import {NftOffer} from './nft-offers';

export type NftExtraData = {
    nftId: string;
    offers: ReadonlyArray<NftOffer>;
    listing:
        | {
              price: number;
              locked: boolean | number[];
          }
        | undefined;
};

export const emptyNftExtraData: NftExtraData = {
    listing: undefined,
    offers: [],
    nftId: '',
};
