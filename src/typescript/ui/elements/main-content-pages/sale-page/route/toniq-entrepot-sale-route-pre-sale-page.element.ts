import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {css, defineElement, html} from 'element-vir';
import {Collection} from '../../../../../data/models/collection';

export const EntrepotSaleRoutePreSalePageElement = defineElement<{
    collections: Array<Collection>;
}>()({
    tagName: 'toniq-entrepot-sale-route-pre-sale-page',
    styles: css``,
    renderCallback: () => {
        return html`
            <div>Pre Sale</div>
        `;
    },
});

export const EntrepotSaleRoutePreSalePage = wrapInReactComponent(
    EntrepotSaleRoutePreSalePageElement,
);
