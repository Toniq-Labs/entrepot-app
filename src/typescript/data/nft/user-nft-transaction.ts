import {CanisterId} from '../models/canister-id';

export type UserNftTransaction = {
    buyerAddress: string;
    collectionId: CanisterId;
    sellerAddress: string;
    timestampNanosecond: number;
    nftId: string;
    transactionId: string;
    listPrice: number;
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

    return {
        buyerAddress: raw.buyer,
        collectionId: raw.canister,
        sellerAddress: raw.seller,
        timestampNanosecond: raw.time,
        nftId: raw.token,
        transactionId: raw.id,
        listPrice: raw.price,
    };
}
