import {defineElement, html, css, listen, defineElementEvent} from 'element-vir';
import {makeDropShadowCardStyles} from '../styles/drop-shadow-card.style';
import {classMap} from 'lit/directives/class-map.js';
import {toniqColors} from '@toniq-labs/design-system';

export const EntrepotFlipCardElement = defineElement<{flipped: boolean}>()({
    tagName: 'toniq-entrepot-flip-card',
    events: {
        flipChange: defineElementEvent<boolean>(),
    },
    styles: css`
        :host {
            display: inline-block;
            perspective: 1200px;
            position: relative;
            border-radius: 16px;
            box-sizing: border-box;
        }

        * {
            border-radius: inherit;
            box-sizing: border-box;
        }

        .flip-wrapper {
            height: 100%;
            width: 100%;
            position: relative;
            transition: transform 600ms;
            transform-style: preserve-3d;
            will-change: transform;
        }

        .flip-wrapper.flipped {
            transform: rotateY(180deg);
        }

        ${makeDropShadowCardStyles('.card-face', false)}

        .card-face {
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            padding: 0;
            overflow: hidden;
            backface-visibility: hidden;
            background-color: ${toniqColors.pagePrimary.backgroundColor};
        }

        .card-face.back {
            position: absolute;
            transform: rotateY(180deg);
        }
    `,
    renderCallback: ({inputs, dispatch, events}) => {
        return html`
            <div
                class="flip-wrapper ${classMap({flipped: inputs.flipped})}"
                ${listen('click', () => {
                    dispatch(new events.flipChange(!inputs.flipped));
                })}
            >
                <div class="card-face front"><slot name="front"></slot></div>
                <div class="card-face back"><slot name="back"></slot></div>
            </div>
        `;
    },
});
