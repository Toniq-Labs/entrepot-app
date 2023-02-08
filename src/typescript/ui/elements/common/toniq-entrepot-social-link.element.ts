import {
    BrandDiscord24Icon,
    BrandTwitter24Icon,
    ToniqIcon,
    ToniqSvg,
    defineToniqElement,
    BrandTelegram24Icon,
} from '@toniq-labs/design-system';
import {html, css, assign} from 'element-vir';

export enum SocialLinkTypeEnum {
    Twitter = 'twitter',
    Discord = 'discord',
    Telegram = 'telegram',
}

const socialImageUrls: Readonly<Record<SocialLinkTypeEnum, ToniqSvg>> = {
    [SocialLinkTypeEnum.Twitter]: BrandTwitter24Icon,
    [SocialLinkTypeEnum.Discord]: BrandDiscord24Icon,
    [SocialLinkTypeEnum.Telegram]: BrandTelegram24Icon,
};

export type SocialLinkDetails = Readonly<{
    link: string;
    type: SocialLinkTypeEnum;
}>;

export const EntrepotSocialLinkElement = defineToniqElement<{
    socialLinkDetails: SocialLinkDetails;
}>()({
    tagName: 'toniq-entrepot-social-link',
    styles: css``,
    renderCallback: ({inputs}) => {
        return html`
            <a href=${inputs.socialLinkDetails.link}>
                <${ToniqIcon}
                    ${assign(ToniqIcon, {icon: socialImageUrls[inputs.socialLinkDetails.type]})}
                ></${ToniqIcon}>
            </a>
        `;
    },
});
