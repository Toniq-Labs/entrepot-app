import {html} from 'element-vir';
import {RawCanisterDetails} from '../canister-details';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const motokoMechsCanisterDetails: RawCanisterDetails = {
    collectionName: 'Motoko Mechs',
    canisterId: 'ugdkf-taaaa-aaaak-acoia-cai',
    getNftImageData({fullSize, nftLinkUrl}): NftImageDisplayData | undefined {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                forcedOriginalImageSize: {
                    width: 850,
                    height: 1214,
                },
            };
        } else {
            return undefined;
        }
    },
};
