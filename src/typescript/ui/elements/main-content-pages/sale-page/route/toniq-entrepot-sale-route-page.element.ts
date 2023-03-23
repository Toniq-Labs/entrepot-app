import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {defineElement, html} from 'element-vir';
import moment from 'moment';
import {getCollectionSales} from '../../../../../data/local-cache/dexie/get-sales';
import {Collection} from '../../../../../data/models/collection';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotSaleRoutePreSalePage} from './toniq-entrepot-sale-route-pre-sale-page.element';
import {EntrepotSaleRouteLiveSalePage} from './toniq-entrepot-sale-route-live-sale-page.element';

export const EntrepotSaleRoutePageElement = defineElement<{
    collections: Array<Collection>;
}>()({
    tagName: 'toniq-entrepot-sale-route-page',
    stateInit: {
        route: '',
        collectionSale: undefined as CollectionSales | undefined,
        collectionSales: [] as Array<CollectionSales> | Array<CollectionSales>,
    },
    initCallback: ({inputs, updateState}) => {
        const saleCollections = inputs.collections.filter(collection => collection.sale);
        getCollectionSales(saleCollections).then((collectionSales: CollectionSales[]) => {
            updateState({collectionSales});
        });
    },
    renderCallback: ({state}) => {
        const route = window.location.pathname.replace(/\/sale\//, '');
        const collectionSale = state.collectionSales.find(collection => collection.route === route);

        if (collectionSale === undefined) return;

        if (moment(collectionSale.sales.startDate).isAfter(moment())) {
            return html`
                <${EntrepotSaleRoutePreSalePage} />
            `;
        } else if (moment(collectionSale.sales.endDate).isBefore(moment())) {
            return html`
                <${EntrepotSaleRouteLiveSalePage} />
            `;
        } else {
            return html`
                <${EntrepotSaleRouteLiveSalePage} />
            `;
        }
    },
});

export const EntrepotSaleRoutePage = wrapInReactComponent(EntrepotSaleRoutePageElement);
