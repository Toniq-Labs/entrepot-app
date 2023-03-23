import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {css, defineElement, html} from 'element-vir';
import {Collection} from '../../../../../data/models/collection';

export const EntrepotSaleRouteLiveSalePageElement = defineElement<{
    collections: Array<Collection>;
}>()({
    tagName: 'toniq-entrepot-sale-route-live-sale-page',
    styles: css``,
    renderCallback: () => {
        return html`
            <div>Live Sale</div>
        `;
    },
});

export const EntrepotSaleRouteLiveSalePage = wrapInReactComponent(
    EntrepotSaleRouteLiveSalePageElement,
);
