import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {defineElement, html, css} from 'element-vir';
import {entrepotTopTabsElement} from '../../common/toniq-entrepot-top-tabs.element';

const entrepotHomePageElement = defineElement<{}>()({
    tagName: 'toniq-entrepot-home-page',
    styles: css`
        :host {
            flex-grow: 1;
            display: flex;
            margin-top: 200px;
            margin-left: 100px;
        }
    `,
    renderCallback: () => {
        return html`
            <${entrepotTopTabsElement}></${entrepotTopTabsElement}>
            yo there
        `;
    },
});

export const EntrepotHomePage = wrapInReactComponent(entrepotHomePageElement);
