import {html} from 'element-vir';
import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const dripBangCanisterDetails: RawCanisterDetails = {
    collectionName: 'DRIP BANG',
    canisterId: 'x4oqm-bqaaa-aaaam-qahaq-cai',
    getNftImageData({fullSize, nftLinkUrl}): NftImageDisplayData | undefined {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                extraHtml: html`
                    <style>
                        body {
                            background-color: black;
                        }
                    </style>
                `,
            };
        } else {
            return undefined;
        }
    },
};