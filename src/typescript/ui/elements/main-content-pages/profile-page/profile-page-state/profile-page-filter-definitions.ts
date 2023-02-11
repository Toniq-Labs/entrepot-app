import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    CurrentSort,
    FilterDefinitions,
    SortDefinition,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {ProfileTopTabValue} from './profile-tabs';
import {
    defaultProfileNftFilters,
    profileNftSortDefinitions,
} from './profile-page-nft-filters/profile-nft-filters';
import {
    profileUserTransactionSortDefinitions,
    defaultProfileUserTransactionFilters,
} from './profile-page-transaction-filters/profile-transaction-filters';
import {
    profileOfferSortDefinitions,
    defaultProfileOfferFilters,
} from './profile-page-offer-filters/profile-offer-filters';

export const defaultProfileFilters = wrapNarrowTypeWithTypeCheck<
    Record<string, ReadonlyDeep<FilterDefinitions<any>>>
>()({
    base: defaultProfileNftFilters,
    activity: defaultProfileUserTransactionFilters,
    earn: defaultProfileNftFilters,
    offers: defaultProfileOfferFilters,
} as const);

export const defaultProfileSort: Record<
    keyof typeof defaultProfileFilters,
    ReadonlyDeep<CurrentSort>
> = {
    activity: {
        ascending: false,
        name: profileUserTransactionSortDefinitions[0].sortName,
    },
    earn: {
        ascending: false,
        name: profileNftSortDefinitions[0].sortName,
    },
    base: {
        ascending: false,
        name: profileNftSortDefinitions[0].sortName,
    },
    offers: {
        ascending: false,
        name: profileOfferSortDefinitions[0].sortName,
    },
} as const;

export const sortDefinitions: Record<
    keyof typeof defaultProfileFilters,
    ReadonlyArray<ReadonlyDeep<SortDefinition<any>>>
> = {
    activity: profileUserTransactionSortDefinitions,
    earn: profileNftSortDefinitions,
    base: profileNftSortDefinitions,
    offers: profileOfferSortDefinitions,
} as const;

export const filterSortKeyByTab: Record<ProfileTopTabValue, keyof typeof defaultProfileFilters> = {
    'my-nfts': 'base',
    favorites: 'base',
    offers: 'offers',
    activity: 'activity',
    earn: 'activity',
} as const;
