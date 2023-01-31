import {NftOffer} from './nft-offers';

export type NftExtraData = {
    nftId: string;
    offers: NftOffer[];
    listing:
        | {
              price: number;
              locked: boolean | number[];
          }
        | undefined;
};
