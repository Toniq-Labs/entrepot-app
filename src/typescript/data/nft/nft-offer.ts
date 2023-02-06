import {Principal} from '@dfinity/principal';

/** This is a separate list of properties because it is fetched from a dedicated canister. */

export type RawNftOffer = {
    // not sure what this address property refers to
    address: string;
    amount: bigint;
    authId: bigint;
    offerer: Principal;
    time: bigint;
};

export type NftOffers = {
    offers: {
        offererAccountAddress: string;
        // unix epoch timestamp in milliseconds
        timestamp: number;
        offerAmount: number;
    }[];
};

export function parseRawNftOffers(rawNftOffers: RawNftOffer[]): NftOffers {
    return {
        offers: rawNftOffers.map(rawNftOffer => {
            return {
                offerAmount: Number(rawNftOffer.amount),
                offererAccountAddress: rawNftOffer.offerer.toText(),
                timestamp: Number(rawNftOffer.time / BigInt(1_000_000)),
            };
        }),
    };
}
