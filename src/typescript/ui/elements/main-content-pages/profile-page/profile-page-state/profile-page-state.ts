import {
    isRuntimeTypeOf,
    isPromiseLike,
    mapObjectValues,
    PropertyValueType,
} from '@augment-vir/common';
import {
    asyncState,
    MaybeAsyncStateToSync,
    UpdateStateCallback,
    AsyncState,
    isRenderReady,
} from 'element-vir';
import {FilterDefinitions} from '../../../common/with-filters/filters-types';
import {CollectionNriData} from '../../../../../data/models/collection-nri-data';
import {CanisterId} from '../../../../../data/models/canister-id';
import {ReadonlyDeep} from 'type-fest';
import {ProfileTopTabValue, profileTabMap, ProfileTab} from './profile-tabs';
import {UserTransactionWithDirection} from '../../../../../data/nft/user-nft-transaction';
import {FullProfileNft} from '../profile-page-nfts/full-profile-nft';
import {BaseNft} from '../../../../../data/nft/base-nft';
import {userTransactionsCache} from '../../../../../data/local-cache/caches/user-data/user-transactions-cache';
import {userOwnedNftsCache} from '../../../../../data/local-cache/caches/user-data/user-owned-nfts-cache';
import {userFavoritesCache} from '../../../../../data/local-cache/caches/user-data/user-favorites-cache';
import {
    userMadeOffersCache,
    makeUserOffersKey,
} from '../../../../../data/local-cache/caches/user-data/user-made-offers-cache';
import {collectionNriCache} from '../../../../../data/local-cache/caches/collection-nri-cache';
import {CollectionMap} from '../../../../../data/models/collection';
import {UserIdentity} from '../../../../../data/models/user-data/identity';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {EntrepotRoutePageEnum, entrepotRouter} from '../../../../../routing/entrepot-router';
import {urlStringToFilters} from '../../../common/with-filters/url-filters';
import {
    defaultProfileFilters,
    defaultProfileSort,
    filterSortKeyByTab,
} from './profile-page-filter-definitions';

export type ProfileFullEarnNft = {
    earn: boolean;
} & BaseNft &
    FullProfileNft;

const selectedCollections: Readonly<Record<ProfileTopTabValue, ReadonlyArray<CanisterId>>> =
    mapObjectValues(profileTabMap, () => {
        return [];
    });

export enum ProfileViewStyleEnum {
    Grid = 'grid',
    List = 'list',
}

export const profilePageStateInit = {
    showFilters: false,
    allFilters: defaultProfileFilters,
    selectedCollections,
    collectionsFilterExpanded: false,
    currentProfileTab: profileTabMap['my-nfts'] as ProfileTab,
    userTransactions: asyncState<ReadonlyArray<UserTransactionWithDirection>>(),
    userOwnedNfts: asyncState<ReadonlyArray<BaseNft>>(),
    userFavorites: asyncState<ReadonlyArray<BaseNft>>(),
    userOffersMade: asyncState<ReadonlyArray<BaseNft>>(),
    collectionNriData: asyncState<Readonly<Record<CanisterId, CollectionNriData>>>(),
    userEarnNfts: asyncState<ReadonlyArray<ProfileFullEarnNft>>(),
    allSorts: defaultProfileSort,
    viewStyle: ProfileViewStyleEnum.Grid,
};

export type ProfilePageInputs = {
    collectionMap: CollectionMap;
    userIdentity: UserIdentity | undefined;
    userAccount: EntrepotUserAccount | undefined;
    isToniqEarnAllowed: boolean;
};

export type ProfilePageStateType = Readonly<MaybeAsyncStateToSync<typeof profilePageStateInit>>;

function getAllCollectionIds(
    asyncStates: ReadonlyArray<AsyncState<ReadonlyArray<Pick<BaseNft, 'collectionId'>>>>,
): CanisterId[] {
    const collectionIds = new Set<CanisterId>();

    asyncStates.forEach(possibleArray => {
        if (isRuntimeTypeOf(possibleArray, 'array')) {
            possibleArray.forEach(entry => {
                collectionIds.add(entry.collectionId);
            });
        }
    });

    return Array.from(collectionIds).sort();
}

