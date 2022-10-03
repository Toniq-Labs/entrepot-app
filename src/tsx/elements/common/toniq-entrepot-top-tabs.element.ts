import {defineElement, listen, defineElementEvent, html, css} from 'element-vir';
import {toniqFontStyles} from '@toniq-labs/design-system';

export type TopTab = {
    label: string;
};

export const entrepotTopTabsElement = defineElement<{tabs: TopTab[]}>()({
    tagName: 'toniq-entrepot-top-tabs',
    styles: css`
        :host {
            display: flex;
            ${toniqFontStyles.paragraphFont};
        }

        button {
        }

        ul {
            padding: 0;
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
        }

        li {
        }
    `,
    events: {
        tabChange: defineElementEvent<TopTab>(),
    },
    renderCallback: ({inputs, dispatch, events}) => {
        return html`
            <ul>
                ${inputs.tabs.map(tab =>
                    makeTopTab(tab, () => {
                        dispatch(new events.tabChange(tab));
                    }),
                )}
            </ul>
        `;
    },
});

function makeTopTab(tab: TopTab, clickCallback: () => void) {
    return html`
        <li ${listen('click', clickCallback)}>
            <button>${tab.label}</button>
        </li>
    `;
}
