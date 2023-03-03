import {RawCanisterDetails} from '../canister-details';
import {getDefaultNftImageData} from '../default-canister-details';

export const petBotsCanisterDetails: RawCanisterDetails = {
    collectionName: 'Pet Bots',
    canisterId: 't2mog-myaaa-aaaal-aas7q-cai',
    getNftLinkUrl({originalCanisterId, nftId}) {
        return getDefaultNftImageData({
            canisterId: originalCanisterId,
            nftId: nftId,
            fullSize: true,
        }).url;
    },
};
