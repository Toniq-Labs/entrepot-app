import {defaultEntrepotApi} from './entrepot-data-api';
import {RawNftOffer} from '../../data/nft/nft-offers';

export const entrepotCanisters = {
    /**
     * You may see another canister id floating around for offers ("6z5wo-yqaaa-aaaah-qcsfa-cai"),
     * but that's the old way. This canister is the new way.
     */
    nftOffers: defaultEntrepotApi.canister('fcwhh-piaaa-aaaak-qazba-cai') as {
        offers: (nftId: string) => Promise<RawNftOffer[]>;
    },
    nftAuctions: defaultEntrepotApi.canister('fcwhh-piaaa-aaaak-qazba-cai') as Promise<unknown[]>,
};
