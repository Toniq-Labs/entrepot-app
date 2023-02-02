import {CanisterId} from '../models/canister-id';
import {decodeNftId} from './nft-id';
import {TransactionDirection} from '../local-cache/caches/user-data/user-transactions-cache';
import {getNftMintNumber} from './nft-mint-number';
import {BaseNft} from './base-nft';

export type UserNftTransaction = BaseNft & {
    buyerAddress: string;
    sellerAddress: string;
    timestampMillisecond: number;
    transactionId: string;
};

export type UserTransactionWithDirection = UserNftTransaction & {
    directionForCurrentUser: TransactionDirection;
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

export function parseRawUserNftTransaction(
    raw: RawUserNftTransaction,
): UserNftTransaction | undefined {
    if (!raw.token) {
        return undefined;
    }

    const {index, canister} = decodeNftId(raw.token);

    if (canister !== raw.canister) {
        throw new Error(
            `Decoded canister id '${canister}' did not match transaction canister id '${raw.canister}'`,
        );
    }

    return {
        buyerAddress: raw.buyer,
        collectionId: raw.canister,
        sellerAddress: raw.seller,
        timestampMillisecond: raw.time / 1_000_000,
        nftId: raw.token,
        transactionId: raw.id,
        nftMintNumber: getNftMintNumber({collectionId: raw.canister, nftIndex: index}),
        listPrice: raw.price,
        nftIndex: index,
    };
}
