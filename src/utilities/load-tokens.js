import axios from 'axios';
import extjs from '../ic/extjs.js';

const api = extjs.connect('https://boundary.ic0.app/');

const toWrappedMap = {
    'qcg3w-tyaaa-aaaah-qakea-cai': 'bxdf4-baaaa-aaaah-qaruq-cai',
    '4nvhy-3qaaa-aaaah-qcnoq-cai': 'y3b7h-siaaa-aaaah-qcnwa-cai',
    'd3ttm-qaaaa-aaaai-qam4a-cai': '3db6u-aiaaa-aaaah-qbjbq-cai',
    'xkbqi-2qaaa-aaaah-qbpqq-cai': 'q6hjz-kyaaa-aaaah-qcama-cai',
    'fl5nr-xiaaa-aaaai-qbjmq-cai': 'jeghr-iaaaa-aaaah-qco7q-cai',
};

export function getEXTCanister(canisterId) {
    return toWrappedMap[canisterId] ?? canisterId;
}

export function getEXTID(tokenid) {
    const {index, canister} = extjs.decodeTokenId(tokenid);
    return extjs.encodeTokenId(getEXTCanister(canister), index);
}

export function nftIdToNft(address, nftId) {
    const canister = extjs.decodeTokenId(nftId).canister;
    return {
        canister: getEXTCanister(canister),
        id: nftId,
        token: nftId,
        price: 0,
        time: 0,
        owner: address,
    };
}

export async function loadAllUserTokens(address, principal) {
    var response = await Promise.all(
        [
            axios(
                'https://us-central1-entrepot-api.cloudfunctions.net/api/user/' + address + '/all',
            ).then(r => r.data.map(a => ({...a, token: a.id}))),
        ]
            .concat(
                [
                    '4nvhy-3qaaa-aaaah-qcnoq-cai',
                    'qcg3w-tyaaa-aaaah-qakea-cai',
                    //"jzg5e-giaaa-aaaah-qaqda-cai",
                    'd3ttm-qaaaa-aaaai-qam4a-cai',
                    'xkbqi-2qaaa-aaaah-qbpqq-cai',
                    //"fl5nr-xiaaa-aaaai-qbjmq-cai",
                ]
                    .map(a => {
                        try {
                            return api
                                .token(a)
                                .getTokens(address, principal)
                                .then(r =>
                                    r.map(b => ({
                                        canister: getEXTCanister(a),
                                        id: b.id,
                                        token: b.id,
                                        price: 0,
                                        time: 0,
                                        owner: address,
                                    })),
                                );
                        } catch (e) {
                            return false;
                        }
                    })
                    .filter(b => b !== false),
            )
            .map(p => p.catch(e => e)),
    );
    var tokens = response.filter(result => !(result instanceof Error)).flat();
    return tokens;
}
