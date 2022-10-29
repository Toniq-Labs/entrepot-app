import {
    BrandDiscord32Icon,
    BrandTwitter32Icon,
    ToniqIcon,
    ToniqSvg,
} from '@toniq-labs/design-system';
import {defineElement, html, css, assign} from 'element-vir';

export enum SocialLinkTypeEnum {
    Twitter = 'twitter',
    Discord = 'discord',
}

const socialImageUrls: Readonly<Record<SocialLinkTypeEnum, ToniqSvg>> = {
    [SocialLinkTypeEnum.Twitter]: BrandTwitter32Icon,
    [SocialLinkTypeEnum.Discord]: BrandDiscord32Icon,
};

export type SocialLinkDetails = Readonly<{
    link: string;
    type: SocialLinkTypeEnum;
}>;

export const EntrepotSocialLinkElement = defineElement<{
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
