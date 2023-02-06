import {classMap} from 'lit/directives/class-map.js';
import {assign, css, html, renderIf} from 'element-vir';
import {defineToniqElement, toniqFontStyles, Icp16Icon, ToniqIcon} from '@toniq-labs/design-system';
import {EntrepotNftCardElement} from '../../common/toniq-entrepot-nft-card.element';
import {toIcp} from '../../../../data/icp';
import {BaseFullProfileEntry} from './profile-entries/base-full-profile-entry';
import {isRuntimeTypeOf} from '@augment-vir/common';
import {BaseNft} from '../../../../data/nft/base-nft';

export const EntrepotProfileCardElement = defineToniqElement<{
    nft: Pick<
        BaseNft & BaseFullProfileEntry,
        'collectionId' | 'nftId' | 'nftIndex' | 'listing' | 'nftNri'
    >;
}>()({
    tagName: 'toniq-entrepot-profile-card',
    styles: css`
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

        .left-side {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    `,
    renderCallback: ({inputs}) => {
        const hasListing = inputs.nft.listing.price > 0;
        const listPriceDisplay = hasListing ? toIcp(BigInt(inputs.nft.listing.price)) : 'Unlisted';

        const rarityDisplay = isRuntimeTypeOf(inputs.nft.nftNri, 'number')
            ? `NRI: ${(inputs.nft.nftNri * 100).toFixed(1)}%`
            : html`
                  &nbsp;
              `;

        return html`
            <${EntrepotNftCardElement}
                ${assign(EntrepotNftCardElement, {
                    nft: inputs.nft,
                })}
            >
                <div class="footer-contents">
                    <p>
                        #${inputs.nft.nftIndex}
                    </p>
                    <div class="button-row">
                        <div class="left-side">
                            <div class=${classMap({
                                'icp-price': true,
                                monospace: !!hasListing,
                            })}>
                                ${renderIf(
                                    !!hasListing,
                                    html`
                                        <${ToniqIcon}
                                            ${assign(ToniqIcon, {icon: Icp16Icon})}
                                        ></${ToniqIcon}>
                                    `,
                                )}
                                <span>
                                    ${listPriceDisplay}
                                </span>
                            </div>
                            <div class="rarity">
                                ${rarityDisplay}
                            </div>
                        </div>
                        <div>
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </${EntrepotNftCardElement}>
        `;
    },
});
