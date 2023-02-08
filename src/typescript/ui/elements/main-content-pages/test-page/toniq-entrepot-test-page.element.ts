import {toniqFontStyles} from '@toniq-labs/design-system';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, defineElement, defineElementEvent, listen} from 'element-vir';
import {EntrepotFlipCardElement} from '../../common/toniq-entrepot-flip-card.element';
import {SocialLinkTypeEnum} from '../../common/toniq-entrepot-social-link.element';
import {EntrepotHomePageElement} from '../home-page/toniq-entrepot-home-page.element';
import {shuffle} from '../../../../augments/array';
import {Collection} from '../../../../data/models/collection';
import {mockCanister} from './toniq-entrepot-home-page-mock-canister';
import {encodeNftId} from '../../../../api/ext';
import {decodeNftId, getExtNftId} from '../../../../data/nft/nft-id';
import {NftImageInputs} from '../../../../data/canisters/get-nft-image-data';
import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {FeaturedCollectionInputs} from '../home-page/children/toniq-entrepot-featured-collection-card.element';
import {TopCardInputs} from '../home-page/children/toniq-entrepot-top-card.element';
import {NftRoute} from '../../common/toniq-entrepot-carousel.element';

const mockImages = [
    'https://ixk4q-oiaaa-aaaaj-qap3q-cai.raw.ic0.app/?index=60',
    'https://mtohu-naaaa-aaaaj-qaqfq-cai.raw.ic0.app/?index=90',
    'https://mtohu-naaaa-aaaaj-qaqfq-cai.raw.ic0.app/?index=95',
    'https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?tokenid=wbxnk-kikor-uwiaa-aaaaa-cuaab-eaqca-aaaaa-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/l7ymd-vykor-uwiaa-aaaaa-cuaab-eaqca-aaeuc-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/bdnmm-2qkor-uwiaa-aaaaa-cuaab-eaqca-aabqo-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/5jigi-eqkor-uwiaa-aaaaa-cuaab-eaqca-aaea3-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/lnty5-uqkor-uwiaa-aaaaa-cuaab-eaqca-aaato-a',
    'https://images.entrepot.app/t/oeee4-qaaaa-aaaak-qaaeq-cai/6h6x3-eakor-uwiaa-aaaaa-cuaab-eaqca-aabmr-q',
    'https://3mttv-dqaaa-aaaah-qcn6q-cai.raw.ic0.app/?tokenid=bpyc6-4ikor-uwiaa-aaaaa-b4atp-uaqca-aaalj-a',
    'https://3mttv-dqaaa-aaaah-qcn6q-cai.raw.ic0.app/?tokenid=uw3jp-yqkor-uwiaa-aaaaa-b4atp-uaqca-aabgz-a',
    'https://5movr-diaaa-aaaak-aaftq-cai.raw.ic0.app/?tokenid=ulllm-aakor-uwiaa-aaaaa-cqabm-4aqca-aab3v-q',
    'https://5movr-diaaa-aaaak-aaftq-cai.raw.ic0.app/?tokenid=mijgx-uikor-uwiaa-aaaaa-cqabm-4aqca-aaamu-q',
] as const;

function makeTopCards(
    highlights: (Collection & NftImageInputs & PartialAndNullable<DimensionConstraints>)[],
) {
    return shuffle(highlights).map((highlight, index) => {
        return {
            collectionName: highlight.name,
            floorPrice: highlight.stats?.floor
                ? Number(highlight.stats?.floor)
                : Math.random() * 10_000,
            volume: highlight.stats?.listings
                ? highlight.stats?.listings
                : Math.random() * 10_000_000,
            index: index + 1,
            id: highlight.id,
        };
    });
}

const EntrepotTestElement = defineElement<{
    collections: Array<Collection>;
}>()({
    tagName: 'toniq-entrepot-test-page',
    styles: css`
        :host {
            max-width: 100%;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        h2 {
            ${toniqFontStyles.h2Font};
        }

        ${EntrepotFlipCardElement} {
            height: 200px;
            width: 200px;
        }

        p {
            margin: 0;
            padding: 0;
        }
    `,
    stateInit: {
        carouselItems: [] as
            | Array<
                  Collection & NftRoute & NftImageInputs & PartialAndNullable<DimensionConstraints>
              >
            | Array<
                  Collection & NftRoute & NftImageInputs & PartialAndNullable<DimensionConstraints>
              >,
        featuredCollections: [] as
            | Array<FeaturedCollectionInputs>
            | Array<FeaturedCollectionInputs>,
        topCollections: {} as
            | Record<'allTime' | 'past24Hours', ReadonlyArray<TopCardInputs>>
            | Record<'allTime' | 'past24Hours', ReadonlyArray<TopCardInputs>>,
    },
    initCallback: ({inputs, updateState}) => {
        const carouselItems = inputs.collections
            .filter(collection => !collection.dev)
            .filter(collection => {
                return mockCanister.includes(collection.canister);
            })
            .slice(0, 26)
            .map(collection => {
                const tokenid = encodeNftId(
                    collection.canister,
                    Math.floor(Math.random() * (collection.stats?.listings! - 0) + 0),
                );
                const {index, canister} = decodeNftId(tokenid);
                const nftRoute = getExtNftId(tokenid);
                return {
                    ...collection,
                    nftRoute,
                    collectionId: canister,
                    fullSize: false,
                    cachePriority: 0,
                    nftId: tokenid,
                    nftIndex: index,
                    ref: 0,
                    min: {width: 360, height: 360},
                    max: {width: 360, height: 360},
                };
            });
        updateState({carouselItems});

        const featuredCollections = carouselItems.slice(0, 4).map(collection => {
            return {
                collectionName: collection.name,
                nfts: Array(3)
                    .fill(0)
                    .map(() => {
                        const tokenid = encodeNftId(
                            collection.canister,
                            Math.floor(Math.random() * (collection.stats?.listings! - 0) + 0),
                        );
                        const {index, canister} = decodeNftId(tokenid);

                        return {
                            collectionId: canister,
                            nftId: tokenid,
                            nftIndex: index,
                            fullSize: true,
                            cachePriority: 0,
                            ref: 0,
                        };
                    }),
                longDescription: collection.blurb,
                collectionRoute: collection.route,
                socialLinks: [
                    {
                        link: collection.discord,
                        type: SocialLinkTypeEnum.Discord,
                    },
                    {
                        link: collection.twitter,
                        type: SocialLinkTypeEnum.Twitter,
                    },
                    {
                        link: collection.telegram,
                        type: SocialLinkTypeEnum.Telegram,
                    },
                ].filter(social => social.link !== ''),
            };
        });
        updateState({featuredCollections});

        const topCollections = {
            past24Hours: makeTopCards(carouselItems),
            allTime: makeTopCards(carouselItems),
        };
        updateState({topCollections});
    },
    events: {
        collectionRouteClicked: defineElementEvent<string>(),
    },
    renderCallback: ({state, events}) => {
        const homepageInputs: (typeof EntrepotHomePageElement)['inputsType'] = {
            carouselItems: state.carouselItems,
            featuredCollections: state.featuredCollections,
            topCollections: state.topCollections,
        };
        return html`
            <${EntrepotHomePageElement}
                ${assign(EntrepotHomePageElement, homepageInputs)}
                ${listen(EntrepotHomePageElement.events.collectionRouteClicked, event => {
                    new events.collectionRouteClicked(event.detail);
                })}
            ></${EntrepotHomePageElement}>
            
        `;
    },
});

export const EntrepotTestPage = wrapInReactComponent(EntrepotTestElement);
