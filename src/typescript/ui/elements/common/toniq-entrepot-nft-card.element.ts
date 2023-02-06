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

export const EntrepotNftCardElement = defineToniqElement<NftCardInputs>()({
    tagName: 'toniq-entrepot-nft-card',
    hostClasses: {
        blockInteraction: false,
    },
    styles: ({hostClassSelectors, hostClassNames}) => css`
        :host {
            width: 384;
            max-width: 100%;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
            color: ${toniqColors.pagePrimary.foregroundColor};
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            ${toniqShadows.popupShadow}
            transition: ${interactionDuration};
            padding: 16px;
            cursor: pointer;
            border: 1px solid transparent;
        }

        :host(:hover) {
            border-color: purple;
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

        .image-overlay {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
        }
    `,
    renderCallback: ({inputs, state, updateState}) => {
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
                    })}
                ></${EntrepotNftDisplayElement}>
                <div class="image-overlay">
                    <slot name="image-overlay"></slot>
                </div>
            </div>
            <div class="footer-contents">
                <slot></slot>
            </div>
        `;
    },
});
