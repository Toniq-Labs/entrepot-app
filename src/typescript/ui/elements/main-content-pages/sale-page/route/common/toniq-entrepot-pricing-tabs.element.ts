import {listen, defineElementEvent, html, css, assign} from 'element-vir';
import {classMap} from 'lit/directives/class-map.js';
import {
    toniqFontStyles,
    toniqColors,
    createFocusStyles,
    removeNativeFormStyles,
    defineToniqElement,
    ToniqIcon,
    ChevronDown24Icon,
} from '@toniq-labs/design-system';
import {repeat} from 'lit/directives/repeat.js';

export type PricingTab<ValueGeneric = unknown> = {
    label: string;
    value: ValueGeneric;
};

export const EntrepotPricingTabsElement = defineToniqElement<{
    tabs?: ReadonlyArray<PricingTab>;
    selected?: Readonly<PricingTab>;
}>()({
    tagName: 'toniq-entrepot-pricing-tabs',
    styles: css`
        :host {
            display: flex;
            ${toniqFontStyles.monospaceFont};
            font-size: 14px;
            line-height: 20px;
            position: relative;
            color: ${toniqColors.pagePrimary.foregroundColor};
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
            font-size: 14px;
            line-height: 20px;

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
            ${toniqFontStyles.boldFont};
            font-size: 14px;
            line-height: 20px;
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

        li.tab-filler {
            flex-grow: 1;
        }

        .title-preloader {
            display: block;
            height: 24px;
            width: 90px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }

        .more-pricing {
            display: inline-flex;
            align-items: center;
            ${toniqFontStyles.boldFont};
            font-size: 14px;
            line-height: 20px;
            color: ${toniqColors.pageInteraction.foregroundColor};
            pointer-events: none;
            z-index: 1;
        }
    `,
    events: {
        tabChange: defineElementEvent<PricingTab>(),
    },
    initCallback: ({inputs, events, dispatch}) => {
        dispatch(new events.tabChange(inputs.selected as PricingTab));
    },
    renderCallback: ({inputs, dispatch, events}) => {
        const preloader = new Array(Math.floor(Math.random() * (4 - 3) + 3)).fill(0);

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
                          <li class="more-pricing">
                              <button><a data-text="more-pricing">More Pricing</a></button>
                              <button>
								<${ToniqIcon}
									${assign(ToniqIcon, {
                                        icon: ChevronDown24Icon,
                                    })}
									style="transform: rotate(90deg);"
								></${ToniqIcon}>
								</button>
                              <button>
							 	<${ToniqIcon}
									${assign(ToniqIcon, {
                                        icon: ChevronDown24Icon,
                                    })}
									style="transform: rotate(270deg);"
								></${ToniqIcon}>
								</button>
							  </button>
                          </li>
                      </ul>
                  `
                : html`
                      <ul>
                          ${repeat(
                              preloader,
                              preloaderTab => preloaderTab,
                              (preloaderTab, preloaderTabIndex) =>
                                  makePricingTab(
                                      preloaderTab,
                                      preloaderTabIndex === 0,
                                      () => {},
                                      true,
                                  ),
                          )}
                          <li class="tab-filler"></li>
                      </ul>
                  `}
        `;
    },
});

function makePricingTab(
    tab: PricingTab,
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