import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';
import {createQueryParamString} from '../../../../augments/url';
import {NftImageDisplayData} from '../../get-nft-image-data';

export const icelebrityCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICelebrity',
    canisterId: 'kss7i-hqaaa-aaaah-qbvmq-cai',
    getNftImageData({originalCanisterId, nftId, ref}): NftImageDisplayData {
        const imageUrl = [
            getCanisterDomain(originalCanisterId),
            createQueryParamString({type: 'thumbnail', tokenid: nftId}, [ref]),
        ].join('/');

        return {url: imageUrl};
    },
};