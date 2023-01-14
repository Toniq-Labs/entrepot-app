import {RawCanisterDetails} from '../canister-details';
import {encodeNftId} from '../../../../api/ext';
import {createImageHTML, createResizableSvg} from '../image-helpers';

export const icpFlowerCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICP Flower',
    canisterId: '4ggk4-mqaaa-aaaae-qad6q-cai',
    getNftImageHtml: ({fullSize, ref, priority, nftIndex}) => {
        if (fullSize) {
            return undefined;
        } else {
            const encodedTokenId = encodeNftId('dexpm-6aaaa-aaaal-qbgrq-cai', nftIndex);

            const refQuery: string = ref == undefined ? '' : String(ref);
            const ampersand = ref == undefined ? '' : '&';
            const queryParams = `?${refQuery}${ampersand}cache=${priority}`;

            const imageUrl = `https://images.entrepot.app/t/dexpm-6aaaa-aaaal-qbgrq-cai/${encodedTokenId}${queryParams}`;

            return createImageHTML(imageUrl);
        }
    },
};
