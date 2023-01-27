import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {ensureType} from '@augment-vir/common';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {
    EntrepotWithFiltersElement,
    createWithFiltersInputs,
} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {CurrentSort} from '../../common/with-filters/filters-types';
import {EntrepotMarketplaceCardElement} from './toniq-entrepot-marketplace-card.element';
import {sortDefinitions, defaultMarketplaceFilters} from './marketplace-filters';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {defineToniqElement} from '@toniq-labs/design-system';
import {shouldMouseEventTriggerRoutes} from 'spa-router-vir';

export const EntrepotMarketplacePageElement = defineToniqElement<{
    collections: ReadonlyArray<Collection>;
}>()({
    tagName: 'toniq-entrepot-marketplace-page',
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
        collectionSelected: defineElementEvent<Collection>(),
    },
    stateInit: {
        showFilters: false,
        filters: defaultMarketplaceFilters,
        currentSort: ensureType<CurrentSort>({
            ascending: false,
            name: sortDefinitions[0].sortName,
        }),
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        console.log({collections: inputs.collections});
        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'All Collections',
                })}
            ></${EntrepotPageHeaderElement}>
            <${EntrepotWithFiltersElement}
                ${assign(
                    EntrepotWithFiltersElement,
                    createWithFiltersInputs({
                        countName: 'Collections',
                        showFilters: state.showFilters,
                        currentSort: state.currentSort,
                        sortDefinitions: sortDefinitions,
                        defaultFilters: defaultMarketplaceFilters,
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
                                <${EntrepotMarketplaceCardElement}
                                    ${assign(EntrepotMarketplaceCardElement, {
                                        collection: collection,
                                    })}
                                    ${listen(
                                        EntrepotMarketplaceCardElement.events.navigateToRoute,
                                        () => {
                                            dispatch(new events.collectionSelected(collection));
                                        },
                                    )}
                                ></${EntrepotMarketplaceCardElement}>
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

export const EntrepotMarketplace = wrapInReactComponent(EntrepotMarketplacePageElement);
