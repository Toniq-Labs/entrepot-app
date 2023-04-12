import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {assign, css, defineElement, html, listen, renderIf} from 'element-vir';
import parse from 'html-react-parser';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales, Sales, SalesGroup, SalesPricing} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {EntrepotTopTabsElement, TopTab} from '../../../common/toniq-entrepot-top-tabs.element';
import {routeStyle} from './common/route-style';
import {repeat} from 'lit/directives/repeat.js';
import moment, {duration} from 'moment';
import {
    applyBackgroundAndForeground,
    Icp24Icon,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {makeDropShadowCardStyles} from '../../../styles/drop-shadow-card.style';

export const EntrepotSaleRouteLiveSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
}>()({
    tagName: 'toniq-entrepot-sale-route-live-sale-page',
    styles: css`
        ${routeStyle}
        .collection-pricing {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .pricing-card-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        ${makeDropShadowCardStyles('.pricing-card')}

        .pricing-card {
            justify-content: space-between;
            height: 48px;
            width: auto;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)};
            border-radius: 16px;
            align-items: stretch;
            padding: 0;
            border-radius: 8px;
            padding: 12px;
            ${toniqFontStyles.boldParagraphFont};
            border-color: rgba(0, 0, 0, 0.12);
        }

        .pricing-card,
        .pricing-card > * {
            display: flex;
            align-items: center;
        }

        .icp-icon {
            margin-right: 8px;
        }

        .pricing-other-info-wrapper {
            max-height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f8f8f8;
            border-radius: 8px;
        }

        .pricing-other-info {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px;
            gap: 10px;
            ${toniqFontStyles.paragraphFont};
        }
    `,
    stateInit: {
        pricingSelectedTab: undefined as undefined | TopTab<SalesGroup>,
    },
    renderCallback: ({inputs, state, updateState}) => {
        const {collectionId, fullSize, cachePriority, nftId, nftIndex, ref, min, max} =
            inputs.nftImageInputs;
        const {name, blurb} = inputs.collectionSale;
        const tabs: ReadonlyArray<TopTab<SalesGroup>> = inputs.collectionSale.sales.groups
            // TODO: Whitelisting
            .filter(group => {
                return group.public && moment(Number(group.end) / 1000000).isAfter(moment());
            })
            .map(group => {
                return {
                    label: group.name,
                    value: group,
                };
            });

        const selectedPricingTab: TopTab<SalesGroup> | undefined =
            state.pricingSelectedTab ?? tabs[0];
        const socials: Array<string> = [
            'telegram',
            'twitter',
            'medium',
            'discord',
            'dscvr',
            'distrikt',
            'icscan',
        ].filter(
            social =>
                inputs.collectionSale.hasOwnProperty(social) &&
                inputs.collectionSale[social as keyof CollectionSales],
        );

        const limitFormattedDate = (date: number) => {
            const dateDuration: any = duration(moment(date).diff(moment()));
            return dateDuration.humanize(true);
        };

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
                            <a
                                href=${
                                    'https://icscan.io/canister/' + inputs.collectionSale.canister
                                }
                                target="_blank"
                                rel="noreferrer"
                                class="socialLinkIcon"
                            >
                                <img
                                    alt="icsans"
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
                        <div class="collection-pricing">
                            <${EntrepotTopTabsElement}
                                ${assign(EntrepotTopTabsElement, {
                                    tabs,
                                    selected: selectedPricingTab as TopTab<SalesGroup>,
                                })}
                                ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                                    const selectedTab = event.detail;
                                    updateState({
                                        pricingSelectedTab: selectedTab as TopTab<SalesGroup>,
                                    });
                                })}
                            ></${EntrepotTopTabsElement}>
                            ${renderIf(
                                !!selectedPricingTab,
                                html`
                                    <div class="pricing-card-wrapper">
                                        ${repeat(
                                            selectedPricingTab?.value?.pricing as SalesPricing,
                                            pricing => pricing[0],
                                            pricing =>
                                                html`
                                                    <button class="pricing-card">
                                                        <span>Buy ${Number(pricing[0])} NFT</span>
                                                        <span>
                                                            <${ToniqIcon}
                                                                class="icp-icon"
                                                                ${assign(ToniqIcon, {
                                                                    icon: Icp24Icon,
                                                                })}
                                                            ></${ToniqIcon}>
                                                            ${Number(pricing[1]) / 100000000}
                                                        </span>
                                                    </button>
                                                `,
                                        )}
                                    </div>
                                `,
                            )}
                            <div class="pricing-other-info-wrapper">
                                <span class="pricing-other-info"><strong>Ends: </strong>${limitFormattedDate(
                                    Number(selectedPricingTab?.value?.end) / 1000000,
                                )}</span>
                                <span class="pricing-other-info"><strong>Limit: </strong>${Number(
                                    selectedPricingTab?.value?.limit[0],
                                )} per wallet</span>
                            </div>
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
