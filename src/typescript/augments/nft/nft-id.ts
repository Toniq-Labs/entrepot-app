import {Principal} from '@dfinity/principal';
import {toHexString} from '../string';
import {from32bits, to32bitArray} from '../bits';
import {getExtCanisterId} from '../../data/canisters/canister-details/wrapped-canister-id';
import {UserNft} from '../../data/models/user-data/user-nft';
import {EntrepotUserAccount} from '../../data/models/user-data/account';

export function decodeNftId(nftId: string) {
    var p: any = [...Principal.fromText(nftId).toUint8Array()];
    var padding = p.splice(0, 4);
    if (toHexString(padding) !== toHexString(Buffer.from('\x0Atid'))) {
        return {
            index: 0,
            canister: nftId,
            token: encodeNftId(nftId, 0),
        };
    } else {
        return {
            index: from32bits(p.splice(-4)),
            canister: Principal.fromUint8Array(p).toText(),
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

export function nftIdToNft({
    userAccount,
    nftId,
}: {
    userAccount: EntrepotUserAccount;
    nftId: string;
}): UserNft {
    const canister = decodeNftId(nftId).canister;
    return {
        collectionId: getExtCanisterId(canister),
        nftId,
        listPrice: 0,
        time: 0,
        ownerAddress: userAccount.address,
    };
}

export function nftIdsToNfts({
    userAccount,
    nftIds,
}: {
    userAccount: EntrepotUserAccount;
    nftIds: ReadonlyArray<string>;
}): UserNft[] {
    return nftIds.map(nftId => nftIdToNft({userAccount, nftId}));
}
