import {CanisterId} from '../models/canister-id';
import {decodeNftId} from './nft-id';
import {getNftMintNumber} from './nft-mint-number';
import {BaseNft} from './base-nft';
import {parseRawNftListing, RawNftListing, NftListingPrice} from './nft-listing';
import {parseRawNftOffers, RawNftOffer} from './nft-offer';
import {Collection} from '../models/collection';

export type UserNftTransaction = BaseNft & {
    buyerAddress: string;
    sellerAddress: string;
    transactionTimeMillisecond: number;
    transactionId: string;
};

export enum TransactionDirection {
    Purchase = 'purchase',
    Sale = 'sale',
}

export type UserTransactionWithDirection = UserNftTransaction & {
    directionForCurrentUser: TransactionDirection;
    collection?: Collection | undefined;
};

export type RawUserNftTransaction = {
    buyer: string;
    canister: CanisterId;
    id: string;
    price: number;
    seller: string;
    time: number;
    token: string;
};

export function parseRawUserNftTransaction({
    rawTransaction,
    rawNftListing,
    rawNftOffers,
}: {
    rawTransaction: RawUserNftTransaction;
    rawNftListing: RawNftListing;
    rawNftOffers: RawNftOffer[];
}): UserNftTransaction {
    const decodedNft = decodeNftId(rawTransaction.token);

    if (decodedNft.canister !== rawTransaction.canister) {
        console.error({rawNft: rawNftListing, decodedNft: decodedNft});
        throw new Error(
            `Decoded canister id '${decodedNft.canister}' did not match transaction canister id '${rawTransaction.canister}'`,
        );
    }

    const listing: NftListingPrice = {
        price: rawTransaction.price,
        lockedTimestamp: rawTransaction.time,
    };

    return {
        ...parseRawNftListing(rawNftListing),
        ...parseRawNftOffers(rawNftOffers),
        buyerAddress: rawTransaction.buyer,
        nftIndex: decodedNft.index,
        nftMintNumber: getNftMintNumber({
            collectionId: rawTransaction.canister,
            nftIndex: decodedNft.index,
        }),
        sellerAddress: rawTransaction.seller,
        transactionTimeMillisecond: rawTransaction.time / 1_000_000,
        transactionId: rawTransaction.id,
        /** This overrides the listing property from parseRawNftListing(rawNftListing) */
        listing,
    };
}
