import {RawCanisterDetails} from '../canister-details';
import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-images-url';

export const icPuppiesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICPuppies',
    canisterId: '5movr-diaaa-aaaak-aaftq-cai',
    getNftImageData: ({originalCanisterId, ref, nftId}) => {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
        };
    },
};
