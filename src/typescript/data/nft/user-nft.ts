import {decodeNftId} from './nft-id';
import {getExtCanisterId} from '../canisters/canister-details/wrapped-canister-id';
import {CanisterId} from '../models/canister-id';
import {getNftMintNumber} from './nft-mint-number';
import {BaseNft} from './base-nft';

export type RawUserNft = {
    id: string;
    canister: CanisterId;
    owner: string;
    price: number;
    time: number;
};

export type UserNft = BaseNft & {
    ownerAddress: string;
    /**
     * I don't actually know what this time property represents for a user NFT: I've only ever seen
     * it be 0.
     */
    time: number;
};

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
