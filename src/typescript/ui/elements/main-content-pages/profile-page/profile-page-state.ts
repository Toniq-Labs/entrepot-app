import {ensureType, wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {asyncState, MaybeAsyncStateToSync} from 'element-vir';
import {
    CurrentSort,
    FilterDefinitions,
    SortDefinition,
} from '../../common/with-filters/filters-types';
import {CollectionNriData} from '../../../../data/models/collection-nri-data';
import {CanisterId} from '../../../../data/models/canister-id';
import {ReadonlyDeep} from 'type-fest';
import {ProfileTopTabValue, profileTabMap, ProfileTab} from './profile-tabs';
import {UserTransactionWithDirection} from '../../../../data/nft/user-nft-transaction';
import {FullProfileNft} from './profile-nfts/full-profile-nft';
import {BaseNft} from '../../../../data/nft/base-nft';
import {
    defaultProfileNftFilters,
    profileNftSortDefinitions,
    ProfileCompleteNft,
} from './nft-profile-parts/nft-profile-filters';
import {
    profileUserTransactionSortDefinitions,
    defaultProfileUserTransactionFilters,
} from './user-transaction-profile-parts/transaction-profile-filters';

export type ProfileFullEarnNft = {
    earn: boolean;
} & BaseNft &
    FullProfileNft;

export const defaultProfileFilters = wrapNarrowTypeWithTypeCheck<
    Record<string, ReadonlyDeep<FilterDefinitions<any>>>
>()({
    base: defaultProfileNftFilters,
    activity: defaultProfileUserTransactionFilters,
    earn: defaultProfileNftFilters,
} as const);

const defaultProfileSort: Record<keyof typeof defaultProfileFilters, ReadonlyDeep<CurrentSort>> = {
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
} as const;

export const sortDefinitions: Record<
    keyof typeof defaultProfileFilters,
    ReadonlyArray<ReadonlyDeep<SortDefinition<any>>>
> = {
    activity: profileUserTransactionSortDefinitions,
    earn: profileNftSortDefinitions,
    base: profileNftSortDefinitions,
} as const;

export const filterSortKeyByTab: Record<ProfileTopTabValue, keyof typeof defaultProfileFilters> = {
    'my-nfts': 'base',
    favorites: 'base',
    offers: 'base',
    activity: 'activity',
    earn: 'activity',
} as const;

export const profilePageStateInit = {
    showFilters: false,
    allFilters: defaultProfileFilters,
    currentProfileTab: profileTabMap['my-nfts'] as ProfileTab,
    userTransactions: asyncState<ReadonlyArray<UserTransactionWithDirection>>(),
    userOwnedNfts: asyncState<ReadonlyArray<BaseNft>>(),
    userFavorites: asyncState<ReadonlyArray<BaseNft>>(),
    userOffersMade: asyncState<ReadonlyArray<BaseNft>>(),
    collectionNriData: asyncState<Readonly<Record<CanisterId, CollectionNriData>>>(),
    userEarnNfts: asyncState<ReadonlyArray<ProfileFullEarnNft>>(),
    allSorts: defaultProfileSort,
};

export type ProfilePageStateType = Readonly<MaybeAsyncStateToSync<typeof profilePageStateInit>>;
