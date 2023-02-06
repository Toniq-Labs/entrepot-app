import {CollectionStats} from '../../data/models/collection';
import {UserIdentity} from '../../data/models/user-data/identity';

// @ts-ignore: extjs has no types
import extjs from '../../../ic/extjs';
import {Sales} from '../../data/models/sales';
import {CanisterId} from '../../data/models/canister-id';
import {treasureCanisterId} from '../../data/canisters/treasure-canister';

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

/**
 * This API has been filled in by looking at previous JavaScrip code, so it might not be entirely
 * accurate.
 */
type CollectionCanisterApi = {
    lock: (
        tokenId: string,
        price: number | BigInt,
        accountAddress: string,
        randomBytes: number[],
    ) => Promise<{err: Error; ok: string}>;
    settle: (tokenId: string) => Promise<void>;
    payments: () => Promise<unknown[][]>;
};

type CanisterApis = {
    '6z5wo-yqaaa-aaaah-qcsfa-cai': {
        offered: () => Promise<NftIds>;
        liked: () => Promise<NftIds>;
    };
    [treasureCanisterId]: {
        tp_close: Promise<unknown>;
        tp_cancel: Promise<unknown>;
        tp_fill: Promise<unknown>;
        tp_settle: Promise<unknown>;
    };
    'uczwa-vyaaa-aaaam-abdba-cai': {
        get_all_launch_settings: () => Promise<Sales[]>;
    };
};

type CanisterCallback = <SpecificId extends CanisterId>(
    canisterId: SpecificId,
    idk?: unknown,
) => SpecificId extends keyof CanisterApis ? CanisterApis[SpecificId] : CollectionCanisterApi;

type EntrepotApi = {
    /** Map a canister to a preloaded idl */
    idl(canisterId: string, idl: any): void;
    setIdentity(identity: any): EntrepotApi;
    setHost(host: any): EntrepotApi;
    canister: CanisterCallback;
    token(tokenId?: string, idl?: any): EntrepotTokenApi;
};

export const defaultEntrepotApi = extjs.connect('https://ic0.app/') as EntrepotApi;

export function createEntrepotApiWithIdentity(identity: UserIdentity | undefined): EntrepotApi {
    return extjs.connect('https://ic0.app/', identity);
}

export function createCloudFunctionsEndpointUrl(paths: string[]): string {
    return [
        'https://us-central1-entrepot-api.cloudfunctions.net',
        'api',
        ...paths,
    ].join('/');
}
