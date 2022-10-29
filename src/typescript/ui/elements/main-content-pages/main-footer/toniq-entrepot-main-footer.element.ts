import {
    applyBackgroundAndForeground,
    BrandDiscord32Icon,
    BrandInstagramFlat32Icon,
    BrandTelegram32Icon,
    BrandTiktokFlat32Icon,
    BrandTwitch32Icon,
    BrandTwitter32Icon,
    EntrepotLogo144Icon,
    ToniqButton,
    toniqColorCssVarNames,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    toniqIconColorCssVarNames,
    ToniqInput,
    ToniqSvg,
} from '@toniq-labs/design-system';
import {unsafeCSS} from 'lit';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, defineElementNoInputs, listen} from 'element-vir';

const footerSocialIcons: ReadonlyArray<{
    icon: ToniqSvg;
    link: string;
}> = [
    {
        icon: BrandDiscord32Icon,
        link: '',
    },
    {
        icon: BrandTiktokFlat32Icon,
        link: '',
    },
    {
        icon: BrandTelegram32Icon,
        link: '',
    },
    {
        icon: BrandTwitter32Icon,
        link: '',
    },
    {
        icon: BrandTwitch32Icon,
        link: '',
    },
    {
        icon: BrandInstagramFlat32Icon,
        link: '',
    },
];

type FooterLink = {name: string; url: string};
type FooterLinkSection = {title: string; links: ReadonlyArray<FooterLink>};

const footerLinkSections: ReadonlyArray<FooterLinkSection> = [
    {
        title: 'My Account',
        links: [
            {name: 'Profile', url: ''},
            {name: 'Favorites', url: ''},
            {name: 'Watchlist', url: ''},
            {name: 'My Collections', url: ''},
            {name: 'Settings', url: ''},
        ],
    },
    {
        title: 'Stats',
        links: [
            {name: 'Rankings', url: ''},
            {name: 'Activity', url: ''},
        ],
    },
    {
        title: 'Resources',
        links: [
            {name: 'Learn', url: ''},
            {name: 'Help Center', url: ''},
            {name: 'Platform Status', url: ''},
            {name: 'Partners', url: ''},
            {name: 'Taxes', url: ''},
            {name: 'Blog', url: ''},
            {name: 'Docs', url: ''},
            {name: 'Newsletter', url: ''},
        ],
    },
    {
        title: 'Company',
        links: [
            {name: 'About', url: ''},
            {name: 'Careers', url: ''},
            {name: 'Ventures', url: ''},
            {name: 'Grants', url: ''},
        ],
    },
];

const EntrepotFooterElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-main-footer',
    stateInit: {
        subscriptionInput: '',
    },
    styles: css`
        :host {
            ${toniqFontStyles.paragraphFont}
            display: flex;
            flex-direction: column;
            position: relative;
            ${applyBackgroundAndForeground(toniqColors.pageDarkPrimary)};
        }

        footer {
            overflow: hidden;
            height: 100%;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 64px;
            padding-bottom: 0;
            gap: 32px;
        }

        h1,
        h2,
        h3,
        h4 {
            margin: 0;
        }

        h3 {
            ${toniqFontStyles.h3Font};
            color: inherit;
        }

        .logo-section {
            max-width: 340px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 16px;
            ${toniqFontStyles.h2Font}
            ${toniqFontStyles.extraBoldFont}
            color: inherit;
            margin-bottom: 12px;
        }

        .logo ${ToniqIcon} {
            height: 48px;
            width: 48px;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .main-footer-content {
            display: flex;
            justify-content: space-evenly;
            flex-grow: 1;
            overflow: hidden;
        }

        .main-footer-content > * {
            flex-grow: 1;
            flex-basis: min-content;
        }

        .links-section {
            flex-grow: 0;
            column-gap: 54px;
            column-count: 3;
        }

        .links-section > * {
            margin-bottom: 48px;
        }

        .individual-link-section {
            display: inline-flex;
            flex-direction: column;
            gap: 8px;
        }

        .link-section-title,
        a {
            white-space: nowrap;
        }

        .link-section-title {
            margin-bottom: 16px;
        }

        .individual-link-section a {
            text-decoration: none;
        }

        .community-section {
            max-width: 340px;
            gap: 64px;
            display: flex;
            flex-direction: column;
        }

        p {
            margin: 0;
        }

        .community-section h3 {
            margin-bottom: 16px;
        }

        .community-section ${ToniqInput} {
            margin-top: 16px;
        }

        .subscribe-section {
            display: flex;
            gap: 8px;
            flex-direction: column;
        }

        ${ToniqInput} {
            ${toniqColorCssVarNames.accentTertiary.backgroundColor}: ${toniqColors.pageDarkPrimary
                .foregroundColor};
        }

        .copyright-line {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding: 32px 0;
        }

        .copyright-line > * {
            display: flex;
            gap: 24px;
            ${toniqFontStyles.labelFont}
            color: inherit;
        }

        .social-icons {
            display: flex;
            justify-content: space-between;
            ${unsafeCSS(toniqIconColorCssVarNames.color)}: ${toniqColors.pageInteraction
                .foregroundColor};
        }

        a {
            color: inherit;
        }
    `,
    renderCallback: ({state, updateState}) => {
        const logoSection = html`
            <div class="logo-section">
                <div class="logo">
                    <${ToniqIcon}
                        class="toniq-icon-fit-icon"
                        ${assign(ToniqIcon, {
                            icon: EntrepotLogo144Icon,
                        })}
                    ></${ToniqIcon}>
                    Entrepot
                </div>
                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomized words.</p>
            </div>
        `;
        const linksSection = html`
            <div class="links-section">
                ${footerLinkSections.map(linkSection => {
                    return html`
                        <div class="individual-link-section">
                            <h4 class="link-section-title">${linkSection.title}</h4>
                            ${linkSection.links.map(link => {
                                return html`
                                    <a href=${link.url}>${link.name}</a>
                                `;
                            })}
                        </div>
                    `;
                })}
            </div>
        `;
        const communitySection = html`
            <div class="community-section">
                <div class="subscribe-section">
                    <h3>Subscribe To Our Newsletter</h3>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                    <${ToniqInput}
                        ${assign(ToniqInput, {
                            value: state.subscriptionInput,
                            placeholder: 'Your email address',
                        })}
                        ${listen(ToniqInput.events.valueChange, event => {
                            updateState({subscriptionInput: event.detail});
                        })}
                    ></${ToniqInput}>
                    <${ToniqButton}
                        ${assign(ToniqButton, {
                            text: 'Sign Up',
                        })}
                    ></${ToniqButton}>
                </div>
                <div class="social-links-section">
                    <h3>Join The Community</h3>
                    <div class="social-icons">
                        ${footerSocialIcons.map(icon => {
                            return html`
                            <a href=${icon.link}>
                                <${ToniqIcon}
                                    ${assign(ToniqIcon, {
                                        icon: icon.icon,
                                    })}
                                ></${ToniqIcon}>
                            </a>
                        `;
                        })}
                    </div>
                </div>
            </div>
        `;
        const copyRightLine = html`
            <div class="copyright-line">
                <a href="https://toniqlabs.com">© 2022 Toniq Labs</a>
                <span>
                    <a href="">Privacy Policy</a>
                    <a href="">Terms of Service</a>
                </span>
            </div>
        `;

        return html`
            <footer>
                <div class="main-footer-content">
                    ${logoSection} ${linksSection} ${communitySection}
                </div>
                ${copyRightLine}
            </footer>
        `;
    },
});

export const EntrepotFooter = wrapInReactComponent(EntrepotFooterElement);
