import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, defineElementNoInputs, html} from 'element-vir';
import {
    Api64Icon,
    CircleDashes64Icon,
    Rocket64Icon,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {EntrepotPageHeaderElement} from '../../common/toniq-entrepot-page-header.element';
import {EntrepotCreateCardElement, CreateCardInputs} from './toniq-entrepot-create-card.element';

const createCards: ReadonlyArray<CreateCardInputs> = [
    {
        icon: Rocket64Icon,
        title: 'Launchpad',
        bullets: [
            'No-code',
            'Highly customizable first come first serve launch page',
            'No canister code customization',
            'No application integration',
            'Closed beta',
        ],
        buttons: [
            {
                primary: false,
                text: 'Access Closed Beta',
            },
            {
                primary: true,
                text: 'Apply for Closed Beta',
            },
        ],
    },
    {
        icon: Api64Icon,
        title: 'CLI / Open API',
        bullets: [
            'Low-code',
            'Does not support custom mint page',
            'Minimum canister code customization',
            'Supports application integration',
            'Open beta',
        ],
        buttons: [
            {
                primary: false,
                text: 'GitHub',
            },
            {
                primary: true,
                text: 'Add Canister to Entrepot',
            },
        ],
    },
    {
        icon: CircleDashes64Icon,
        title: 'Token Standard',
        subtitle: '(EXT)',
        bullets: [
            'Code',
            'Does not support custom mint page',
            'Maximum canister code customization',
            'Supports application integration',
            'Closed beta',
        ],
        buttons: [
            {
                primary: false,
                text: 'GitHub',
            },
            {
                primary: true,
                text: 'Add Canister to Entrepot',
            },
        ],
    },
];

export const EntrepotCreatePageElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-create-page',
    styles: css`
        :host {
            display: block;
            min-height: 100vh;
        }

        ${EntrepotCreateCardElement} {
            width: 444px;
        }

        .cards {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
            justify-content: space-evenly;
            margin: 0 32px;
        }

        p {
            margin: 32px 32px 56px;
            ${toniqFontStyles.paragraphFont}
        }

        @media (max-width: 1200px) {
            :host {
                padding: 16px;
            }
        }
    `,
    renderCallback: () => {
        return html`
            <${EntrepotPageHeaderElement}
                ${assign(EntrepotPageHeaderElement, {
                    headerText: 'Toniq Create',
                })}
            ></${EntrepotPageHeaderElement}>
            <p>We offer a variety of tools for developers and non-developers to help build, launch and grow your business with NFTs.</p>
            <div class="cards">
                ${createCards.map(createCard => {
                    return html`
                        <${EntrepotCreateCardElement}
                            ${assign(EntrepotCreateCardElement, {...createCard})}
                        ></${EntrepotCreateCardElement}>
                    `;
                })}
            </div>
        `;
    },
});

export const EntrepotCreate = wrapInReactComponent(EntrepotCreatePageElement);
