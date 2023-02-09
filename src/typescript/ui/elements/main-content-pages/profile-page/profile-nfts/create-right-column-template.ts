import {html, renderIf} from 'element-vir';
import {toniqFontStyles, toniqColors} from '@toniq-labs/design-system';

export function createRightSideTextTemplate({
    topString,
    bottomString,
    useNbsp,
}: {
    topString: string;
    bottomString: string;
    useNbsp: boolean;
}) {
    const empty = useNbsp
        ? html`
              &nbsp;
          `
        : '';

    const topDisplay = topString || empty;
    const bottomDisplay = bottomString || empty;

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
            ${renderIf(
                !!topDisplay,
                html`
                    <div class="top">${topDisplay}</div>
                `,
            )}
            ${renderIf(
                !!bottomDisplay,
                html`
                    <div class="bottom">${bottomDisplay}</div>
                `,
            )}
        </div>
    `;
}
