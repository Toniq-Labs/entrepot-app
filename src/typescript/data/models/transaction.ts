import {CanisterId} from './canister-id';

export type Transaction = {
    buyerAddress: string;
    collectionId: CanisterId;
    sellerAddress: string;
    timestampNanosecond: number;
    tokenId: string;
    transactionId: string;
    transactionPrice: number;
};

export type RawTransaction = {
    buyer: string;
    canister: CanisterId;
    id: string;
    price: number;
    seller: string;
    time: number;
    token: string;
};

export function parseRawTransaction(raw: RawTransaction): Transaction | undefined {
    if (!raw.token) {
        return undefined;
    }

    return {
        buyerAddress: raw.buyer,
        collectionId: raw.canister,
        sellerAddress: raw.seller,
        timestampNanosecond: raw.time,
        tokenId: raw.token,
        transactionId: raw.id,
        transactionPrice: raw.price,
    };
}
