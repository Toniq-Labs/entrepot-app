import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {formEntrepotImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';

export const btcFlowerCanisterDetails: RawCanisterDetails = {
    collectionName: 'BTC Flower',
    canisterId: 'pk6rk-6aaaa-aaaae-qaazq-cai',
    getNftImageData: ({originalCanisterId, fullSize, nftId}) => {
        const imageUrl = fullSize
            ? `${getCanisterDomain(originalCanisterId)}/?tokenid=${nftId}`
            : formEntrepotImagesUrl({
                  entrepotImagesCanisterId: '7budn-wqaaa-aaaah-qcsba-cai',
                  nftId,
              });

        return {
            url: imageUrl,
        };
    },
};
