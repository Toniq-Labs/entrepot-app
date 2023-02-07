import {Principal} from '@dfinity/principal';
import {toHexString} from '../../augments/string';
import {from32bits, to32bitArray} from '../../augments/bits';
import {getExtCanisterId} from '../canisters/canister-details/wrapped-canister-id';
import {CanisterId} from '../models/canister-id';

export function decodeNftId(nftId: string) {
    const p = [...Principal.fromText(nftId).toUint8Array()];
    const padding = p.splice(0, 4);
    if (toHexString(padding) !== toHexString(Buffer.from('\x0Atid'))) {
        return {
            index: 0,
            canister: nftId,
            token: encodeNftId(nftId, 0),
        };
    } else {
        return {
            index: from32bits(p.splice(-4)),
            canister: Principal.fromUint8Array(p as any).toText(),
            token: nftId,
        };
    }
}

export function encodeNftId(principal: any, index: any) {
    const padding = Buffer.from('\x0Atid');
    const array = new Uint8Array([
        ...padding,
        ...Principal.fromText(principal).toUint8Array(),
        ...to32bitArray(index),
    ]);
    return Principal.fromUint8Array(array).toText();
}

export function getExtNftId(nftId: string) {
    console.log({nftId});
    const {index, canister} = decodeNftId(nftId);
    return encodeNftId(getExtCanisterId(canister), index);
}
