import {toniqColors, toniqFontStyles} from '@toniq-labs/design-system';
import {css} from 'element-vir';
import {makeDropShadowCardStyles} from '../../../../styles/drop-shadow-card.style';

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
		flex-grow: 1;
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

	.section-info {
		display: flex;
		gap: 48px;
		padding: 44px 0px;
	}

	${makeDropShadowCardStyles('.info-card')}

	.info-card {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		border: 3px solid ${toniqColors.pageInteraction.foregroundColor};
		padding: 25px 0px;
	}

	.info-card > span {
		${toniqFontStyles.boldFont};
		font-size: 48px;
		line-height: 64px;
	}

	.info-card > span:last-of-type {
		color: ${toniqColors.pageInteraction.foregroundColor};
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

		.section-info {
			gap: 12px;
			padding: 28px 0px;
		}

		.info-card {
			flex-direction: column;
			padding: 16px 0px;
		}

		.info-card > span {
			${toniqFontStyles.boldParagraphFont};
		}

		.info-card > span:last-of-type {
			${toniqFontStyles.toniqFont};
			font-weight: 800;
			font-size: 24px;
			line-height: 32px;
			color: ${toniqColors.pageInteraction.foregroundColor};
		}
	}
`;
