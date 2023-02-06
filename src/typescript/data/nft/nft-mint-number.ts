import {getCanisterDetails} from '../canisters/canister-details/all-canister-details';
import {BaseNft} from './base-nft';

export function getNftMintNumber(nftDetails: Pick<BaseNft, 'collectionId' | 'nftIndex'>): number {
    const collectionDetails = getCanisterDetails(nftDetails.collectionId);

    if (collectionDetails.hasWrappedCanister) {
        return nftDetails.nftIndex;
    } else {
        return nftDetails.nftIndex + 1;
    }
}
