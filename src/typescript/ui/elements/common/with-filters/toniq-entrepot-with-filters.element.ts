import {classMap} from 'lit/directives/class-map.js';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {CurrentSort, FilterDefinitions, SortDefinition} from './with-filters-types';
import {HTMLTemplateResult} from 'lit';
import {applyAllFilters} from './apply-filters';
import {
    ArrowsSortAscending24Icon,
    ArrowsSortDescending24Icon,
    Filter24Icon,
    removeNativeFormStyles,
    Search24Icon,
    toniqColorCssVarNames,
    toniqColors,
    ToniqDropdown,
    toniqFontStyles,
    ToniqIcon,
    ToniqInput,
    ToniqToggleButton,
} from '@toniq-labs/design-system';
import {EntrepotFilterElement} from './toniq-entrpot-filter.element';
import {applySort} from './apply-sort';
import {EntrepotFilterTokenElement} from './toniq-entrepot-filter-token.element';
import {countFiltersNotAtDefaults} from './is-still-default';

export type WithFiltersElementInputs<
    EntryData extends object,
    FilterDefinitionsGeneric extends FilterDefinitions<EntryData>,
> = {
    currentFilters: FilterDefinitionsGeneric;
    defaultFilters: FilterDefinitionsGeneric;
    sortDefinitions: ReadonlyArray<SortDefinition<EntryData>>;
    currentSort: CurrentSort;
    countName: string;
    searchPlaceholder: string;
    showFilters: boolean;
    allEntries: ReadonlyArray<Readonly<EntryData>>;
    createEntryTemplateCallback: (entry: Readonly<EntryData>) => HTMLTemplateResult;
    searchCallback: (searchTerm: string, entry: Readonly<EntryData>) => boolean;
};

/**
 * Use this function when creating inputs for the "with filters" element below so that the generic
 * inferences work correctly.
 */
export function createWithFiltersInputs<
    EntryData extends object,
    FilterDefinitionsGeneric extends FilterDefinitions<EntryData>,
>(inputs: WithFiltersElementInputs<EntryData, FilterDefinitionsGeneric>) {
    return inputs;
}

