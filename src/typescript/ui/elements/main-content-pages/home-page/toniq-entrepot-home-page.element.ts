import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, listen} from 'element-vir';
import {EntrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {
    FeaturedCollectionInputs,
    EntrepotFeaturedCollectionCardElement,
} from './children/toniq-entrepot-featured-collection-card.element';
import {
    TopCardInputs,
    EntrepotHomePageTopCardElement,
} from './children/toniq-entrepot-top-card.element';
import {EntrepotCarouselElement} from '../../common/toniq-entrepot-carousel.element';
import {isTruthy} from '@augment-vir/common';
import {toniqColors, toniqFontStyles, defineToniqElement} from '@toniq-labs/design-system';
import {EntrepotHomePageTopCardHeaderElement} from './children/toniq-entrepot-top-card-header.element';
import {Collection} from '../../../../data/models/collection';

export const EntrepotHomePageElement = defineToniqElement<{
    featuredCollections: ReadonlyArray<FeaturedCollectionInputs>;
    topCollections: Readonly<Record<'allTime' | 'past24Hours', ReadonlyArray<TopCardInputs>>>;
    carouselItems: ReadonlyArray<Collection>;
}>()({
    tagName: 'toniq-entrepot-home-page',
    stateInit: {
        topCollectionsSelectedTab: undefined as undefined | TopTab<ReadonlyArray<TopCardInputs>>,
    },
    styles: css`
        :host {
            flex-grow: 1;
            display: flex;
            max-width: 100%;
            flex-direction: column;
            padding-bottom: 32px;
        }

        ${EntrepotTopTabsElement} {
            margin: 0 64px;
        }

        .featured-collections {
            margin: 0 64px;
            column-count: 2;
            column-gap: 32px;
            max-width: 100%;
        }

        .top-cards {
            column-count: 2;
            column-gap: 32px;
            margin: 64px;
            margin-top: 16px;
        }

        .top-cards > * {
            width: 100%;
            max-width: 100%;
            margin-bottom: 16px;
        }

        .top-cards-header {
            display: flex;
            column-count: 2;
            column-gap: 32px;
            margin: 64px;
            margin-bottom: 0;
            margin-top: 24px;
        }

        .top-cards-header > * {
            width: 100%;
        }

        h2 {
            ${toniqFontStyles.h2Font};
            ${toniqFontStyles.extraBoldFont};
            border-bottom: 1px solid ${toniqColors.divider.foregroundColor};
            margin: 40px 64px;
            text-align: center;
            padding-bottom: 12px;
        }

        ${EntrepotFeaturedCollectionCardElement} {
            max-width: 100%;
            margin-bottom: 32px;
        }

        @media (max-width: 1200px) and (min-width: 900px), (max-width: 600px) {
            .top-cards-header,
            .top-cards,
            .featured-collections,
            ${EntrepotTopTabsElement}, h2 {
                margin-right: 0;
                margin-left: 0;
            }
        }

        @media (max-width: 900px) {
            .top-cards-header,
            .top-cards,
            .featured-collections {
                column-count: 1;
            }

            .top-cards-header > :last-of-type {
                display: none;
            }
        }
    `,
    renderCallback: ({inputs, state, updateState}) => {
        const tabs: ReadonlyArray<TopTab<ReadonlyArray<TopCardInputs>>> = [
            inputs.topCollections.past24Hours.length
                ? {
                      label: 'Past 24 Hours',
                      value: inputs.topCollections.past24Hours,
                  }
                : undefined,
            inputs.topCollections.allTime.length
                ? {
                      label: 'All Time',
                      value: inputs.topCollections.allTime,
                  }
                : undefined,
        ].filter(isTruthy);

        const selectedTopTab: TopTab<ReadonlyArray<TopCardInputs>> | undefined =
            state.topCollectionsSelectedTab ?? tabs[0];
        const selectedTopCards: ReadonlyArray<TopCardInputs> = selectedTopTab?.value ?? [];

        const topCardsToShow = selectedTopCards.slice(0, 10);
        const headerCount = topCardsToShow.length > 5 ? 2 : 1;

        return html`
            <${EntrepotCarouselElement}
                ${assign(EntrepotCarouselElement, {
                    items: inputs.carouselItems,
                    automaticRotation: true,
                })}
            ></${EntrepotCarouselElement}>
            
            ${
                selectedTopTab
                    ? html`
                        <${EntrepotTopTabsElement}
                            ${assign(EntrepotTopTabsElement, {
                                tabs,
                                selected: selectedTopTab,
                            })}
                            ${listen(EntrepotTopTabsElement.events.tabChange, event => {
                                const selectedTab = event.detail as TopTab<
                                    ReadonlyArray<TopCardInputs>
                                >;
                                updateState({topCollectionsSelectedTab: selectedTab});
                            })}
                        ></${EntrepotTopTabsElement}>`
                    : ''
            }
            <div class="top-cards-header">
                ${Array(headerCount)
                    .fill(0)
                    .map(() => {
                        return html`
                            <${EntrepotHomePageTopCardHeaderElement}
                                ${assign(EntrepotHomePageTopCardHeaderElement, {
                                    hasImage: true,
                                    hasIndex: true,
                                })}
                            ></${EntrepotHomePageTopCardHeaderElement}>`;
                    })}
            </div>
            <div class="top-cards">
                ${topCardsToShow.map(topCard => {
                    return html`
                        <${EntrepotHomePageTopCardElement}
                            ${assign(EntrepotHomePageTopCardElement, topCard)}
                        ></${EntrepotHomePageTopCardElement}>
                    `;
                })}
            </div>
            
            <h2>
                Featured
            </h2>
            <div class="featured-collections">
                ${inputs.featuredCollections.map(featuredCollection => {
                    return html`
                        <${EntrepotFeaturedCollectionCardElement}
                            ${assign(EntrepotFeaturedCollectionCardElement, featuredCollection)}
                        ></${EntrepotFeaturedCollectionCardElement}>
                        `;
                })}
            </div>
        `;
    },
});

export const EntrepotHomePage = wrapInReactComponent(EntrepotHomePageElement);
