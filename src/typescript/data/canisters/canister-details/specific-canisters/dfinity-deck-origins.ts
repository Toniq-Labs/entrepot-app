import {formEntrepotImagesUrl} from '../../../../api/entrepot-images-url';
import {RawCanisterDetails} from '../canister-details';

export const dfinityDeckOriginsCanisterDetails: RawCanisterDetails = {
    collectionName: 'DfinityDeck:ORIGINS',
    canisterId: '7i54s-nyaaa-aaaal-abomq-cai',
    getNftImageData: ({originalCanisterId, nftId, priority}) => {
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
