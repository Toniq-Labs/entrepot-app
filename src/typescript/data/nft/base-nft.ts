import {NftListing, RawNftListing, parseRawNftListing} from './nft-listing';
import {NftOffers, RawNftOffer, parseRawNftOffers} from './nft-offer';
import {decodeNftId} from './nft-id';
import {getExtCanisterId} from '../canisters/canister-details/wrapped-canister-id';
import {getNftMintNumber} from './nft-mint-number';

export type BaseNft = {
    nftIndex: number;
    nftMintNumber: number;
    timestampNanosecond?: number;
    listPrice?: number;
} & NftListing &
    NftOffers;

export function parseRawNftData({
    rawNftListing,
    rawNftOffers,
}: {
    rawNftListing: RawNftListing;
    rawNftOffers: RawNftOffer[];
}): BaseNft {
    const decodedNftId = decodeNftId(rawNftListing.id);

    if (decodedNftId.canister !== rawNftListing.canister) {
        console.error({rawNft: rawNftListing, decodedNft: decodedNftId});
        throw new Error(
            `Trying to parse raw NFT but its collection id does not match its decoded collection id. See error printed above.`,
        );
    }

    const collectionId = getExtCanisterId(decodedNftId.canister);
    const nftIndex = decodedNftId.index;

    return {
        ...parseRawNftListing(rawNftListing),
        ...parseRawNftOffers(rawNftOffers),
        nftIndex,
        nftMintNumber: getNftMintNumber({collectionId, nftIndex}),
    };
}
