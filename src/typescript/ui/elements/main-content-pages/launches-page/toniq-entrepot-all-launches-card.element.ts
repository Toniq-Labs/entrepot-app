import {HTMLTemplateResult} from 'lit';
import {assign, css, defineElement, html} from 'element-vir';
import {
    ToniqChip,
    toniqColors,
    toniqFontStyles,
    toniqShadows,
    applyBackgroundAndForeground,
    removeNativeFormStyles,
    ToniqSvg,
} from '@toniq-labs/design-system';
import {BigNumber} from 'bignumber.js';
import {truncateNumber} from '@augment-vir/common';
import moment, {duration} from 'moment';

type StatsArray = {
    title: string;
    icon?: ToniqSvg | undefined;
    stat: string | number | BigNumber | undefined;
};

export const EntrepotAllLaunchesCardElement = defineElement<{
    collectionName: string;
    collectionImageUrl: string;
    // this should eventually be the collection's creator
    descriptionText: string;
    date: number;
    dateMessage?: string;
    statsArray: Array<StatsArray>;
    progress?: number;
}>()({
    tagName: 'toniq-entrepot-all-launches-card',
    styles: css`
        :host {
            scroll-snap-align: start;
        }

        .card-wrapper {
            display: flex;
            flex-direction: column;
            border-radius: 16px;
            will-change: filter;
            margin: 16px;
            min-width: 304px;
            max-width: 100%;
            border: 1px solid transparent;
            cursor: pointer;
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)};
            ${toniqShadows.popupShadow};
        }

        .card-button {
            ${removeNativeFormStyles};
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
            min-height: 40px;
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
            gap: 24px;
            flex-direction: column;
            padding: 16px;
            text-align: center;
        }

        .collection-info {
            display: flex;
            flex-grow: 1;
            gap: 12px;
            flex-direction: column;
            text-align: center;
        }

        h3 {
            margin: 0;
            ${toniqFontStyles.h3Font};
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .launch {
            background: #000000;
            border-radius: 8px;
            height: 24px;
            padding: 4px 12px;
            max-width: 140px;
            ${toniqFontStyles.boldParagraphFont};
            color: #ffffff;
            margin: 0 auto;
        }

        .launch-time-unit {
            display: inline-flex;
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
            ${toniqFontStyles.boldLabelFont};
            ${toniqFontStyles.monospaceFont};
            max-height: 24px;
            flex-grow: 1;
        }

        .stat-title {
            text-align: center;
            ${toniqFontStyles.labelFont};
            ${applyBackgroundAndForeground(toniqColors.pageSecondary)};
        }

        progress {
            opacity: 0;
        }

        .progress-container {
            position: relative;
            display: inline-block;
            background: #f1f3f6;
            height: 8px;
            border-radius: 16px;
            overflow: hidden;
        }

        .progress {
            position: absolute;
            height: 6px;
            border-radius: 16px;
            background: #00d093;
            margin-top: 1px;
        }
    `,
    renderCallback: ({inputs}) => {
        function formattedDate(date: number) {
            if (moment(date).isBefore(moment()))
                return inputs.dateMessage ? inputs.dateMessage : 'Just Ended';
            const dateDuration: any = duration(moment(date).diff(moment()));
            const {days, hours, minutes} = dateDuration._data;
            return html`
                <span class="launch-time-unit">
                    ${days}
                    <strong>d</strong>
                </span>
                <span class="launch-time-unit">
                    ${hours}
                    <strong>h</strong>
                </span>
                <span class="launch-time-unit">
                    ${minutes}
                    <strong>m</strong>
                </span>
            `;
        }

        return html`
            <button class="card-button">
                <div class="card-wrapper">
                    <div
                        class="image-holder"
                        style="background-image: url('${inputs.collectionImageUrl}')"
                    ></div>
                    <div class="collection-details">
                        <div class="collection-info">
                            <div class="launch">${formattedDate(inputs.date)}</div>
                            <h3>${inputs.collectionName}</h3>
                            <p class="description">${inputs.descriptionText}</p>
                        </div>
                        <div class="stats">${createStatsTemplate(inputs.statsArray)}</div>
                        ${inputs.progress !== undefined
                            ? createProgressTemplate(inputs.progress)
                            : ''}
                    </div>
                </div>
            </button>
        `;
    },
});

function createStatsTemplate(
    statsArray: Array<StatsArray>,
): HTMLTemplateResult | HTMLTemplateResult[] {
    if (!statsArray) {
        return html``;
    }

    return statsArray.map(statEntry => {
        return html`
            <div class="stat-entry">
                <span class="stat-title">${statEntry.title}</span>
                ${statEntry.stat
                    ? html`<${ToniqChip}
                    class=${ToniqChip.hostClasses.secondary}
                    ${assign(ToniqChip, {
                        icon: statEntry.icon,
                        text: truncateNumber(statEntry.stat),
                    })}
                ></${ToniqChip}>`
                    : ''}
            </div>
        `;
    });
}

function createProgressTemplate(progress: number): HTMLTemplateResult | HTMLTemplateResult[] {
    return html`
        <div class="progress-container">
            <div class="progress" style="width: ${progress}%"></div>
        </div>
    `;
}
