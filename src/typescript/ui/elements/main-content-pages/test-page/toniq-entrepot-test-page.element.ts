import {defineToniqElement, toniqFontStyles} from '@toniq-labs/design-system';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, defineElementEvent, listen} from 'element-vir';
import {EntrepotFlipCardElement} from '../../common/toniq-entrepot-flip-card.element';
import {SocialLinkTypeEnum} from '../../common/toniq-entrepot-social-link.element';
import {EntrepotHomePageElement} from '../home-page/toniq-entrepot-home-page.element';
import {Collection} from '../../../../data/models/collection';
import {encodeNftId} from '../../../../api/ext';
import {decodeNftId, getExtNftId} from '../../../../data/nft/nft-id';
import {NftImageInputs} from '../../../../data/canisters/get-nft-image-data';
import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {FeaturedCollectionInputs} from '../home-page/children/toniq-entrepot-featured-collection-card.element';
import {TopCardInputs} from '../home-page/children/toniq-entrepot-top-card.element';
import {NftRoute} from '../../common/toniq-entrepot-carousel.element';
import {CanisterId} from '../../../../data/models/canister-id';
import {ValidIcp} from '../../../../data/icp';
import {bannerCanisters} from './toniq-entrepot-home-page-banner-canister';
import {featuredCanisters} from './toniq-entrepot-home-page-featured-canister';

type TopVolume = {
    canisterId: CanisterId;
    volumeE8s: ValidIcp;
    floorPriceE8s: ValidIcp;
};

function formatTopCollection(collections: ReadonlyArray<Collection>, canisters: Array<TopVolume>) {
    return canisters.map((canister: TopVolume, collectionIndex: number) => {
        const collectionMatch = collections.find(
            (collection: Collection) => collection.canister === canister.canisterId,
        );
        return {
            collectionName: collectionMatch ? collectionMatch.name : '',
            floorPrice: Number(canister.floorPriceE8s) / 100000000,
            volume: Number(canister.volumeE8s) / 100000000,
            index: collectionIndex + 1,
            route: collectionMatch ? collectionMatch.route : '',
            id: canister.canisterId,
        };
    });
}

async function fetchLast24hData(collections: ReadonlyArray<Collection>) {
    const data = await fetch('https://api.nftgeek.app/api/1/toniq/top/volume/last24h').then(r =>
        r.json(),
    );
    return formatTopCollection(collections, data.canisters);
}

async function fetchAllTimeData(collections: ReadonlyArray<Collection>) {
    const data = await fetch('https://api.nftgeek.app/api/1/toniq/top/volume/allTime').then(r =>
        r.json(),
    );
    return formatTopCollection(collections, data.canisters);
}

function setIntervalImmediately(func: Function, interval: number) {
    func();
    return setInterval(func, interval);
}

const EntrepotTestElement = defineToniqElement<{
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
    initCallback: async ({inputs, updateState}) => {
        const carouselItems = inputs.collections
            .filter(collection => !collection.dev)
            .filter(collection => {
                return bannerCanisters.includes(collection.canister);
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
        const featuredCollections = inputs.collections
            .filter(collection => !collection.dev)
            .filter(collection => {
                return featuredCanisters.includes(collection.canister);
            })
            .slice(0, 4)
            .map(collection => {
                return {
                    collectionName: collection.name,
                    nfts: Array(10)
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

        setIntervalImmediately(async () => {
            const topCollections = {
                past24Hours: await fetchLast24hData(inputs.collections),
                allTime: await fetchAllTimeData(inputs.collections),
            };
            updateState({topCollections});
        }, 60000);
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
