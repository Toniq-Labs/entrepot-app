import {assign, css, defineElement, html} from 'element-vir';
import {
    applyBackgroundAndForeground,
    ToniqButton,
    ToniqCheckbox,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    toniqShadows,
    ToniqSvg,
} from '@toniq-labs/design-system';

export type CreateCardInputs = {
    title: string;
    icon: ToniqSvg;
    subtitle?: string | undefined;
    bullets: ReadonlyArray<string>;
    buttons: ReadonlyArray<{text: string; primary: boolean}>;
};

export const EntrepotCreateCardElement = defineElement<CreateCardInputs>()({
    tagName: 'toniq-entrepot-create-card',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            box-sizing: border-box;
            padding: 48px;
            border: 1px solid ${toniqColors.divider.foregroundColor};
            ${applyBackgroundAndForeground(toniqColors.pagePrimary)}
            ${toniqShadows.popupShadow}
        }

        h2 {
            margin: 0;
            margin-top: 16px;
            margin-bottom: 32px;
            ${toniqFontStyles.h2Font}
        }

        .subtitle {
            ${toniqFontStyles.boldParagraphFont}
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .bullet-checks,
        .buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .bullet-checks {
            margin-bottom: 48px;
        }

        .top-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        ${ToniqIcon} {
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        ${ToniqCheckbox} {
            pointer-events: none;
        }
    `,
    renderCallback: ({inputs}) => {
        const subtitleTemplate = inputs.subtitle
            ? html`
                  <span class="subtitle">${inputs.subtitle}</span>
              `
            : '';

        const bulletsTemplate = inputs.bullets.map(bullet => {
            return html`
                <${ToniqCheckbox}
                    ${assign(ToniqCheckbox, {
                        checked: true,
                        text: bullet,
                    })}
                ></${ToniqCheckbox}>
            `;
        });

        const buttonsTemplate = inputs.buttons.map(button => {
            return html`
                <${ToniqButton}
                    class=${button.primary ? '' : ToniqButton.hostClasses.outline}
                    ${assign(ToniqButton, {
                        text: button.text,
                    })}
                ></${ToniqButton}>
            `;
        });

        return html`
            <div class="top-content">
                <${ToniqIcon}
                    ${assign(ToniqIcon, {icon: inputs.icon})}
                ></${ToniqIcon}>
                <h2>${inputs.title}${subtitleTemplate}</h2>
                <div class="bullet-checks">${bulletsTemplate}</div>
            </div>
            <div class="buttons">${buttonsTemplate}</div>
        `;
    },
});
