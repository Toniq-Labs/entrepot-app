import {toniqColors, toniqFontStyles} from '@toniq-labs/design-system';
import {css} from 'element-vir';

export const routeStyle = css`
	.page-wrapper {
		padding: 16px 104px 48px;
	}

	.section-overview {
		display: flex;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
	}

	.overview-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.collection-name {
		${toniqFontStyles.h2Font};
		${toniqFontStyles.extraBoldFont};
		margin-bottom: 8px;
	}

	.collection-team {
		${toniqFontStyles.toniqFont}
		color: ${toniqColors.pageInteraction.foregroundColor};
		font-size: 20px;
		font-weight: 500;
	}

	.collection-social {
		display: flex;
		gap: 24px;
		margin-top: 12px;
	}

	.collection-blurb {
		${toniqFontStyles.toniqFont};
		color: ${toniqColors.pagePrimary.foregroundColor};
		margin: 32px 0;
	}

	.readMoreEllipsis {
		${toniqFontStyles.boldParagraphFont};
		color: ${toniqColors.pageInteraction.foregroundColor}
		border: none;
		background: none;
		cursor: pointer;
	}

	.socialLinkIcon {
		display: flex;
	}

	@media (max-width: 1023px) {
		.section-overview {
			flex-direction: column;
		}
	}

	@media (max-width: 600px) {
		.section-overview {
			gap: 24px;
		}

		.page-wrapper {
			padding: 16px 0px 32px;
		}
	}
`;
