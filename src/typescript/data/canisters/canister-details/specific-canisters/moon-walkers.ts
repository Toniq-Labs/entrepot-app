import {RawCanisterDetails} from '../canister-details';

export const moonWalkersCanisterDetails: RawCanisterDetails = {
    collectionName: 'MoonWalkers',
    canisterId: 'er7d4-6iaaa-aaaaj-qac2q-cai',
    getNftImageData: ({fullSize, nftLinkUrl}) => {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                imageDimensions: {
                    width: 375,
                    height: 500,
                },
                transformJavascript: `
                    document.querySelector('img').style.width = 'unset';
                `,
            };
        } else {
            return undefined;
        }
    },
};
