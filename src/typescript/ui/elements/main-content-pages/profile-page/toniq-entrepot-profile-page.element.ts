import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElementEvent, html, listen} from 'element-vir';
import {EntrepotWithFiltersElement} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {defineToniqElement} from '@toniq-labs/design-system';
import {EntrepotTopTabsElement} from '../../common/toniq-entrepot-top-tabs.element';
import {getAllowedTabs, ProfileTab} from './profile-tabs';
import {
    profilePageStateInit,
    filterSortKeyByTab,
    ProfilePageInputs,
    createAsyncProfileStateUpdate,
    initProfileElement,
} from './profile-page-state';
import {generateProfileWithFiltersInput} from './profile-filters';
import {FullProfileNft} from './profile-nfts/full-profile-nft';
import {createOverallStatsTemplate} from './overall-profile-stats';

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
        const filterInputs = generateProfileWithFiltersInput({
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

        updateState(createAsyncProfileStateUpdate({state, inputs}));

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
            ${createOverallStatsTemplate(state)}
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
