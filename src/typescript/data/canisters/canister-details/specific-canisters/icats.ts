import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {getImageHTML} from '../image-helpers';

export const icatsCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICats',
    canisterId: {
        original: '4nvhy-3qaaa-aaaah-qcnoq-cai',
        extWrapped: 'y3b7h-siaaa-aaaah-qcnwa-cai',
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