export const EntrepotWithFiltersElement = defineElement<WithFiltersElementInputs<any, any>>()({
    tagName: 'toniq-entrepot-with-filters',
    cssVars: {
        filterPanelWidth: '333px',
    },
    styles: ({cssVarValues}) => css`
        :host {
            display: flex;
            flex-direction: column;
            gap: 32px;
            ${toniqFontStyles.paragraphFont};
        }

        .search-sort-header {
            display: flex;
            gap: 24px;
            height: 40px;
        }

        .search-sort-header ${ToniqInput} {
            flex-grow: 1;
        }

        .bottom-half {
            display: flex;
        }

        .filter-tokens-and-count {
            padding: 0 16px;
            height: 56px;
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .filter-tokens {
            flex-grow: 1;
            display: flex;
            gap: 16px;
        }

        ${EntrepotFilterTokenElement} {
            gap: 16px;
        }

        .count {
            color: ${toniqColors.pageSecondary.foregroundColor};
        }

        .content {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
        }

        .content-entries {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            flex-grow: 1;
        }

        .filters-panel-wrapper {
            width: 0;
            overflow: hidden;
            position: relative;
            transition: 200ms;
            flex-shrink: 0;
        }

        .filters-panel-wrapper.show-filters-panel {
            width: ${cssVarValues.filterPanelWidth};
        }

        .filters-panel {
            box-sizing: border-box;
            padding-right: 32px;
            /* sufficient padding for selection outlines */
            padding-left: 8px;
            padding-bottom: 16px;
            position: relative;
            right: 0;
            top: 0;
            width: ${cssVarValues.filterPanelWidth};
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 32px;
            align-items: stretch;
        }

        hr {
            border: 0;
            height: 1px;
            background: ${toniqColors.pageSecondary.foregroundColor};
            margin: 0;
            padding: 0;
            width: 100%;
        }

        .sort-combo {
            display: flex;
            align-items: center;
        }

        .sort-combo ${ToniqIcon} {
            cursor: pointer;
        }

        .sort-dropdown {
            width: unset;
            min-height: 40px;
            max-height: 40px;
            ${toniqColorCssVarNames.accentSecondary.backgroundColor}: transparent;
        }

        .hidden {
            display: none;
        }

        .clear-all-token {
            ${removeNativeFormStyles}
            ${toniqFontStyles.paragraphFont}
            cursor: pointer;
        }
        .clear-all-token:hover {
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        @media (max-width: 975px) {
        }
    `,
    stateInit: {
        searchValue: '',
    },
    events: {
        showFiltersChange: defineElementEvent<boolean>(),
        filtersChange: defineElementEvent<WithFiltersElementInputs<any, any>['currentFilters']>(),
        sortChange: defineElementEvent<CurrentSort>(),
    },
    renderCallback: ({inputs, dispatch, events, state, updateState}) => {
        const filteredEntries = inputs.allEntries.filter(entry => {
            return (
                inputs.searchCallback(state.searchValue, entry) &&
                applyAllFilters(entry, inputs.currentFilters)
            );
        });
        const sortedFilteredEntries = applySort({
            ...inputs,
            entries: filteredEntries,
        });

        const filterTemplates = Object.keys(inputs.currentFilters).map((filterName, index) => {
            const filter = inputs.currentFilters[filterName];
            return html`
                ${
                    index > 0
                        ? html`
                              <hr />
                          `
                        : ''
                }
                <${EntrepotFilterElement}
                    ${listen(EntrepotFilterElement.events.filterChange, event => {
                        dispatch(
                            new events.filtersChange({
                                ...inputs.currentFilters,
                                ...event.detail,
                            }),
                        );
                    })}
                    ${assign(EntrepotFilterElement, {
                        filter,
                        filterName,
                    })}
                ></${EntrepotFilterElement}>
            `;
        });

        const searchTemplate: HTMLTemplateResult = html`
            <${ToniqToggleButton}
                class="${ToniqToggleButton.hostClasses.textOnly}"
                ${assign(ToniqToggleButton, {
                    toggled: inputs.showFilters,
                    text: 'Filters',
                    icon: Filter24Icon,
                })}
                ${listen('click', () => {
                    dispatch(new events.showFiltersChange(!inputs.showFilters));
                })}
            ></${ToniqToggleButton}>
            <${ToniqInput}
                class="${ToniqInput.hostClasses.outline}"
                ${assign(ToniqInput, {
                    value: state.searchValue,
                    placeholder: inputs.searchPlaceholder,
                    icon: Search24Icon,
                })}
                ${listen(ToniqInput.events.valueChange, event => {
                    updateState({
                        searchValue: event.detail,
                    });
                })}
            ></${ToniqInput}>
            <div class="sort-combo">
                <${ToniqIcon}
                    ${assign(ToniqIcon, {
                        icon: inputs.currentSort.ascending
                            ? ArrowsSortAscending24Icon
                            : ArrowsSortDescending24Icon,
                    })}
                    ${listen('click', () => {
                        dispatch(
                            new events.sortChange({
                                ...inputs.currentSort,
                                ascending: !inputs.currentSort.ascending,
                            }),
                        );
                    })}
                ></${ToniqIcon}>
                <${ToniqDropdown}
                    class="sort-dropdown"
                    ${assign(ToniqDropdown, {
                        options: inputs.sortDefinitions.map(definition => {
                            return {
                                label: definition.sortName,
                                value: definition.sortName,
                            };
                        }),
                        selected: {
                            label: inputs.currentSort.name,
                            value: inputs.currentSort.name,
                        },
                    })}
                    ${listen(ToniqDropdown.events.selectChange, event => {
                        dispatch(
                            new events.sortChange({
                                ...inputs.currentSort,
                                name: event.detail.value,
                            }),
                        );
                    })}
                ></${ToniqDropdown}>
            </div>
        `;

        const nonDefaultFilterCount = countFiltersNotAtDefaults({
            filters: inputs.currentFilters,
            defaultFilters: inputs.defaultFilters,
        });

        console.log({nonDefaultFilterCount});

        const filterTokensTemplates = Object.keys(inputs.currentFilters).map(filterName => {
            const filter = inputs.currentFilters[filterName];
            const defaultFilter = inputs.defaultFilters[filterName];

            return html`
                <${EntrepotFilterTokenElement}
                    ${assign(EntrepotFilterTokenElement, {
                        defaultFilter,
                        filter,
                        filterName,
                    })}
                    ${listen(EntrepotFilterTokenElement.events.resetFilter, event => {
                        dispatch(
                            new events.filtersChange({
                                ...inputs.currentFilters,
                                [filterName]: event.detail,
                            }),
                        );
                    })}
                ></${EntrepotFilterTokenElement}>
            `;
        });

        return html`
            <div class="search-sort-header">${searchTemplate}</div>
            <div class="bottom-half">
                <div
                    class="filters-panel-wrapper ${classMap({
                        'show-filters-panel': inputs.showFilters,
                    })}"
                >
                    <div class="filters-panel">${filterTemplates}</div>
                </div>
                <div class="content">
                    <div class="filter-tokens-and-count">
                        <div class="filter-tokens">
                            ${filterTokensTemplates}
                            <button
                                class="clear-all-token ${classMap({
                                    hidden: nonDefaultFilterCount <= 1,
                                })}"
                                ${listen('click', () => {
                                    dispatch(new events.filtersChange(inputs.defaultFilters));
                                })}
                            >
                                Clear All
                            </button>
                        </div>
                        <span class="count">
                            ${sortedFilteredEntries.length} ${inputs.countName}
                        </span>
                    </div>
                    <div class="content-entries">
                        ${sortedFilteredEntries.map(entry => {
                            return inputs.createEntryTemplateCallback(entry);
                        })}
                    </div>
                </div>
            </div>
        `;
    },
});
