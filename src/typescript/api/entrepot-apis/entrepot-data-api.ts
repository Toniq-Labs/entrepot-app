// @ts-ignore: extjs has no types
import extjs from '../../../ic/extjs';
import {CollectionStats} from '../../data/models/collection';

export type EntrepotTokenApi = {
    call: EntrepotApi;
    fee(): Promise<number>;
    size(): Promise<number>;
    listings(): Promise<any>;
    stats(): Promise<CollectionStats>;
    getTokens(aid: any, principal: any): Promise<any>;
    getBearer(): Promise<any>;
    getDetails(): Promise<any>;
    getBalance(address: string, principal: any): Promise<any>;
    getTransactions(address: string): Promise<{id: string}[]>;
};

type EntrepotApi = {
    /** Map a canister to a preloaded idl */
    idl(canisterId: string, idl: any): void;
    setIdentity(identity: any): EntrepotApi;
    setHost(host: any): EntrepotApi;
    canister(canisterId: string, idl?: any): any;
    token(tokenId?: string, idl?: any): EntrepotTokenApi;
};

export const defaultEntrepotApi = extjs.connect('https://ic0.app/') as EntrepotApi;

export function createEntrepotApiWithIdentity(identity: string) {
    return extjs.connect('https://ic0.app/', identity);
}

export function createCloudFunctionsEndpointUrl(paths: ReadonlyArray<string>): string {
    return [
        'https://us-central1-entrepot-api.cloudfunctions.net',
        'api',
        ...paths,
    ].join('/');
}