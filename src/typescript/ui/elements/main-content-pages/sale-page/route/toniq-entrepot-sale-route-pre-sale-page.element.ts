import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {ToniqButton, toniqColors, toniqFontStyles, ToniqInput} from '@toniq-labs/design-system';
import {assign, css, defineElement, html} from 'element-vir';
import parse from 'html-react-parser';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';

export const EntrepotSaleRoutePreSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
}>()({
    tagName: 'toniq-entrepot-sale-route-pre-sale-page',
    styles: css`
        .page-wrapper {
            padding: 16px 104px;
        }

        .section-overview {
            display: flex;
            grid-template-columns: 1fr 1fr;
            gap: 56px;
        }

        .overview-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .collection-name {
            ${toniqFontStyles.h2Font};
            ${toniqFontStyles.extraBoldFont};
            margin-bottom: 8px;
        }

        .collection-team {
            ${toniqFontStyles.toniqFont}
            color: ${toniqColors.pageInteraction.foregroundColor};
            font-size: 20px;
            font-weight: 500;
        }

        .collection-social {
            display: flex;
            gap: 24px;
            margin-top: 12px;
        }

        .collection-blurb {
            ${toniqFontStyles.toniqFont};
            color: ${toniqColors.pagePrimary.foregroundColor};
            margin: 32px 0;
        }

        .email-notification-wrapper {
            display: flex;
            gap: 12px;
        }

        .readMoreEllipsis {
            ${toniqFontStyles.boldParagraphFont};
            color: ${toniqColors.pageInteraction.foregroundColor}
            border: none;
            background: none;
            cursor: pointer;
        }
    `,
    renderCallback: ({inputs}) => {
        const {collectionId, fullSize, cachePriority, nftId, nftIndex, ref, min, max} =
            inputs.nftImageInputs;
        const {name, blurb} = inputs.collectionSale;

        console.log(inputs.collectionSale);
        return html`
            <div class="page-wrapper">
                <div class="section-overview">
                    <div class="image-wrapper">
                        <${EntrepotNftDisplayElement}
                            ${assign(EntrepotNftDisplayElement, {
                                collectionId,
                                fullSize,
                                cachePriority,
                                nftId,
                                nftIndex,
                                ref,
                                min,
                                max,
                            })}
                        ></${EntrepotNftDisplayElement}>
                    </div>
                    <div class="overview-wrapper">
                        <span class="collection-name">${name}</span>
                        <span class="collection-team">by Team Name</span>
                        <div class="collection-social">
                            ${[
                                'telegram',
                                'twitter',
                                'medium',
                                'discord',
                                'dscvr',
                                'distrikt',
                            ]
                                .filter(
                                    social =>
                                        inputs.collectionSale.hasOwnProperty(social) &&
                                        inputs.collectionSale[social as keyof CollectionSales],
                                )
                                .map(social => {
                                    return html`
                                        <a
                                            href=${inputs.collectionSale[
                                                social as keyof CollectionSales
                                            ]}
                                            target="_blank"
                                            rel="noreferrer"
                                            class="socialLinkIcon"
                                        >
                                            <img
                                                alt=${social}
                                                style="width: 24px"
                                                src=${'/icon/svg/' + social + '.svg'}
                                            />
                                        </a>
                                    `;
                                })}
                        </div>
                        <div class="collection-blurb">
                            ${parse(blurb)}
                        </div>
                        <div class="email-notification-wrapper">
                            <${ToniqInput}
                                class=${ToniqInput.hostClasses.outline}
                                ${assign(ToniqInput, {
                                    value: '',
                                    placeholder: 'Your email address',
                                    disableBrowserHelps: true,
                                })}
                                style="flex-grow: 1"
                            ></${ToniqInput}>
                            <${ToniqButton}>
                                <div style="display: flex; gap: 4px">
                                    <span>Notify Me</span>
                                    <img
                                        alt="notification"
                                        style="width: 24"
                                        src="/icon/svg/notification.svg"
                                    />
                                </div>
                            </${ToniqButton}>
                        </div>
                    </div>
                </div>
                <div class="section-info"></div>
                <div class="section-details"></div>
                <div class="section-artwork"></div>
            </div>
        `;
    },
});
