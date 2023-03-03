import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {assign, css, html} from 'element-vir';
import {
    Api64Icon,
    CircleDashes64Icon,
    Rocket64Icon,
    toniqFontStyles,
    defineToniqElementNoInputs,
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
                text: 'Add Canister to Toniq',
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
                text: 'Add Canister to Toniq',
            },
        ],
    },
];

export const EntrepotCreatePageElement = defineToniqElementNoInputs({
    tagName: 'toniq-entrepot-create-page',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        ${EntrepotCreateCardElement} {
            flex-basis: 0;
            flex-grow: 1;
            max-width: 444px;
            min-width: 320px;
        }

        .cards-wrapper {
            display: flex;
            justify-content: center;
        }

        .cards {
            display: flex;
            gap: 16px;
            flex-grow: 1;
            max-width: 1600px;
            flex-wrap: wrap;
            justify-content: space-evenly;
            margin: 32px 0;
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
            <p>
                We offer a variety of tools for developers and non-developers to help build, launch
                and grow your business with NFTs.
            </p>
            <div class="cards-wrapper">
                <div class="cards">
                    ${createCards.map(createCard => {
                        return html`
                        <${EntrepotCreateCardElement}
                            ${assign(EntrepotCreateCardElement, {...createCard})}
                        ></${EntrepotCreateCardElement}>
                    `;
                    })}
                </div>
            </div>
        `;
    },
});

export const EntrepotCreate = wrapInReactComponent(EntrepotCreatePageElement);
