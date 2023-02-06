import {ensureType} from '@augment-vir/common';
import {asyncState, MaybeAsyncStateToSync} from 'element-vir';
import {CurrentSort, FilterDefinitions} from '../../common/with-filters/filters-types';
import {
    defaultProfileUserNftFilters,
    profileUserNftSortDefinitions,
} from './user-nft-profile-parts/user-nft-profile-filters';
import {UserNft} from '../../../../data/nft/raw-user-nft';
import {NftListing} from '../../../../data/nft/nft-listing';
import {CollectionNriData} from '../../../../data/models/collection-nri-data';
import {CanisterId} from '../../../../data/models/canister-id';
import {ReadonlyDeep} from 'type-fest';
import {ProfileTopTabValue, profileTabMap, ProfileTab} from './profile-tabs';
import {UserTransactionWithDirection} from '../../../../data/nft/user-nft-transaction';
import {BaseFullProfileEntry} from './profile-entries/base-full-profile-entry';
import {BaseNft} from '../../../../data/nft/base-nft';

export type ProfileFullEarnNft = {
    earn: boolean;
} & BaseNft &
    BaseFullProfileEntry;

export const profilePageStateInit = {
    showFilters: false,
    filters: ensureType<Record<ProfileTopTabValue, ReadonlyDeep<FilterDefinitions<any>>>>({
        activity: defaultProfileUserNftFilters,
        earn: defaultProfileUserNftFilters,
        favorites: defaultProfileUserNftFilters,
        'my-nfts': defaultProfileUserNftFilters,
        offers: defaultProfileUserNftFilters,
    }),
    currentProfileTab: profileTabMap['my-nfts'] as ProfileTab,
    userTransactions: asyncState<ReadonlyArray<UserTransactionWithDirection>>(),
    userNfts: asyncState<ReadonlyArray<UserNft>>(),
    userFavorites: asyncState<ReadonlyArray<UserNft>>(),
    userOffersMade: asyncState<ReadonlyArray<UserNft>>(),
    collectionNriData: asyncState<Readonly<Record<CanisterId, CollectionNriData>>>(),
    userEarnNfts: asyncState<ReadonlyArray<ProfileFullEarnNft>>(),
    nftExtraData: asyncState<Readonly<Record<string, NftListing>>>(),
    currentSort: ensureType<Record<ProfileTopTabValue, ReadonlyDeep<CurrentSort>>>({
        activity: {
            ascending: false,
            name: profileUserNftSortDefinitions[0].sortName,
        },
        earn: {
            ascending: false,
            name: profileUserNftSortDefinitions[0].sortName,
        },
        favorites: {
            ascending: false,
            name: profileUserNftSortDefinitions[0].sortName,
        },
        'my-nfts': {
            ascending: false,
            name: profileUserNftSortDefinitions[0].sortName,
        },
        offers: {
            ascending: false,
            name: profileUserNftSortDefinitions[0].sortName,
        },
    }),
};

export type ProfilePageStateType = Readonly<MaybeAsyncStateToSync<typeof profilePageStateInit>>;
