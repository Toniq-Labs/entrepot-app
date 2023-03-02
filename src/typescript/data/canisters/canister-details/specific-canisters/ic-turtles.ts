import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';

export const icTurtlesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICTurtles',
    canisterId: {
        original: 'fl5nr-xiaaa-aaaai-qbjmq-cai',
        extWrapped: 'jeghr-iaaaa-aaaah-qco7q-cai',
    },
    getNftLinkUrl({originalCanisterId, nftIndex}) {
        return [
            getCanisterDomain(originalCanisterId),
            'nft',
            nftIndex,
        ].join('/');
    },
};
