// @ts-ignore: this file has no types
import extjs from '../../ic/extjs';
import {CollectionStats} from './models/collection';

type EntrepotTokenApi = {
    call: EntrepotApi;
    fee(): Promise<number>;
    size(): Promise<number>;
    listings(): Promise<any>;
    stats(): Promise<CollectionStats>;
    getTokens(aid: any, principal: any): Promise<any>;
    getBearer(): Promise<any>;
    getDetails(): Promise<any>;
    getBalance(address: any, principal: any): Promise<any>;
    getTransactions(address: any): Promise<any>;
};

type EntrepotApi = {
    /** Map a canister to a preloaded idl */
    idl(canisterId: string, idl: any): void;
    setIdentity(identity: any): EntrepotApi;
    setHost(host: any): EntrepotApi;
    canister(canisterId: string, idl?: any): any;
    token(tokenId?: string, idl?: any): EntrepotTokenApi;
};

export const entrepotDataApi = extjs.connect('https://ic0.app/') as EntrepotApi;
