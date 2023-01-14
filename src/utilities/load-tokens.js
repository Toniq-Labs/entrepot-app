import axios from 'axios';
import extjs from '../ic/extjs.js';
import {getExtCanisterId} from '../typescript/data/canisters/canister-details/wrapped-canister-ids';
import {defaultEntrepotApi} from '../typescript/api/entrepot-data-api';

export function getExtId(tokenid) {
    const {index, canister} = extjs.decodeTokenId(tokenid);
    return extjs.encodeTokenId(getExtCanisterId(canister), index);
}

export function nftIdToNft(address, nftId) {
    const canister = extjs.decodeTokenId(nftId).canister;
    return {
        canister: getExtCanisterId(canister),
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
                    .map(wrappedCanisterId => {
                        try {
                            return defaultEntrepotApi
                                .token(wrappedCanisterId)
                                .getTokens(address, principal)
                                .then(tokenList =>
                                    tokenList.map(token => ({
                                        canister: getExtCanisterId(wrappedCanisterId),
                                        id: token.id,
                                        token: token.id,
                                        price: 0,
                                        time: 0,
                                        owner: address,
                                    })),
                                );
                        } catch (error) {
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
