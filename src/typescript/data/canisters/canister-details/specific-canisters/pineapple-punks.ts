import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {formEntrepotImagesUrl} from '../../../../api/entrepot-apis/entrepot-images-url';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const pineapplePunksCanisterDetails: RawCanisterDetails = {
    collectionName: 'Pineapple Punks',
    canisterId: 'skjpp-haaaa-aaaae-qac7q-cai',
    getNftImageData({originalCanisterId, fullSize, nftId}): NftImageDisplayData {
        const imageUrl = fullSize
            ? `${getCanisterDomain(originalCanisterId)}/?tokenid=${nftId}`
            : formEntrepotImagesUrl({
                  entrepotImagesCanisterId: 'wtwf2-biaaa-aaaam-qauoq-cai',
                  nftId,
              });

        return {url: imageUrl};
    },
};