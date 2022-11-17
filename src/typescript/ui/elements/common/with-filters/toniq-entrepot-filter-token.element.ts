import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {SingleFilterDefinition, FilterTypeEnum} from './with-filters-types';
import {
    applyBackgroundAndForeground,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    X24Icon,
} from '@toniq-labs/design-system';
import {isTruthy, truncateNumber} from 'augment-vir';
import {isStillAtDefaults} from './is-still-default';

type FilterTokenInputs = {
    filterName: string;
    defaultFilter: SingleFilterDefinition<any>;
    filter: SingleFilterDefinition<any>;
};

export const EntrepotFilterTokenElement = defineElement<FilterTokenInputs>()({
    tagName: 'toniq-entrepot-filter-token',
    events: {
        resetFilter: defineElementEvent<SingleFilterDefinition<any>>(),
    },
    styles: ({hostClassSelectors}) => css`
        :host {
            display: flex;
        }

        .token {
            display: flex;
            border-radius: 8px;
            padding: 8px 16px;
            gap: 12px;
            ${toniqFontStyles.paragraphFont};
            ${applyBackgroundAndForeground(toniqColors.accentSecondary)}
        }

        .close-icon {
            cursor: pointer;
        }
    `,
    renderCallback: ({inputs, events, dispatch}) => {
        const atDefaults = isStillAtDefaults(inputs);

        if (atDefaults) {
            return html``;
        }

        const tokens = createFilterTokenText(inputs);

        return html`
            ${tokens.map(token => {
                return html`
                <div class="token">
                    ${token.text}
                    <${ToniqIcon}
                        class="close-icon"
                        ${assign(ToniqIcon, {icon: X24Icon})}
                        ${listen('click', () => {
                            dispatch(new events.resetFilter(token.resetValue));
                        })}
                    ></${ToniqIcon}>
                </div>`;
            })}
        `;
    },
});

type FilterToken = {
    text: string;
    resetValue: SingleFilterDefinition<any>;
};

function createFilterTokenText({
    filter,
    filterName,
    defaultFilter,
}: Pick<FilterTokenInputs, 'filter' | 'filterName' | 'defaultFilter'>): ReadonlyArray<FilterToken> {
    if (
        filter.filterType === FilterTypeEnum.Checkboxes &&
        defaultFilter.filterType === FilterTypeEnum.Checkboxes
    ) {
        return filter.checkboxes
            .map((checkbox, index): FilterToken | undefined => {
                const defaultCheckbox = defaultFilter.checkboxes[index]!;

                if (defaultCheckbox.checked === checkbox.checked) {
                    return undefined;
                } else {
                    const inversion = checkbox.checked ? '' : '!';
                    return {
                        text: `${inversion}${checkbox.label}`,
                        resetValue: {
                            ...filter,
                            checkboxes: filter.checkboxes.map((checkbox, innerIndex) => {
                                if (innerIndex === index) {
                                    return defaultCheckbox;
                                } else {
                                    return checkbox;
                                }
                            }),
                        },
                    };
                }
            })
            .filter(isTruthy);
    } else if (
        filter.filterType === FilterTypeEnum.ExpandingList &&
        defaultFilter.filterType === FilterTypeEnum.ExpandingList
    ) {
        return [{text: filterName, resetValue: defaultFilter}];
    } else if (
        filter.filterType === FilterTypeEnum.NumericRange &&
        defaultFilter.filterType === FilterTypeEnum.NumericRange
    ) {
        const start =
            filter.currentMin == undefined ? '' : `${truncateNumber(filter.currentMin)} < `;
        const end = filter.currentMax == undefined ? '' : ` < ${truncateNumber(filter.currentMax)}`;
        return [{text: `${start}${filterName}${end}`, resetValue: defaultFilter}];
    } else {
        throw new Error(
            `Unsupported filter type for tokens: ${defaultFilter.filterType}, ${filter.filterType}`,
        );
    }
}
