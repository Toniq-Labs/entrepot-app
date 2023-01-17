import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {EntrepotAllLaunchesCardElement} from './toniq-entrepot-all-launches-card.element';
import {getCollectionSales} from '../../../../data/local-cache/get-sales';
import {Account, CollectionSales} from '../../../../data/models/sales';
import moment from 'moment';
import {Icp16Icon} from '@toniq-labs/design-system';

export const EntrepotAllLaunchesPageElement = defineElement<{
    collections: Array<Collection>;
    account: Account;
}>()({
    tagName: 'toniq-entrepot-all-launches-page',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
            margin-top: 32px;
        }

        ${EntrepotTopTabsElement} {
            margin: 32px;
        }

        @media (max-width: 1200px) and (min-width: 900px), (max-width: 600px) {
            ${EntrepotTopTabsElement} {
                margin-right: 0;
                margin-left: 0;
            }
        }
    `,
    events: {
        collectionSelected: defineElementEvent<Collection>(),
    },
    stateInit: {
        allLaunchesSelectedTab: undefined as undefined | TopTab,
        collectionSales: undefined as undefined | Array<CollectionSales>,
        upcoming: undefined as undefined | Array<CollectionSales>,
        inProgress: undefined as undefined | Array<CollectionSales>,
        endingSoon: undefined as undefined | Array<CollectionSales>,
    },
    initCallback: ({inputs, updateState}) => {
        getCollectionSales(inputs.collections, inputs.account).then(collectionSales => {
            updateState({collectionSales});
            updateState({
                inProgress: collectionSales
                    .filter(collectionSale => {
                        return collectionSale.sales.percentMinted < 100;
                    })
                    .sort(
                        (prev: CollectionSales, next: CollectionSales) =>
                            next.sales.percentMinted - prev.sales.percentMinted,
                    ),
            });
            updateState({
                upcoming: collectionSales
                    .filter(collectionSale => {
                        return moment(collectionSale.sales.startDate).isAfter(
                            moment().subtract(12, 'hours'),
                        );
                    })
                    .sort(
                        (prev: CollectionSales, next: CollectionSales) =>
                            prev.sales.startDate - next.sales.startDate,
                    ),
            });
            updateState({
                endingSoon: collectionSales
                    .filter(collectionSale => {
                        return moment(collectionSale.sales.endDate).isAfter(
                            moment().subtract(12, 'hours'),
                        );
                    })
                    .sort(
                        (prev: CollectionSales, next: CollectionSales) =>
                            prev.sales.endDate - next.sales.endDate,
                    ),
            });
        });
    },
    renderCallback: ({inputs, state, updateState, dispatch, events}) => {
        const tabs = [
            {
                label: 'Featured',
                value: 'featured',
            },
            {
                label: 'Upcoming',
                value: 'upcoming',
            },
            {
                label: 'In Progress',
                value: 'inprogress',
            },
            {
                label: 'Ending Soon',
                value: 'endingsoon',
            },
        ];

        const selectedTopTab: TopTab | undefined = state.allLaunchesSelectedTab ?? tabs[0];

        return html`
			<${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'All Launches',
                })}
            ></${EntrepotPageHeaderElement}>

			${
                selectedTopTab
                    ? html`
                        <${EntrepotTopTabsElement}
                            ${assign(EntrepotTopTabsElement, {
                                tabs,
                                selected: selectedTopTab,
                            })}
                            ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                                const selectedTab = event.detail;
                                updateState({allLaunchesSelectedTab: selectedTab});
                            })}
                        ></${EntrepotTopTabsElement}>`
                    : ''
            }

            <div>
                <span>Upcoming</span>
                <div>
                    ${
                        state.upcoming
                            ? html`
                                  ${state.upcoming.map(collection => {
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
                                            stat: collection.stats!.total,
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
                            ></${EntrepotAllLaunchesCardElement}>
                        `;
                                  })}
                              `
                            : 'Fetching data'
                    }
                </div>
                
                <span>In Progress</span>
                <div>
                    ${
                        state.inProgress
                            ? html`
                                  ${state.inProgress.map(collection => {
                                      return html`
                            <${EntrepotAllLaunchesCardElement}
                                ${assign(EntrepotAllLaunchesCardElement, {
                                    collectionImageUrl: collection.collection,
                                    collectionName: collection.name,
                                    descriptionText: collection.brief,
                                    date: collection.sales.startDate,
                                    statsArray: [
                                        {
                                            title: 'PRICE',
                                            icon: Icp16Icon,
                                            stat: collection.stats!.total,
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
                            ></${EntrepotAllLaunchesCardElement}>
                        `;
                                  })}
                              `
                            : 'Fetching data'
                    }
                </div>

                <span>Ending Soon</span>
                <div>
                    ${
                        state.endingSoon
                            ? html`
                                  ${state.endingSoon.map(collection => {
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
                                            stat: collection.stats!.total,
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
                            ></${EntrepotAllLaunchesCardElement}>
                        `;
                                  })}
                              `
                            : 'Fetching data'
                    }
                </div>
            </div>
		`;
    },
});

export const EntrepotAllLaunches = wrapInReactComponent(EntrepotAllLaunchesPageElement);
