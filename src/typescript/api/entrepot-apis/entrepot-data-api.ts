import {CollectionStats} from '../../data/models/collection';
import {UserIdentity} from '../../data/models/user-data/identity';

// @ts-ignore: extjs has no types
import extjs from '../../../ic/extjs';
import {CanisterId} from '../../data/models/canister-id';

export type EntrepotTokenApi = {
    call: EntrepotApi;
    fee(): Promise<number>;
    size(): Promise<number>;
    listings(): Promise<any>;
    stats(): Promise<CollectionStats>;
    getTokens(accountAddress: any, principalString: any): Promise<any>;
    getBearer(): Promise<any>;
    getDetails(): Promise<any>;
    getBalance(address: string, principal: any): Promise<any>;
    getTransactions(address: string): Promise<{id: string}[]>;
};

export type NftIds = string[];

type EntrepotApi = {
    /** Map a canister to a preloaded idl */
    idl(canisterId: string, idl: any): void;
    setIdentity(identity: any): EntrepotApi;
    setHost(host: any): EntrepotApi;
    /** Use getEntrepotCanister to get typed canisters APIs. */
    canister: (canisterId: CanisterId, idl?: unknown) => unknown;
    token(tokenId?: string, idl?: any): EntrepotTokenApi;
};

export const defaultEntrepotApi = extjs.connect('https://ic0.io/') as EntrepotApi;

export function createEntrepotApiWithIdentity(identity: UserIdentity | undefined): EntrepotApi {
    return extjs.connect('https://ic0.io/', identity);
}

export function createCloudFunctionsEndpointUrl(paths: string[]): string {
    return [
        'https://us-central1-entrepot-api.cloudfunctions.net',
        'api',
        ...paths,
    ].join('/');
}
