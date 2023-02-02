import {getCanisterDetails} from '../canisters/canister-details/all-canister-details';
import {UserNft} from './user-nft';

export function getNftMintNumber(nftDetails: Pick<UserNft, 'collectionId' | 'nftIndex'>): number {
    const collectionDetails = getCanisterDetails(nftDetails.collectionId);

    if (collectionDetails.hasWrappedCanister) {
        return nftDetails.nftIndex;
    } else {
        return nftDetails.nftIndex + 1;
    }
}
