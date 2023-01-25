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
    stat: string | number | BigNumber;
};

export const EntrepotSaleCategoryCardElement = defineElement<{
    collectionName?: string;
    collectionImageUrl?: string;
    descriptionText?: string;
    date?: number;
    dateMessage?: string;
    statsArray?: Array<StatsArray>;
    progress?: number | undefined;
}>()({
    tagName: 'toniq-entrepot-sale-category-card',
    styles: css`
        :host {
            display: inline-flex;
            flex-direction: column;
            border-radius: 16px;
            will-change: filter;
            width: 644px;
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
            text-align: start;
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

        .description-preloader {
            display: block;
            height: 20px;
            width: 270px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }

        .image-holder {
            height: 188px;
            width: 100%;
            border-radius: 16px 0 0 0;
            overflow: hidden;
            background-position: center;
            background-size: cover;
        }

        .image-holder-preloader {
            display: block;
            background-color: #f6f6f6;
        }

        .collection-content {
            display: grid;
            grid-template-columns: repeat(auto-fill, 322px);
        }

        .preloader
            position: relative;
            height: 420px;
        }

        .preloader::after {
            content: '';
            position: absolute;
            display: block;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background-image: linear-gradient(
                90deg,
                rgba(#f6f7f8, 0) 0,
                rgba(#f6f7f8, 0.4) 20%,
                rgba(#f6f7f8, 0.4) 40%,
                rgba(#f6f7f8, 0) 100%
            );
            background-size: 200px 100%;
            background-position: -150% 0;
            pointer-events: none;
            background-repeat: no-repeat;
            animation: loading 1500ms infinite 0ms ease-out;

            @keyframes loading {
                to {
                    background-position: 300% 0;
                }
            }
        }

        .collection-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .collection-info {
            display: flex;
            gap: 28px;
            flex-direction: column;
            text-align: left;
            padding: 24px 16px;
        }

        .collection-stats {
            display: flex;
            gap: 16px;
            flex-direction: column;
            padding: 12px 16px;
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
            margin-right: auto;
        }

        .launch-preloader {
            display: block;
            width: 50%;
            background-color: #f6f6f6;
        }

        .launch-time-unit {
            display: inline-flex;
        }

        .title-preloader {
            display: block;
            height: 28px;
            width: 128px;
            background-color: #f6f6f6;
            border-radius: 8px;
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

        .stat-title-preloader {
            display: block;
            height: 14px;
            width: 45px;
            background-color: #f6f6f6;
            border-radius: 8px;
            margin: 0 auto;
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

        .preloader-pill {
            display: block;
            height: 24px;
            width: 130px;
            background-color: #f6f6f6;
            border-radius: 8px;
            margin: 0 auto;
        }


        @media (max-width: 1439px) {
            :host {
                width: 304px;
            }

            .collection-content {
                display: flex;
            }

            .image-holder {
                flex: 1 1 0%;
                border-radius: 16px 16px 0 0;
            }

            .collection-info {
                flex: 1 1 0%;
                gap: 12px;
                text-align: center;
            }

            .collection-content {
                display: grid;
                grid-template-columns: unset;
            }

            .stat-title-preloader {
                width: 35px;
            }

            .preloader-pill {
                width: 80px;
            }

            .launch {
                margin: 0 auto;
            }
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
            ${inputs.date && inputs.statsArray
                ? html`
                      <button class="card-button">
                          <div class="collection-content">
                              <div
                                  class="image-holder"
                                  style="background-image: url('${inputs.collectionImageUrl}')"
                              ></div>
                              <div class="collection-info">
                                  <div class="launch">${formattedDate(inputs.date)}</div>
                                  <div class="collection-details">
                                      <h3>${inputs.collectionName}</h3>
                                      <p class="description">${inputs.descriptionText}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="collection-stats">
                              <div class="stats">${createStatsTemplate(inputs.statsArray)}</div>
                              ${inputs.progress !== undefined
                                  ? createProgressTemplate(inputs.progress)
                                  : ''}
                          </div>
                      </button>
                  `
                : html`
                      <button class="card-button">
                          <div class="collection-content preloader">
                              <div class="image-holder image-holder-preloader"></div>
                              <div class="collection-info">
                                  <span class="launch launch-preloader"></span>
                                  <span class="title-preloader"></span>
                                  <span class="description description-preloader"></span>
                              </div>
                          </div>
                          <div class="collection-stats">
                              <div class="stats">
                                  <div class="stat-entry">
                                      <span class="stat-title stat-title-preloader"></span>
                                      <span class="preloader-pill"></span>
                                  </div>
                                  <div class="stat-entry">
                                      <span class="stat-title stat-title-preloader"></span>
                                      <span class="preloader-pill"></span>
                                  </div>
                                  <div class="stat-entry">
                                      <span class="stat-title stat-title-preloader"></span>
                                      <span class="preloader-pill"></span>
                                  </div>
                              </div>
                          </div>
                      </button>
                  `}
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
            ${statEntry.stat !== undefined
                ? html`
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
                `
                : ''}
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
