import {classMap} from 'lit/directives/class-map.js';
import {
    applyBackgroundAndForeground,
    toniqColors,
    toniqFontStyles,
    defineToniqElement,
} from '@toniq-labs/design-system';
import {html, css, assign} from 'element-vir';
import {makeDropShadowCardStyles} from '../../../styles/drop-shadow-card.style';
import {ValidIcp, toIcp} from '../../../../../data/icp';
import {decodeNftId} from '../../../../../data/nft/nft-id';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';

export type TopCardInputs = Readonly<(typeof EntrepotHomePageTopCardElement)['inputsType']>;

export const EntrepotHomePageTopCardElement = defineToniqElement<{
    collectionName: string;
    floorPrice: ValidIcp;
    volume: ValidIcp;
    id: string;
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
            border-right: 1px solid ${toniqColors.dividerFaint.foregroundColor};

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
            min-height: 72px;
            display: flex;
            flex-grow: 1;
            align-items: stretch;
            border-radius: inherit;
            ${toniqFontStyles.paragraphFont};
            margin-right: 32px;
            overflow: hidden;
        }

        .main-contents div {
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

        /* double selector to override ".main-contents div" */
        .collection-name.collection-name {
            ${toniqFontStyles.boldFont};
            flex-grow: 1;
            flex-shrink: 1;
            overflow: hidden;
        }

        .collection-name span {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .floor-price {
            padding: 0 12px;
            margin-right: 20px;
        }

        .price {
            ${toniqFontStyles.monospaceFont};
            flex-basis: 90px;
            display: flex;
            justify-content: flex-end;
            font-size: 17px;
        }
    `,
    renderCallback: ({inputs}) => {
        const indexTemplate =
            inputs.index == undefined
                ? ''
                : html`
                      <span class="index-number">${inputs.index}</span>
                  `;
        let {index, canister} = decodeNftId(inputs.id);
        const imageTemplate =
            canister == undefined
                ? ''
                : html`
                      <div class="image-wrapper">
                        <${EntrepotNftDisplayElement}
                            ${assign(EntrepotNftDisplayElement, {
                                collectionId: canister,
                                fullSize: false,
                                cachePriority: 0,
                                nftId: inputs.id,
                                nftIndex: index,
                                ref: 0,
                                min: {width: 72, height: 72},
                                max: {width: 72, height: 72},
                            })}
                        ></${EntrepotNftDisplayElement}>
                      </div>
                  `;

        const displayFloorPrice = `${toIcp(inputs.floorPrice)} ICP`;
        const displayVolume = `${toIcp(inputs.volume)} ICP`;

        return html`
            ${indexTemplate}
            <div
                class="main-contents ${classMap({
                    'left-spacing': !indexTemplate,
                })}"
            >
                ${imageTemplate}
                <div class="collection-name">
                    <span>${inputs.collectionName}</span>
                </div>
                <div class="price floor-price">
                    <span>${displayFloorPrice}</span>
                </div>
                <div class="price">
                    <span>${displayVolume}</span>
                </div>
            </div>
        `;
    },
});
