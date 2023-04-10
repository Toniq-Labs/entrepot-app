import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {
    Icp16Icon,
    removeNativeFormStyles,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotHorizontalScrollElement} from '../../../common/toniq-entrepot-horizontal-scroll.element';
import {EntrepotSaleCardElement} from '../toniq-entrepot-sale-card.element';
import {Collection} from '../../../../../data/models/collection';
import {TopTab} from '../../../common/toniq-entrepot-top-tabs.element';

export const EntrepotSaleFeatureTabElement = defineElement<{
    upcoming: ReadonlyArray<CollectionSales> | [];
    inProgress: ReadonlyArray<CollectionSales> | [];
    endingSoon: ReadonlyArray<CollectionSales> | [];
    updateState: (newState: any) => void;
}>()({
    tagName: 'toniq-entrepot-sale-feature-tab',
    styles: css`
        .header {
            display: flex;
            justify-content: space-between;
        }

        .title {
            ${toniqFontStyles.boldFont};
            font-size: 20px;
            line-height: 28px;
            color: ${toniqColors.pagePrimary.foregroundColor};
        }

        .see-all {
            ${removeNativeFormStyles};
            font-weight: 500;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .tab-content {
            display: flex;
            flex-direction: column;
            gap: 52px;
            margin: 0 32px;
        }
    `,
    events: {
        collectionSelected: defineElementEvent<Collection>(),
    },
    renderCallback: ({inputs, dispatch, events}) => {
        function goToTab(tab: TopTab) {
            console.log(tab);
            inputs.updateState({saleSelectedTab: tab});
            window.scrollTo({behavior: 'smooth', top: 0});
        }

        return html`
            <div class="tab-content">
                ${inputs.upcoming.length
                    ? html`
                <div>
                    <div class="header">
                        <span class="title">Upcoming</span>
                        <button
                            class="see-all"
                            @click=${() => goToTab({label: 'Upcoming', value: 'upcoming'})}
                        >
                            See All
                        </button>
                    </div>
                    <${EntrepotHorizontalScrollElement}
                        ${assign(EntrepotHorizontalScrollElement, {
                            children: html`
                                ${inputs.upcoming.map(collection => {
                                    return html`
                                        <${EntrepotSaleCardElement}
                                            ${assign(EntrepotSaleCardElement, {
                                                collectionImageUrl: collection.collection,
                                                collectionName: collection.name,
                                                descriptionText: collection.brief,
                                                date: collection.sales.startDate,
                                                dateMessage: 'Just Launched',
                                                statsArray: [
                                                    {
                                                        title: 'PRICE',
                                                        icon: Icp16Icon,
                                                        stat: collection.sales.salePrice,
                                                    },
                                                    {
                                                        title: 'SIZE',
                                                        stat: collection.sales.quantity,
                                                    },
                                                    {
                                                        title: 'FOR SALE',
                                                        stat: collection.sales.remaining,
                                                    },
                                                ],
                                            })}
                                            ${listen('click', () => {
                                                dispatch(new events.collectionSelected(collection));
                                            })}
                                        ></${EntrepotSaleCardElement}>
                                    `;
                                })}
                            `,
                            maxCardHeight: 460,
                        })}
                    ></${EntrepotHorizontalScrollElement}>
                </div>`
                    : ''}
                ${inputs.inProgress.length
                    ? html`
                <div>
                    <div class="header">
                        <span class="title">In Progress</span>
                        <button
                            class="see-all"
                            @click=${() => goToTab({label: 'In Progress', value: 'inProgress'})}
                        >
                            See All
                        </button>
                    </div>
                    <${EntrepotHorizontalScrollElement}
                        ${assign(EntrepotHorizontalScrollElement, {
                            children: html`
                                ${inputs.inProgress.map(collection => {
                                    return html`
                                        <${EntrepotSaleCardElement}
                                            ${assign(EntrepotSaleCardElement, {
                                                collectionImageUrl: collection.collection,
                                                collectionName: collection.name,
                                                descriptionText: collection.brief,
                                                date: collection.sales.endDate,
                                                statsArray: [
                                                    {
                                                        title: 'PRICE',
                                                        icon: Icp16Icon,
                                                        stat: collection.sales.salePrice,
                                                    },
                                                    {
                                                        title: 'SOLD',
                                                        stat:
                                                            Number(collection.sales.quantity) -
                                                            Number(collection.sales.remaining),
                                                    },
                                                    {
                                                        title: 'REMAINING',
                                                        stat: collection.sales.remaining,
                                                    },
                                                ],
                                                progress: collection.sales.percentMinted,
                                            })}
                                            ${listen('click', () => {
                                                dispatch(new events.collectionSelected(collection));
                                            })}
                                        ></${EntrepotSaleCardElement}>
                                    `;
                                })}
                            `,
                        })}
                    ></${EntrepotHorizontalScrollElement}>
                </div>`
                    : ''}
                ${inputs.endingSoon.length
                    ? html`
                <div>
                    <div class="header">
                        <span class="title">Ending Soon</span>
                        <button
                            class="see-all"
                            @click=${() => goToTab({label: 'Ending Soon', value: 'endingSoon'})}
                        >
                            See All
                        </button>
                    </div>
                    <${EntrepotHorizontalScrollElement}
                        ${assign(EntrepotHorizontalScrollElement, {
                            children: html`
                                ${inputs.endingSoon.map(collection => {
                                    return html`
                                        <${EntrepotSaleCardElement}
                                            ${assign(EntrepotSaleCardElement, {
                                                collectionImageUrl: collection.collection,
                                                collectionName: collection.name,
                                                descriptionText: collection.brief,
                                                date: collection.sales.endDate,
                                                statsArray: [
                                                    {
                                                        title: 'PRICE',
                                                        icon: Icp16Icon,
                                                        stat: collection.sales.salePrice,
                                                    },
                                                    {
                                                        title: 'SOLD',
                                                        stat:
                                                            Number(collection.sales.quantity) -
                                                            Number(collection.sales.remaining),
                                                    },
                                                    {
                                                        title: 'REMAINING',
                                                        stat: collection.sales.remaining,
                                                    },
                                                ],
                                                progress: collection.sales.percentMinted,
                                            })}
                                            ${listen('click', () => {
                                                dispatch(new events.collectionSelected(collection));
                                            })}
                                        ></${EntrepotSaleCardElement}>
                                    `;
                                })}
                            `,
                        })}
                    ></${EntrepotHorizontalScrollElement}>
                </div>`
                    : ''}
            </div>
        `;
    },
});
