import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {createQueryParamString} from '../../../../augments/url';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const icBucksCanisterDetails: RawCanisterDetails = {
    collectionName: 'IC Bucks',
    canisterId: '6wih6-siaaa-aaaah-qczva-cai',
    getNftImageData({originalCanisterId, nftId, ref}): NftImageDisplayData {
        const imageUrl = [
            getCanisterDomain(originalCanisterId),
            createQueryParamString({cc: Date.now(), type: 'thumbnail', tokenid: nftId}, [ref]),
        ].join('/');

        return {url: imageUrl};
    },
};
