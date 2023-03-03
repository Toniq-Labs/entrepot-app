import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';
import {html} from 'element-vir';

export const moonWalkersCanisterDetails: RawCanisterDetails = {
    collectionName: 'MoonWalkers',
    canisterId: 'er7d4-6iaaa-aaaaj-qac2q-cai',
    getNftImageData({fullSize, nftLinkUrl}): NftImageDisplayData | undefined {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                forcedOriginalImageSize: {
                    width: 375,
                    height: 500,
                },
                extraHtml: html`
                    <script>
                        document.querySelector('img').style.width = 'unset';
                    </script>
                `,
            };
        } else {
            return undefined;
        }
    },
};
