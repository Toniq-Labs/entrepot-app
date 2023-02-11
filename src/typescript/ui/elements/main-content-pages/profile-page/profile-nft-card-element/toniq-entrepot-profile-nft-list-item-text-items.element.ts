import {classMap} from 'lit/directives/class-map.js';
import {assign, css, html, renderIf} from 'element-vir';
import {
    defineToniqElement,
    toniqFontStyles,
    Icp16Icon,
    ToniqIcon,
    applyBackgroundAndForeground,
    toniqColors,
} from '@toniq-labs/design-system';
import {toIcp} from '../../../../../data/icp';
import {FullProfileNft} from '../profile-page-nfts/full-profile-nft';
import {isRuntimeTypeOf} from '@augment-vir/common';
import {BaseNft} from '../../../../../data/nft/base-nft';

const headerTitles = {
    mint: 'MINT #',
    nri: 'NRI',
    price: 'PRICE',
};

export const EntrepotProfileNftListItemTextItemsElement = defineToniqElement<{
    nft?: Pick<BaseNft & FullProfileNft, 'nftId' | 'listing' | 'nftNri' | 'nftMintNumber'>;
    isHeader?: boolean | undefined;
    finalItemHeaderTitle?: string | undefined;
}>()({
    tagName: 'toniq-entrepot-profile-nft-list-item-text-items',
    hostClasses: {
        header: ({inputs}) => !!inputs.isHeader,
    },
    styles: ({hostClassSelectors}) => css`
        :host {
            display: flex;
            gap: 16px;
        }

        :host > div {
            flex-grow: 1;
            display: flex;
            align-items: center;
            flex-basis: 0;
            flex-shrink: 1;
        }

        .nft-mint-number {
            margin-left: 32px;
            max-width: 120px;
        }

        ${hostClassSelectors.header} {
            ${toniqFontStyles.labelFont}
            ${applyBackgroundAndForeground(toniqColors.accentSecondary)}
            border-radius: 8px;
            padding: 8px 16px;
        }

        ${hostClassSelectors.header} .nft-mint-number {
            margin-left: 96px;
        }

        .monospace-price {
            ${toniqFontStyles.boldFont};
            ${toniqFontStyles.monospaceFont};
        }

        .nft-price ${ToniqIcon} {
            margin-right: 4px;
        }

        .nft-rarity {
            max-width: 64px;
        }

        .slot-wrapper {
            display: flex;
            justify-content: flex-end;
        }
    `,
    renderCallback: ({inputs}) => {
        const isHeader: boolean = !!inputs.isHeader || !inputs.nft;

        const hasListing: boolean = !!inputs.nft && inputs.nft.listing.price > 0;
        const listPriceText =
            hasListing && inputs.nft ? toIcp(BigInt(inputs.nft.listing.price)) : '-';

        const rarityText =
            inputs.nft && isRuntimeTypeOf(inputs.nft?.nftNri, 'number')
                ? `NRI: ${(inputs.nft.nftNri * 100).toFixed(1)}%`
                : '-';

        const mintNumberDisplay = isHeader ? headerTitles.mint : `#${inputs.nft?.nftMintNumber}`;
        const rarityDisplay = isHeader ? headerTitles.nri : rarityText;
        const priceDisplay = isHeader ? headerTitles.price : listPriceText;

        return html`
            <div class="nft-mint-number">${mintNumberDisplay}</div>
            <div class="nft-rarity">${rarityDisplay}</div>
            <div class="nft-price">
                ${renderIf(
                    !!hasListing && !isHeader,
                    html`
                        <${ToniqIcon}
                            ${assign(ToniqIcon, {icon: Icp16Icon})}
                        ></${ToniqIcon}>
                    `,
                )}
                <span class=${classMap({'monospace-price': hasListing})}>${priceDisplay}</span>
            </div>
            <div class="slot-wrapper">
                ${renderIf(
                    !isHeader,
                    html`
                        <slot></slot>
                    `,
                    inputs.finalItemHeaderTitle,
                )}
            </div>
        `;
    },
});
