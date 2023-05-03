import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {assign, css, defineElement, defineElementEvent, html, listen, renderIf} from 'element-vir';
import parse from 'html-react-parser';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales, Sales, SalesGroup, SalesPricing} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {EntrepotPricingTabsElement, PricingTab} from './common/toniq-entrepot-pricing-tabs.element';
import {routeStyle} from './common/route-style';
import {repeat} from 'lit/directives/repeat.js';
import moment, {duration} from 'moment';
import {
    applyBackgroundAndForeground,
    Icp24Icon,
    LoaderAnimated24Icon,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {makeDropShadowCardStyles} from '../../../styles/drop-shadow-card.style';
import {truncateNumber} from '@augment-vir/common';
import {createEntrepotApiWithIdentity} from '../../../../../api/entrepot-apis/entrepot-data-api';
import {CanisterId} from '../../../../../data/models/canister-id';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {isEmpty, fill, chain} from 'lodash';
import {UserIdentity} from '../../../../../data/models/user-data/identity';
import {BigNumber} from 'bignumber.js';

export type BuySale = {
    id: number | BigNumber | undefined;
    quantity: number | BigNumber | undefined;
    price: number | BigNumber | undefined;
    canister: CanisterId;
};

export const EntrepotSaleRouteLiveSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
    userAccount: EntrepotUserAccount | undefined;
    userIdentity: UserIdentity | undefined;
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

        .pricing-card-preloader-title {
            display: block;
            height: 28px;
            width: 110px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }

        .pricing-card-preloader-price {
            display: block;
            height: 28px;
            width: 50px;
            background-color: #f6f6f6;
            border-radius: 8px;
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

        ${makeDropShadowCardStyles('.info-card')}

        .info-card {
            border: 3px solid ${toniqColors.pageInteraction.foregroundColor};
            cursor: auto;
        }

        @media (max-width: 600px) {
            .pricing-other-info-wrapper {
                max-height: unset;
                flex-direction: column;
            }
        }
    `,
    stateInit: {
        pricingSelectedTab: undefined as undefined | PricingTab<SalesGroup>,
        saleCurrent: undefined as undefined | Sales,
        saleSetting: undefined as undefined | Sales,
    },
    initCallback: async ({inputs, state, updateState}) => {
        const getSaleCurrent = setInterval(async () => {
            const api = createEntrepotApiWithIdentity(inputs.userIdentity).canister(
                inputs.collectionSale.canister as CanisterId,
                'ext2',
            ) as any;
            if (api.hasOwnProperty('ext_saleCurrent') || api.hasOwnProperty('ext_saleSettings')) {
                if (isEmpty(state.saleCurrent)) {
                    const saleCurrent: Sales = (await api.ext_saleCurrent())[0];
                    updateState({saleCurrent});
                }

                if (isEmpty(state.saleSetting)) {
                    const saleSetting: Sales = (
                        await api.ext_saleSettings(
                            inputs.userAccount ? inputs.userAccount.address : '',
                        )
                    )[0];
                    updateState({saleSetting});
                }

                if (!isEmpty(state.saleCurrent) && !isEmpty(state.saleSetting)) {
                    clearInterval(getSaleCurrent);
                }
                return;
            }
        }, 1000);
    },
    events: {
        buyFromSale: defineElementEvent<BuySale>(),
    },
    renderCallback: ({inputs, state, updateState, events, dispatch}) => {
        const {collectionId, fullSize, cachePriority, nftId, nftIndex, ref, min, max} =
            inputs.nftImageInputs;
        const {name, blurb, sales, canister} = inputs.collectionSale;
        const tabs: ReadonlyArray<PricingTab<SalesGroup>> = chain(sales.groups)
            .map(group => {
                if (isEmpty(state.saleCurrent)) {
                    return group;
                }

                const matchedSaleCurrent = state.saleCurrent?.groups.find(saleCurrentGroup => {
                    return (
                        saleCurrentGroup.name === group.name &&
                        saleCurrentGroup.start === group.start
                    );
                });
                // Whitelist debugging
                // if (
                //     !(matchedSaleCurrent!.participants as string[]).includes(
                //         inputs.userAccount?.address as string,
                //     )
                // )
                //     matchedSaleCurrent!.participants?.push(inputs.userAccount?.address as string);
                return {
                    ...group,
                    participants: matchedSaleCurrent!.participants as string[],
                };
            })
            .filter(group => {
                if (group.public) {
                    return group.public && moment(Number(group.end) / 1000000).isAfter(moment());
                } else if (inputs.userAccount?.address && !isEmpty(group.participants)) {
                    return (
                        (group.participants as string[]).includes(
                            inputs.userAccount?.address as string,
                        ) && moment(Number(group.end) / 1000000).isAfter(moment())
                    );
                } else {
                    return false;
                }
            })
            .map(group => {
                return {
                    label: group.name,
                    value: group,
                };
            })
            .reverse()
            .value();
        const selectedPricingTab: PricingTab<SalesGroup> | undefined =
            state.pricingSelectedTab ?? tabs[0];
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

        const limitFormattedDate = (date: number) => {
            const dateDuration: any = duration(moment(date).diff(moment()));
            return dateDuration.humanize(true);
        };

        const getGroupSaleId = (selectedPricingTab: PricingTab<SalesGroup>) => {
            if (!state.saleSetting) return undefined;
            const groupId = state.saleSetting?.groups!.find((group: SalesGroup) => {
                return group.name === selectedPricingTab.value.name;
            })?.id;
            return groupId;
        };

        const preloader = new Array(Math.floor(Math.random() * (4 - 3) + 3)).fill(0);

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
                                href=${'https://icscan.io/canister/' + canister}
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
                        <div class="collection-pricing">
                            <${EntrepotPricingTabsElement}
                                ${assign(EntrepotPricingTabsElement, {
                                    tabs,
                                    selected: selectedPricingTab as PricingTab<SalesGroup>,
                                })}
                                ${listen(EntrepotPricingTabsElement.events.tabChange, event => {
                                    const selectedTab = event.detail;
                                    updateState({
                                        pricingSelectedTab: selectedTab as PricingTab<SalesGroup>,
                                    });
                                })}
                            ></${EntrepotPricingTabsElement}>
                            ${renderIf(
                                !!selectedPricingTab && !isEmpty(state.saleSetting),
                                html`
                                    <div class="pricing-card-wrapper">
                                        ${repeat(
                                            selectedPricingTab?.value?.pricing as SalesPricing,
                                            pricing => pricing[0],
                                            pricing =>
                                                html`
                                                    <button
                                                        class="pricing-card"
                                                        ${listen('click', async () => {
                                                            const buysale = {
                                                                id: getGroupSaleId(
                                                                    selectedPricingTab!,
                                                                ),
                                                                quantity: pricing[0],
                                                                price: pricing[1],
                                                                canister: canister as CanisterId,
                                                            };
                                                            dispatch(
                                                                new events.buyFromSale(buysale),
                                                            );
                                                        })}
                                                    >
                                                        <span>Buy ${truncateNumber(
                                                            Number(pricing[0]),
                                                        )} NFT</span>
                                                        <span>
                                                            <${ToniqIcon}
                                                                class="icp-icon"
                                                                ${assign(ToniqIcon, {
                                                                    icon: Icp24Icon,
                                                                })}
                                                            ></${ToniqIcon}>
                                                            ${truncateNumber(
                                                                Number(pricing[1]) / 100000000,
                                                            )}
                                                        </span>
                                                    </button>
                                                `,
                                        )}
                                    </div>
                                `,
                                html`
                                    <div class="pricing-card-wrapper">
                                        ${repeat(
                                            preloader,
                                            preloader => preloader,
                                            () =>
                                                html`
                                                    <button class="pricing-card">
                                                        <span
                                                            class="pricing-card-preloader-title"
                                                        ></span>
                                                        <${ToniqIcon}
                                                            ${assign(ToniqIcon, {
                                                                icon: LoaderAnimated24Icon,
                                                            })}
                                                        ></${ToniqIcon}>
                                                        <span
                                                            class="pricing-card-preloader-price"
                                                        ></span>
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
                                <span class="pricing-other-info"><strong>Limit: </strong>${truncateNumber(
                                    Number(selectedPricingTab?.value?.limit[0]),
                                )} per wallet</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-info">
                    <div class="info-card">
                        <span>Minted:&nbsp;</span>
                        <span>${truncateNumber(
                            Number(sales.quantity) - Number(sales.remaining),
                        )}</span>
                    </div>
                    <div class="info-card">
                        <span>Remaining:&nbsp;</span>
                        <span>${truncateNumber(Number(sales.remaining))}</span>
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
