import {assign, css, html} from 'element-vir';
import {
    applyBackgroundAndForeground,
    defineToniqElement,
    toniqColors,
    toniqShadows,
} from '@toniq-labs/design-system';
import {UserNft} from '../../../data/nft/user-nft';
import {NftExtraData} from '../../../data/nft/nft-extra-data';
import {EntrepotNftDisplayElement} from './toniq-entrepot-nft-display.element';

export type NftCardInputs = {
    nft: Pick<UserNft & NftExtraData, 'collectionId' | 'nftId' | 'nftIndex'>;
};

export const EntrepotNftCardElement = defineToniqElement<NftCardInputs>()({
    tagName: 'toniq-entrepot-nft-card',
    styles: css`
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
        }
    `,
    renderCallback: ({inputs, state, updateState}) => {
        return html`
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
        `;
    },
});
