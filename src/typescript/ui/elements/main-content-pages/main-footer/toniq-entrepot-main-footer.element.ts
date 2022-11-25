import {
    applyBackgroundAndForeground,
    BrandDiscord24Icon,
    BrandInstagramFlat24Icon,
    BrandTelegram24Icon,
    BrandTiktokFlat24Icon,
    BrandTwitch24Icon,
    BrandTwitter24Icon,
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
        icon: BrandDiscord24Icon,
        link: 'https://discord.gg/toniqlabs',
    },
    // {
    //     icon: BrandTiktokFlat24Icon,
    //     link: '',
    // },
    {
        icon: BrandTelegram24Icon,
        link: 'https://t.me/ICNFTNews',
    },
    {
        icon: BrandTwitter24Icon,
        link: 'https://twitter.com/EntrepotApp',
    },
    // {
    //     icon: BrandTwitch24Icon,
    //     link: '',
    // },
    // {
    //     icon: BrandInstagramFlat24Icon,
    //     link: '',
    // },
    // https://toniqlabs.medium.com/
    // https://www.youtube.com/channel/UC9bN51qCCbbz4A1kftZlBPw
    // https://www.linkedin.com/company/toniq-labs/
    // https://dscvr.one/p/toniq-talks
];

type FooterLink = {
    name: string;
    url: string;
};
type FooterLinkSection = {title: string; links: ReadonlyArray<FooterLink>};

const footerLinkSections: ReadonlyArray<FooterLinkSection> = [
    {
        title: 'My Account',
        links: [
            {
                name: 'Collected',
                url: '/profile',
            },
            {
                name: 'Favorites',
                url: '/profile/favorites',
            },
            {
                name: 'Activity',
                url: '/profile/activity',
            },
            {
                name: 'Offers',
                url: '/profile/offers',
            },
        ],
    },
    // {
    //     title: 'Stats',
    //     links: [
    //         {name: 'Rankings', pathName: ''},
    //         {name: 'Activity', pathName: ''},
    //     ],
    // },
    {
        title: 'Resources',
        links: [
            {
                name: 'Creator Docs',
                url: 'https://toniq-labs.gitbook.io/toniq-mint/',
            },
            {
                name: 'Help Center',
                url: 'https://toniqlabs-help.freshdesk.com/support/home',
            },
            {
                name: 'Open Ticket',
                url: 'https://toniqlabs-help.freshdesk.com/support/tickets/new',
            },
            {
                name: 'Blog',
                url: 'https://toniqlabs.medium.com/',
            },
        ],
    },
    {
        title: 'Company',
        links: [
            {
                name: 'About',
                url: 'https://toniqlabs.com/',
            },
            {
                name: 'Team',
                url: 'https://toniqlabs.com/#about',
            },
            {
                name: 'Careers',
                url: 'https://jobs.vivahr.com/7514-toniq-labs/jobs',
            },
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
            flex-shrink: 0;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .main-footer-content {
            display: flex;
            justify-content: space-evenly;
            flex-grow: 1;
            overflow: hidden;
            gap: 40px;
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
            padding-bottom: 48px;
        }

        .individual-link-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            break-inside: avoid;
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
            width: 100%;
            ${toniqColorCssVarNames.accentTertiary.backgroundColor}: ${toniqColors.pageDarkPrimary
                .foregroundColor};
        }

        .copyright-line {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding: 32px 0;
            flex-wrap: wrap;
            gap: 32px;
        }

        .copyright-line > * {
            display: flex;
            gap: 24px;
            ${toniqFontStyles.labelFont}
            color: inherit;
        }

        .social-icons {
            display: flex;
            gap: 8px;
            ${unsafeCSS(toniqIconColorCssVarNames.color)}: ${toniqColors.pageInteraction
                .foregroundColor};
        }

        a {
            color: inherit;
        }

        @media (max-width: 1250px) {
            .links-section {
                column-count: 2;
            }
        }

        @media (max-width: 1000px) {
            .community-section {
                order: -1;
                padding-bottom: 40px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .main-footer-content {
                flex-direction: column;
            }
            .main-footer-content > * {
                max-width: unset;
            }
            .individual-link-section {
                display: flex;
            }
            .copyright-line {
                justify-content: center;
            }
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
                <p>Entrepot is a digital trading post where users create, store, and trade digital assets in a decentralized and non-custodial way. Entrepot is home to the most collections, users, and volume across the Internet Computer blockchain.</p>
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
                    <!-- <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p> -->
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
                    <a href="/tos">Terms of Service</a>
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
