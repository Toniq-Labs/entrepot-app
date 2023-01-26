import {RawCanisterDetails} from '../canister-details';
import {getDefaultNftImageData} from '../default-canister-details';

export const pokeBotsCanisterDetails: RawCanisterDetails = {
    collectionName: 'Poked Bots',
    canisterId: 'bzsui-sqaaa-aaaah-qce2a-cai',
    getNftLinkUrl: ({originalCanisterId, nftId}) => {
        return getDefaultNftImageData({
            canisterId: originalCanisterId,
            nftId: nftId,
            fullSize: true,
        }).url;
    },
};
// https://bzsui-sqaaa-aaaah-qce2a-cai.raw.ic0.app/?cc=0&tokenid=ej3pw-sqkor-uwiaa-aaaaa-b4arg-qaqca-aaba4-a
