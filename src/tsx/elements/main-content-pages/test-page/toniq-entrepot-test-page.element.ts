import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {defineElement, html, css, assign, defineElementNoInputs} from 'element-vir';
import {entrepotTopTabsElement} from '../../common/toniq-entrepot-top-tabs.element';

const entrepotTestElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-test-page',
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
            <${entrepotTopTabsElement} ${assign(entrepotTopTabsElement, {
            tabs: [
                {
                    label: 'Top Collections',
                },
                {
                    label: 'Past 24 Hours',
                },
            ],
        })}></${entrepotTopTabsElement}>
        `;
    },
});

export const EntrepotTestPage = wrapInReactComponent(entrepotTestElement);
