import {defineElement, listen, defineElementEvent, html, css} from 'element-vir';
import {classMap} from 'lit/directives/class-map.js';
import {
    toniqFontStyles,
    toniqColors,
    createFocusStyles,
    removeNativeFormStyles,
    defineToniqElement,
} from '@toniq-labs/design-system';

export type TopTab<ValueGeneric = unknown> = {
    label: string;
    value: ValueGeneric;
};

export const EntrepotTopTabsElement = defineToniqElement<{
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

        a {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-decoration: none;
        }

        a::after {
            content: attr(data-text);
            content: attr(data-text) / '';
            height: 0;
            visibility: hidden;
            overflow: hidden;
            user-select: none;
            pointer-events: none;
            ${toniqFontStyles.boldParagraphFont};

            @media speech {
                display: none;
            }
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
            border-bottom-width: 1px;
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
            <button><a data-text="${tab.label}">${tab.label}</a></button>
        </li>
    `;
}
