import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {formEntrepotImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';

export const ethFlowerCanisterDetails: RawCanisterDetails = {
    collectionName: 'ETH Flower',
    canisterId: 'dhiaa-ryaaa-aaaae-qabva-cai',
    getNftImageData: ({originalCanisterId, fullSize, nftId}) => {
        const imageUrl = fullSize
            ? `${getCanisterDomain(originalCanisterId)}/?tokenid=${nftId}`
            : formEntrepotImagesUrl({
                  entrepotImagesCanisterId: 'qtejr-pqaaa-aaaah-qcyvq-cai',
                  nftId,
              });
        return {url: imageUrl};
    },
};
