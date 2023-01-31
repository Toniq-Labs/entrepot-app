import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {
    ArrayElement,
    camelCaseToKebabCase,
    ensureType,
    filterObject,
    isRuntimeTypeOf,
    isTruthy,
    mapObjectValues,
    typedMap,
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
import {Collection, CollectionMap} from '../../../../data/models/collection';
import {
    EntrepotWithFiltersElement,
    createWithFiltersInputs,
} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {CurrentSort} from '../../common/with-filters/filters-types';
import {EntrepotProfileCardElement} from './toniq-entrepot-profile-card.element';
import {profileSortDefinitions, defaultProfileFilters} from './profile-filters';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {defineToniqElement} from '@toniq-labs/design-system';
import {UserIdentity} from '../../../../data/models/user-data/identity';
import {EntrepotUserAccount} from '../../../../data/models/user-data/account';
import {
    UserTransaction,
    userTransactionsCache,
} from '../../../../data/local-cache/caches/user-data/user-transactions-cache';
import {userNftsCache} from '../../../../data/local-cache/caches/user-data/user-nfts-cache';
import {UserNft} from '../../../../data/nft/user-nft';
import {userFavoritesCache} from '../../../../data/local-cache/caches/user-data/user-favorites-cache';
import {userMadeOffersCache} from '../../../../data/local-cache/caches/user-data/user-made-offers-cache';
import {NftExtraData} from '../../../../data/nft/nft-extra-data';
import {
    nftExtraDataCache,
    NftExtraDataCacheInputs,
} from '../../../../data/local-cache/caches/nft-extra-data-cache';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';

function getAllNftsThatNeedData(
    asyncStates: ReadonlyArray<AsyncState<ReadonlyArray<NftExtraDataCacheInputs['userNft']>>>,
): Record<string, NftExtraDataCacheInputs['userNft']> {
    const nftsThatNeedIds: Record<string, NftExtraDataCacheInputs['userNft']> = {};

    asyncStates.forEach(possibleArray => {
        if (isRuntimeTypeOf(possibleArray, 'array')) {
            possibleArray.forEach(entry => {
                nftsThatNeedIds[entry.nftId] = entry;
            });
        }
    });

    return nftsThatNeedIds;
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

const profileTopTabs = [
    {
        label: 'My NFTs',
        value: 'my-nfts',
    },
    {
        label: 'Favorites',
        value: 'favorites',
    },
    {
        label: 'Offers',
        value: 'offers',
    },
    {
        label: 'Activity',
        value: 'activity',
    },
    {
        label: 'Earn',
        value: 'earn',
    },
] as const;

type ProfileTopTab = ArrayElement<typeof profileTopTabs>;

function combineOffers({
    userOffersMade,
    userNfts,
    nftExtraData,
}: {
    userOffersMade: AsyncState<ReadonlyArray<UserNft>>;
    userNfts: AsyncState<ReadonlyArray<UserNft>>;
    nftExtraData: AsyncState<Readonly<Record<string, NftExtraData>>>;
}): AsyncState<ReadonlyArray<UserNft>> {
    const allOffers: UserNft[] = [];
    if (!isRenderReady(nftExtraData)) {
        return nftExtraData as Promise<any> | Error;
    }

    if (Array.isArray(userOffersMade)) {
        allOffers.push(...userOffersMade);
    }
    if (Array.isArray(userNfts)) {
        allOffers.push();
    }

    return allOffers.filter(userNft => {
        return !!nftExtraData[userNft.nftId]?.offers.length;
    });
}

export const EntrepotProfilePageElement = defineToniqElement<{
    collections: CollectionMap;
    userIdentity: UserIdentity | undefined;
    userAccount: EntrepotUserAccount | undefined;
    toniqEarnAllowed: boolean;
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
        sellClick: defineElementEvent<void>(),
        transferClick: defineElementEvent<void>(),
    },
    stateInit: {
        showFilters: false,
        filters: defaultProfileFilters,
        currentTopTab: profileTopTabs[0] as ProfileTopTab,
        userTransactions: asyncState<ReadonlyArray<UserTransaction>>(),
        userNfts: asyncState<ReadonlyArray<UserNft>>(),
        userFavorites: asyncState<ReadonlyArray<UserNft>>(),
        userOffersMade: asyncState<ReadonlyArray<UserNft>>(),
        userEarnNfts: asyncState<ReadonlyArray<unknown>>(),
        nftExtraData: asyncState<Readonly<Record<string, NftExtraData>>>(),
        currentSort: ensureType<CurrentSort>({
            ascending: false,
            name: profileSortDefinitions[0].sortName,
        }),
    },
    initCallback: ({inputs, updateState}) => {
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
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        const asyncUserNftArrays: ReadonlyArray<
            AsyncState<ReadonlyArray<NftExtraDataCacheInputs['userNft']>>
        > = [
            state.userFavorites,
            state.userNfts,
            state.userOffersMade,
            state.userTransactions,
        ];

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

        const tabToStateProp = wrapNarrowTypeWithTypeCheck<
            Record<ProfileTopTab['value'], AsyncState<ReadonlyArray<any>>>
        >()({
            'my-nfts': state.userNfts,
            favorites: state.userFavorites,
            offers: combineOffers(state),
            activity: state.userTransactions,
            earn: state.userEarnNfts,
        });

        const allowedTabs = inputs.toniqEarnAllowed
            ? profileTopTabs
            : profileTopTabs.filter(topTab => !topTab.label.toLowerCase().includes('earn'));

        const entries = tabToStateProp[state.currentTopTab.value];

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
            <${EntrepotTopTabsElement}
                ${assign(EntrepotTopTabsElement, {
                    selected: state.currentTopTab,
                    tabs: allowedTabs,
                })}
                ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                    updateState({
                        currentTopTab: event.detail as ProfileTopTab,
                    });
                })}
            ></${EntrepotTopTabsElement}>
            <${EntrepotWithFiltersElement}
                ${assign(
                    EntrepotWithFiltersElement,
                    createWithFiltersInputs({
                        countName: 'NFTs',
                        showFilters: state.showFilters,
                        currentSort: state.currentSort,
                        sortDefinitions: profileSortDefinitions,
                        defaultFilters: defaultProfileFilters,
                        currentFilters: state.filters,
                        isLoading: !Array.isArray(entries),
                        allEntries: Array.isArray(entries) ? entries : [],
                        searchPlaceholder: 'Search: Collection Name or Keywords',
                        searchCallback: (searchTerm, collection) => {
                            const allSearchAreas = [
                                collection.name,
                                collection.keywords,
                                collection.route,
                                collection.id,
                            ].join(' ');
                            return allSearchAreas.toLowerCase().includes(searchTerm.toLowerCase());
                        },
                        createEntryTemplateCallback: userNft => {
                            return JSON.stringify(userNft);
                        },
                    }),
                )}
                ${listen(EntrepotWithFiltersElement.events.showFiltersChange, event => {
                    updateState({showFilters: event.detail});
                })}
                ${listen(EntrepotWithFiltersElement.events.filtersChange, event => {
                    updateState({filters: event.detail});
                })}
                ${listen(EntrepotWithFiltersElement.events.sortChange, event => {
                    updateState({currentSort: event.detail});
                })}
            >
            </${EntrepotWithFiltersElement}>
        `;
    },
});

export const EntrepotProfile = wrapInReactComponent(EntrepotProfilePageElement);
