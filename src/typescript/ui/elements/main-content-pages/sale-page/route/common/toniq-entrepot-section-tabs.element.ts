import {html, css, listen, defineElementEvent} from 'element-vir';
import {
    createFocusStyles,
    defineToniqElement,
    removeNativeFormStyles,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {repeat} from 'lit/directives/repeat.js';
import {classMap} from 'lit/directives/class-map.js';

export type SectionTab<ValueGeneric = unknown> = {
    label: string;
    value: ValueGeneric;
};

export const EntrepotSectionTabsElement = defineToniqElement<{
    tabs?: ReadonlyArray<SectionTab>;
    selected?: Readonly<SectionTab>;
}>()({
    tagName: 'toniq-entrepot-section-tabs',
    styles: css`
        :host {
            display: flex;
            ${toniqFontStyles.monospaceFont};
            font-size: 36px;
            line-height: 48px;
            position: relative;
            color: ${toniqColors.pagePrimary.foregroundColor};
            overflow-y: hidden;
            max-height: 72px;
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
            ${toniqFontStyles.boldFont};
            font-size: 36px;
            line-height: 48px;

            @media speech {
                display: none;
            }
        }

        ul {
            list-style: none;
            display: flex;
            gap: 48px;
            flex-grow: 1;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 100px;
            margin: 0;
            overflow-x: scroll;
            margin-left: -40px;
        }

        ${createFocusStyles({
            mainSelector: 'button:focus:focus-visible:not(:active)',
            elementBorderSize: 0,
            outlineGap: 0,
        })}

        li.selected {
            ${toniqFontStyles.boldFont};
            color: ${toniqColors.pageInteraction.foregroundColor};
            border-bottom: 2px solid ${toniqColors.pageInteraction.foregroundColor};
            pointer-events: none;
            z-index: 1;
            padding-bottom: 64px;
        }

        li.selected > button > .title-preloader {
            background-color: ${toniqColors.pageInteraction.foregroundColor};
            opacity: 0.6;
        }

        li {
            ${toniqFontStyles.toniqFont};
            ${toniqFontStyles.boldFont}
            margin: 0;
            padding: 6px 6px 10px;
            white-space: nowrap;
            cursor: pointer;
            scroll-snap-align: start;
        }

        li.tab-filler {
            flex-grow: 1;
            cursor: auto;
        }

        .title-preloader {
            display: block;
            height: 24px;
            width: 90px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }

        @media (max-width: 600px) {
            :host {
                font-size: 32px;
            }

            ul {
                gap: 0px;
            }
        }
    `,
    stateInit: {},
    events: {
        tabChange: defineElementEvent<SectionTab>(),
    },
    renderCallback: ({inputs, events, dispatch}) => {
        return html`
            ${inputs.tabs
                ? html`
                      <ul>
                          ${repeat(
                              inputs.tabs,
                              tab => tab.value,
                              tab =>
                                  makePricingTab(tab, tab.label === inputs.selected?.label, () => {
                                      dispatch(new events.tabChange(tab));
                                  }),
                          )}
                          <li class="tab-filler"></li>
                      </ul>
                  `
                : ''}
        `;
    },
});

function makePricingTab(
    tab: SectionTab,
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
