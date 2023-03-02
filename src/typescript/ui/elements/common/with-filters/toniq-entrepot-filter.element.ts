import {assign, css, defineElementEvent, html, listen} from 'element-vir';
import {classMap} from 'lit/directives/class-map.js';
import {SingleFilterDefinition, FilterTypeEnum, FilterDefinitions} from './filters-types';
import {HTMLTemplateResult} from 'lit';
import {
    ToniqCheckbox,
    toniqFontStyles,
    ToniqInput,
    ChevronDown24Icon,
    ChevronUp24Icon,
    ToniqIcon,
    removeNativeFormStyles,
    defineToniqElement,
    ToniqRadioGroup,
    toniqColors,
} from '@toniq-labs/design-system';
import {isRuntimeTypeOf, mapObjectValues, removeCommasFromNumberString} from '@augment-vir/common';
import {EntrepotExpandingListFilterElement} from './toniq-entrepot-expanding-list-filter.element';
import {EntrepotImageToggleFilterElement} from './toniq-entrepot-image-toggle-filter.element';

export const EntrepotFilterElement = defineToniqElement<{
    filterName: string;
    filter: SingleFilterDefinition<any>;
}>()({
    tagName: 'toniq-entrepot-filter',
    events: {
        filterChange: defineElementEvent<FilterDefinitions<any>>(),
    },
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
        }

        .title-row {
            margin-top: 0;
            display: flex;
            justify-content: space-between;
            ${removeNativeFormStyles}
            ${toniqFontStyles.boldParagraphFont}
            margin-bottom: 16px;
            cursor: default;
        }

        .clickable {
            cursor: pointer;
        }

        .numeric-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .numeric-row ${ToniqInput} {
            flex-grow: 1;
        }

        .expanding-entries {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        ${EntrepotExpandingListFilterElement} {
            margin-left: 4px;
        }
    `,
    renderCallback: ({inputs, events, dispatch}) => {
        function changeCallback(newFilter: typeof inputs.filter) {
            dispatch(new events.filterChange({[inputs.filterName]: newFilter}));
        }

        const filterInternalsTemplate = createFilterInternals(inputs.filter, changeCallback);

        if (!filterInternalsTemplate) {
            console.error(
                new Error(
                    `Invalid filter type for rendering "${inputs.filter.filterType}" for "${inputs.filterName}"`,
                ),
            );
            return html``;
        }

        const filterCountString = createFilterCountString(inputs.filter);
        const expandingIconTemplate = createExpandingIconTemplate(inputs.filter);
        const clickCallback = createFilterTitleRowClickCallback(inputs.filter, changeCallback);

        return html`
            <button
                class="title-row ${classMap({clickable: !!clickCallback})}"
                ${listen('click', () => {
                    clickCallback?.();
                })}
            >
                <span>${inputs.filterName}${filterCountString}</span>
                ${expandingIconTemplate}
            </button>
            ${'expanded' in inputs.filter
                ? inputs.filter.expanded
                    ? filterInternalsTemplate
                    : ''
                : filterInternalsTemplate}
        `;
    },
});

function createFilterTitleRowClickCallback(
    filter: SingleFilterDefinition<any>,
    changeCallback: (newFilter: SingleFilterDefinition<any>) => void,
) {
    if ('expanded' in filter) {
        return () =>
            changeCallback({
                ...filter,
                expanded: !filter.expanded,
            });
    } else {
        return undefined;
    }
}

function createFilterCountString(filter: SingleFilterDefinition<any>): string {
    let count: undefined | number;
    if (filter.filterType === FilterTypeEnum.ExpandingList) {
        count = filter.entries.length;
    } else if (filter.filterType === FilterTypeEnum.ImageToggles) {
        count = Object.keys(filter.entries).length;
    }

    if (count) {
        return ` (${count})`;
    } else {
        return '';
    }
}

function createExpandingIconTemplate(filter: SingleFilterDefinition<any>): HTMLTemplateResult {
    if ('expanded' in filter) {
        return html`
            <${ToniqIcon}
                ${assign(ToniqIcon, {
                    icon: filter.expanded ? ChevronUp24Icon : ChevronDown24Icon,
                })}
            ></${ToniqIcon}>
        `;
    } else {
        return html``;
    }
}

function createFilterInternals(
    filter: SingleFilterDefinition<any>,
    changeCallback: (newFilter: SingleFilterDefinition<any>) => void,
): HTMLTemplateResult | ReadonlyArray<HTMLTemplateResult> | undefined {
    if (filter.filterType === FilterTypeEnum.Checkboxes) {
        return filter.checkboxes.map((checkbox, index) => {
            return html`
                <${ToniqCheckbox}
                    ${assign(ToniqCheckbox, {
                        checked: checkbox.checked,
                        text: checkbox.label,
                    })}
                    ${listen(ToniqCheckbox.events.checkedChange, event => {
                        changeCallback({
                            ...filter,
                            checkboxes: filter.checkboxes.map((checkbox, innerIndex) => {
                                if (innerIndex === index) {
                                    return {
                                        ...checkbox,
                                        checked: event.detail,
                                    };
                                } else {
                                    return checkbox;
                                }
                            }),
                        });
                    })}
                ></${ToniqCheckbox}>
            `;
        });
    } else if (filter.filterType === FilterTypeEnum.Radio) {
        return html`
            <${ToniqRadioGroup}
                ${assign(ToniqRadioGroup, {
                    entries: filter.radios.map(radio => {
                        return {
                            value: isRuntimeTypeOf(radio.value, 'boolean')
                                ? String(radio.value)
                                : radio.value ?? radio.label,
                            label: radio.label,
                        };
                    }),
                    value: String(filter.value),
                })}
                ${listen(ToniqRadioGroup.events.valueChange, event => {
                    changeCallback({
                        ...filter,
                        value: event.detail,
                    });
                })}
            ></${ToniqRadioGroup}>
        `;
    } else if (filter.filterType === FilterTypeEnum.ExpandingList) {
        return createExpandingListTemplate(filter, changeCallback);
    } else if (filter.filterType === FilterTypeEnum.ImageToggles) {
        return createImageTogglesFilterTemplate(filter, changeCallback);
    } else if (filter.filterType === FilterTypeEnum.NumericRange) {
        return html`
            <div class="numeric-row">
                ${createNumericRangeInputTemplate({
                    filter,
                    propName: 'currentMin',
                    changeCallback,
                })}
                ${createNumericRangeInputTemplate({
                    filter,
                    propName: 'currentMax',
                    changeCallback,
                })}
            </div>
        `;
    } else {
        return undefined;
    }
}

function createImageTogglesFilterTemplate<
    FilterGeneric extends Extract<
        SingleFilterDefinition<any>,
        {filterType: FilterTypeEnum.ImageToggles}
    >,
>(filter: FilterGeneric, changeCallback: (newFilter: FilterGeneric) => void): HTMLTemplateResult {
    const {anyChecked, totalCount} = Object.values(filter.entries).reduce(
        (combined, entry) => {
            return {
                anyChecked: combined.anyChecked || entry.checked,
                totalCount: entry.count + combined.totalCount,
            };
        },
        {
            anyChecked: false,
            totalCount: 0,
        },
    );

    const firstImages = Object.values(filter.entries)
        .slice(0, 4)
        .map(entry => entry.imageUrl);

    const styleCss = css`
        .image-toggle-header {
            margin-bottom: 8px;
        }

        hr {
            width: 100%;
            background-color: ${toniqColors.divider.foregroundColor};
            height: 1px;
            border: 0;
        }

        hr + ${EntrepotImageToggleFilterElement} {
            margin-top: 8px;
        }
    `;

    return html`
        <style>
            ${String(styleCss)}
        </style>
        <div class="expanding-entries">
            <${EntrepotImageToggleFilterElement}
                class="image-toggle-header"
                ${assign(EntrepotImageToggleFilterElement, {
                    name: filter.allEntriesTitle,
                    imageToggleEntry: {
                        checked: !anyChecked,
                        count: totalCount,
                        imageUrl: '',
                    },
                    headerImages: firstImages,
                })}
                ${listen(EntrepotImageToggleFilterElement.events.select, event => {
                    changeCallback({
                        ...filter,
                        entries: mapObjectValues(filter.entries, (filterName, filterEntry) => {
                            return {
                                ...filterEntry,
                                checked: false,
                            };
                        }),
                    });
                })}
            ></${EntrepotImageToggleFilterElement}>
            <hr>
            ${Object.entries(filter.entries).map(
                ([
                    name,
                    imageToggleEntry,
                ]) => {
                    return html`
                    <${EntrepotImageToggleFilterElement}
                        ${assign(EntrepotImageToggleFilterElement, {
                            imageToggleEntry,
                            name,
                        })}
                        ${listen(EntrepotImageToggleFilterElement.events.select, event => {
                            const entries = {
                                ...filter.entries,
                                [name]: {
                                    ...filter.entries[name],
                                    checked: event.detail,
                                },
                            };
                            changeCallback({
                                ...filter,
                                entries,
                            });
                        })}
                    ></${EntrepotImageToggleFilterElement}>`;
                },
            )}
        </div>
    `;
}

function createExpandingListTemplate<
    FilterGeneric extends Extract<
        SingleFilterDefinition<any>,
        {filterType: FilterTypeEnum.ExpandingList}
    >,
>(filter: FilterGeneric, changeCallback: (newFilter: FilterGeneric) => void): HTMLTemplateResult {
    return html`
        <div class="expanding-entries">
            ${filter.entries.map((entry, entryIndex) => {
                return html`
                    <${EntrepotExpandingListFilterElement}
                        ${assign(EntrepotExpandingListFilterElement, {
                            expandingListEntry: entry,
                        })}
                        ${listen(EntrepotExpandingListFilterElement.events.entryChange, event => {
                            const entries = [...filter.entries];
                            entries[entryIndex] = event.detail;
                            changeCallback({
                                ...filter,
                                entries,
                            });
                        })}
                    ></${EntrepotExpandingListFilterElement}>`;
            })}
        </div>
    `;
}

function createNumericRangeInputTemplate<
    FilterGeneric extends Extract<
        SingleFilterDefinition<any>,
        {filterType: FilterTypeEnum.NumericRange}
    >,
>({
    filter,
    propName,
    changeCallback,
}: {
    filter: FilterGeneric;
    propName: 'currentMin' | 'currentMax';
    changeCallback: (newFilter: FilterGeneric) => void;
}): HTMLTemplateResult {
    const value = filter[propName];

    return html`
        <${ToniqInput}
            class=${ToniqInput.hostClasses.outline}
            ${assign(ToniqInput, {
                value: value == undefined ? '' : String(value),
                placeholder: propName.replace(/^current/, ''),
                disableBrowserHelps: true,
            })}
            ${listen(ToniqInput.events.valueChange, event => {
                const numericCast = Number(removeCommasFromNumberString(event.detail));
                const newValue =
                    isNaN(numericCast) || event.detail === '' ? undefined : numericCast;
                changeCallback({
                    ...filter,
                    [propName]: newValue,
                });
            })}
        ></${ToniqInput}>
    `;
}
