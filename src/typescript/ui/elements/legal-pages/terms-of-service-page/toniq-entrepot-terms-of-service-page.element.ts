import {css, defineElementNoInputs, html} from 'element-vir';
import {termsOfServiceTemplate} from './terms-of-service-template';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';

export const EntrepotTermsOfServicePageElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-terms-of-service-page',
    styles: css`
        :host {
            display: block;
        }

        @media (max-width: 1200px) {
            :host {
                padding: 16px;
            }
        }
    `,
    renderCallback: () => {
        return html`
            ${termsOfServiceTemplate}
        `;
    },
});

export const EntrepotTermsOfService = wrapInReactComponent(EntrepotTermsOfServicePageElement);
