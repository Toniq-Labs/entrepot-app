import {RawCanisterDetails} from '../canister-details';
import {getDefaultNftImageData} from '../default-canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';
import {html} from 'element-vir';

export const imaginationProjectCanisterDetails: RawCanisterDetails = {
    collectionName: 'Imagination Project',
    canisterId: 'px5ub-qqaaa-aaaah-qcjxa-cai',
    getNftImageData({originalCanisterId, nftId, fullSize}): NftImageDisplayData | undefined {
        if (!fullSize) {
            return undefined;
        }
        const imageData = getDefaultNftImageData({
            canisterId: originalCanisterId,
            nftId: nftId,
            fullSize: true,
        });

        return {
            ...imageData,
            htmlSizeQuerySelector: '.front img',
            extraHtml: html`
                <script>
                    executeBeforeSizing = () => {
                        const img = document.querySelector('.front img');

                        if (img) {
                            const size = {
                                width: img.naturalWidth,
                                height: img.naturalHeight,
                            };

                            const mustChange = [
                                '.container',
                                '.box',
                            ];

                            mustChange.forEach(mustChangeQuery => {
                                const element = document.querySelector(mustChangeQuery);
                                if (element) {
                                    element.style.height = img.height + 'px';
                                    element.style.width = img.width + 'px';
                                }
                            });
                        }
                    };
                </script>
            `,
        };
    },
};