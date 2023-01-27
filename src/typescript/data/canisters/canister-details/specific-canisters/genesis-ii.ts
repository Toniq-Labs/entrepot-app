import {RawCanisterDetails} from '../canister-details';

export const genesisIICanisterDetails: RawCanisterDetails = {
    collectionName: 'Gensis II',
    canisterId: 't555s-uyaaa-aaaal-qbjsa-cai',
    getNftImageData: ({fullSize, nftLinkUrl}) => {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                imageDimensions: {
                    width: 2048,
                    height: 1900,
                },
                transformJavascript: `
                    document.getElementById('root').style.width = '100vw';
                    document.getElementById('root').style.height = '100vh';
                    document.getElementById('defaultCanvas0').style.width = '100vw';
                    document.getElementById('defaultCanvas0').style.height = '100vh';
                `,
            };
        } else {
            return undefined;
        }
    },
};
