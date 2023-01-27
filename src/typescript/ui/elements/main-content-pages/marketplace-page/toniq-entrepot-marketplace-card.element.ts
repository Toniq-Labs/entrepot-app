import {HTMLTemplateResult} from 'lit';
import {assign, css, defineElementEvent, html} from 'element-vir';
import {Collection, CollectionStats} from '../../../../data/models/collection';
import {
    Icp16Icon,
    ToniqChip,
    toniqColors,
    toniqFontStyles,
    toniqShadows,
    applyBackgroundAndForeground,
    removeNativeFormStyles,
    defineToniqElement,
} from '@toniq-labs/design-system';
import {truncateNumber} from '@augment-vir/common';
import {shouldMouseEventTriggerRoutes} from 'spa-router-vir';

export const EntrepotMarketplaceCardElement = defineToniqElement<{
    collection: Pick<Readonly<Collection>, 'name' | 'brief' | 'stats' | 'route' | 'collection'>;
}>()({
    tagName: 'toniq-entrepot-marketplace-card',
    events: {
        navigateToRoute: defineElementEvent<string>(),
    },
    styles: css`
        :host {
            display: inline-flex;
            flex-direction: column;
            border-radius: 16px;
            will-change: filter;
            margin: 16px 4px;
            width: 304px;
            max-width: 100%;
            border: 1px solid transparent;
            cursor: pointer;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
            ${toniqShadows.popupShadow}
        }

        a {
            height: 100%;
            width: 100%;
            text-decoration: none;
            display: flex;
            align-items: stretch;
            text-align: left;
            flex-direction: column;
            flex-grow: 1;
            color: inherit;
        }

        :host(:hover) {
            border-color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .description {
            flex-grow: 1;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .image-holder {
            height: 188px;
            width: 100%;
            border-radius: 16px 16px 0 0;
            overflow: hidden;
            background-position: center;
            background-size: cover;
        }

        .collection-details {
            display: flex;
            flex-grow: 1;
            gap: 16px;
            flex-direction: column;
            padding: 16px;
        }

        h3 {
            margin: 0;
            ${toniqFontStyles.h3Font}
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .stats {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .stat-entry {
            /* This weird flex-basis value allows the stat-entry elements to snap between 
             * horizontal and vertical. See https://codepen.io/heydon/pen/JwwZaX
             */
            flex-basis: calc(calc(256px - 100%) * 999);
            flex-shrink: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
            max-width: 100%;
        }

        .stat-entry ${ToniqChip} {
            ${toniqFontStyles.boldLabelFont}
            ${toniqFontStyles.monospaceFont}
            max-height: 24px;
            flex-grow: 1;
        }

        .stat-title {
            text-align: center;
            ${toniqFontStyles.labelFont}
            ${applyBackgroundAndForeground(toniqColors.pageSecondary)}
        }
    `,
    renderCallback: ({inputs, events, dispatch}) => {
        const linkUrl = `/marketplace/${inputs.collection.route}`;
        return html`
            <a
                href=${linkUrl}
                @click=${(clickEvent: MouseEvent) => {
                    if (shouldMouseEventTriggerRoutes(clickEvent)) {
                        clickEvent.preventDefault();
                        dispatch(new events.navigateToRoute(inputs.collection.route));
                    }
                }}
            >
                <div
                    class="image-holder"
                    style="background-image: url('${inputs.collection.collection}')"
                ></div>
                <div class="collection-details">
                    <h3>${inputs.collection.name}</h3>
                    <p class="description">${inputs.collection.brief}</p>
                    <div class="stats">${createStatsTemplate(inputs.collection.stats)}</div>
                </div>
            </a>
        `;
    },
});

function createStatsTemplate(
    stats: Pick<CollectionStats, 'total' | 'floor' | 'listings'> | undefined,
): HTMLTemplateResult | HTMLTemplateResult[] {
    if (!stats) {
        return html``;
    }

    const statsArray = [
        {
            title: 'VOLUME',
            icon: Icp16Icon,
            stat: stats.total,
        },
        {
            title: 'LISTINGS',
            stat: stats.listings,
        },
        {
            title: 'FLOOR PRICE',
            icon: Icp16Icon,
            stat: stats.floor,
        },
    ];

    return statsArray.map(statEntry => {
        return html`
            <div class="stat-entry">
                <span class="stat-title">${statEntry.title}</span>
                <${ToniqChip}
                    class=${ToniqChip.hostClasses.secondary}
                    ${assign(ToniqChip, {
                        icon: statEntry.icon,
                        text: truncateNumber(statEntry.stat),
                    })}
                ></${ToniqChip}>
            </div>
        `;
    });
}
