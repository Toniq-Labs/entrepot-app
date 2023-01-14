import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';

export const icDripCanisterDetails: RawCanisterDetails = {
    collectionName: 'IC Drip',
    canisterId: {
        original: 'd3ttm-qaaaa-aaaai-qam4a-cai',
        extWrapped: '3db6u-aiaaa-aaaah-qbjbq-cai',
    },
    getNftLinkUrl: ({originalCanisterId, nftIndex}) => {
        return [
            getCanisterDomain(originalCanisterId),
            '?tokenId=',
            nftIndex,
        ].join('');
    },
};
