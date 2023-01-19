import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {
    Icp16Icon,
    removeNativeFormStyles,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotHorizontalScrollElement} from '../../../common/toniq-entrepot-horizontal-scroll.element';
import {EntrepotAllLaunchesCardElement} from '../toniq-entrepot-all-launches-card.element';
import {Collection} from '../../../../../data/models/collection';

export const EntrepotAllLaunchesFeatureTabElement = defineElement<{
    upcoming: ReadonlyArray<CollectionSales> | undefined;
    inProgress: ReadonlyArray<CollectionSales> | undefined;
    endingSoon: ReadonlyArray<CollectionSales> | undefined;
    updateState: (newState: any) => void;
}>()({
    tagName: 'toniq-entrepot-all-launches-feature-tab',
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
        return html`
            <div class="tab-content">
                <div>
                    <div class="header">
                        <span class="title">Upcoming</span>
                        <button
                            class="see-all"
                            @click=${() =>
                                inputs.updateState({
                                    allLaunchesSelectedTab: {label: 'Upcoming', value: 'upcoming'},
                                })}
                        >
                            See All
                        </button>
                    </div>
                    ${inputs.upcoming
                        ? html`
							<${EntrepotHorizontalScrollElement}
								${assign(EntrepotHorizontalScrollElement, {
                                    children: html`
                                        ${inputs.upcoming.map(collection => {
                                            return html`
												<${EntrepotAllLaunchesCardElement}
													${assign(EntrepotAllLaunchesCardElement, {
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
                                                        dispatch(
                                                            new events.collectionSelected(
                                                                collection,
                                                            ),
                                                        );
                                                    })}
												></${EntrepotAllLaunchesCardElement}>
											`;
                                        })}
                                    `,
                                    maxCardHeight: 460,
                                })}
							></${EntrepotHorizontalScrollElement}>
						`
                        : 'Fetching data'}
                </div>

                <div>
                    <div class="header">
                        <span class="title">In Progress</span>
                        <button
                            class="see-all"
                            @click=${() =>
                                inputs.updateState({
                                    allLaunchesSelectedTab: {
                                        label: 'In Progress',
                                        value: 'inProgress',
                                    },
                                })}
                        >
                            See All
                        </button>
                    </div>

                    ${inputs.inProgress
                        ? html`
							<${EntrepotHorizontalScrollElement}
								${assign(EntrepotHorizontalScrollElement, {
                                    children: html`
                                        ${inputs.inProgress.map(collection => {
                                            return html`
												<${EntrepotAllLaunchesCardElement}
													${assign(EntrepotAllLaunchesCardElement, {
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
                                                                    Number(
                                                                        collection.sales.quantity,
                                                                    ) -
                                                                    Number(
                                                                        collection.sales.remaining,
                                                                    ),
                                                            },
                                                            {
                                                                title: 'REMAINING',
                                                                stat: collection.sales.remaining,
                                                            },
                                                        ],
                                                        progress: collection.sales.percentMinted,
                                                    })}
													${listen('click', () => {
                                                        dispatch(
                                                            new events.collectionSelected(
                                                                collection,
                                                            ),
                                                        );
                                                    })}
												></${EntrepotAllLaunchesCardElement}>
											`;
                                        })}
                                    `,
                                })}
							></${EntrepotHorizontalScrollElement}>
						`
                        : 'Fetching data'}
                </div>

                <div>
                    <div class="header">
                        <span class="title">Ending Soon</span>
                        <button
                            class="see-all"
                            @click=${() =>
                                inputs.updateState({
                                    allLaunchesSelectedTab: {
                                        label: 'Ending Soon',
                                        value: 'endingSoon',
                                    },
                                })}
                        >
                            See All
                        </button>
                    </div>
                    ${inputs.endingSoon
                        ? html`
							<${EntrepotHorizontalScrollElement}
								${assign(EntrepotHorizontalScrollElement, {
                                    children: html`
                                        ${inputs.endingSoon.map(collection => {
                                            return html`
												<${EntrepotAllLaunchesCardElement}
													${assign(EntrepotAllLaunchesCardElement, {
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
                                                                    Number(
                                                                        collection.sales.quantity,
                                                                    ) -
                                                                    Number(
                                                                        collection.sales.remaining,
                                                                    ),
                                                            },
                                                            {
                                                                title: 'REMAINING',
                                                                stat: collection.sales.remaining,
                                                            },
                                                        ],
                                                        progress: collection.sales.percentMinted,
                                                    })}
													${listen('click', () => {
                                                        dispatch(
                                                            new events.collectionSelected(
                                                                collection,
                                                            ),
                                                        );
                                                    })}
												></${EntrepotAllLaunchesCardElement}>
											`;
                                        })}
                                    `,
                                })}
							></${EntrepotHorizontalScrollElement}>
						`
                        : 'Fetching data'}
                </div>
            </div>
        `;
    },
});
