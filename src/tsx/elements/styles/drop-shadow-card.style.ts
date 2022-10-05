import {unsafeCSS} from 'lit';
import {toniqColors, toniqShadows} from '@toniq-labs/design-system';
import {css} from 'element-vir';

export function makeDropShadowCardStyles(selector: string, allowHover = true) {
    const cssSelector = unsafeCSS(selector);
    const hoverSelector =
        selector === ':host'
            ? // prettier-ignore
              css`
                  :host(:hover)
              `
            : css`
                  ${cssSelector}:hover
              `;

    const hoverStyles = allowHover
        ? css`
              ${cssSelector} {
                  cursor: pointer;
              }
              ${hoverSelector} {
                  border-color: ${toniqColors.pageInteraction.foregroundColor};
              }
          `
        : css``;

    return css`
        ${cssSelector} {
            border-radius: 16px;
            background-color: ${toniqColors.pagePrimary.backgroundColor};
            border: 1px solid transparent;
            padding: 16px;
            cursor: auto;
            /* This helps force the drop shadow to re-render when the element moves */
            will-change: filter;
            ${toniqShadows.popupShadow};
        }

        ${hoverStyles}
    `;
}
