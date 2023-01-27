import {BigNumber} from 'bignumber.js';
import {Collection} from './collection';

export type SalesGroup = {
    available: boolean;
    end: BigNumber;
    id: BigNumber;
    name: string;
    pricing: Array<Array<BigNumber>>;
    start: BigNumber;
    public: boolean;
};

export type Sales = {
    id?: string;
    end: BigNumber;
    groups: Array<SalesGroup>;
    quantity: BigNumber;
    remaining: BigNumber;
    start: BigNumber;
};

export type SalesData = Sales & {
    startDate: number;
    endDate: number;
    percentMinted: number;
    salePrice: number;
};

export type CollectionSales = Collection & {
    sales: SalesData;
};
