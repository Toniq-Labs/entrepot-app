import {html, css, assign, listen, defineElementEvent} from 'element-vir';
import {
    EntrepotSocialLinkElement,
    SocialLinkDetails,
} from '../../../common/toniq-entrepot-social-link.element';
import {EntrepotFlipCardElement} from '../../../common/toniq-entrepot-flip-card.element';
import {ToniqButton, toniqFontStyles, defineToniqElement} from '@toniq-labs/design-system';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

export type FeaturedCollectionInputs = {
    collectionName: string;
    nfts: ReadonlyArray<NftImageInputs>;
    longDescription: string;
    socialLinks: ReadonlyArray<SocialLinkDetails>;
    collectionRoute: string;
};

export const EntrepotFeaturedCollectionCardElement = defineToniqElement<FeaturedCollectionInputs>()(
    {
        tagName: 'toniq-entrepot-featured-collection-card',
        stateInit: {
            flipped: false,
        },
        events: {
            collectionRouteClicked: defineElementEvent<string>(),
        },
        styles: css`
            :host {
                display: inline-block;
                position: relative;
                flex-direction: column;
                --big-pic-size: 360px;
                --pic-gap: 8px;
                --small-pic-size: calc(calc(var(--big-pic-size) - var(--pic-gap)) / 2);
            }

            /* so that the card flip always happens in front of other elements */
            :host(:hover) {
                z-index: 10;
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
                display: flex;
                flex-wrap: wrap;
                max-height: var(--big-pic-size);
                overflow: hidden;
                justify-content: space-evenly;
                gap: 2px;
            }

            .secondary-pics {
                flex-basis: var(--small-pic-size);
                justify-content: space-evenly;
                row-gap: var(--pic-gap);
                column-gap: 2px;
                flex-grow: 1;
                max-height: 100%;
                display: flex;
                flex-wrap: wrap;
            }

            ${EntrepotFlipCardElement} {
                width: 100%;
            }

            .big-pic-wrapper {
                max-width: 100%;
                flex-shrink: 0;
                width: var(--big-pic-size);
                height: var(--big-pic-size);
            }

            .pic-wrapper {
                width: var(--small-pic-size);
                height: var(--small-pic-size);
            }

            .big-pic-wrapper,
            .pic-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            img {
                max-width: 100%;
                max-height: 100%;
                border-radius: 16px;
            }

            .card-footer {
                display: inline-flex;
                flex-direction: row-reverse;
                flex-wrap: wrap;
                align-items: center;
                flex-shrink: 0;
                max-height: 48px;
                overflow: hidden;
                justify-content: space-between;
                margin-top: 24px;
                gap: 16px;
            }

            .social-links {
                display: flex;
                flex-wrap: wrap;
                flex-basis: 24px;
                align-items: center;
                max-height: 24px;
                overflow: hidden;
                gap: 16px;
                flex-grow: 1;
            }

            .buttons {
                display: flex;
                gap: 8px;
                flex-grow: 1;
                justify-content: flex-end;
            }

            ${ToniqButton} {
                flex-grow: 2;
                white-space: nowrap;
                max-width: calc(var(--small-pic-size) * 2);
            }

            .explore-button {
                flex-grow: 1;
                max-width: var(--small-pic-size);
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
        renderCallback: ({inputs, state, updateState, dispatch, events}) => {
            const cardFooterTemplate = html`
            <div class="card-footer">
                <!-- the card-footer children are reversed in order so that when it wraps, the social links get wrapped, not the buttons -->
                <div class="buttons">
                    <${ToniqButton}
                        class="toniq-button-outline"
                        ${assign(ToniqButton, {text: 'View Collection'})}
                        ${listen('click', () => {
                            dispatch(new events.collectionRouteClicked(inputs.collectionRoute));
                        })}
                    ></${ToniqButton}>
                    <${ToniqButton}
                        class="explore-button"
                        ${assign(ToniqButton, {text: !state.flipped ? 'More Info' : 'Back'})}
                        ${listen('click', () => {
                            updateState({flipped: !state.flipped});
                        })}
                    ></${ToniqButton}>
                </div>
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
                        <div class="big-pic-wrapper">
                            <${EntrepotNftDisplayElement}
                                ${assign(EntrepotNftDisplayElement, {
                                    collectionId: inputs.nfts[0]!.collectionId,
                                    fullSize: inputs.nfts[0]!.fullSize,
                                    cachePriority: inputs.nfts[0]!.cachePriority,
                                    nftId: inputs.nfts[0]!.nftId,
                                    nftIndex: inputs.nfts[0]!.nftIndex,
                                    ref: inputs.nfts[0]!.ref,
                                    min: {width: 360, height: 360},
                                    max: {width: 360, height: 360},
                                })}
                            ></${EntrepotNftDisplayElement}>
                        </div>
                        <div class="secondary-pics">
                            ${inputs.nfts.slice(1).map(nfts => {
                                const {collectionId, cachePriority, nftId, nftIndex, ref} = nfts;
                                return html`
                                    <div class="pic-wrapper">
                                        <${EntrepotNftDisplayElement}
                                            ${assign(EntrepotNftDisplayElement, {
                                                collectionId,
                                                fullSize: false,
                                                cachePriority,
                                                nftId,
                                                nftIndex,
                                                ref,
                                                min: {width: 176, height: 176},
                                                max: {width: 176, height: 176},
                                            })}
                                        ></${EntrepotNftDisplayElement}>
                                    </div>
                                `;
                            })}
                        </div>
                    </div>
                    ${cardFooterTemplate}
                </div>
                <div class="card-face back" slot="back">
                    ${cardHeaderTemplate}
                    <p>${unsafeHTML(inputs.longDescription)}</p>
                    ${cardFooterTemplate}
                </div>
            </${EntrepotFlipCardElement}>
        `;
        },
    },
);
