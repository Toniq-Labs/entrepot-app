import {RawCanisterDetails} from '../canister-details';
import {getDefaultNftImageData} from '../default-canister-details';

export const flightCanisterDetails: RawCanisterDetails = {
    collectionName: 'Flight',
    canisterId: 'dylar-wyaaa-aaaah-qcexq-cai',
    getNftImageData: inputs => {
        const defaultImageData = getDefaultNftImageData({
            ...inputs,
            canisterId: 'dylar-wyaaa-aaaah-qcexq-cai',
        });

        return {
            ...defaultImageData,
            imageDimensions: {
                width: 200,
                height: 300,
            },
            extraHtml: inputs.fullSize
                ? ''
                : /* HTML */
                  `
                      <style>
                          body {
                              display: flex;
                              justify-content: center;
                          }
                          img {
                              width: unset !important;
                              max-width: unset !important;
                          }
                      </style>
                  `,
        };
    },
};
