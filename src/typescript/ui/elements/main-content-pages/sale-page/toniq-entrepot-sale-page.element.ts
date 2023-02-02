import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {getCollectionSales} from '../../../../data/local-cache/dexie/get-sales';
import {CollectionSales} from '../../../../data/models/sales';
import moment from 'moment';
import {EntrepotSaleFeatureTabElement} from './tabs/toniq-entrepot-sale-feature-tab.element';
import {EntrepotSaleCategoryTabElement} from './tabs/toniq-entrepot-sale-category-tab.element';
import {EntrepotSaleCategoryCardElement} from './toniq-entrepot-sale-category-card.element';
import {Icp16Icon} from '@toniq-labs/design-system';

export const EntrepotSalePageElement = defineElement<{
    collections: Array<Collection>;
}>()({
    tagName: 'toniq-entrepot-sale-page',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
            margin: 32px 0px;
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
        SaleSelectedTab: undefined as undefined | TopTab,
        collectionSales: undefined as undefined | Array<CollectionSales>,
        upcoming: undefined as undefined | Array<CollectionSales>,
        inProgress: undefined as undefined | Array<CollectionSales>,
        endingSoon: undefined as undefined | Array<CollectionSales>,
    },
    initCallback: ({inputs, updateState}) => {
        const saleCollections = inputs.collections.filter(collection => collection.sale);
        getCollectionSales(saleCollections).then(collectionSales => {
            collectionSales = collectionSales.filter(collectionSales => {
                return Object.keys(collectionSales.sales).length;
            });

            const upcoming = collectionSales
                .filter(collectionSale => {
                    return moment(collectionSale.sales.startDate).isAfter(
                        moment().subtract(12, 'hours'),
                    );
                })
                .sort(
                    (prev: CollectionSales, next: CollectionSales) =>
                        prev.sales.startDate - next.sales.startDate,
                );

            const inProgress = collectionSales
                .filter(collectionSale => {
                    return collectionSale.sales.percentMinted < 100;
                })
                .sort(
                    (prev: CollectionSales, next: CollectionSales) =>
                        next.sales.percentMinted - prev.sales.percentMinted,
                );

            const endingSoon = collectionSales
                .filter(collectionSale => {
                    return moment(collectionSale.sales.endDate).isAfter(
                        moment().subtract(12, 'hours'),
                    );
                })
                .filter(collectionSale => {
                    return Number(collectionSale.sales.remaining) > 0;
                })
                .sort(
                    (prev: CollectionSales, next: CollectionSales) =>
                        prev.sales.endDate - next.sales.endDate,
                );

            updateState({collectionSales});
            updateState({upcoming});
            updateState({inProgress});
            updateState({endingSoon});
        });
    },
    renderCallback: ({state, updateState, events, dispatch}) => {
        const preloader = new Array(Math.floor(Math.random() * (8 - 4) + 4)).fill(0);
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
                value: 'inProgress',
            },
            {
                label: 'Ending Soon',
                value: 'endingSoon',
            },
        ];

        const selectedTopTab: TopTab | undefined = state.SaleSelectedTab ?? tabs[0];

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
                                updateState({SaleSelectedTab: selectedTab});
                            })}
                        ></${EntrepotTopTabsElement}>`
                    : ''
            }

            ${
                selectedTopTab?.value === 'featured'
                    ? html`
                        <${EntrepotSaleFeatureTabElement}
                            ${assign(EntrepotSaleFeatureTabElement, {
                                upcoming: state.upcoming,
                                inProgress: state.inProgress,
                                endingSoon: state.endingSoon,
                                updateState,
                            })}
                            ${listen(
                                EntrepotSaleFeatureTabElement.events.collectionSelected,
                                event => {
                                    new events.collectionSelected(event.detail);
                                },
                            )}
                        ></${EntrepotSaleFeatureTabElement}>
                    `
                    : ''
            }

            ${
                selectedTopTab?.value === 'upcoming'
                    ? html`
                        <${EntrepotSaleCategoryTabElement}
                            ${assign(EntrepotSaleCategoryTabElement, {
                                categoryName: 'Upcoming',
                                children: html`
                                    ${state.upcoming && state.upcoming.length
                                        ? html`
                                              ${state.upcoming.map(collection => {
                                                  return html`
                                                    <${EntrepotSaleCategoryCardElement}
                                                        ${assign(EntrepotSaleCategoryCardElement, {
                                                            collectionImageUrl:
                                                                collection.collection,
                                                            collectionName: collection.name,
                                                            descriptionText: collection.brief,
                                                            date: collection.sales.endDate,
                                                            dateMessage: 'Just Launched',
                                                            statsArray: [
                                                                {
                                                                    title: 'PRICE',
                                                                    icon: Icp16Icon,
                                                                    stat: collection.sales
                                                                        .salePrice,
                                                                },
                                                                {
                                                                    title: 'SIZE',
                                                                    stat: collection.sales.quantity,
                                                                },
                                                                {
                                                                    title: 'FOR SALE',
                                                                    stat: collection.sales
                                                                        .remaining,
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
                                                    ></${EntrepotSaleCategoryCardElement}>
                                                    `;
                                              })}
                                          `
                                        : html`
                                              ${preloader.map(() => {
                                                  return html`
                                                    <${EntrepotSaleCategoryCardElement}
                                                    ${assign(EntrepotSaleCategoryCardElement, {})}
                                                    ></${EntrepotSaleCategoryCardElement}>
                                                    `;
                                              })}
                                          `}
                                `,
                            })}
                        ></${EntrepotSaleCategoryTabElement}>
                    `
                    : ''
            }

            ${
                selectedTopTab?.value === 'inProgress'
                    ? html`
                        <${EntrepotSaleCategoryTabElement}
                            ${assign(EntrepotSaleCategoryTabElement, {
                                categoryName: 'In Progress',
                                children: html`
                                    ${state.inProgress && state.inProgress.length
                                        ? html`
                                              ${state.inProgress.map(collection => {
                                                  return html`
                                                        <${EntrepotSaleCategoryCardElement}
                                                            ${assign(
                                                                EntrepotSaleCategoryCardElement,
                                                                {
                                                                    collectionImageUrl:
                                                                        collection.collection,
                                                                    collectionName: collection.name,
                                                                    descriptionText:
                                                                        collection.brief,
                                                                    date: collection.sales.endDate,
                                                                    statsArray: [
                                                                        {
                                                                            title: 'PRICE',
                                                                            icon: Icp16Icon,
                                                                            stat: collection.sales
                                                                                .salePrice,
                                                                        },
                                                                        {
                                                                            title: 'SOLD',
                                                                            stat:
                                                                                Number(
                                                                                    collection.sales
                                                                                        .quantity,
                                                                                ) -
                                                                                Number(
                                                                                    collection.sales
                                                                                        .remaining,
                                                                                ),
                                                                        },
                                                                        {
                                                                            title: 'REMAINING',
                                                                            stat: collection.sales
                                                                                .remaining,
                                                                        },
                                                                    ],
                                                                    progress:
                                                                        collection.sales
                                                                            .percentMinted,
                                                                },
                                                            )}
                                                            ${listen('click', () => {
                                                                dispatch(
                                                                    new events.collectionSelected(
                                                                        collection,
                                                                    ),
                                                                );
                                                            })}
                                                        ></${EntrepotSaleCategoryCardElement}>
                                                    `;
                                              })}
                                          `
                                        : html`
                                              ${preloader.map(() => {
                                                  return html`
                                                <${EntrepotSaleCategoryCardElement}
                                                ${assign(EntrepotSaleCategoryCardElement, {})}
                                                ></${EntrepotSaleCategoryCardElement}>
                                                `;
                                              })}
                                          `}
                                `,
                            })}
                        ></${EntrepotSaleCategoryTabElement}>
                    `
                    : ''
            }

            ${
                selectedTopTab?.value === 'endingSoon'
                    ? html`
                        <${EntrepotSaleCategoryTabElement}
                            ${assign(EntrepotSaleCategoryTabElement, {
                                categoryName: 'Ending Soon',
                                children: html`
                                    ${state.endingSoon && state.endingSoon.length
                                        ? html`
                                              ${state.endingSoon.map(collection => {
                                                  return html`
                                                        <${EntrepotSaleCategoryCardElement}
                                                            ${assign(
                                                                EntrepotSaleCategoryCardElement,
                                                                {
                                                                    collectionImageUrl:
                                                                        collection.collection,
                                                                    collectionName: collection.name,
                                                                    descriptionText:
                                                                        collection.brief,
                                                                    date: collection.sales.endDate,
                                                                    statsArray: [
                                                                        {
                                                                            title: 'PRICE',
                                                                            icon: Icp16Icon,
                                                                            stat: collection.sales
                                                                                .salePrice,
                                                                        },
                                                                        {
                                                                            title: 'SOLD',
                                                                            stat:
                                                                                Number(
                                                                                    collection.sales
                                                                                        .quantity,
                                                                                ) -
                                                                                Number(
                                                                                    collection.sales
                                                                                        .remaining,
                                                                                ),
                                                                        },
                                                                        {
                                                                            title: 'REMAINING',
                                                                            stat: collection.sales
                                                                                .remaining,
                                                                        },
                                                                    ],
                                                                    progress:
                                                                        collection.sales
                                                                            .percentMinted,
                                                                },
                                                            )}
                                                            ${listen('click', () => {
                                                                dispatch(
                                                                    new events.collectionSelected(
                                                                        collection,
                                                                    ),
                                                                );
                                                            })}
                                                        ></${EntrepotSaleCategoryCardElement}>
                                                    `;
                                              })}
                                          `
                                        : html`
                                              ${preloader.map(() => {
                                                  return html`
                                                <${EntrepotSaleCategoryCardElement}
                                                ${assign(EntrepotSaleCategoryCardElement, {})}
                                                ></${EntrepotSaleCategoryCardElement}>
                                                `;
                                              })}
                                          `}
                                `,
                            })}
                        ></${EntrepotSaleCategoryTabElement}>
                    `
                    : ''
            }
        `;
    },
});

export const EntrepotSale = wrapInReactComponent(EntrepotSalePageElement);
