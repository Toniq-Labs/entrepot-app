import {defineElement, html, css, assign, listen} from 'element-vir';
import {
    EntrepotSocialLinkElement,
    SocialLinkDetails,
} from '../../../common/toniq-entrepot-social-link.element';
import {EntrepotFlipCardElement} from '../../../common/toniq-entrepot-flip-card.element';
import {ToniqButton, toniqFontStyles} from '@toniq-labs/design-system';

export type FeaturedCollectionInputs = Readonly<
    typeof EntrepotFeaturedCollectionCardElement['inputsType']
>;

export const EntrepotFeaturedCollectionCardElement = defineElement<{
    collectionName: string;
    imageUrls: ReadonlyArray<string>;
    longDescription: string;
    socialLinks: ReadonlyArray<SocialLinkDetails>;
}>()({
    tagName: 'toniq-entrepot-featured-collection-card',
    stateInit: {
        flipped: false,
    },
    styles: css`
        :host {
            display: inline-block;
            position: relative;
            flex-direction: column;
        }

        h3 {
            ${toniqFontStyles.h3Font};
            ${toniqFontStyles.extraBoldFont};
            margin: 0;
            margin-bottom: 20px;
            display: inline-block;
        }

        .card-face {
            display: flex;
            flex-direction: column;
            padding: 32px;
        }

        .pics {
            display: inline-grid;
            align-items: center;
            justify-items: center;
            gap: 16px;
            grid-template-columns: repeat(3, 180px);
            grid-template-rows: repeat(3, 180px);
        }

        img {
            max-width: 180px;
            max-height: 180px;
            border-radius: 16px;
        }

        img:first-of-type {
            max-width: 360px;
            max-height: 360px;
            grid-column: 1 / 3;
            grid-row: 1 / 3;
        }

        .card-footer {
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
        }

        .social-links {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        ${ToniqButton} {
            width: 378px;
        }

        p {
            flex-grow: 1;
            ${toniqFontStyles.paragraphFont};
        }

        .card-face.back {
            width: 100%;
            height: 100%;
            max-height: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        .card-face.back p {
            overflow-y: auto;
        }
    `,
    renderCallback: ({inputs, state, updateState}) => {
        const cardFooterTemplate = html`
            <div class="card-footer">
                <div class="social-links">
                    ${inputs.socialLinks.map(socialLink => {
                        return html`<${EntrepotSocialLinkElement} ${assign(
                            EntrepotSocialLinkElement,
                            {
                                socialLinkDetails: socialLink,
                            },
                        )}></${EntrepotSocialLinkElement}>`;
                    })}
                </div>
                <${ToniqButton}
                    ${assign(ToniqButton, {text: 'Explore'})}
                    ${listen('click', () => {
                        updateState({flipped: !state.flipped});
                    })}
                    class="toniq-button-outline"
                ></${ToniqButton}>
            </div>
        `;
        const cardHeaderTemplate = html`
            <h3>${inputs.collectionName}</h3>
        `;

        return html`
            <${EntrepotFlipCardElement}
                ${assign(EntrepotFlipCardElement, {flipped: state.flipped})}
            >
                <div class="card-face" slot="front">
                    ${cardHeaderTemplate}
                    <div class="pics">
                        ${inputs.imageUrls.slice(0, 6).map(imageUrl => {
                            return html`
                                <img src=${imageUrl} />
                            `;
                        })}
                    </div>
                    ${cardFooterTemplate}
                </div>
                <div class="card-face back" slot="back">
                    ${cardHeaderTemplate}
                    <p>${inputs.longDescription}</p>
                    ${cardFooterTemplate}
                </div>
            </${EntrepotFlipCardElement}>
        `;
    },
});
