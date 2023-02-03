import {Principal} from '@dfinity/principal';

export type RawNftOffer = {
    // not sure what this address property refers to
    address: string;
    amount: bigint;
    authId: bigint;
    offerer: Principal;
    time: bigint;
};

export type NftOffer = {
    offererAccountAddress: string;
    // unix epoch timestamp in milliseconds
    timestamp: number;
    offerAmount: number;
};

export function parseRawNftOffer(rawNftOffer: RawNftOffer): NftOffer {
    return {
        offerAmount: Number(rawNftOffer.amount),
        offererAccountAddress: rawNftOffer.offerer.toText(),
        timestamp: Number(rawNftOffer.time / BigInt(1_000_000)),
    };
}
