import {decodeNftId} from './nft-id';
import {getExtCanisterId} from '../canisters/canister-details/wrapped-canister-id';
import {getCanisterDetails} from '../canisters/canister-details/all-canister-details';

export type RawUserNft = {
    id: string;
    canister: string;
    owner: string;
    price: number;
    time: number;
};

export type UserNft = {
    nftId: string;
    nftIndex: number;
    nftMintNumber: number;
    collectionId: string;
    ownerAddress: string;
    listPrice: number;
    /** I don't actually know what this time property represents, I've only ever seen it be 0. */
    time: number;
};

export function getNftMintNumber(nftDetails: Pick<UserNft, 'collectionId' | 'nftIndex'>): number {
    const collectionDetails = getCanisterDetails(nftDetails.collectionId);

    if (collectionDetails.hasWrappedCanister) {
        return nftDetails.nftIndex;
    } else {
        return nftDetails.nftIndex + 1;
    }
}

export function parseRawUserNft(rawNft: RawUserNft): UserNft {
    const decodedNftId = decodeNftId(rawNft.id);

    if (decodedNftId.canister !== rawNft.canister) {
        console.error({rawNft: rawNft, decodedNft: decodedNftId});
        throw new Error(
            `Trying to parse raw NFT but its collection id does not match its decoded collection id. See error printed above.`,
        );
    }

    const collectionId = getExtCanisterId(decodedNftId.canister);
    const nftIndex = decodedNftId.index;

    return {
        collectionId,
        listPrice: rawNft.price,
        nftIndex,
        nftId: rawNft.id,
        nftMintNumber: getNftMintNumber({collectionId, nftIndex}),
        ownerAddress: rawNft.owner,
        time: rawNft.time,
    };
}
