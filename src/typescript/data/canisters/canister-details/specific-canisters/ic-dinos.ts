import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';
import {RawCanisterDetails} from '../canister-details';

export const icDinosCanisterDetails: RawCanisterDetails = {
    collectionName: 'IC Dinos',
    canisterId: 'yrdz3-2yaaa-aaaah-qcvpa-cai',
    getNftImageData: ({originalCanisterId, nftId, ref}) => {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
        };
        // {
        //     replaceAttributeValues: [
        //         {
        //             attribute: 'viewBox',
        //             replaceThis: /2000/,
        //             withThis: '1990',
        //         },
        //     ],
        // },
        // );
    },
};
