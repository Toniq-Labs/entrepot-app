import {PartialAndNullable, truncateNumber} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {ToniqButton, toniqColors, toniqFontStyles, ToniqInput} from '@toniq-labs/design-system';
import {assign, css, defineElement, html} from 'element-vir';
import parse from 'html-react-parser';
import moment, {duration} from 'moment';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {routeStyle} from './common/route-style';
import {repeat} from 'lit/directives/repeat.js';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {makeDropShadowCardStyles} from '../../../styles/drop-shadow-card.style';
import {fill} from 'lodash';

export const EntrepotSaleRoutePreSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
    userAccount: EntrepotUserAccount | undefined;
}>()({
    tagName: 'toniq-entrepot-sale-route-pre-sale-page',
    styles: css`
        ${routeStyle}

        .email-notification-wrapper {
            display: flex;
            gap: 12px;
        }

        .info-card {
            display: flex;
            justify-content: space-around;
            padding: 28px 48px;
            border-radius: 16px;
            background-color: ${toniqColors.pagePrimary.backgroundColor};
            border: 1px solid transparent;
            width: auto;
        }

        ${makeDropShadowCardStyles('.info-card-wrapper')}

        .info-card-wrapper {
            width: 100%;
            padding: 2px;
        }

        .info-card-wrapper::after {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(
                to left,
                rgba(0, 208, 147, 0),
                rgba(0, 208, 147, 0.2),
                rgba(0, 208, 147, 0.4),
                rgba(0, 208, 147, 1)
            );
            content: '';
            z-index: -1;
            border-radius: 17px;
        }

        .info-card > span:last-of-type {
            display: inline-flex;
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
        const {name, blurb, sales} = inputs.collectionSale;

        const socials: Array<string> = [
            'telegram',
            'twitter',
            'medium',
            'discord',
            'dscvr',
            'distrikt',
        ].filter(
            social =>
                inputs.collectionSale.hasOwnProperty(social) &&
                inputs.collectionSale[social as keyof CollectionSales],
        );

        const dateDuration: any = duration(moment(sales.startDate).diff(moment()));
        const {days, hours, minutes} = dateDuration._data;

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
                        <!-- <span class="collection-team">by Team Name</span> -->
                        <div class="collection-social">
                            <a
                                href=${
                                    'https://icscan.io/canister/' + inputs.collectionSale.canister
                                }
                                target="_blank"
                                rel="noreferrer"
                                class="socialLinkIcon"
                            >
                                <img
                                    alt="icscans"
                                    style="width: 24px"
                                    src="/icon/svg/icscan.svg"
                                />
                            </a>
                            ${repeat(
                                socials,
                                social => social,
                                social => html`
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
                                `,
                            )}
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
                            <${ToniqButton} ${assign(ToniqButton, {text: ''})}>
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
                    <div class="info-card-wrapper">
                        <div class="info-card">
                            <span>Time to Launch</span>
                            <span>
                                <div>
                                    <span>${days}</span>
                                    <span>${days > 1 ? 'Days' : 'Day'}</span>
                                </div>
                                <div>
                                    <span class="time-colon">:</span>
                                </div>
                                <div>
                                    <span>${hours}</span>
                                    <span>${hours > 1 ? 'Hours' : 'Hour'}</span>
                                </div>
                                <div>
                                    <span class="time-colon">:</span>
                                </div>
                                <div>
                                    <span>${minutes}</span>
                                    <span>${hours > 1 ? 'Minutes' : 'Minute'}</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="section-details">
                    <div class="section-title">
                        <span>Details</span>
                    </div>
                    <div class="detail-card-container">
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">Launch Date</span>
                                <div class="detail-content">${moment(sales.startDate).format(
                                    'MMM DD, YYYY',
                                )}</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">End Date</span>
                                <div class="detail-content">${moment(sales.endDate).format(
                                    'MMM DD, YYYY',
                                )}</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">Low Price</span>
                                <div class="detail-content">${truncateNumber(
                                    Number(sales.salePrice),
                                )} ICP</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">High Price</span>
                                <div class="detail-content">${truncateNumber(
                                    Number(sales.salePrice),
                                )} ICP</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">Collection Size</span>
                                <div class="detail-content">${truncateNumber(
                                    Number(sales.quantity),
                                )}</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">For Sale</span>
                                <div class="detail-content">${truncateNumber(
                                    Number(sales.quantity),
                                )}</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">Team Allocation</span>
                                <div class="detail-content">-</div>
                            </div>
                        </div>
                        <div class="detail-card-wrapper">
                            <div class="detail-card">
                                <span class="detail-title">Airdrops</span>
                                <div class="detail-content">-</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-artwork">
                    <div class="section-title">
                        <span>Artwork</span>
                    </div>
                    <div class="artwork-card-container">
                        ${repeat(
                            fill(Array(8), null),
                            () => {},
                            () => {
                                return html`
                            <div class="artwork-wrapper">
                                <${EntrepotNftDisplayElement}
                                    ${assign(EntrepotNftDisplayElement, {
                                        collectionId,
                                        fullSize,
                                        cachePriority,
                                        nftId,
                                        nftIndex,
                                        ref,
                                        min: {height: 236, width: 236},
                                        max: {height: 236, width: 236},
                                    })}
                                ></${EntrepotNftDisplayElement}>
                            </div>
                            `;
                            },
                        )}

                    </div>
                </div>
            </div>
        `;
    },
});
