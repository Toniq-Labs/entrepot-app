import {RequiredAndNotNullBy} from 'augment-vir';
import {scrollSnapToNext, ScrollDirection} from 'scroll-snap-api';
import {classMap} from 'lit/directives/class-map.js';
import {
    applyBackgroundAndForeground,
    ArrowLeft24Icon,
    ArrowRight24Icon,
    toniqColors,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {defineElement, html, css, assign, listen} from 'element-vir';

export type CarouselItem = {
    imageUrl: string;
    link: string;
};

const carouselEdgeBuffer = 0;

export const entrepotCarousel = defineElement<{
    items: CarouselItem[];
}>()({
    tagName: 'toniq-entrepot-carousel',
    stateInit: {
        scrollPosition: {
            left: 0,
            right: Infinity,
        },
        scrollThrottle: false,
    },
    styles: css`
        :host {
            display: flex;
            position: relative;
            padding: 32px 0;
        }

        .carousel-image-wrapper {
            height: 340px;
            width: 340px;
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
        }

        .arrow {
            --background-degrees: 90deg;
            position: sticky;
            height: 100%;
            /* zero width here so that it does not take up space that pushes the thumbnails */
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
    renderCallback: ({inputs, state, updateState, host}) => {
        return html`
            <div
                data-query-id="scrolling-container"
                class="images-container"
                ${listen('scroll', event => {
                    const element = event.target as HTMLElement;
                    if (!state.scrollThrottle) {
                        setTimeout(() => {
                            updateState({
                                scrollPosition: {
                                    left: element.scrollLeft,
                                    right:
                                        element.scrollWidth -
                                        element.scrollLeft -
                                        element.clientWidth,
                                },
                                scrollThrottle: false,
                            });
                        }, 100);
                        updateState({
                            scrollThrottle: true,
                        });
                    }
                })}
            >
                <div class="arrow left">
                    <${ToniqIcon}
                        class=${classMap({
                            hidden: state.scrollPosition.left <= carouselEdgeBuffer,
                        })}
                        ${assign(ToniqIcon, {
                            icon: ArrowLeft24Icon,
                        })}
                        ${listen('click', () => {
                            updateScrollPosition(host, 'left');
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
                            hidden: state.scrollPosition.right <= carouselEdgeBuffer,
                        })}
                        ${assign(ToniqIcon, {
                            icon: ArrowRight24Icon,
                        })}
                        ${listen('click', () => {
                            updateScrollPosition(host, 'right');
                        })}
                    ></${ToniqIcon}>
                </div>
            </div>
        `;
    },
});

function updateScrollPosition(
    host: RequiredAndNotNullBy<HTMLElement, 'shadowRoot'>,
    direction: ScrollDirection,
) {
    const scrollContainer = host.shadowRoot.querySelector('[data-query-id="scrolling-container"]');
    if (!(scrollContainer instanceof HTMLElement)) {
        throw new Error(`Failed to find scroll container.`);
    }
    scrollSnapToNext(scrollContainer, direction);
}