export function createAsyncProfileStateUpdate({
    state,
    inputs,
}: {
    state: ProfilePageStateType;
    inputs: ProfilePageInputs;
}): Parameters<UpdateStateCallback<typeof profilePageStateInit>>[0] {
    const asyncUserNftArrays = [
        state.userFavorites,
        state.userOwnedNfts,
        state.userOffersMade,
        state.userTransactions,
    ];

    const allUserCollectionIds = getAllCollectionIds(asyncUserNftArrays);
    // update nft data
    return {
        userTransactions: {
            createPromise: async () =>
                inputs.userAccount
                    ? userTransactionsCache.get({
                          userAccount: inputs.userAccount,
                      })
                    : [],
            trigger: {
                account: inputs.userAccount?.address,
            },
        },
        userOwnedNfts: {
            createPromise: async () => {
                return inputs.userAccount && inputs.userIdentity
                    ? userOwnedNftsCache.get({
                          userAccount: inputs.userAccount,
                          userIdentity: inputs.userIdentity,
                      })
                    : [];
            },
            trigger: {
                account: inputs.userAccount?.address,
                identity: inputs.userIdentity?.getPrincipal().toText(),
            },
        },
        collectionNriData: {
            createPromise: async () => {
                let waitIndex = 1;
                const nriData = await Promise.all(
                    allUserCollectionIds.map(async collectionId => {
                        return collectionNriCache.get({
                            collectionId,
                            waitIndex: waitIndex++,
                        });
                    }),
                );

                const nriDataByCollectionId: Record<CanisterId, CollectionNriData> =
                    Object.fromEntries(
                        nriData.map((nriEntry): [CanisterId, CollectionNriData] => {
                            return [
                                nriEntry.collectionId,
                                nriEntry,
                            ];
                        }),
                    );

                return nriDataByCollectionId;
            },
            trigger: allUserCollectionIds,
        },
        userFavorites: {
            createPromise: async () =>
                inputs.userAccount && inputs.userIdentity
                    ? userFavoritesCache.get({
                          userIdentity: inputs.userIdentity,
                          userAccount: inputs.userAccount,
                      })
                    : [],
            trigger: {
                account: inputs.userAccount?.address,
                identity: inputs.userIdentity?.getPrincipal().toText(),
            },
        },
        userOffersMade: {
            createPromise: async () =>
                inputs.userAccount && inputs.userIdentity
                    ? userMadeOffersCache.get({
                          userIdentity: inputs.userIdentity,
                          userAccount: inputs.userAccount,
                      })
                    : [],
            trigger: {
                account: inputs.userAccount?.address,
                identity: inputs.userIdentity?.getPrincipal().toText(),
            },
        },
    };
}

export function initProfileElement({
    state,
    inputs,
    updateState,
}: {
    state: ProfilePageStateType;
    inputs: ProfilePageInputs;
    updateState: UpdateStateCallback<typeof profilePageStateInit>;
}) {
    userTransactionsCache.subscribe(({generatedKey: updatedAddress, newValue}) => {
        if (inputs.userAccount && inputs.userAccount.address === updatedAddress) {
            updateState({
                userTransactions: {
                    resolvedValue: newValue,
                },
            });
        }
    });
    userOwnedNftsCache.subscribe(({generatedKey: updatedAddress, newValue}) => {
        if (inputs.userAccount && inputs.userAccount.address === updatedAddress) {
            updateState({
                userOwnedNfts: {
                    resolvedValue: newValue,
                },
            });
        }
    });
    userFavoritesCache.subscribe(({generatedKey: updatedAddress, newValue}) => {
        if (inputs.userAccount && inputs.userAccount.address === updatedAddress) {
            updateState({
                userFavorites: {
                    resolvedValue: newValue,
                },
            });
        }
    });
    userMadeOffersCache.subscribe(({generatedKey: updatedGeneratedKey, newValue}) => {
        if (inputs.userAccount && inputs.userIdentity) {
            const userKey = makeUserOffersKey({
                userAccount: inputs.userAccount,
                userIdentity: inputs.userIdentity,
            });
            if (userKey === updatedGeneratedKey) {
                updateState({
                    userOffersMade: {
                        resolvedValue: newValue,
                    },
                });
            }
        }
    });
    collectionNriCache.subscribe(async ({generatedKey: collectionId, newValue}) => {
        if (isPromiseLike(state.collectionNriData)) {
            await state.collectionNriData;
        }
        updateState({
            collectionNriData: {
                resolvedValue: {
                    ...(isRenderReady(state.collectionNriData) ? state.collectionNriData : {}),
                    [collectionId]: newValue,
                },
            },
        });
    });

    entrepotRouter.addRouteListener(true, routes => {
        if (routes.paths[0] !== EntrepotRoutePageEnum.Profile) {
            return;
        }
        // tab
        const profileTab: PropertyValueType<typeof profileTabMap> | undefined =
            profileTabMap[routes.paths[1] as ProfileTopTabValue];
        if (profileTab) {
            updateState({currentProfileTab: profileTab});
        }

        if (routes.search) {
            if (routes.search.filters) {
                try {
                    const defaultFilters: ReadonlyDeep<FilterDefinitions<any>> =
                        defaultProfileFilters[filterSortKeyByTab[state.currentProfileTab.value]];
                    // filters
                    const filters = urlStringToFilters({
                        filterString: routes.search.filters,
                        defaultFilters,
                    });
                    updateState({
                        allFilters: {
                            ...state.allFilters,
                            [filterSortKeyByTab[state.currentProfileTab.value]]: filters,
                        },
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    });
}

export const listViewFinalItemHeaderTitleByTab: Record<ProfileTopTabValue, string> = {
    'my-nfts': '',
    activity: 'TIME',
    earn: '',
    favorites: 'OFFERS',
    offers: 'OFFERS',
};
