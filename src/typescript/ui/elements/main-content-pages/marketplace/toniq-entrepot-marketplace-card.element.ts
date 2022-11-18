import {HTMLTemplateResult} from 'lit';
import {assign, css, defineElement, html} from 'element-vir';
import {CollectionStats} from '../../../../data/models/collection';
import {
    Icp16Icon,
    Icp24Icon,
    ToniqChip,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    toniqShadows,
    applyBackgroundAndForeground,
    removeNativeFormStyles,
} from '@toniq-labs/design-system';
import {truncateNumber} from 'augment-vir';

export const EntrepotMarketplaceCardElement = defineElement<{
    collectionName: string;
    collectionImageUrl: string;
    // this should eventually be the collection's creator
    descriptionText: string;
    stats: Pick<CollectionStats, 'total' | 'floor' | 'listings'> | undefined;
}>()({
    tagName: 'toniq-entrepot-marketplace-card',
    styles: css`
        :host {
            display: inline-flex;
            flex-direction: column;
            border-radius: 16px;
            will-change: filter;
            margin: 16px;
            width: 304px;
            max-width: 100%;
            border: 1px solid transparent;
            cursor: pointer;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
            ${toniqShadows.popupShadow}
        }

        .card-button {
            ${removeNativeFormStyles}
            text-decoration: none;
            display: flex;
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
            gap: 16px;
        }

        .stat-entry {
            flex-basis: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
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
    renderCallback: ({inputs}) => {
        return html`
            <button class="card-button">
                <div
                    class="image-holder"
                    style="background-image: url('${inputs.collectionImageUrl}')"
                ></div>
                <div class="collection-details">
                    <h3>${inputs.collectionName}</h3>
                    <p class="description">${inputs.descriptionText}</p>
                    <div class="stats">${createStatsTemplate(inputs.stats)}</div>
                </div>
            </button>
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
