import {
    applyBackgroundAndForeground,
    BrandDiscord24Icon,
    BrandTelegram24Icon,
    BrandTwitter24Icon,
    ToniqButton,
    toniqColorCssVarNames,
    toniqColors,
    toniqFontStyles,
    ToniqIcon,
    toniqIconColorCssVarNames,
    ToniqInput,
    ToniqSvg,
    defineToniqElementNoInputs,
} from '@toniq-labs/design-system';
import {unsafeCSS} from 'lit';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {html, css, assign, listen} from 'element-vir';
import {HTMLTemplateResult} from 'lit';
import {sendLogToSentry} from '../../../../services/logging/send-log';
import {LogSeverityEnum} from '../../../../services/logging/log-levels';

const footerSocialIcons: ReadonlyArray<{
    icon: ToniqSvg;
    link: string;
}> = [
    {
        icon: BrandDiscord24Icon,
        link: 'https://discord.gg/toniqlabs',
    },
    {
        icon: BrandTelegram24Icon,
        link: 'https://t.me/ICNFTNews',
    },
    {
        icon: BrandTwitter24Icon,
        link: 'https://twitter.com/toniqMarket',
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

const EntrepotFooterElement = defineToniqElementNoInputs({
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
            align-items: center;
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
            max-width: 1600px;
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

        .logo {
            display: flex;
            align-items: center;
            gap: 16px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            ${toniqFontStyles.h2Font};
            font-weight: 200;
            color: white;
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
            flex-basis: 0;
            display: flex;
            justify-content: center;
        }

        .main-footer-content > * > * {
            max-width: 360px;
            flex-grow: 1;
        }

        .middle-section-wrapper {
            flex-grow: 0;
        }

        .left-section-wrapper {
            justify-content: flex-start;
        }

        .right-section-wrapper {
            justify-content: flex-end;
        }

        .email-input {
            display: flex;
            gap: 8px;
            flex-direction: column;
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
            gap: 64px;
            display: flex;
            flex-direction: column;
        }

        p {
            margin: 0;
        }

        .community-section h3 {
            margin-bottom: 32px;
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
            gap: 16px;
            ${unsafeCSS(toniqIconColorCssVarNames.color)}: ${toniqColors.pageInteraction
                .foregroundColor};
        }

        a {
            color: inherit;
        }

        @media (max-width: 1300px) {
            .right-section-wrapper {
                order: -1;
                padding-bottom: 40px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
        }

        @media (max-width: 1300px) and (min-width: 701px) {
            .right-section-wrapper {
                flex-basis: 100%;
            }

            .community-section {
                max-width: unset;
                align-items: center;
            }

            .subscribe-section {
                align-self: stretch;
            }

            .community-section h3 {
                text-align: center;
            }

            .social-icons {
                justify-content: center;
            }

            .main-footer-content {
                display: flex;
                flex-wrap: wrap;
            }

            .email-input {
                flex-direction: row;
                align-items: flex-start;
            }

            .email-input ${ToniqButton} {
                flex-shrink: 0;
                width: 120px;
            }

            .email-input ${ToniqInput} {
                width: unset;
                flex-grow: 1;
            }
        }

        @media (max-width: 800px) {
            .links-section {
                display: flex;
                flex-wrap: wrap;
            }

            .middle-section-wrapper {
                flex-grow: 1;
            }
        }

        @media (max-width: 700px) {
            .main-footer-content {
                flex-direction: column;
            }

            .main-footer-content > * > * {
                max-width: unset;
            }

            .main-footer-content > * {
                max-width: unset;
            }

            .individual-link-section {
                display: flex;
            }
            .copyright-line {
                justify-content: center;
                flex-wrap: wrap;
            }
        }

        @media (max-width: 400px) {
            footer {
                padding: 16px;
                padding-bottom: 0;
            }
        }
    `,
    renderCallback: ({state, updateState}) => {
        const logoSection = html`
            <div class="logo-section">
                <div class="logo">
                    <img
                        alt="Toniq Logo"
                        src="/icon/svg/toniq-site-logo-white.svg"
                        style="height: 48px"
                    />
                    Toniq
                </div>
                <p>
                    Toniq is a digital trading post where users create, store, and trade digital
                    assets in a decentralized and non-custodial way. Toniq is home to the most
                    collections, users, and volume across the Internet Computer blockchain.
                </p>
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
        const communitySection: HTMLTemplateResult = html`
            <div class="community-section">
                <div class="subscribe-section">
                    <h3>Subscribe To Our Newsletter</h3>
                    <div class="email-input">
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
                            ${listen('click', () => {
                                sendLogToSentry('Newsletter sign up clicked', {
                                    severity: LogSeverityEnum.Info,
                                    extraData: {input: state.subscriptionInput},
                                });
                            })}
                        ></${ToniqButton}>
                    </div>
                </div>
                <div class="social-links-section">
                    <h3>Join The Community</h3>
                    <div class="social-icons">
                        ${footerSocialIcons.map(icon => {
                            return html`
                            <a href=${icon.link} target="_blank">
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
                <a href="https://toniqlabs.com">© ${new Date().getFullYear()} Toniq Labs</a>
                <span>
                    <a href="">Privacy Policy</a>
                    <a href="/tos">Terms of Service</a>
                </span>
            </div>
        `;

        return html`
            <footer>
                <div class="main-footer-content">
                    <div class="left-section-wrapper">${logoSection}</div>
                    <div class="middle-section-wrapper">${linksSection}</div>
                    <div class="right-section-wrapper">${communitySection}</div>
                </div>
                ${copyRightLine}
            </footer>
        `;
    },
});

export const EntrepotFooter = wrapInReactComponent(EntrepotFooterElement);
