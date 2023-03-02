import {RawCanisterDetails} from '../canister-details';
import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const icPuppiesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICPuppies',
    canisterId: '5movr-diaaa-aaaak-aaftq-cai',
    getNftImageData({originalCanisterId, ref, nftId}): NftImageDisplayData {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
        };
    },
};
