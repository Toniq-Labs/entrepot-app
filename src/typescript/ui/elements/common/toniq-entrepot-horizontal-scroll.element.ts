import {
    applyBackgroundAndForeground,
    ChevronDown24Icon,
    toniqColors,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {defineElement, html, css, assign, listen, onResize} from 'element-vir';
import {getScrollSnapPositions, scrollSnapToNext} from 'scroll-snap-api';
import {HTMLTemplateResult} from 'lit';
import {RequiredAndNotNullBy} from '@augment-vir/common';
import {throttle} from '../../../augments/function';
import {classMap} from 'lit/directives/class-map.js';

const maxCardHeight = 495;

export const EntrepotHorizontalScrollElement = defineElement<{
    children: HTMLTemplateResult;
    maxCardHeight?: number;
}>()({
    tagName: 'toniq-entrepot-horizontal-scroll',
    stateInit: {
        scrollPosition: {
            left: 0,
            right: Infinity,
        },
        scrollSnapPositions: [] as number[],
        scrollThrottle: false,
    },
    styles: css`
        :host {
            display: block;
            position: relative;
            overflow: visible;
        }

        .scroll-container {
            max-height: 495px;
            margin: 0 -16px;
            overflow-y: hidden;
        }

        .items-container {
            position: relative;
            display: flex;
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            z-index: 9;
            padding-bottom: 100px;
        }

        .arrow {
            --background-degrees: 90deg;
            position: absolute;
            width: 200px;
            max-width: 20%;
            top: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            z-index: 10;
        }

        .arrow.left {
            left: -20px;
            right: unset;
        }

        .arrow.right {
            justify-content: flex-end;
            --background-degrees: -90deg;
            left: unset;
            right: -29px;
        }

        .arrow.right::after {
            left: unset;
            right: 0;
        }

        .arrow ${ToniqIcon} {
            transition: 300ms;
            cursor: pointer;
            position: relative;
            z-index: 11;
            box-shadow: 0px 2px 28px rgba(0, 0, 0, 0.12);
            display: inline-flex;
            padding: 8px;
            border-radius: 50%;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)};
            border: 1px solid rgba(0, 208, 147, 0.16);
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .arrow.left ${ToniqIcon} {
            transform: rotate(90deg);
        }

        .arrow.right ${ToniqIcon} {
            transform: rotate(270deg);
        }

        .hidden {
            opacity: 0;
            pointer-events: none;
        }
    `,
    renderCallback: ({inputs, state, host, updateState}) => {
        const leftArrowHideZone = getMidSnapPosition(state.scrollSnapPositions, 0);
        const rightArrowHideZone = getMidSnapPosition(state.scrollSnapPositions, -1);

        return html`
			<div class="scroll-container" style="max-height: ${
                inputs.maxCardHeight ? `${inputs.maxCardHeight}px` : `${maxCardHeight}px`
            }">
				<div class="arrow left">
					<${ToniqIcon}
						class=${classMap({
                            hidden: state.scrollPosition.left <= (leftArrowHideZone ?? 100),
                        })}
						${assign(ToniqIcon, {
                            icon: ChevronDown24Icon,
                        })}
						${listen('click', () => {
                            scrollSnapToNext(getScrollContainer(host), 'left');
                        })}
					></${ToniqIcon}>
				</div>
				<div class="items-container" ${onResize(() => {
                    updateState({
                        scrollSnapPositions: getScrollSnapPositions(getScrollContainer(host)).x,
                    });
                })}
                class="images-container"
                ${listen('scroll', event => {
                    throttledUpdateScrollPosition(event.target as HTMLElement, updateState);
                })}>
					${inputs.children}
				</div>
				<div class="arrow right">
					<${ToniqIcon}
						class=${classMap({
                            hidden:
                                rightArrowHideZone == undefined
                                    ? state.scrollPosition.right <= 100
                                    : state.scrollPosition.left >= rightArrowHideZone,
                        })}
						${assign(ToniqIcon, {
                            icon: ChevronDown24Icon,
                        })}
						${listen('click', () => {
                            scrollSnapToNext(getScrollContainer(host), 'right');
                        })}
					></${ToniqIcon}>
				</div>
			</div>
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

function getScrollContainer(host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>) {
    const scrollContainer = host.shadowRoot.querySelector('.items-container');
    if (!(scrollContainer instanceof HTMLElement)) {
        throw new Error(`Failed to find scroll container.`);
    }
    return scrollContainer;
}

const throttledUpdateScrollPosition = throttle(
    250,
    (
        element: HTMLElement,
        updateState: (
            newState: Partial<(typeof EntrepotHorizontalScrollElement)['stateType']>,
        ) => void,
    ) => {
        updateState({
            scrollPosition: {
                left: element.scrollLeft,
                right: element.scrollWidth - element.scrollLeft - element.clientWidth,
            },
            scrollThrottle: false,
        });
    },
);
