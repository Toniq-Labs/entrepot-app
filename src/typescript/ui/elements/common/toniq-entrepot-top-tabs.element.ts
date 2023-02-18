import {listen, defineElementEvent, html, css} from 'element-vir';
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
    tabs?: ReadonlyArray<TopTab>;
    selected?: Readonly<TopTab>;
}>()({
    tagName: 'toniq-entrepot-top-tabs',
    styles: css`
        :host {
            display: flex;
            ${toniqFontStyles.paragraphFont};
            position: relative;
        }

        :host::after {
            position: absolute;
            content: '';
            bottom: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px solid ${toniqColors.divider.foregroundColor};
            z-index: 0;
        }

        button {
            ${removeNativeFormStyles};
            padding: 12px;
            position: relative;
            outline: none;
            padding: 6px;
        }

        button:focus {
            outline: 0;
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
            gap: 16px;
            flex-grow: 1;
            overflow-x: auto;
        }

        ${createFocusStyles({
            mainSelector: 'button:focus:focus-visible:not(:active)',
            elementBorderSize: 0,
            outlineGap: 0,
        })}

        ul {
            margin: 0;
            padding: 0;
        }

        li.selected {
            ${toniqFontStyles.boldParagraphFont};
            color: ${toniqColors.pageInteraction.foregroundColor};
            border-bottom: 2px solid ${toniqColors.pageInteraction.foregroundColor};
            pointer-events: none;
            z-index: 1;
        }

        li.selected > button > .title-preloader {
            background-color: ${toniqColors.pageInteraction.foregroundColor};
            opacity: 0.6;
        }

        li {
            margin: 0;
            padding: 6px 6px 10px;
            white-space: nowrap;
        }

        li:last-of-type {
            flex-grow: 1;
        }

        .title-preloader {
            display: block;
            height: 24px;
            width: 90px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }
    `,
    events: {
        tabChange: defineElementEvent<TopTab>(),
    },
    renderCallback: ({inputs, dispatch, events}) => {
        const preloader = new Array(Math.floor(Math.random() * (4 - 3) + 3)).fill(0);

        return html`
            ${inputs.tabs
                ? html`
                      <ul>
                          ${inputs.tabs.map(tab =>
                              makeTopTab(tab, tab.label === inputs.selected?.label, () => {
                                  dispatch(new events.tabChange(tab));
                              }),
                          )}
                          <li class="take up remaining space"></li>
                      </ul>
                  `
                : html`
                      <ul>
                          ${preloader.map((preloaderTab, preloaderTabIndex) =>
                              makeTopTab(preloaderTab, preloaderTabIndex === 0, () => {}, true),
                          )}
                          <li class="take up remaining space"></li>
                      </ul>
                  `}
        `;
    },
});

function makeTopTab(
    tab: TopTab,
    isSelected: boolean,
    clickCallback: () => void,
    preloader: boolean = false,
) {
    return html`
        <li
            class=${classMap({
                selected: isSelected,
            })}
            ${listen('click', clickCallback)}
        >
            ${preloader
                ? html`
                      <button><a class="title-preloader"></a></button>
                  `
                : html`
                      <button><a data-text=${tab.label}>${tab.label}</a></button>
                  `}
        </li>
    `;
}
