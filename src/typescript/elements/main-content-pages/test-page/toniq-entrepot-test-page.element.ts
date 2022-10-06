import {toniqFontStyles} from '@toniq-labs/design-system';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, defineElementNoInputs, listen} from 'element-vir';
import {entrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {entrepotFeaturedCollectionCardElement} from '../home-page/toniq-entrepot-featured-collection-card.element';
import {entrepotFlipCardElement} from '../../common/toniq-entrepot-flip-card.element';
import {SocialLinkTypeEnum} from '../../common/toniq-entrepot-social-link.element';
import {entrepotCarousel} from '../../common/toniq-entrepot-carousel.element';
import {entrepotHomePageTopCard} from '../home-page/toniq-entrepot-top-card.element';

const tabs: Readonly<[Readonly<TopTab>, Readonly<TopTab>]> = [
    {
        label: 'Top Collections',
    },
    {
        label: 'Past 24 Hours',
    },
];

const images = [
    'https://ixk4q-oiaaa-aaaaj-qap3q-cai.raw.ic0.app/?index=60',
    'https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?tokenid=wbxnk-kikor-uwiaa-aaaaa-cuaab-eaqca-aaaaa-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/l7ymd-vykor-uwiaa-aaaaa-cuaab-eaqca-aaeuc-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/bdnmm-2qkor-uwiaa-aaaaa-cuaab-eaqca-aabqo-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/5jigi-eqkor-uwiaa-aaaaa-cuaab-eaqca-aaea3-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/lnty5-uqkor-uwiaa-aaaaa-cuaab-eaqca-aaato-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/6h6x3-eakor-uwiaa-aaaaa-cuaab-eaqca-aabmr-q',
];

const entrepotTestElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-test-page',
    stateInit: {
        selectedTab: tabs[0],
        flipped: false,
    },
    styles: css`
        :host {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        h2 {
            ${toniqFontStyles.h2Font};
        }

        ${entrepotFlipCardElement} {
            height: 200px;
            width: 200px;
        }

        p {
            margin: 0;
            padding: 0;
        }
    `,
    renderCallback: ({state, updateState}) => {
        return html`
            <h2>Tabs</h2>
            <${entrepotTopTabsElement}
                ${assign(entrepotTopTabsElement, {
                    tabs,
                    selected: state.selectedTab,
                })}
                ${listen(entrepotTopTabsElement.events.tabChange, detail => {
                    updateState({selectedTab: detail.detail});
                })}
            ></${entrepotTopTabsElement}>
            
            <h2>Featured Collection Cards</h2>
            <${entrepotFeaturedCollectionCardElement}
                ${assign(entrepotFeaturedCollectionCardElement, {
                    collectionName: 'Motoko Ghosts',
                    imageUrls: images,
                    longDescription:
                        "On the Motoko programming language's 2nd birthday, the DFINITY Foundation distributed 10,000 Motoko ghosts designed by Jon Ball of Pokedstudios to the community.",
                    socialLinks: [
                        {
                            link: '',
                            type: SocialLinkTypeEnum.Discord,
                        },
                        {
                            link: '',
                            type: SocialLinkTypeEnum.Twitter,
                        },
                    ],
                })}></${entrepotFeaturedCollectionCardElement}>
            
            <h2>Flip Card</h2>
                <${entrepotFlipCardElement}
                    ${assign(entrepotFlipCardElement, {flipped: state.flipped})}
                    ${listen(entrepotFlipCardElement.events.flipChange, event => {
                        updateState({flipped: event.detail});
                    })}
                >
                    <div slot="front">FRONT</div>
                    <div slot="back">BACK</div>
                </${entrepotFlipCardElement}>
                
            <h2>Carousel</h2>
            <${entrepotCarousel}
                    ${assign(entrepotCarousel, {
                        items: [
                            ...images,
                            ...images,
                        ].map(url => {
                            return {
                                imageUrl: url,
                                link: '',
                            };
                        }),
                    })}
            ></${entrepotCarousel}>
            
            <h2>Home page top card</h2>
            ${[
                {
                    collectionName: 'Robits',
                    floorPrice: 200,
                    imageUrl: 'https://ixk4q-oiaaa-aaaaj-qap3q-cai.raw.ic0.app/?index=60',
                    volume: 130,
                    index: 6,
                },
                {
                    collectionName: 'Robits',
                    floorPrice: 200,
                    imageUrl: 'https://ixk4q-oiaaa-aaaaj-qap3q-cai.raw.ic0.app/?index=60',
                    volume: 130,
                },
                {
                    collectionName: 'Robits',
                    floorPrice: 200,
                    volume: 130,
                    index: 6,
                },
                {
                    collectionName: 'Robits',
                    floorPrice: 200,
                    volume: 130,
                },
            ].map(
                topCardInputs => html`
                    <${entrepotHomePageTopCard}
                        ${assign(entrepotHomePageTopCard, topCardInputs)}
                    ></${entrepotHomePageTopCard}>`,
            )}
            
        `;
    },
});

export const EntrepotTestPage = wrapInReactComponent(entrepotTestElement);
