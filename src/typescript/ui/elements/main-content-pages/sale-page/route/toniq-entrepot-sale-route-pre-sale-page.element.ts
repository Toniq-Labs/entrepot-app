import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {ToniqButton, toniqColors, toniqFontStyles, ToniqInput} from '@toniq-labs/design-system';
import {assign, css, defineElement, html} from 'element-vir';
import parse from 'html-react-parser';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {routeStyle} from './common/route-style';

export const EntrepotSaleRoutePreSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
}>()({
    tagName: 'toniq-entrepot-sale-route-pre-sale-page',
    styles: css`
        ${routeStyle}

        .email-notification-wrapper {
            display: flex;
            gap: 12px;
        }

        .info-card {
            padding: 28px 48px;
        }

        .info-card > span:last-of-type {
            display: inline-flex;
            padding: 28px 48px;
            gap: 24px;
        }

        .time-colon {
            ${toniqFontStyles.toniqFont} !important;
            font-weight: 500 !important;
            font-size: 64px !important;
            line-height: 69px !important;
        }

        .info-card > span:last-of-type > div {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .info-card > span:last-of-type > div > span:first-of-type {
            ${toniqFontStyles.toniqFont};
            font-size: 64px;
            line-height: 80px;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .info-card > span:last-of-type > div > span:last-of-type {
            ${toniqFontStyles.toniqFont};
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
        }

        @media (max-width: 1300px) {
            .email-notification-wrapper {
                flex-direction: column;
            }

            .email-notification-wrapper > * {
                width: 100%;
            }

            .info-card {
                flex-direction: column;
                padding: 16px 0px;
                gap: 12px;
            }

            .info-card > span:first-of-type {
                font-weight: 900;
                font-size: 24px;
                line-height: 32px;
            }

            .info-card > span:last-of-type {
                gap: 16px;
                padding: 0;
            }

            .info-card > span:last-of-type > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: unset;
            }

            .info-card > span:last-of-type > div > span:first-of-type {
                ${toniqFontStyles.toniqFont};
                font-size: 36px;
                line-height: 46px;
                color: ${toniqColors.pageInteraction.foregroundColor};
            }

            .info-card > span:last-of-type > div > span:last-of-type {
                ${toniqFontStyles.toniqFont};
                font-size: 14px;
                line-height: 20px;
            }
        }
    `,
    renderCallback: ({inputs}) => {
        const {collectionId, fullSize, cachePriority, nftId, nftIndex, ref, min, max} =
            inputs.nftImageInputs;
        const {name, blurb} = inputs.collectionSale;

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
                <div class="section-info">
                    <div class="info-card">
                        <span>Time to Launch</span>
                        <span>
                            <div>
                                <span>00</span>
                                <span>Days</span>
                            </div>
                            <div>
                                <span class="time-colon">:</span>
                            </div>
                            <div>
                                <span>00</span>
                                <span>Hours</span>
                            </div>
                            <div>
                                <span class="time-colon">:</span>
                            </div>
                            <div>
                                <span>00</span>
                                <span>Minutes</span>
                            </div>
                        </span>
                    </div>
                </div>
                <div class="section-details"></div>
                <div class="section-artwork"></div>
            </div>
        `;
    },
});
