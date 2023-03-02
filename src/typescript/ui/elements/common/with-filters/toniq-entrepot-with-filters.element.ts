import {repeat} from 'lit/directives/repeat.js';
import {classMap} from 'lit/directives/class-map.js';
import {assign, css, defineElement, defineElementEvent, html, listen, renderIf} from 'element-vir';
import {CurrentSort, FilterDefinitions, SortDefinition} from './filters-types';
import {HTMLTemplateResult} from 'lit';
import {applyAllFilters} from './apply-filters';
import {
    applyBackgroundAndForeground,
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
    defineToniqElement,
    LoaderAnimated24Icon,
} from '@toniq-labs/design-system';
import {EntrepotFilterElement} from './toniq-entrepot-filter.element';
import {applySort} from './apply-sort';
import {EntrepotFilterTokenElement} from './toniq-entrepot-filter-token.element';
import {countFiltersNotAtDefaults} from './is-still-default';
import {ReadonlyDeep} from 'type-fest';
import {
    filterScrollHeaderHeight,
    mainEntrepotHeaderHeight,
    filterScrollHeaderBottomMargin,
} from '../../../fixed-sizes';

export type WithFiltersElementInputs<
    EntryData extends object,
    FilterDefinitionsGeneric extends FilterDefinitions<EntryData>,
> = {
    currentFilters: ReadonlyDeep<FilterDefinitionsGeneric>;
    defaultFilters: ReadonlyDeep<FilterDefinitionsGeneric>;
    sortDefinitions: ReadonlyArray<ReadonlyDeep<SortDefinition<EntryData>>>;
    currentSort: ReadonlyDeep<CurrentSort>;
    isLoading?: boolean;
    countName: string;
    searchPlaceholder: string;
    showFilters: boolean;
    allEntries: ReadonlyArray<Readonly<EntryData>>;
    createEntryTemplateCallback: (entry: Readonly<EntryData>) => HTMLTemplateResult | string;
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

export const EntrepotWithFiltersElement = defineToniqElement<WithFiltersElementInputs<any, any>>()({
    tagName: 'toniq-entrepot-with-filters',
    cssVars: {
        filterPanelWidth: '333px',
    },
    styles: ({cssVarValues, cssVarNames}) => css`
        :host {
            display: flex;
            flex-direction: column;
            ${toniqFontStyles.paragraphFont};
        }

        .search-sort-header {
            padding-top: 16px;
            margin-bottom: ${filterScrollHeaderBottomMargin}px;
            box-sizing: border-box;
            height: ${filterScrollHeaderHeight}px;
            position: sticky;
            top: 70px;
            z-index: 10;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
        }

        .shadow-wrapper {
            display: flex;
            gap: 24px;
            height: 40px;
            padding: 16px 32px 8px;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}

            box-shadow: 0 0 10px 15px white;
        }

        .shadow-wrapper ${ToniqInput} {
            flex-grow: 1;
        }

        .bottom-half {
            display: flex;
            padding: 0 32px;
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
            z-index: 5;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
        }

        .content-entries {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            gap: 16px 4px;
        }

        .content-entries.is-loading-entries {
            justify-content: center;
        }

        .filters-panel-wrapper {
            opacity: 0;
            display: flex;
            width: 0;
            transition: 200ms;
            flex-shrink: 0;
            align-items: flex-start;
        }

        .filters-panel-wrapper.show-filters-panel {
            opacity: 1;
            width: ${cssVarValues.filterPanelWidth};
        }

        .filters-panel {
            max-height: calc(
                100vh -
                    ${mainEntrepotHeaderHeight +
                    filterScrollHeaderHeight +
                    filterScrollHeaderBottomMargin}px
            );
            overflow-y: auto;
            position: sticky;
            box-sizing: border-box;
            padding-right: 8px;
            /* sufficient padding for selection outlines */
            padding-left: 8px;
            padding-bottom: 64px;
            right: 0;
            top: 174px;
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

        .filter-tokens-and-count .sort-combo {
            display: none;
        }

        .shadow-footer {
            position: sticky;
            bottom: 0;
            width: 100vw;
            z-index: 10;
            margin-top: 64px;
            box-shadow: 0 0 10px 15px white;
        }

        @media (max-width: 1200px) {
            :host {
                ${cssVarNames.filterPanelWidth}: 200px;
            }
        }

        @media (max-width: 950px) {
            :host {
                ${cssVarNames.filterPanelWidth}: 500px;
            }

            .search-sort-header .sort-combo {
                display: none;
            }

            .filter-tokens-and-count {
                justify-content: space-between;
                padding: 0;
            }

            .filter-tokens-and-count .sort-combo {
                display: flex;
            }

            .filter-tokens {
                display: none;
            }

            .bottom-half {
                flex-direction: column;
            }

            .filters-panel-wrapper {
                max-width: 100%;
                width: unset;
                justify-content: center;
                height: 0;
            }

            .filters-panel-wrapper.show-filters-panel {
                width: unset;
                height: unset;
            }

            .filters-panel {
                max-width: 100%;
                top: unset;
                right: unset;
            }
        }
    `,
    stateInit: {
        searchValue: '',
    },
    initCallback: ({updateState}) => {
        const searchTerm = new URL(document.location.href).searchParams.get('search');
        if (searchTerm !== null) updateState({searchValue: searchTerm});
    },
    events: {
        showFiltersChange: defineElementEvent<boolean>(),
        filtersChange:
            defineElementEvent<
                WithFiltersElementInputs<any, FilterDefinitions<any>>['currentFilters']
            >(),
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

        const sortTemplate = html`
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
                <slot name="extra-controls"></slot>
            </div>
        `;

        const searchTemplate: HTMLTemplateResult = html`
            <${ToniqToggleButton}
                class="${ToniqToggleButton.hostClasses.textOnly}"
                ${assign(ToniqToggleButton, {
                    toggled: inputs.showFilters,
                    text: state.searchValue ? '' : 'Filters',
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
            ${sortTemplate}
        `;

        const nonDefaultFilterCount = countFiltersNotAtDefaults({
            filters: inputs.currentFilters,
            defaultFilters: inputs.defaultFilters,
        });

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
            <div class="search-sort-header">
                <div class="shadow-wrapper">${searchTemplate}</div>
            </div>
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
                        ${sortTemplate}
                    </div>
                    <div
                        class=${classMap({
                            'content-entries': true,
                            'is-loading-entries': !!inputs.isLoading,
                        })}
                    >
                        <slot name="entries-header"></slot>
                        ${renderIf(
                            !!inputs.isLoading,
                            html`
                                <${ToniqIcon}
                                    ${assign(ToniqIcon, {
                                        icon: LoaderAnimated24Icon,
                                    })}
                                ></${ToniqIcon}>
                            `,
                            repeat(
                                sortedFilteredEntries,
                                entry => entry,
                                inputs.createEntryTemplateCallback,
                            ),
                        )}
                    </div>
                </div>
            </div>
            <div class="shadow-footer"></div>
        `;
    },
});
