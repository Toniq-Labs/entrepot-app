import {classMap} from 'lit/directives/class-map.js';
import {
    applyBackgroundAndForeground,
    toniqColors,
    toniqFontStyles,
    toniqShadows,
} from '@toniq-labs/design-system';
import {defineElement, html, css} from 'element-vir';
import {makeDropShadowCardStyles} from '../../styles/drop-shadow-card.style';

export const entrepotHomePageTopCard = defineElement<{
    imageUrl?: string | undefined;
    collectionName: string;
    floorPrice: number;
    volume: number;
    index?: number | undefined;
}>()({
    tagName: 'toniq-entrepot-home-page-top-card',
    styles: css`
        ${makeDropShadowCardStyles(':host')}

        :host {
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)};
            display: inline-flex;
            border-radius: 16px;
            align-items: stretch;
            padding: 0;
        }

        .index-number {
            ${toniqFontStyles.h3Font};
            ${applyBackgroundAndForeground(toniqColors.pageInteraction)};
            border-right: 1px solid ${toniqColors.divider.foregroundColor};

            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
            width: 44px;
            justify-content: center;
            display: flex;
            align-items: center;
        }

        .main-contents {
            padding: 12px;
            min-height: 72px;
            display: flex;
            flex-grow: 1;
            align-items: stretch;
            border-radius: inherit;
            ${toniqFontStyles.paragraphFont};
            margin-right: 32px;
        }

        .main-contents span {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            white-space: nowrap;
        }

        .main-contents.left-spacing {
            margin-left: 32px;
        }

        .image-wrapper {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 72px;
            width: 72px;
            position: relative;
            margin-right: 12px;
        }

        .collection-image {
            max-height: 100%;
            max-width: 100%;
            border-radius: 8px;
        }

        .collection-name {
            ${toniqFontStyles.boldFont};
            flex-grow: 3;
        }

        .floor-price {
            flex-grow: 1;
            padding: 0 12px;
        }
    `,
    renderCallback: ({inputs}) => {
        const indexTemplate =
            inputs.index == undefined
                ? ''
                : html`
                      <span class="index-number">${inputs.index}</span>
                  `;

        const imageTemplate =
            inputs.imageUrl == undefined
                ? ''
                : html`
                      <div class="image-wrapper">
                          <img class="collection-image" src=${inputs.imageUrl} />
                      </div>
                  `;

        const displayFloorPrice = `${inputs.floorPrice} ICP`;
        const displayVolume = `${inputs.volume} ICP`;

        return html`
            ${indexTemplate}
            <div
                class="main-contents ${classMap({
                    'left-spacing': !indexTemplate,
                })}"
            >
                ${imageTemplate}
                <span class="collection-name">${inputs.collectionName}</span>
                <span class="floor-price">${displayFloorPrice}</span>
                <span>${displayVolume}</span>
            </div>
        `;
    },
});
