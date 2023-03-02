import {formEntrepotImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';
import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const dfinityDeckOriginsCanisterDetails: RawCanisterDetails = {
    collectionName: 'DfinityDeck:ORIGINS',
    canisterId: '7i54s-nyaaa-aaaal-abomq-cai',
    getNftImageData({originalCanisterId, nftId, priority}): NftImageDisplayData {
        return {
            url: formEntrepotImagesUrl({
                entrepotImagesCanisterId: originalCanisterId,
                nftId,
                cachePriority: priority,
                useCacheBuster: true,
            }),
        };
    },
};
