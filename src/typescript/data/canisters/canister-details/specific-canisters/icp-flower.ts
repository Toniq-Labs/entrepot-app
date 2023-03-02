import {RawCanisterDetails} from '../canister-details';
import {encodeNftId} from '../../../../api/ext';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const icpFlowerCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICP Flower',
    canisterId: '4ggk4-mqaaa-aaaae-qad6q-cai',
    getNftImageData({ref, priority, fullSize, nftIndex}): NftImageDisplayData | undefined {
        if (fullSize) {
            return undefined;
        }
        const encodedTokenId = encodeNftId('dexpm-6aaaa-aaaal-qbgrq-cai', nftIndex);

        const refQuery: string = ref == undefined ? '' : String(ref);
        const ampersand = ref == undefined ? '' : '&';
        const queryParams = `?${refQuery}${ampersand}cache=${priority}`;
        const imageUrl = `https://images.entrepot.app/t/dexpm-6aaaa-aaaal-qbgrq-cai/${encodedTokenId}${queryParams}`;

        return {
            url: imageUrl,
        };
    },
};
