import {listen, defineElementEvent, html, css, assign, renderIf, onResize} from 'element-vir';
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
import {makeDropShadowCardStyles} from '../../../../styles/drop-shadow-card.style';
import {scrollSnapToNext, getScrollSnapPositions} from 'scroll-snap-api';
import {RequiredAndNotNullBy} from '@augment-vir/common';
import {throttle} from '../../../../../../augments/function';
import {EntrepotCarouselElement} from '../../../../common/toniq-entrepot-carousel.element';
import {ifDefined} from 'lit/directives/if-defined.js';

export type PricingTab<ValueGeneric = unknown> = {
    label: string;
    value: ValueGeneric;
};

const carouselImageWidth = 340;

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
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
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

        ${makeDropShadowCardStyles('.more-pricing', false)}

        .more-pricing {
            max-height: 32px;
            display: inline-flex;
            align-items: center;
            ${toniqFontStyles.boldFont};
            font-size: 14px;
            line-height: 20px;
            padding: 4px 6px;
            gap: 4px;
            margin-right: 12px;
            border-radius: 8px;
            position: absolute;
            right: 0;
            margin: 0;
            z-index: 100;
        }

        .more-pricing > button {
            padding: 0;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .more-pricing > button:disabled {
            color: rgba(0, 0, 0, 0.08);
            pointer-events: none;
        }

        .more-pricing-divider {
            width: 1px;
            height: 12px;
            background-color: rgba(0, 0, 0, 0.08);
        }
    `,
    stateInit: {
        scrollPosition: {
            left: 0,
            right: Infinity,
        },
        scrollSnapPositions: [] as number[],
    },
    events: {
        tabChange: defineElementEvent<PricingTab>(),
    },
    initCallback: ({inputs, events, dispatch}) => {
        dispatch(new events.tabChange(inputs.selected as PricingTab));
    },
    renderCallback: ({host, inputs, state, updateState, dispatch, events}) => {
        const preloader = new Array(Math.floor(Math.random() * (4 - 3) + 3)).fill(0);
        const leftArrowDisabled = getMidSnapPosition(state.scrollSnapPositions, 0);
        const rightArrowDisabled = getMidSnapPosition(state.scrollSnapPositions, -1);

        const isPricingTabsScrollable = () => {
            const pricingTabEl = host.shadowRoot.querySelector('ul');
            if (pricingTabEl && pricingTabEl.scrollWidth > pricingTabEl.clientWidth) return true;
            return false;
        };

        return html`
            ${inputs.tabs
                ? html`
                      <ul
                          ${onResize(() => {
                              updateState({
                                  scrollSnapPositions: getScrollSnapPositions(
                                      host.shadowRoot.querySelector('ul')!,
                                  ).x,
                              });
                          })}
                          ${listen('scroll', event => {
                              throttledUpdateScrollPosition(
                                  event.target as HTMLElement,
                                  updateState,
                              );
                          })}
                      >
                          ${repeat(
                              inputs.tabs,
                              tab => tab.value,
                              tab =>
                                  makePricingTab(tab, tab.label === inputs.selected?.label, () => {
                                      dispatch(new events.tabChange(tab));
                                  }),
                          )}
                          <li class="tab-filler"></li>
                          ${renderIf(
                              isPricingTabsScrollable(),
                              html`
                                <li class="more-pricing">
                                    <button disabled=${ifDefined(
                                        state.scrollPosition.left <= (leftArrowDisabled ?? 100)
                                            ? 'disabled'
                                            : undefined,
                                    )}>
                                        <${ToniqIcon}
                                            ${assign(ToniqIcon, {
                                                icon: ChevronDown24Icon,
                                            })}
                                            style="transform: rotate(90deg);"
                                            ${listen('click', () => {
                                                scrollTab({
                                                    host,
                                                    direction: 'left',
                                                });
                                            })}
                                        ></${ToniqIcon}>
                                    </button>
                                    <div class="more-pricing-divider"></div>
                                    <button disabled=${ifDefined(
                                        rightArrowDisabled == undefined
                                            ? state.scrollPosition.right <= 100
                                                ? 'disabled'
                                                : undefined
                                            : state.scrollPosition.left >= rightArrowDisabled
                                            ? 'disabled'
                                            : undefined,
                                    )}>
                                        <${ToniqIcon}
                                            ${assign(ToniqIcon, {
                                                icon: ChevronDown24Icon,
                                            })}
                                            style="transform: rotate(270deg);"
                                            ${listen('click', () => {
                                                scrollTab({
                                                    host,
                                                    direction: 'right',
                                                });
                                            })}
                                        ></${ToniqIcon}>
                                        </button>
                                    </button>
                                </li>
                            `,
                          )}
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

function getMidSnapPosition(positions: number[], positionToRead: number): number | undefined {
    const increment = positionToRead >= 0 ? 1 : -1;
    const indexToRead: number =
        positionToRead < 0 ? positions.length + positionToRead : positionToRead;
    const nextIndex = indexToRead + increment;

    const start = positions[indexToRead];
    const end = positions[nextIndex];

    if (start == undefined || end == undefined) {
        return undefined;
    }

    return (start + end) / 2 + increment * 20;
}

function scrollTab({
    host,
    direction,
}: {
    host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>;
    direction: 'left' | 'right';
}) {
    const scrollContainer = host.shadowRoot.querySelector('ul')!;
    const snapPositions = getScrollSnapPositions(host.shadowRoot.querySelector('ul')!).x;

    const currentPosition = getSnapPositionClosestTo(scrollContainer.scrollLeft, snapPositions);
    const directionFactor = direction === 'right' ? 1 : -1;
    const nextPosition = getSnapPositionClosestTo(
        (currentPosition || 0) +
            (scrollContainer.clientWidth - carouselImageWidth) * directionFactor,
        snapPositions,
    );

    if (direction === 'right' && nextPosition > currentPosition) {
        scrollContainer.scrollTo({behavior: 'smooth', left: nextPosition});
    } else if (direction === 'left' && nextPosition < currentPosition) {
        scrollContainer.scrollTo({behavior: 'smooth', left: nextPosition});
    } else {
        scrollSnapToNext(scrollContainer, direction);
    }
}

function getSnapPositionClosestTo(
    closestToThis: number,
    snapPositions: ReadonlyArray<number>,
): number {
    const closestPosition = snapPositions.reduce((closest, position) => {
        const positionDistance = Math.abs(closestToThis - position);
        const closestDistance = Math.abs(closestToThis - closest);
        if (positionDistance < closestDistance) {
            return position;
        } else {
            return closest;
        }
    }, Infinity);

    return closestPosition;
}

const throttledUpdateScrollPosition = throttle(
    250,
    (
        element: HTMLElement,
        updateState: (newState: Partial<(typeof EntrepotCarouselElement)['stateType']>) => void,
    ) => {
        updateState({
            scrollPosition: {
                left: element.scrollLeft,
                right: element.scrollWidth - element.scrollLeft - element.clientWidth,
            },
        });
    },
);

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
