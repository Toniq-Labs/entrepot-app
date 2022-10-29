import {defineElement, listen, defineElementEvent, html, css} from 'element-vir';
import {classMap} from 'lit/directives/class-map.js';
import {
    toniqFontStyles,
    removeNativeFormStyles,
    toniqColors,
    createFocusStyles,
} from '@toniq-labs/design-system';

export type TopTab<ValueGeneric = unknown> = {
    label: string;
    value: ValueGeneric;
};

export const EntrepotTopTabsElement = defineElement<{
    tabs: ReadonlyArray<TopTab>;
    selected: Readonly<TopTab>;
}>()({
    tagName: 'toniq-entrepot-top-tabs',
    styles: css`
        :host {
            display: flex;
            ${toniqFontStyles.paragraphFont};
        }

        button {
            ${removeNativeFormStyles};
            padding: 12px;
            position: relative;
            outline: none;
        }

        ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            flex-grow: 1;
        }

        ${createFocusStyles({
            mainSelector: 'button:focus',
            elementBorderSize: 0,
            outlineGap: 0,
        })}

        ul,
        li {
            margin: 0;
            padding: 0;
        }

        li.selected {
            ${toniqFontStyles.boldParagraphFont};
            color: ${toniqColors.pageInteraction.foregroundColor};
            border-bottom-color: ${toniqColors.pageInteraction.foregroundColor};
            border-bottom-width: 2px;
            pointer-events: none;
        }

        li {
            border-bottom: 1px solid ${toniqColors.divider.foregroundColor};
        }

        li:last-of-type {
            flex-grow: 1;
        }
    `,
    events: {
        tabChange: defineElementEvent<TopTab>(),
    },
    renderCallback: ({inputs, dispatch, events}) => {
        return html`
            <ul>
                ${inputs.tabs.map(tab =>
                    makeTopTab(tab, tab.label === inputs.selected.label, () => {
                        dispatch(new events.tabChange(tab));
                    }),
                )}
                <li></li>
            </ul>
        `;
    },
});

function makeTopTab(tab: TopTab, isSelected: boolean, clickCallback: () => void) {
    return html`
        <li
            class=${classMap({
                selected: isSelected,
            })}
            ${listen('click', clickCallback)}
        >
            <button>${tab.label}</button>
        </li>
    `;
}
