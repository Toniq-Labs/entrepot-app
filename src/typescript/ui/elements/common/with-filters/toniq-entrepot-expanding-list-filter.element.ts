import {classMap} from 'lit/directives/class-map.js';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {ExpandingListFilterEntry, BooleanFilterEntry} from './filters-types';
import {
    applyBackgroundAndForeground,
    ChevronDown24Icon,
    ChevronUp24Icon,
    removeNativeFormStyles,
    Search24Icon,
    ToniqCheckbox,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    ToniqInput,
    defineToniqElement,
} from '@toniq-labs/design-system';

export const EntrepotExpandingListFilterElement = defineToniqElement<{
    expandingListEntry: ExpandingListFilterEntry;
}>()({
    tagName: 'toniq-entrepot-expanding-list-template',
    events: {
        entryChange: defineElementEvent<ExpandingListFilterEntry>(),
    },
    stateInit: {
        searchTerm: '',
    },
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
        }

        .title-row {
            ${removeNativeFormStyles}
            ${toniqFontStyles.paragraphFont}
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            margin: 0;
        }

        .title-row-suffix {
            display: flex;
            gap: 8px;
        }

        .selected-amount {
            display: flex;
            min-height: 24px;
            min-width: 24px;
            border-radius: 12px;
            justify-content: center;
            align-items: center;
            ${toniqFontStyles.boldLabelFont}
            ${applyBackgroundAndForeground(toniqColors.accentPrimary)}
        }

        .expandable-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-height: 0;
            overflow: hidden;
        }

        .expandable-list.expanded {
            max-height: unset;
            margin-bottom: 16px;
        }

        ${ToniqInput} {
            margin: 24px 8px 8px;
        }

        .hidden {
            display: none;
        }
    `,
    renderCallback: ({inputs, state, updateState, events, dispatch}) => {
        const selectedCount = inputs.expandingListEntry.checkboxes.reduce(
            (accum, checkbox) => accum + Number(checkbox.checked),
            0,
        );

        const filteredCheckboxes: ReadonlyArray<BooleanFilterEntry> =
            inputs.expandingListEntry.checkboxes.filter(checkbox => {
                if (state.searchTerm) {
                    return checkbox.label.toLowerCase().includes(state.searchTerm.toLowerCase());
                } else {
                    return true;
                }
            });

        return html`
            <button class="title-row"
                ${listen('click', () => {
                    dispatch(
                        new events.entryChange({
                            ...inputs.expandingListEntry,
                            expanded: !inputs.expandingListEntry.expanded,
                        }),
                    );
                })}
            >
                <span class="title">
                    ${inputs.expandingListEntry.name}
                    (${inputs.expandingListEntry.checkboxes.length})
                </span>
                <div class="title-row-suffix">
                    <div class="selected-amount ${classMap({hidden: selectedCount === 0})}">
                        <span>${selectedCount}</span>
                    </div>
                    <${ToniqIcon}
                        ${assign(ToniqIcon, {
                            icon: inputs.expandingListEntry.expanded
                                ? ChevronUp24Icon
                                : ChevronDown24Icon,
                        })}
                    ></${ToniqIcon}>
                </div>
            </button>
            <div
                class="expandable-list ${classMap({
                    expanded: inputs.expandingListEntry.expanded,
                })}"
            >
                <${ToniqInput}
                    ${assign(ToniqInput, {
                        value: state.searchTerm,
                        placeholder: 'Search....',
                        icon: Search24Icon,
                        disableBrowserHelps: true,
                    })}
                    ${listen(ToniqInput.events.valueChange, event => {
                        updateState({
                            searchTerm: event.detail,
                        });
                    })}
                ></${ToniqInput}>
                ${filteredCheckboxes.map((checkbox, index) => {
                    return html`
                        <${ToniqCheckbox}
                            ${assign(ToniqCheckbox, {
                                checked: checkbox.checked,
                                text: checkbox.label,
                            })}
                            ${listen(ToniqCheckbox.events.checkedChange, event => {
                                const checkboxes = [...inputs.expandingListEntry.checkboxes];
                                checkboxes[index] = {...checkbox, checked: event.detail};

                                dispatch(
                                    new events.entryChange({
                                        ...inputs.expandingListEntry,
                                        checkboxes,
                                    }),
                                );
                            })}
                        ></${ToniqCheckbox}>
                    `;
                })}
        </div>
        `;
    },
});
