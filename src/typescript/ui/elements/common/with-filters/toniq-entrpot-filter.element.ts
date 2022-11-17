import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {SingleFilterDefinition, FilterTypeEnum, FilterDefinitions} from './with-filters-types';
import {HTMLTemplateResult} from 'lit';
import {ToniqCheckbox, toniqFontStyles, ToniqInput} from '@toniq-labs/design-system';
import {removeCommasFromNumberString} from 'augment-vir';

export const EntrepotFilterElement = defineElement<{
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

        .title {
            margin-top: 0;
            ${toniqFontStyles.boldParagraphFont}
        }

        .numeric-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .numeric-row ${ToniqInput} {
            width: 127px;
        }

        .numeric-row span {
            ${toniqFontStyles.boldParagraphFont}
        }
    `,
    renderCallback: ({inputs, events, dispatch}) => {
        const filterInternalsTemplate = createFilterInternals(inputs.filter, newFilter => {
            dispatch(new events.filterChange({[inputs.filterName]: newFilter}));
        });

        if (!filterInternalsTemplate) {
            console.error(
                new Error(
                    `Invalid filter type "${inputs.filter.filterType}" for "${inputs.filterName}"`,
                ),
            );
            return html``;
        }

        return html`
            <p class="title">${inputs.filterName}</p>
            ${filterInternalsTemplate}
        `;
    },
});

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
    } else if (filter.filterType === FilterTypeEnum.ExpandingList) {
        return html``;
    } else if (filter.filterType === FilterTypeEnum.NumericRange) {
        const min = filter.currentMin == undefined ? '' : String(filter.currentMin);
        const max = filter.currentMax == undefined ? '' : String(filter.currentMax);
        return html`
            <div class="numeric-row">
                ${createNumericRangeInputTemplate({
                    filter,
                    propName: 'currentMin',
                    changeCallback,
                })}
                <span>to</span>
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
