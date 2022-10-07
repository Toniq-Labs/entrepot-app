import {classMap} from 'lit/directives/class-map.js';
import {
    applyBackgroundAndForeground,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {defineElement, html, css} from 'element-vir';
import {makeDropShadowCardStyles} from '../../../styles/drop-shadow-card.style';

export const entrepotHomePageTopCardHeaderElement = defineElement<{
    hasIndex: boolean;
    hasImage: boolean;
}>()({
    tagName: 'toniq-entrepot-home-page-top-card-header',
    styles: css`
        :host {
            ${toniqFontStyles.paragraphFont};
            ${applyBackgroundAndForeground(toniqColors.pageTertiary)};
            display: inline-flex;
            border-radius: 16px;
            align-items: stretch;
            padding: 0;
        }

        .index-number {
            border-right: 1px dashed transparent;

            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
            width: 44px;
            justify-content: center;
            flex-shrink: 0;
            display: flex;
            align-items: center;
        }

        .main-contents {
            padding: 12px;
            display: flex;
            flex-grow: 1;
            align-items: stretch;
            border-radius: inherit;
            margin-right: 32px;
        }

        .main-contents span {
            flex-shrink: 0;
            white-space: nowrap;
        }

        .main-contents.left-spacing {
            margin-left: 32px;
        }

        .collection-image {
            max-height: 100%;
            max-width: 100%;
            border-radius: 8px;
        }

        .collection-name {
            flex-grow: 3;
            flex-shrink: 1;
        }

        .floor-price {
            padding: 0 12px;
            margin-right: 32px;
        }

        .price {
            text-align: right;
            flex-basis: 90px;
        }
    `,
    renderCallback: ({inputs}) => {
        const indexTemplate = inputs.hasIndex
            ? html`
                  <span class="index-number">&nbsp;</span>
              `
            : '';

        return html`
            ${indexTemplate}
            <div
                class="main-contents ${classMap({
                    'left-spacing': !indexTemplate,
                })}"
            >
                <span class="collection-name">Collection</span>
                <span class="price floor-price">Floor Price</span>
                <span class="price">Volume</span>
            </div>
        `;
    },
});
