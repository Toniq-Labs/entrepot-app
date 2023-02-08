import {classMap} from 'lit/directives/class-map.js';
import {css, defineElementEvent, html, listen} from 'element-vir';
import {ImageToggleEntry} from './filters-types';
import {
    applyBackgroundAndForeground,
    removeNativeFormStyles,
    toniqColors,
    toniqFontStyles,
    defineToniqElement,
} from '@toniq-labs/design-system';
import {unsafeCSS} from 'lit';

export const EntrepotImageToggleFilterElement = defineToniqElement<{
    name: string;
    imageToggleEntry: Omit<ImageToggleEntry, 'filterValue'>;
    headerImages?: ReadonlyArray<string>;
}>()({
    tagName: 'toniq-entrepot-image-toggle-filter',
    events: {
        select: defineElementEvent<boolean>(),
    },
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
        }

        .row {
            ${removeNativeFormStyles}
            ${toniqFontStyles.paragraphFont}
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0;
        }

        .row-suffix {
            display: flex;
            gap: 8px;
        }

        .first-part {
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .selected-row .title {
            ${toniqFontStyles.boldFont};
        }

        .selected-row .row-count {
            ${applyBackgroundAndForeground(toniqColors.accentPrimary)}
        }

        .row-count {
            display: flex;
            min-height: 24px;
            min-width: 24px;
            border-radius: 12px;
            justify-content: center;
            align-items: center;
            ${toniqFontStyles.boldLabelFont}
            ${applyBackgroundAndForeground(toniqColors.accentSecondary)}
        }

        .hidden {
            display: none;
        }

        .image-toggle-filter-image {
            border-radius: 8px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
            height: 100%;
            width: 100%;
        }

        .header-row .image-toggle-filter-image {
            width: 22px;
            height: 22px;
        }

        .row-image-wrapper {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            position: relative;
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
        }
    `,
    renderCallback: ({inputs, state, updateState, events, dispatch}) => {
        const isHeader: boolean = !!inputs.headerImages?.length;

        const isChecked = inputs.imageToggleEntry.checked;

        const imageTemplate = isHeader
            ? (inputs.headerImages ?? []).map(makeRowImageTemplate)
            : makeRowImageTemplate(inputs.imageToggleEntry.imageUrl);

        return html`
            <button
                class=${classMap({row: true, 'header-row': isHeader, 'selected-row': isChecked})}
                ${listen('click', () => {
                    dispatch(new events.select(!isChecked));
                })}
            >
                <div class="first-part">
                    <div class="row-image-wrapper">${imageTemplate}</div>
                    <span class="title">${inputs.name}</span>
                </div>
                <div class="row-suffix">
                    <div class="row-count">
                        <span>${inputs.imageToggleEntry.count}</span>
                    </div>
                </div>
            </button>
        `;
    },
});

function makeRowImageTemplate(imageUrl: string) {
    const backgroundImageStyle = String(
        css`
            background-image: url(${unsafeCSS(imageUrl)});
        `,
    );

    return html`
        <div class="image-toggle-filter-image" style=${backgroundImageStyle}></div>
    `;
}
