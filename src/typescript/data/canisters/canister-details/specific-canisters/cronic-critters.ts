import {RawCanisterDetails} from '../canister-details';
import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';

export const cronicCrittersCanisterDetails: RawCanisterDetails = {
    collectionName: 'Cronic Critters',
    canisterId: 'e3izy-jiaaa-aaaah-qacbq-cai',
    getNftImageData: ({originalCanisterId, ref, nftId}) => {
        const url = formEntrepotTncImagesUrl({
            canisterId: originalCanisterId,
            nftId,
            ref,
        });
        return {
            url,
        };
    },
};
