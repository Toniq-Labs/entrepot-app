import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, defineElement, html} from 'element-vir';
import moment from 'moment';
import {getCollectionSales} from '../../../../../data/local-cache/dexie/get-sales';
import {Collection} from '../../../../../data/models/collection';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotSaleRoutePreSalePageElement} from './toniq-entrepot-sale-route-pre-sale-page.element';
import {EntrepotSaleRouteLiveSalePageElement} from './toniq-entrepot-sale-route-live-sale-page.element';
import {encodeNftId} from '../../../../../api/ext';
import {decodeNftId} from '../../../../../data/nft/nft-id';

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

        const tokenid = encodeNftId(
            collectionSale.canister,
            Math.floor(Math.random() * (collectionSale.stats?.listings! - 0) + 0),
        );
        const {index, canister} = decodeNftId(tokenid);
        const nftImageInputs = {
            collectionId: canister,
            fullSize: false,
            cachePriority: 0,
            nftId: tokenid,
            nftIndex: index,
            ref: 0,
            min: {width: 500, height: 500},
            max: {width: 500, height: 500},
        };
        if (moment(collectionSale.sales.startDate).isAfter(moment())) {
            return html`
                <${EntrepotSaleRoutePreSalePageElement}
                    ${assign(EntrepotSaleRoutePreSalePageElement, {
                        collectionSale,
                        nftImageInputs,
                    })}
                />
            `;
        } else if (
            moment(collectionSale.sales.startDate).isBefore(moment()) &&
            moment(collectionSale.sales.endDate).isAfter(moment())
        ) {
            return html`
                <${EntrepotSaleRouteLiveSalePageElement}
                    ${assign(EntrepotSaleRouteLiveSalePageElement, {
                        collectionSale,
                        nftImageInputs,
                    })}
                />
            `;
        } else {
            return html`
                <${EntrepotSaleRouteLiveSalePageElement}
                    ${assign(EntrepotSaleRouteLiveSalePageElement, {
                        collectionSale,
                        nftImageInputs,
                    })}
                />
            `;
        }
    },
});

export const EntrepotSaleRoutePage = wrapInReactComponent(EntrepotSaleRoutePageElement);
