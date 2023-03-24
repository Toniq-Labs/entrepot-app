import {removeNativeFormStyles, toniqColors} from '@toniq-labs/design-system';
import {assign, css, defineElementNoInputs, html} from 'element-vir';
import {EntrepotHorizontalScrollElement} from '../../common/toniq-entrepot-horizontal-scroll.element';
import {EntrepotSaleCardElement} from './toniq-entrepot-sale-card.element';

export const EntrepotSalePreloaderElement = defineElementNoInputs({
    tagName: 'toniq-entrepot-sale-preloader',
    styles: css`
        .header {
            display: flex;
            justify-content: space-between;
        }

        .title-preloader {
            display: block;
            height: 28px;
            width: 128px;
            background-color: #f6f6f6;
            border-radius: 8px;
        }

        .see-all-preloader {
            ${removeNativeFormStyles};
            display: block;
            height: 22px;
            width: 46px;
            background-color: ${toniqColors.pageInteraction.foregroundColor};
            border-radius: 8px;
            opacity: 0.6;
        }

        .tab-content {
            display: flex;
            flex-direction: column;
            gap: 52px;
            margin: 0 32px;
        }
    `,
    renderCallback: () => {
        const preloader = new Array(Math.floor(Math.random() * (8 - 4) + 4)).fill(0);

        return html`
			<div class="tab-content">
				<div>
					<div class="header">
						<span class="title-preloader"></span>
						<button class="see-all-preloader"></button>
					</div>
					<${EntrepotHorizontalScrollElement}
						${assign(EntrepotHorizontalScrollElement, {
                            children: html`
                                ${preloader.map(() => {
                                    return html`
										<${EntrepotSaleCardElement}
										${assign(EntrepotSaleCardElement, {})}
										></${EntrepotSaleCardElement}>
									`;
                                })}
                            `,
                            maxCardHeight: 460,
                        })}
					></${EntrepotHorizontalScrollElement}>
				</div>

				<div>
					<div class="header">
						<span class="title-preloader"></span>
						<button class="see-all-preloader"></button>
					</div>
					<${EntrepotHorizontalScrollElement}
						${assign(EntrepotHorizontalScrollElement, {
                            children: html`
                                ${preloader.map(() => {
                                    return html`
										<${EntrepotSaleCardElement}
										${assign(EntrepotSaleCardElement, {})}
										></${EntrepotSaleCardElement}>
									`;
                                })}
                            `,
                            maxCardHeight: 460,
                        })}
					></${EntrepotHorizontalScrollElement}>
				</div>
			</div>
        `;
    },
});
