import {Principal} from '@dfinity/principal';
import {to32bitArray} from '../augments/bits';

export function encodeNftId(principalAddress: string, nftIndex: number) {
    const padding = Buffer.from('\x0Atid');
    const array = new Uint8Array([
        ...padding,
        ...Principal.fromText(principalAddress).toUint8Array(),
        ...to32bitArray(nftIndex),
    ]);
    return Principal.fromUint8Array(array).toText();
}
