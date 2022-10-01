import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {defineElement, html, css} from 'element-vir';

const entrepotHomepageElement = defineElement<{}>()({
    tagName: 'toniq-entrepot-homepage',
    styles: css`
        :host {
            display: block;
            margin-top: 200px;
            margin-left: 100px;
        }
    `,
    renderCallback: () => {
        return html`
            yo there
        `;
    },
});

export const EntrepotHomepage = wrapInReactComponent(entrepotHomepageElement);
