import {Principal} from '@dfinity/principal';

export type RawNftOffer = [
    // I have no idea what this principal is, it doesn't seem to actually correspond to anything
    Principal,
    // amount
    bigint,
    // time stamp
    bigint,
    // offer maker account address
    string,
];

export type NftOffer = {
    offerMadeByUserAccountAddress: string;
    timestamp: bigint;
    offerAmount: bigint;
};

export function parseRawNftOffer(rawNftOffer: RawNftOffer): NftOffer {
    return {
        offerAmount: rawNftOffer[1],
        offerMadeByUserAccountAddress: rawNftOffer[3],
        timestamp: rawNftOffer[2],
    };
}
