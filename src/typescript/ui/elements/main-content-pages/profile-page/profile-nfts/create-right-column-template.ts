import {html} from 'element-vir';
import {toniqFontStyles, toniqColors} from '@toniq-labs/design-system';

export function createRightSideTextTemplate({
    topString,
    bottomString,
}: {
    topString: string;
    bottomString: string;
}) {
    return html`
        <style>
            .right-side-column {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .top {
                ${toniqFontStyles.boldParagraphFont};
            }

            .bottom {
                ${toniqFontStyles.labelFont};
                color: ${toniqColors.pageSecondary.foregroundColor};
            }
        </style>
        <div class="right-side-column">
            <div class="top">
                ${topString ||
                html`
                    &nbsp;
                `}
            </div>
            <div class="bottom">
                ${bottomString ||
                html`
                    &nbsp;
                `}
            </div>
        </div>
    `;
}
