import {PropertyValueType} from '@augment-vir/common';
import {AsyncState} from 'element-vir';
import {ProfileTopTabValue} from '../profile-page-state/profile-tabs';
import {ProfilePageStateType, ProfileFullEarnNft} from '../profile-page-state/profile-page-state';
import {ProfileCompleteNft} from '../profile-page-state/profile-page-nft-filters/profile-nft-filters';
import {ProfileCompleteTransactionNft} from '../profile-page-state/profile-page-transaction-filters/profile-transaction-filters';

type StateEntryType<SpecificKey extends keyof ProfilePageStateType> =
    ProfilePageStateType[SpecificKey] extends AsyncState<ReadonlyArray<infer EntryType>>
        ? EntryType
        : never;

type TabValueToEntryType = {
    'my-nfts': StateEntryType<'userOwnedNfts'>;
    favorites: StateEntryType<'userFavorites'>;
    offers: StateEntryType<'userOffersMade'>;
    activity: StateEntryType<'userTransactions'>;
    earn: StateEntryType<'userEarnNfts'>;
};

type TabValueToFullProfileEntryType = {
    'my-nfts': ProfileCompleteNft;
    favorites: ProfileCompleteNft;
    offers: ProfileCompleteNft;
    activity: ProfileCompleteTransactionNft;
    earn: ProfileFullEarnNft;
};

export type AnyProfileEntryType = PropertyValueType<TabValueToEntryType>;
export type AnyFullProfileEntryType = PropertyValueType<TabValueToFullProfileEntryType>;

type AsyncTypeUnionMap<T> = T extends any ? AsyncState<ReadonlyArray<T>> : never;
type ReadonlyArrayUnionMap<T> = T extends any ? ReadonlyArray<T> : never;
export type AnyProfileEntriesAsyncState = AsyncTypeUnionMap<AnyProfileEntryType>;
export type AnyFullProfileEntries = ReadonlyArrayUnionMap<AnyFullProfileEntryType>;

export function isNftType<TopTabValueGeneric extends ProfileTopTabValue>(
    nft: TabValueToEntryType[ProfileTopTabValue],
    tabValue: TopTabValueGeneric,
    state: Pick<ProfilePageStateType, 'currentProfileTab'>,
): nft is TabValueToEntryType[TopTabValueGeneric] {
    return state.currentProfileTab.value === tabValue;
}

export function isEntriesType<TopTabValueGeneric extends ProfileTopTabValue>(
    entries: ReadonlyArray<Readonly<AnyProfileEntryType>>,
    tabValue: TopTabValueGeneric,
    state: Pick<ProfilePageStateType, 'currentProfileTab'>,
): entries is ReadonlyArray<TabValueToFullProfileEntryType[TopTabValueGeneric]> {
    return state.currentProfileTab.value === tabValue;
}
