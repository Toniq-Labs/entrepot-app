import {RawCanisterDetails} from '../canister-details';
import {getCanisterDomain} from '../../../../api/ic-canister-domain';

export const icpBunnyCanisterDetails: RawCanisterDetails = {
    collectionName: 'ICPBunny',
    canisterId: {
        original: 'xkbqi-2qaaa-aaaah-qbpqq-cai',
        extWrapped: 'q6hjz-kyaaa-aaaah-qcama-cai',
    },
    getNftLinkUrl({nftIndex}) {
        const icpBunnyStorage = [
            'efqhu-yqaaa-aaaaf-qaeda-cai',
            'ecrba-viaaa-aaaaf-qaedq-cai',
            'fp7fo-2aaaa-aaaaf-qaeea-cai',
            'fi6d2-xyaaa-aaaaf-qaeeq-cai',
            'fb5ig-bqaaa-aaaaf-qaefa-cai',
            'fg4os-miaaa-aaaaf-qaefq-cai',
            'ft377-naaaa-aaaaf-qaega-cai',
            'fu2zl-ayaaa-aaaaf-qaegq-cai',
            'f5zsx-wqaaa-aaaaf-qaeha-cai',
            'f2yud-3iaaa-aaaaf-qaehq-cai',
        ];

        const canisterToUse = icpBunnyStorage[nftIndex % icpBunnyStorage.length]!;

        return [
            getCanisterDomain(canisterToUse),
            'Token',
            nftIndex,
        ].join('/');
    },
};
