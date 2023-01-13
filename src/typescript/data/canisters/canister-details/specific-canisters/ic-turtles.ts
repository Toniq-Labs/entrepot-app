import axios from 'axios';
import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {createResizableSvg} from '../image-helpers';

export const icTurtlesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICTurtles',
    canisterId: {
        original: 'fl5nr-xiaaa-aaaai-qbjmq-cai',
        extWrapped: 'jeghr-iaaaa-aaaah-qco7q-cai',
    },
    getNftLinkUrl: ({originalCanisterId, nftIndex}) => {
        return [
            getCanisterDomain(originalCanisterId),
            'nft',
            nftIndex,
        ].join('/');
    },
    getNftImageHtml: async ({nftLinkUrl}) => {
        const response = await axios(nftLinkUrl);
        const svgData = response.data;
        const betterSvg = createResizableSvg(svgData);

        return betterSvg;
    },
};
