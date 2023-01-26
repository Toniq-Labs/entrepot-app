import {RawCanisterDetails} from '../canister-details';
import {createResizableSvg} from '../image-helpers';
import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-images-url';

export const icKittiesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICKitties',
    canisterId: 'rw7qm-eiaaa-aaaak-aaiqq-cai',
    getNftImageData: ({originalCanisterId, ref, nftId}) => {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
        };
        //     {
        //         replaceAttributeValues: [
        //             {
        //                 attribute: 'viewBox',
        //                 replaceThis: /1024/g,
        //                 withThis: '1000',
        //             },
        //         ],
        //     },
        // );
    },
};
