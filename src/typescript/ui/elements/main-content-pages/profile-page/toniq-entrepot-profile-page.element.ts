import {classMap} from 'lit/directives/class-map.js';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElementEvent, html, listen, renderIf} from 'element-vir';
import {EntrepotWithFiltersElement} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {
    defineToniqElement,
    interactionDuration,
    LayoutGrid24Icon,
    ListDetails24Icon,
    removeNativeFormStyles,
    toniqColors,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {EntrepotTopTabsElement} from '../../common/toniq-entrepot-top-tabs.element';
import {getAllowedTabs, ProfileTab, profileTabMap} from './profile-page-state/profile-tabs';
import {
    profilePageStateInit,
    ProfilePageInputs,
    createAsyncProfileStateUpdate,
    initProfileElement,
    ProfileViewStyleEnum,
    listViewFinalItemHeaderTitleByTab,
} from './profile-page-state/profile-page-state';
import {createProfileFilterInputs} from './profile-page-state/create-profile-filters';
import {FullProfileNft} from './profile-page-nfts/full-profile-nft';
import {createOverallStatsTemplate} from './profile-page-state/overall-profile-stats';
import {FilterTypeEnum} from '../../common/with-filters/filters-types';
import {isTruthy} from '@augment-vir/common';
import {CanisterId} from '../../../../data/models/canister-id';
import {EntrepotProfileNftListItemTextItemsElement} from './profile-nft-card-element/toniq-entrepot-profile-nft-list-item-text-items.element';
import {filterSortKeyByTab} from './profile-page-state/profile-page-filter-definitions';

export const EntrepotProfilePageElement = defineToniqElement<ProfilePageInputs>()({
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

        .view-style-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .view-style-controls ${ToniqIcon} {
            color: ${toniqColors.pageTertiary.foregroundColor};
            transition: ${interactionDuration};
        }

        .view-style-controls button {
            ${removeNativeFormStyles}
        }

        .view-style-controls ${ToniqIcon}.current-view-style-icon {
            color: ${toniqColors.pagePrimary.foregroundColor};
        }

        ${EntrepotProfileNftListItemTextItemsElement} {
            width: 100%;
        }
    `,
    events: {
        sellClick: defineElementEvent<FullProfileNft>(),
        transferClick: defineElementEvent<FullProfileNft>(),
        nftClick: defineElementEvent<FullProfileNft>(),
    },
    stateInit: profilePageStateInit,
    initCallback: ({inputs, state, updateState}) => {
        initProfileElement({inputs, state, updateState});
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        updateState(createAsyncProfileStateUpdate({state, inputs}));

        const filterInputs = createProfileFilterInputs({
            currentProfilePageState: {...state},
            collectionMap: inputs.collectionMap,
            sellCallback: nft => {
                dispatch(new events.sellClick(nft));
            },
            transferCallback: nft => {
                dispatch(new events.transferClick(nft));
            },
            nftClickCallback: nft => {
                dispatch(new events.nftClick(nft));
            },
            userAccount: inputs.userAccount,
        });

        const extraControlsTemplate = html`
            <div class="view-style-controls" slot="extra-controls">
                <button ${listen('click', () => {
                    updateState({
                        viewStyle: ProfileViewStyleEnum.Grid,
                    });
                })}>
                    <${ToniqIcon}
                        ${assign(ToniqIcon, {
                            icon: LayoutGrid24Icon,
                        })}
                        class=${classMap({
                            'current-view-style-icon':
                                state.viewStyle === ProfileViewStyleEnum.Grid,
                        })}
                    ></${ToniqIcon}>
                </button>
                <button ${listen('click', () => {
                    updateState({
                        viewStyle: ProfileViewStyleEnum.List,
                    });
                })}>
                    <${ToniqIcon}
                        ${assign(ToniqIcon, {
                            icon: ListDetails24Icon,
                        })}
                        class=${classMap({
                            'current-view-style-icon':
                                state.viewStyle === ProfileViewStyleEnum.List,
                        })}
                    ></${ToniqIcon}>
                </button>
            </div>
        `;

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
            ${createOverallStatsTemplate(state, inputs.collectionMap)}
            <${EntrepotTopTabsElement}
                ${assign(EntrepotTopTabsElement, {
                    selected: state.currentProfileTab,
                    tabs: getAllowedTabs({isToniqEarnAllowed: inputs.isToniqEarnAllowed}),
                })}
                ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                    if ((event.detail as ProfileTab) === profileTabMap['activity']) {
                        updateState({
                            viewStyle: ProfileViewStyleEnum.List,
                        });
                    } else {
                        updateState({
                            viewStyle: ProfileViewStyleEnum.Grid,
                        });
                    }
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
                    const collectionFilter = event.detail.Collections;
                    if (collectionFilter?.filterType === FilterTypeEnum.ImageToggles) {
                        const selectedCollectionIds = Object.values(collectionFilter.entries)
                            .map(filterEntry => {
                                if (filterEntry.checked) {
                                    return filterEntry.filterValue as CanisterId;
                                } else {
                                    return undefined;
                                }
                            })
                            .filter(isTruthy);
                        updateState({
                            collectionsFilterExpanded: collectionFilter.expanded,
                            selectedCollections: {
                                ...state.selectedCollections,
                                [state.currentProfileTab.value]: selectedCollectionIds,
                            },
                        });
                    }
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
                            [filterSortKeyByTab[state.currentProfileTab.value]]: event.detail,
                        },
                    });
                })}
            >
                ${extraControlsTemplate}
                ${renderIf(
                    state.viewStyle === ProfileViewStyleEnum.List,
                    html`
                        <${EntrepotProfileNftListItemTextItemsElement}
                            slot="entries-header"
                            ${assign(EntrepotProfileNftListItemTextItemsElement, {
                                isHeader: true,
                                finalItemHeaderTitle:
                                    listViewFinalItemHeaderTitleByTab[
                                        state.currentProfileTab.value
                                    ],
                            })}
                        ></${EntrepotProfileNftListItemTextItemsElement}>
                    `,
                )}
            </${EntrepotWithFiltersElement}>
        `;
    },
});

export const EntrepotProfile = wrapInReactComponent(EntrepotProfilePageElement);
