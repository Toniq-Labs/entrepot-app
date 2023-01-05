import randomWords from 'random-words';
import {toniqFontStyles} from '@toniq-labs/design-system';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, defineElementNoInputs} from 'element-vir';
import {EntrepotFlipCardElement} from '../../common/toniq-entrepot-flip-card.element';
import {SocialLinkTypeEnum} from '../../common/toniq-entrepot-social-link.element';
import {EntrepotHomePageElement} from '../home-page/toniq-entrepot-home-page.element';
import {shuffle} from '../../../../augments/array';

const images = [
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

const doubleImages = shuffle([
    ...images,
    ...images,
]);

function makeTopCards() {
    return shuffle(doubleImages).map((imageUrl, index) => {
        const simpleFloorPrice = !!Math.round(Math.random());
        const simpleVolume = !!Math.round(Math.random());

        return {
            collectionName: randomWords({min: 1, max: 3, join: ' '}),
            floorPrice: simpleFloorPrice
                ? Math.round(Math.random() * 10) * 100
                : Math.random() * 10_000,
            volume: simpleVolume
                ? Math.round(Math.random() * 10) * 1_000
                : Math.random() * 10_000_000,
            imageUrl: imageUrl,
            index: index + 1,
        };
    });
}

const homepageInputs: typeof EntrepotHomePageElement['inputsType'] = {
    carouselItems: doubleImages.map(url => {
        return {
            imageUrl: url,
            link: '',
        };
    }),
    featuredCollections: Array(4)
        .fill(0)
        .map(() => {
            return {
                collectionName: 'Motoko Ghosts',
                imageUrls: shuffle(images),
                longDescription: randomWords({min: 50, max: 2000, join: ' '}),
                collectionRoute: '',
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
            };
        }),
    topCollections: {
        past24Hours: makeTopCards(),
        top: makeTopCards(),
    },
};

const EntrepotTestElement = defineElementNoInputs({
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
    renderCallback: () => {
        return html`
            <${EntrepotHomePageElement}
                ${assign(EntrepotHomePageElement, homepageInputs)}
            ></${EntrepotHomePageElement}>
            
        `;
    },
});

export const EntrepotTestPage = wrapInReactComponent(EntrepotTestElement);
