import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElement, html, listen} from 'element-vir';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';

export const EntrepotAllLaunchesPageElement = defineElement<{}>()({
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
    events: {},
    stateInit: {
        allLaunchesSelectedTab: undefined as undefined | TopTab,
    },
    renderCallback: ({state, updateState}) => {
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
		`;
    },
});

export const EntrepotAllLaunches = wrapInReactComponent(EntrepotAllLaunchesPageElement);
