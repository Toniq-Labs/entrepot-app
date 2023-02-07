import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {isPromiseLike, isRuntimeTypeOf, mapObjectValues} from '@augment-vir/common';
import {
    assign,
    AsyncState,
    css,
    defineElementEvent,
    html,
    isRenderReady,
    listen,
} from 'element-vir';
import {CollectionMap} from '../../../../data/models/collection';
import {EntrepotWithFiltersElement} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {defineToniqElement} from '@toniq-labs/design-system';
import {UserIdentity} from '../../../../data/models/user-data/identity';
import {EntrepotUserAccount} from '../../../../data/models/user-data/account';
import {userTransactionsCache} from '../../../../data/local-cache/caches/user-data/user-transactions-cache';
import {userOwnedNftsCache} from '../../../../data/local-cache/caches/user-data/user-owned-nfts-cache';
import {userFavoritesCache} from '../../../../data/local-cache/caches/user-data/user-favorites-cache';
import {
    userMadeOffersCache,
    makeUserOffersKey,
} from '../../../../data/local-cache/caches/user-data/user-made-offers-cache';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {collectionNriCache} from '../../../../data/local-cache/caches/collection-nri-cache';
import {CollectionNriData} from '../../../../data/models/collection-nri-data';
import {CanisterId} from '../../../../data/models/canister-id';
import {getAllowedTabs, ProfileTab} from './profile-tabs';
import {profilePageStateInit, filterSortKeyByTab} from './profile-page-state';
import {generateProfileWithFiltersInput} from './profile-nfts/profile-nfts';
import {BaseNft} from '../../../../data/nft/base-nft';
import {FullProfileNft} from './profile-nfts/full-profile-nft';

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

    return Array.from(collectionIds);
}

export const EntrepotProfilePageElement = defineToniqElement<{
    collectionMap: CollectionMap;
    userIdentity: UserIdentity | undefined;
    userAccount: EntrepotUserAccount | undefined;
    isToniqEarnAllowed: boolean;
}>()({
    tagName: 'toniq-entrepot-profile-page',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        ${EntrepotTopTabsElement} {
            margin: 0 32px;
            max-width: 100%;
        }

        @media (max-width: 1200px) {
            :host {
                padding: 16px;
            }
        }
    `,
    events: {
        sellClick: defineElementEvent<FullProfileNft>(),
        transferClick: defineElementEvent<FullProfileNft>(),
        nftClick: defineElementEvent<FullProfileNft>(),
    },
    stateInit: profilePageStateInit,
    initCallback: ({inputs, state, updateState, dispatch, events}) => {
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
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        const asyncUserNftArrays = [
            state.userFavorites,
            state.userOwnedNfts,
            state.userOffersMade,
            state.userTransactions,
        ];

        const allUserCollectionIds = getAllCollectionIds(asyncUserNftArrays);

        // update nft data
        updateState({
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
        });

        const filterInputs = generateProfileWithFiltersInput({
            currentProfilePageState: {...state},
            collectionMap: inputs.collectionMap,
            sellCallback: nft => {
                dispatch(new events.sellClick(nft));
            },
            transferCallback: nft => {
                dispatch(new events.transferClick(nft));
            },
            userAccount: inputs.userAccount,
        });

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
            <${EntrepotTopTabsElement}
                ${assign(EntrepotTopTabsElement, {
                    selected: state.currentProfileTab,
                    tabs: getAllowedTabs({isToniqEarnAllowed: inputs.isToniqEarnAllowed}),
                })}
                ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                    updateState({
                        currentProfileTab: event.detail as ProfileTab,
                    });
                })}
            ></${EntrepotTopTabsElement}>
            <${EntrepotWithFiltersElement}
                ${assign(EntrepotWithFiltersElement, filterInputs)}
                ${listen(EntrepotWithFiltersElement.events.showFiltersChange, event => {
                    updateState({showFilters: event.detail});
                })}
                ${listen(EntrepotWithFiltersElement.events.filtersChange, event => {
                    updateState({
                        allFilters: {
                            ...state.allFilters,
                            [filterSortKeyByTab[state.currentProfileTab.value]]: event.detail,
                        },
                    });
                })}
                ${listen(EntrepotWithFiltersElement.events.sortChange, event => {
                    updateState({
                        allSorts: {
                            ...state.allSorts,
                            [state.currentProfileTab.value]: event.detail,
                        },
                    });
                })}
            >
            </${EntrepotWithFiltersElement}>
        `;
    },
});

export const EntrepotProfile = wrapInReactComponent(EntrepotProfilePageElement);
