import {RawCanisterDetails} from '../canister-details';

export const motokoMechsCanisterDetails: RawCanisterDetails = {
    collectionName: 'Motoko Mechs',
    canisterId: 'ugdkf-taaaa-aaaak-acoia-cai',
    getNftImageData: ({fullSize, nftLinkUrl}) => {
        if (fullSize) {
            return {
                url: nftLinkUrl,
                imageDimensions: {
                    width: 850,
                    height: 1160,
                },
            };
        } else {
            return undefined;
        }
    },
};
