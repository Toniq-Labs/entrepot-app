import axios from 'axios';
import extjs from '../ic/extjs.js';
import {getExtCanisterId} from '../typescript/data/canisters/canister-details/wrapped-canister-id';
import {
    defaultEntrepotApi,
    createCloudFunctionsEndpointUrl,
} from '../typescript/api/entrepot-apis/entrepot-data-api';
import {encodeNftId} from '../typescript/data/nft/nft-id';

export async function loadAllUserTokens(address, principal) {
    var response = await Promise.all(
        [
            axios(
                createCloudFunctionsEndpointUrl([
                    'user',
                    address,
                    'all',
                ]),
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
