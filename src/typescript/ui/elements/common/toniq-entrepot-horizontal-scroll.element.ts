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

const maxCardHeight = 510;

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
    },
    styles: css`
        :host {
            display: block;
            position: relative;
            overflow: visible;
        }

        .scroll-container {
            max-height: 495px;
            margin: 0 -22px;
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
            height: 42px;
            top: 0;
            bottom: 0;
            left: 0;
            margin: auto 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            z-index: 10;
        }

        .arrow.left {
            left: -24px;
            right: unset;
        }

        .arrow.right {
            justify-content: flex-end;
            --background-degrees: -90deg;
            left: unset;
            right: -24px;
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
        return html`
			<div
                class="scroll-container"
                style="max-height: ${
                    inputs.maxCardHeight ? `${inputs.maxCardHeight}px` : `${maxCardHeight}px`
                }"
            >
				<div class="arrow left">
					<${ToniqIcon}
						class=${classMap({
                            hidden: state.scrollPosition.left <= 100,
                        })}
						${assign(ToniqIcon, {
                            icon: ChevronDown24Icon,
                        })}
						${listen('click', () => {
                            rotateCarousel({
                                direction: 'left',
                                host,
                            });
                        })}
					></${ToniqIcon}>
				</div>
				<div
                    class="items-container"
                    ${onResize(event => {
                        updateState({
                            scrollSnapPositions: getScrollSnapPositions(getScrollContainer(host)).x,
                        });
                        throttledUpdateScrollPosition(event.target as HTMLElement, updateState);
                    })}
                    ${listen('scroll', event => {
                        throttledUpdateScrollPosition(event.target as HTMLElement, updateState);
                    })}
                >
					${inputs.children}
				</div>
				<div class="arrow right">
					<${ToniqIcon}
						class=${classMap({
                            hidden: state.scrollPosition.right <= 100,
                        })}
						${assign(ToniqIcon, {
                            icon: ChevronDown24Icon,
                        })}
						${listen('click', () => {
                            rotateCarousel({
                                direction: 'right',
                                host,
                            });
                        })}
					></${ToniqIcon}>
				</div>
			</div>
        `;
    },
});

function getScrollContainer(host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>) {
    const scrollContainer = host.shadowRoot.querySelector('.items-container');
    if (!(scrollContainer instanceof HTMLElement)) {
        throw new Error(`Failed to find scroll container.`);
    }
    return scrollContainer;
}

function rotateCarousel({
    host,
    direction,
}: {
    host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>;
    direction: 'left' | 'right';
}) {
    const scrollContainer = getScrollContainer(host);
    const snapPositions = getScrollSnapPositions(getScrollContainer(host)).x;

    const currentPosition = getSnapPositionClosestTo(scrollContainer.scrollLeft, snapPositions);
    const directionFactor = direction === 'right' ? 1 : -1;
    const nextPosition = getSnapPositionClosestTo(
        (currentPosition || 0) + (scrollContainer.clientWidth - 304) * directionFactor,
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
        updateState: (
            newState: Partial<(typeof EntrepotHorizontalScrollElement)['stateType']>,
        ) => void,
    ) => {
        updateState({
            scrollPosition: {
                left: element.scrollLeft,
                right: element.scrollWidth - element.scrollLeft - element.clientWidth,
            },
        });
    },
);
