import {html} from 'element-vir';
import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const genesisIICanisterDetails: RawCanisterDetails = {
    collectionName: 'Genesis II',
    canisterId: 't555s-uyaaa-aaaal-qbjsa-cai',
    getNftImageData({fullSize, nftLinkUrl}): NftImageDisplayData | undefined {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                forcedOriginalImageSize: {
                    width: 2048,
                    height: 1900,
                },
                extraHtml: html`
                    <script>
                        document.getElementById('root').style.width = '100vw';
                        document.getElementById('root').style.height = '100vh';
                        document.getElementById('defaultCanvas0').style.width = '100vw';
                        document.getElementById('defaultCanvas0').style.height = '100vh';
                    </script>
                `,
            };
        } else {
            return undefined;
        }
    },
};
