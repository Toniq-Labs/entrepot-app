import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Collection} from '../../../../data/models/collection';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {getCollectionSales} from '../../../../data/local-cache/get-sales';
import {Account, CollectionSales} from '../../../../data/models/sales';
import moment from 'moment';
import {EntrepotAllLaunchesFeatureTabElement} from './tabs/toniq-entrepot-all-launches-feature-tab.element';

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
    renderCallback: ({state, updateState, events}) => {
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

            ${
                selectedTopTab?.value === 'featured'
                    ? html`
                        <${EntrepotAllLaunchesFeatureTabElement}
                            ${assign(EntrepotAllLaunchesFeatureTabElement, {
                                upcoming: state.upcoming,
                                inProgress: state.inProgress,
                                endingSoon: state.endingSoon,
                            })}
                            ${listen(
                                EntrepotAllLaunchesFeatureTabElement.events.collectionSelected,
                                event => {
                                    new events.collectionSelected(event.detail);
                                },
                            )}
                        ></${EntrepotAllLaunchesFeatureTabElement}>
                    `
                    : ''
            }
		`;
    },
});

export const EntrepotAllLaunches = wrapInReactComponent(EntrepotAllLaunchesPageElement);
