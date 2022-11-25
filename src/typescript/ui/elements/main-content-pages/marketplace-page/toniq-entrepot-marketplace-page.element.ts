import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {ensureType} from 'augment-vir';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {
    EntrepotWithFiltersElement,
    createWithFiltersInputs,
} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {CurrentSort} from '../../common/with-filters/filters-types';
import {toniqFontStyles} from '@toniq-labs/design-system';
import {EntrepotMarketplaceCardElement} from './toniq-entrepot-marketplace-card.element';
import {sortDefinitions, defaultMarketplaceFilters} from './marketplace-filters';

export const EntrepotMarketplacePageElement = defineElement<{
    collections: ReadonlyArray<Collection>;
}>()({
    tagName: 'toniq-entrepot-page-marketplace',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
        }

        h1 {
            ${toniqFontStyles.h1Font}
            ${toniqFontStyles.extraBoldFont}
            margin: 0 32px;
        }

        @media (max-width: 1200px) {
            :host {
                padding: 16px;
            }

            h1 {
                ${toniqFontStyles.h2Font}
                ${toniqFontStyles.extraBoldFont}
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
            <h1>All Collections</h1>
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
                        searchPlaceholder: 'Search for collection name...',
                        searchCallback: (searchTerm, collection) => {
                            return collection.name.toLowerCase().includes(searchTerm.toLowerCase());
                        },
                        createEntryTemplateCallback: collection => {
                            return html`
                                <${EntrepotMarketplaceCardElement}
                                    ${assign(EntrepotMarketplaceCardElement, {
                                        collectionImageUrl: collection.collection,
                                        collectionName: collection.name,
                                        descriptionText: collection.brief,
                                        stats: collection.stats,
                                    })}
                                    ${listen('click', () => {
                                        dispatch(new events.collectionSelected(collection));
                                    })}
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
