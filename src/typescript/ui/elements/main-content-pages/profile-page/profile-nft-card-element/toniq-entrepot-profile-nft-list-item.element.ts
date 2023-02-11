import {classMap} from 'lit/directives/class-map.js';
import {assign, css, html, renderIf} from 'element-vir';
import {defineToniqElement, toniqFontStyles, Icp16Icon, ToniqIcon} from '@toniq-labs/design-system';
import {toIcp} from '../../../../../data/icp';
import {FullProfileNft} from '../profile-page-nfts/full-profile-nft';
import {isRuntimeTypeOf} from '@augment-vir/common';
import {BaseNft} from '../../../../../data/nft/base-nft';
import {EntrepotNftListItemElement} from '../../../common/toniq-entrepot-nft-list-item.element';
import {EntrepotProfileNftListItemTextItemsElement} from './toniq-entrepot-profile-nft-list-item-text-items.element';

export const EntrepotProfileNftListItemElement = defineToniqElement<{
    nft: Pick<
        BaseNft & FullProfileNft,
        'collectionId' | 'nftId' | 'nftIndex' | 'listing' | 'nftNri' | 'nftMintNumber'
    >;
}>()({
    tagName: 'toniq-entrepot-profile-nft-list-item',
    styles: css`
        :host {
            display: flex;
            width: 100%;
        }

        .footer-contents {
            display: flex;
            flex-direction: column;
        }

        p {
            margin: 16px 0;
            ${toniqFontStyles.h3Font}
        }

        .monospace {
            ${toniqFontStyles.monospaceFont}
        }

        .icp-price {
            display: flex;
            align-items: center;
            gap: 4px;
            ${toniqFontStyles.boldFont}
        }

        .button-row {
            display: flex;
            justify-content: space-between;
        }

        .rarity {
            ${toniqFontStyles.labelFont}
        }

        .row-items {
            display: flex;
        }

        ${EntrepotNftListItemElement} {
            width: 100%;
        }

        ${EntrepotProfileNftListItemTextItemsElement} {
            flex-grow: 1;
        }
    `,
    renderCallback: ({inputs}) => {
        return html`
            <${EntrepotNftListItemElement}
                ${assign(EntrepotNftListItemElement, {
                    nft: inputs.nft,
                })}
            >
                <${EntrepotProfileNftListItemTextItemsElement}
                    ${assign(EntrepotProfileNftListItemTextItemsElement, {
                        nft: inputs.nft,
                    })}
                >
                    <slot></slot>
                </${EntrepotProfileNftListItemTextItemsElement}>
            </${EntrepotNftListItemElement}>
        `;
    },
});
