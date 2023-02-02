import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {
    ArrayElement,
    camelCaseToKebabCase,
    ensureType,
    filterObject,
    isPromiseLike,
    isRuntimeTypeOf,
    isTruthy,
    mapObjectValues,
    typedMap,
    typedObjectFromEntries,
    wait,
    wrapNarrowTypeWithTypeCheck,
} from '@augment-vir/common';
import {
    assign,
    AsyncState,
    asyncState,
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
import {userNftsCache} from '../../../../data/local-cache/caches/user-data/user-nfts-cache';
import {UserNft} from '../../../../data/nft/user-nft';
import {userFavoritesCache} from '../../../../data/local-cache/caches/user-data/user-favorites-cache';
import {
    userMadeOffersCache,
    makeUserOffersKey,
} from '../../../../data/local-cache/caches/user-data/user-made-offers-cache';
import {
    nftExtraDataCache,
    NftExtraDataCacheInputs,
} from '../../../../data/local-cache/caches/nft-extra-data-cache';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {collectionNriCache} from '../../../../data/local-cache/caches/collection-nri-cache';
import {CollectionNriData} from '../../../../data/models/collection-nri-data';
import {CanisterId} from '../../../../data/models/canister-id';
import {getAllowedTabs, ProfileTab} from './profile-tabs';
import {profilePageStateInit} from './entrepot-profile-page-state';
import {generateProfileWithFiltersInput} from './profile-entries/profile-entries';

function getAllNftsThatNeedData(
    asyncStates: ReadonlyArray<AsyncState<ReadonlyArray<NftExtraDataCacheInputs['userNft']>>>,
): Record<string, NftExtraDataCacheInputs['userNft']> {
    const nftsThatNeedExtraData: Record<string, NftExtraDataCacheInputs['userNft']> = {};

    asyncStates.forEach(possibleArray => {
        if (isRuntimeTypeOf(possibleArray, 'array')) {
            possibleArray.forEach(entry => {
                nftsThatNeedExtraData[entry.nftId] = entry;
            });
        }
    });

    return nftsThatNeedExtraData;
}

function getAllCollectionIds(
    asyncStates: ReadonlyArray<AsyncState<ReadonlyArray<Pick<UserNft, 'collectionId'>>>>,
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

function makeNftExtraDataLoadTrigger(
    asyncStates: ReadonlyArray<AsyncState<ReadonlyArray<NftExtraDataCacheInputs['userNft']>>>,
) {
    return asyncStates.map(asyncState => {
        if (isRuntimeTypeOf(asyncState, 'array')) {
            return asyncState;
        } else {
            return [];
        }
    });
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
        sellClick: defineElementEvent<{nftId: string}>(),
        transferClick: defineElementEvent<{nftId: string}>(),
        nftClick: defineElementEvent<{nftId: string}>(),
    },
    stateInit: profilePageStateInit,
    initCallback: ({inputs, state, updateState}) => {
        userTransactionsCache.subscribe(({generatedKey: updatedAddress, newValue}) => {
            if (inputs.userAccount && inputs.userAccount.address === updatedAddress) {
                updateState({
                    userTransactions: {
                        resolvedValue: newValue,
                    },
                });
            }
        });
        userNftsCache.subscribe(({generatedKey: updatedAddress, newValue}) => {
            if (inputs.userAccount && inputs.userAccount.address === updatedAddress) {
                updateState({
                    userNfts: {
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
        nftExtraDataCache.subscribe(async ({generatedKey: nftId, newValue}) => {
            console.log('extra data cache updated');
            if (isPromiseLike(state.nftExtraData)) {
                await state.nftExtraData;
            }
            updateState({
                nftExtraData: {
                    resolvedValue: {
                        ...(isRenderReady(state.nftExtraData) ? state.nftExtraData : {}),
                        [nftId]: newValue,
                    },
                },
            });
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
            console.log('extra data cache updated');
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
            state.userNfts,
            state.userOffersMade,
            state.userTransactions,
        ];

        const allUserCollectionIds = getAllCollectionIds(asyncUserNftArrays);

        console.log({...state});

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
            userNfts: {
                createPromise: async () => {
                    return inputs.userAccount && inputs.userIdentity
                        ? userNftsCache.get({
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
            nftExtraData: {
                createPromise: async () => {
                    const nftsThatNeedData = getAllNftsThatNeedData(asyncUserNftArrays);
                    let waitIndex = 1;
                    const nftExtraDataPromises = await mapObjectValues(
                        nftsThatNeedData,
                        async (nftId, userNft) => {
                            const extraData = await nftExtraDataCache.get({
                                userNft,
                                waitIndex: waitIndex++,
                            });

                            if (!extraData) {
                                console.log(`why is this undefined ${nftId}`);
                            }

                            return extraData;
                        },
                    );

                    return nftExtraDataPromises;
                },
                trigger: makeNftExtraDataLoadTrigger(asyncUserNftArrays),
            },
        });

        const filterInputs = generateProfileWithFiltersInput({...state}, inputs.collectionMap);

        console.log({filterInputs});

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
            <${EntrepotTopTabsElement}
                ${assign(EntrepotTopTabsElement, {
                    selected: state.currentTopTab,
                    tabs: getAllowedTabs({isToniqEarnAllowed: inputs.isToniqEarnAllowed}),
                })}
                ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                    updateState({
                        currentTopTab: event.detail as ProfileTab,
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
                        filters: {
                            ...state.filters,
                            [state.currentTopTab.value]: event.detail,
                        },
                    });
                })}
                ${listen(EntrepotWithFiltersElement.events.sortChange, event => {
                    updateState({
                        currentSort: {
                            ...state.currentSort,
                            [state.currentTopTab.value]: event.detail,
                        },
                    });
                })}
            >
            </${EntrepotWithFiltersElement}>
        `;
    },
});

export const EntrepotProfile = wrapInReactComponent(EntrepotProfilePageElement);
