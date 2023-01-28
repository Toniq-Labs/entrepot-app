import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {ensureType} from '@augment-vir/common';
import {assign, asyncState, css, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {
    EntrepotWithFiltersElement,
    createWithFiltersInputs,
} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {CurrentSort} from '../../common/with-filters/filters-types';
import {EntrepotProfileCardElement} from './toniq-entrepot-profile-card.element';
import {profileSortDefinitions, defaultProfileFilters} from './profile-filters';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {defineToniqElement} from '@toniq-labs/design-system';
import {UserIdentity} from '../../../../data/models/user/identity';
import {EntrepotUserAccount} from '../../../../data/models/user/account';
import {
    UserTransaction,
    userTransactions,
} from '../../../../data/local-cache/caches/user-transactions';

export const EntrepotProfilePageElement = defineToniqElement<{
    collections: ReadonlyArray<Collection>;
    identity: UserIdentity;
    account: EntrepotUserAccount | undefined;
}>()({
    tagName: 'toniq-entrepot-profile-page',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
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
        userTransactions: asyncState<ReadonlyArray<UserTransaction>>(),
        currentSort: ensureType<CurrentSort>({
            ascending: false,
            name: profileSortDefinitions[0].sortName,
        }),
    },
    initCallback: ({inputs, updateState}) => {
        userTransactions.subscribe(({subKey: updatedAddress, newValue}) => {
            if (inputs.account && inputs.account.address === updatedAddress) {
                updateState({
                    userTransactions: {
                        resolvedValue: newValue,
                    },
                });
            }
        });
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        updateState({
            userTransactions: {
                createPromise: async () => {
                    if (inputs.account) {
                        const currentUserTransactions = await userTransactions.get(
                            inputs.account.address,
                        );

                        console.log({currentUserTransactions});
                        return currentUserTransactions;
                    } else {
                        return [];
                    }
                },
                trigger: {
                    account: inputs.account,
                },
            },
        });

        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'My Profile',
                })}
            ></${EntrepotPageHeaderElement}>
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
                        allEntries: inputs.collections,
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
                        createEntryTemplateCallback: collection => {
                            return html`
                                <${EntrepotProfileCardElement}
                                    ${assign(EntrepotProfileCardElement, {
                                        collection: collection,
                                    })}
                                    ${listen(
                                        EntrepotProfileCardElement.events.navigateToRoute,
                                        () => {
                                            // dispatch(new events.collectionSelected(collection));
                                        },
                                    )}
                                ></${EntrepotProfileCardElement}>
                            `;
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
