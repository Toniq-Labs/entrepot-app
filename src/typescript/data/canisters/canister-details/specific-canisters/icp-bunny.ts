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
            'h3ba2-7aaaa-aaaaf-qaeka-cai',
            'h4ago-syaaa-aaaaf-qaekq-cai',
            'fi6d2-xyaaa-aaaaf-qaeeq-cai',
            'fb5ig-bqaaa-aaaaf-qaefa-cai',
            'fg4os-miaaa-aaaaf-qaefq-cai',
            'gynj4-lyaaa-aaaaf-qaemq-cai',
            'groca-5qaaa-aaaaf-qaena-cai',
            'gwpeu-qiaaa-aaaaf-qaenq-cai',
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
