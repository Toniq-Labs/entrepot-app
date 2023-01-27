import {RawCanisterDetails} from '../canister-details';
import {formEntrepotTncImagesUrl} from '../../../../api/entrepot-images-url';
import {html} from 'element-vir';
import {getDefaultNftImageData} from '../default-canister-details';

export const icKittiesCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICKitties',
    canisterId: 'rw7qm-eiaaa-aaaak-aaiqq-cai',
    getNftLinkUrl: ({originalCanisterId, nftId}) => {
        return getDefaultNftImageData({
            canisterId: originalCanisterId,
            nftId: nftId,
            fullSize: true,
        }).url;
    },
    getNftImageData: ({originalCanisterId, ref, nftId}) => {
        return {
            url: formEntrepotTncImagesUrl({
                canisterId: originalCanisterId,
                nftId,
                ref,
            }),
            extraHtml: html`
                <script>
                    const svgElement = document.querySelector('svg');
                    svgElement.setAttribute(
                        'viewBox',
                        svgElement.getAttribute('viewBox').replace(/1024/g, '1000'),
                    );
                </script>
            `,
        };
    },
};
