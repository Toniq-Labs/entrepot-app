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
		padding: 16px 0px 48px;
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

	.section-details {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 64px 0px;
	}

	.section-title {
		position: relative;
		${toniqFontStyles.toniqFont};
		font-weight: 800;
		font-size: 36px;
		line-height: 48px;
		margin-bottom: 12px;
	}

	.section-title::after {
		position: absolute;
		content: "";
		bottom: -12px;
		left: 0px;
		width: 100%;
		height: 1px;
		border-bottom: 1px solid ${toniqColors.divider.foregroundColor};
		z-index: 0;
	}

	.detail-card-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 20px;
	}

	.detail-card {
		display: inline-block;
		border-radius: 16px;
		background-color: #ffffff;
		border: 1px solid ${toniqColors.pageInteraction.foregroundColor};
		padding: 0px;
		cursor: pointer;
		will-change: filter;
		display: flex;
		flex-direction: column;
		align-items: center;
		filter: drop-shadow(0px 12px 8px #D2EEFA);
	}

	.detail-title {
		width: 100%;
		display: flex;
		padding: 4px 0;
		justify-content: center;
		background-color: #F1F3F6;
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		${toniqFontStyles.paragraphFont}
	}

	.detail-content {
		padding: 24px 20px;
		${toniqFontStyles.h3Font};
	}

	@media (max-width: 1023px) {
		.section-overview {
			flex-direction: column;
		}
	}

	@media (max-width: 600px) {
		.section-overview {
			gap: 24px;
			padding: 0px 0px 32px;
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

		.section-details {
			padding: 32px 16px;
		}

		.detail-card-wrapper {
			grid-template-columns: 1fr;
		}
	}
`;
