import {assign, css, html} from 'element-vir';
import {
    applyBackgroundAndForeground,
    defineToniqElement,
    interactionDuration,
    toniqColors,
    toniqShadows,
} from '@toniq-labs/design-system';
import {NftListing} from '../../../data/nft/nft-listing';
import {EntrepotNftDisplayElement} from './toniq-entrepot-nft-display.element';
import {BaseNft} from '../../../data/nft/base-nft';

export type NftCardInputs = {
    nft: Pick<BaseNft & NftListing, 'collectionId' | 'nftId' | 'nftIndex'>;
};

export const EntrepotNftListItemElement = defineToniqElement<NftCardInputs>()({
    tagName: 'toniq-entrepot-nft-list-item',
    hostClasses: {
        blockInteraction: false,
    },
    styles: ({hostClassSelectors, hostClassNames}) => css`
        :host {
            max-height: 64px;
            max-width: 100%;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
            color: ${toniqColors.pagePrimary.foregroundColor};
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            ${toniqShadows.popupShadow}
            transition: ${interactionDuration};
            padding: 16px;
            cursor: pointer;
            border: 1px solid transparent;
        }

        :host(:hover) {
            border-color: ${toniqColors.pageInteraction.foregroundColor};
        }

        ${hostClassSelectors.blockInteraction} {
            cursor: auto;
        }

        :host(.${hostClassNames.blockInteraction}:hover) {
            border-color: transparent;
        }

        .image-wrapper {
            position: relative;
        }

        .other-contents {
            display: flex;
            flex-grow: 1;
            align-items: stretch;
        }
    `,
    renderCallback: ({inputs}) => {
        return html`
            <div class="image-wrapper">
                <${EntrepotNftDisplayElement}
                    ${assign(EntrepotNftDisplayElement, {
                        collectionId: inputs.nft.collectionId,
                        fullSize: false,
                        cachePriority: 0,
                        nftId: inputs.nft.nftId,
                        nftIndex: inputs.nft.nftIndex,
                        ref: 0,
                        max: {
                            width: 64,
                            height: 64,
                        },
                        min: {
                            width: 64,
                            height: 64,
                        },
                    })}
                ></${EntrepotNftDisplayElement}>
            </div>
            <div class="other-contents">
                <slot></slot>
            </div>
        `;
    },
});
