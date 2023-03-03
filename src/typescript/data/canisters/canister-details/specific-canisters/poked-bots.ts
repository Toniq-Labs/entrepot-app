import {RawCanisterDetails} from '../canister-details';
import {getDefaultNftImageData} from '../default-canister-details';

export const pokeBotsCanisterDetails: RawCanisterDetails = {
    collectionName: 'Poked Bots',
    canisterId: 'bzsui-sqaaa-aaaah-qce2a-cai',
    getNftLinkUrl({originalCanisterId, nftId}) {
        return getDefaultNftImageData({
            canisterId: originalCanisterId,
            nftId: nftId,
            fullSize: true,
        }).url;
    },
};
