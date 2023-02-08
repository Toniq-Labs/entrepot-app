import {CanisterId} from './canister-id';

export type BaseCollection = {
    /** Image url */
    avatar: string;
    /** Image url */
    banner: string;
    /** Html string */
    blurb: string;
    brief: string;
    canister: string;
    /** Url */
    collection: string;
    commission: number;
    description: string;
    detailpage: string;
    dev: boolean;
    /** Server invite URL */
    discord: string;
    /** Url */
    distrikt: string;
    /** Url */
    dscvr: string;
    earn: boolean;
    external: boolean;
    filter: boolean;
    /** Canister id for the collection */
    id: CanisterId;
    /** Space separated list */
    keywords: string;
    kyc: boolean;
    legacy: string;
    market: boolean;
    mature: boolean;
    /** Url for medium.com */
    medium: string;
    name: string;
    nftlicense: string;
    nftv: boolean;
    priority: number;
    route: string;
    sale: boolean;
    saletype: 'v1' | 'v2' | 'auction';
    standard: 'legacy' | 'ext' | 'EXT';
    /** Url */
    telegram: string;
    /** Url */
    twitter: string;
    unit: 'NFT' | string;
    /** Url */
    web: string;
};

export type CollectionStats = {
    /** Numeric value inside a string */
    average: string;
    /** Numeric value inside a string */
    floor: string;
    /** Numeric value inside a string */
    high: string;
    /** Integers only */
    listings: number;
    /** Numeric value inside a string */
    low: string;
    /** Integers only */
    sales: number;
    /** Integers only */
    tokens: number;
    /** Numeric value inside a string */
    total: string;
};

export type Collection = BaseCollection & {
    stats: CollectionStats | undefined;
};

export type CollectionMap = Readonly<Record<string, Collection>>;
