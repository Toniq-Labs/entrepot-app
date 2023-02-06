/** This is a separate list of properties because it is fetched from a dedicated canister. */

import {CanisterId} from '../models/canister-id';

export type NftListingPrice = {
    lockedTimestamp: number;
    price: number;
};

export type NftListing = {
    collectionId: CanisterId;
    listing: NftListingPrice;
    nftId: string;
    ownerAddress: string;
};

export const emptyNftListing: NftListing = {
    collectionId: '' as any,
    listing: {
        price: 0,
        lockedTimestamp: 0,
    },
    nftId: '',
    ownerAddress: '',
};

export type RawNftListing = {
    canister: CanisterId;
    id: string;
    owner: string;
    price: number;
    time: number;
    // fill in this type better if you want to use it
    transactions: never[];
};

export function parseRawNftListing(rawNftListingAndOffers: RawNftListing): NftListing {
    const listing: NftListingPrice = {
        price: rawNftListingAndOffers.price,
        lockedTimestamp: rawNftListingAndOffers.time,
    };

    return {
        collectionId: rawNftListingAndOffers.canister,
        listing: listing,
        nftId: rawNftListingAndOffers.id,
        ownerAddress: rawNftListingAndOffers.owner,
    };
}
