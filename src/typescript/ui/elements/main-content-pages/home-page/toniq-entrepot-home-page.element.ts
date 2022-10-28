import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {defineElement, html, css, assign, listen} from 'element-vir';
import {entrepotTopTabsElement, TopTab} from '../../common/toniq-entrepot-top-tabs.element';
import {
    FeaturedCollectionInputs,
    entrepotFeaturedCollectionCardElement,
} from './children/toniq-entrepot-featured-collection-card.element';
import {
    TopCardInputs,
    entrepotHomePageTopCardElement,
} from './children/toniq-entrepot-top-card.element';
import {CarouselItem, entrepotCarouselElement} from '../../common/toniq-entrepot-carousel.element';
import {isTruthy} from 'augment-vir';
import {toniqColors, toniqFontStyles} from '@toniq-labs/design-system';
import {entrepotHomePageTopCardHeaderElement} from './children/toniq-entrepot-top-card-header.element';

export const entrepotHomePageElement = defineElement<{
    featuredCollections: ReadonlyArray<FeaturedCollectionInputs>;
    topCollections: Readonly<Record<'top' | 'past24Hours', ReadonlyArray<TopCardInputs>>>;
    carouselItems: ReadonlyArray<CarouselItem>;
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
            overflow: hidden;
            padding-bottom: 32px;
        }

        ${entrepotTopTabsElement} {
            margin: 0 64px;
        }

        .featured-collections {
            align-self: center;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 32px;
            width: 1500px;
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

        ${entrepotFeaturedCollectionCardElement} {
            max-width: 100%;
        }

        @media (max-width: 1200px) and (min-width: 900px), (max-width: 600px) {
            .top-cards-header,
            .top-cards,
            ${entrepotTopTabsElement}, h2 {
                margin-right: 0;
                margin-left: 0;
            }
        }

        @media (max-width: 900px) {
            .top-cards-header,
            .top-cards {
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
            inputs.topCollections.top.length
                ? {
                      label: 'Top Collections',
                      value: inputs.topCollections.top,
                  }
                : undefined,
        ].filter(isTruthy);

        const selectedTopTab: TopTab<ReadonlyArray<TopCardInputs>> | undefined =
            state.topCollectionsSelectedTab ?? tabs[0];
        const selectedTopCards: ReadonlyArray<TopCardInputs> = selectedTopTab?.value ?? [];

        const topCardsToShow = selectedTopCards.slice(0, 10);
        const headerCount = topCardsToShow.length > 5 ? 2 : 1;

        return html`
            <${entrepotCarouselElement}
                ${assign(entrepotCarouselElement, {
                    items: inputs.carouselItems,
                    automaticRotation: true,
                })}
            ></${entrepotCarouselElement}>
            
            ${
                selectedTopTab
                    ? html`
                        <${entrepotTopTabsElement}
                            ${assign(entrepotTopTabsElement, {
                                tabs,
                                selected: selectedTopTab,
                            })}
                            ${listen(entrepotTopTabsElement.events.tabChange, event => {
                                const selectedTab = event.detail as TopTab<
                                    ReadonlyArray<TopCardInputs>
                                >;
                                updateState({topCollectionsSelectedTab: selectedTab});
                            })}
                        ></${entrepotTopTabsElement}>`
                    : ''
            }
            <div class="top-cards-header">
                ${Array(headerCount)
                    .fill(0)
                    .map(() => {
                        return html`
                            <${entrepotHomePageTopCardHeaderElement}
                                ${assign(entrepotHomePageTopCardHeaderElement, {
                                    hasImage: true,
                                    hasIndex: true,
                                })}
                            ></${entrepotHomePageTopCardHeaderElement}>`;
                    })}
            </div>
            <div class="top-cards">
                ${topCardsToShow.map(topCard => {
                    return html`
                        <${entrepotHomePageTopCardElement}
                            ${assign(entrepotHomePageTopCardElement, topCard)}
                        ></${entrepotHomePageTopCardElement}>
                    `;
                })}
            </div>
            
            <h2>
                Featured
            </h2>
            <div class="featured-collections">
                ${inputs.featuredCollections.map(featuredCollection => {
                    return html`
                        <${entrepotFeaturedCollectionCardElement}
                            ${assign(entrepotFeaturedCollectionCardElement, featuredCollection)}
                        ></${entrepotFeaturedCollectionCardElement}>
                        `;
                })}
            </div>
        `;
    },
});

export const EntrepotHomePage = wrapInReactComponent(entrepotHomePageElement);
