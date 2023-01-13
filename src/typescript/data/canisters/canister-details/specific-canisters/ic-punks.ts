import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {getImageHTML} from '../image-helpers';

export const icPunksCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICPunks',
    canisterId: {
        original: 'qcg3w-tyaaa-aaaah-qakea-cai',
        extWrapped: 'bxdf4-baaaa-aaaah-qaruq-cai',
    },
    getNftLinkUrl: ({originalCanisterId, nftIndex}) => {
        return [
            getCanisterDomain(originalCanisterId),
            'Token',
            nftIndex,
        ].join('/');
    },
    getNftImageHtml: getImageHTML,
};
