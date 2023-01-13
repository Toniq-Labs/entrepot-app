import {RequiredAndNotNullBy} from '@augment-vir/common';
import {scrollSnapToNext, getScrollSnapPositions} from 'scroll-snap-api';
import {classMap} from 'lit/directives/class-map.js';
import {
    applyBackgroundAndForeground,
    ArrowLeft24Icon,
    ArrowRight24Icon,
    toniqColors,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {defineElement, html, css, assign, listen, onResize} from 'element-vir';
import {throttle} from '../../../augments/function';

export type CarouselItem = {
    imageUrl: string;
    link: string;
};

const carouselImageWidth = 340;

export const EntrepotCarouselElement = defineElement<{
    items: ReadonlyArray<CarouselItem>;
    automaticRotation?: boolean;
}>()({
    tagName: 'toniq-entrepot-carousel',
    stateInit: {
        scrollPosition: {
            left: 0,
            right: Infinity,
        },
        scrollSnapPositions: [] as number[],
        scrollThrottle: false,
        rotationIntervalId: undefined as undefined | number,
        enableRotation: true,
    },
    styles: css`
        :host {
            display: block;
            position: relative;
            margin: 32px 0;
            max-height: 340px;
            overflow-y: hidden;
        }

        .carousel-image-wrapper {
            height: 340px;
            width: ${carouselImageWidth}px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            scroll-snap-align: center;
        }

        img {
            max-height: 100%;
            max-width: 100%;
            border-radius: 16px;
        }

        .images-container {
            position: relative;
            display: flex;
            gap: 24px;
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            z-index: 9;
            padding-bottom: 100px;
        }

        .arrow {
            --background-degrees: 90deg;
            position: sticky;
            width: 200px;
            max-width: 20%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            z-index: 10;
            background: linear-gradient(
                var(--background-degrees),
                white 0%,
                rgba(255, 255, 255, 0.6) 30%,
                rgba(255, 255, 255, 0) 100%
            );
        }

        .arrow.right {
            justify-content: flex-end;
            --background-degrees: -90deg;
            left: unset;
            right: 0;
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
            margin: 40px;
            box-shadow: 0px 2px 28px rgba(0, 0, 0, 0.12);
            display: inline-flex;
            padding: 8px;
            border-radius: 50%;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)};
        }

        .hidden {
            opacity: 0;
            pointer-events: none;
        }
    `,
    cleanupCallback: ({state}) => {
        window.clearInterval(state.rotationIntervalId);
    },
    renderCallback: ({inputs, state, updateState, host}) => {
        if (inputs.automaticRotation && state.rotationIntervalId == undefined) {
            updateState({
                rotationIntervalId: window.setInterval(() => {
                    rotateCarousel({
                        host,
                        direction: 'right',
                        allowWrapping: true,
                        blockIfHovering: true,
                    });
                }, 4000),
            });
        } else if (!inputs.automaticRotation && state.rotationIntervalId != undefined) {
            window.clearInterval(state.rotationIntervalId);
            updateState({
                rotationIntervalId: undefined,
            });
        }
        const leftArrowHideZone = getMidSnapPosition(state.scrollSnapPositions, 0);
        const rightArrowHideZone = getMidSnapPosition(state.scrollSnapPositions, -1);

        return html`
            <div
                ${onResize(() => {
                    updateState({
                        scrollSnapPositions: getScrollSnapPositions(getScrollContainer(host)).x,
                    });
                })}
                class="images-container"
                ${listen('scroll', event => {
                    throttledUpdateScrollPosition(event.target as HTMLElement, updateState);
                })}
            >
                <div class="arrow left">
                    <${ToniqIcon}
                        class=${classMap({
                            hidden: state.scrollPosition.left <= (leftArrowHideZone ?? 100),
                        })}
                        ${assign(ToniqIcon, {
                            icon: ArrowLeft24Icon,
                        })}
                        ${listen('click', () => {
                            rotateCarousel({
                                allowWrapping: false,
                                blockIfHovering: false,
                                direction: 'left',
                                host,
                            });
                        })}
                    ></${ToniqIcon}>
                </div>
                ${inputs.items.map(item => {
                    return html`
                        <a href="${item.link}">
                            <div class="carousel-image-wrapper">
                                <img src=${item.imageUrl} />
                            </div>
                        </a>
                    `;
                })}
                <div class="arrow right">
                    <${ToniqIcon}
                        class=${classMap({
                            hidden:
                                rightArrowHideZone == undefined
                                    ? state.scrollPosition.right <= 100
                                    : state.scrollPosition.left >= rightArrowHideZone,
                        })}
                        ${assign(ToniqIcon, {
                            icon: ArrowRight24Icon,
                        })}
                        ${listen('click', () => {
                            rotateCarousel({
                                allowWrapping: false,
                                blockIfHovering: false,
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
    const scrollContainer = host.shadowRoot.querySelector('.images-container');
    if (!(scrollContainer instanceof HTMLElement)) {
        throw new Error(`Failed to find scroll container.`);
    }
    return scrollContainer;
}

function rotateCarousel({
    host,
    direction,
    allowWrapping,
    blockIfHovering,
}: {
    host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>;
    direction: 'left' | 'right';
    allowWrapping: boolean;
    blockIfHovering: boolean;
}) {
    // don't rotate if the user is mousing over the carousel
    if (blockIfHovering && host.matches(':hover')) {
        return;
    }

    const scrollContainer = getScrollContainer(host);
    const containerWidth = scrollContainer.clientWidth;
    const snapPositions = getScrollSnapPositions(getScrollContainer(host)).x;
    const firstScrollPosition = snapPositions[0] ?? 0;
    const lastScrollPosition = snapPositions.slice(-1).pop() ?? containerWidth;

    if (
        direction === 'right' &&
        scrollContainer.scrollLeft >=
            lastScrollPosition -
                // small buffer
                10
    ) {
        if (allowWrapping) {
            scrollContainer.scrollTo({
                behavior: 'smooth',
                left: firstScrollPosition,
            });
        }
    } else if (
        direction === 'left' &&
        scrollContainer.scrollLeft <=
            firstScrollPosition +
                // small buffer
                10
    ) {
        if (allowWrapping) {
            scrollContainer.scrollTo({
                behavior: 'smooth',
                left: lastScrollPosition,
            });
        }
    } else {
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
            scrollThrottle: false,
        });
    },
);
