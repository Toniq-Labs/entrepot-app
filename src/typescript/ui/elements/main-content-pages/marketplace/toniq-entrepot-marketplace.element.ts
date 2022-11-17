import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {ensureType, getEnumTypedValues, wrapNarrowTypeWithTypeCheck} from 'augment-vir';
import {assign, css, defineElement, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {
    EntrepotWithFiltersElement,
    createWithFiltersInputs,
} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    CurrentSort,
} from '../../common/with-filters/with-filters-types';
import {VolumeDurationEnum} from '../../../../data/models/volume-data';
import {toniqFontStyles} from '@toniq-labs/design-system';
import {EntrepotMarketplaceCardElement} from './toniq-entrepot-marketplace-card.element';

const defaultMarketplaceFilters = wrapNarrowTypeWithTypeCheck<FilterDefinitions<Collection>>()({
    Price: {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: [
            'stats',
            'floor',
        ],
    },
    Volume: {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        // selectedType: VolumeDurationEnum.days7,
        // types: getEnumTypedValues(VolumeDurationEnum),
        filterField: [
            'stats',
            'total',
        ],
    },
    Dev: {
        filterType: FilterTypeEnum.Checkboxes,
        checkboxes: [
            {
                label: 'dev',
                checked: false,
            },
        ],
        filterField: ['dev'],
    },
});

const sortDefinitions = wrapNarrowTypeWithTypeCheck<ReadonlyArray<SortDefinition<Collection>>>()([
    {
        sortName: 'Volume',
        sortField: [
            'stats',
            'total',
        ],
    },
    {
        sortName: 'Listings',
        sortField: [
            'stats',
            'listings',
        ],
    },
    {
        sortName: 'Price',
        sortField: [
            'stats',
            'floor',
        ],
    },
    {
        sortName: 'Name',
        sortField: ['name'],
    },
] as const);

export const EntrepotMarketplaceElement = defineElement<{
    collections: ReadonlyArray<Collection>;
}>()({
    tagName: 'toniq-entrepot-marketplace',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
        }
        h1 {
            ${toniqFontStyles.h1Font}
            ${toniqFontStyles.extraBoldFont}
            margin: 0;
            margin-bottom: 32px;
        }
    `,
    stateInit: {
        showFilters: false,
        filters: defaultMarketplaceFilters,
        currentSort: ensureType<CurrentSort>({
            ascending: false,
            name: sortDefinitions[0].sortName,
        }),
    },
    renderCallback: ({inputs, state, updateState}) => {
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
                                        collectionRoute: collection.route,
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

export const EntrepotMarketplace = wrapInReactComponent(EntrepotMarketplaceElement);
