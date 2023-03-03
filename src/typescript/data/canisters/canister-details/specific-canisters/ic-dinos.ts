import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';
import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const icDinosCanisterDetails: RawCanisterDetails = {
    collectionName: 'IC Dinos',
    canisterId: 'yrdz3-2yaaa-aaaah-qcvpa-cai',
    getNftImageData({originalCanisterId, nftId, ref}): NftImageDisplayData {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
        };
    },
};
