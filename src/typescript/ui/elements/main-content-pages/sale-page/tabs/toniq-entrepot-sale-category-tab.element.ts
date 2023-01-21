import {css, defineElement, defineElementEvent, html} from 'element-vir';
import {removeNativeFormStyles, toniqColors, toniqFontStyles} from '@toniq-labs/design-system';
import {HTMLTemplateResult} from 'lit';
import {Collection} from '../../../../../data/models/collection';

export const EntrepotSaleCategoryTabElement = defineElement<{
    categoryName: string;
    children: HTMLTemplateResult;
}>()({
    tagName: 'toniq-entrepot-sale-category-tab',
    styles: css`
        .header {
            margin-bottom: 16px;
            text-align: start;
        }

        .title {
            ${toniqFontStyles.boldFont};
            font-size: 20px;
            line-height: 28px;
            color: ${toniqColors.pagePrimary.foregroundColor};
        }

        .see-all {
            ${removeNativeFormStyles};
            font-weight: 500;
            color: ${toniqColors.pageInteraction.foregroundColor};
        }

        .tab-content {
            display: flex;
            flex-direction: column;
            gap: 52px;
            margin: 0 32px;
        }

        .items-container {
            gap: 24px;
            display: grid;
            justify-content: center;
            grid-template-columns: repeat(auto-fill, 644px);
        }

        @media (max-width: 1439px) {
            .items-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
            }
        }
    `,
    events: {
        collectionSelected: defineElementEvent<Collection>(),
    },
    renderCallback: ({inputs, dispatch, events}) => {
        return html`
            <div class="tab-content">
                <div>
                    <div class="header">
                        <span class="title">${inputs.categoryName}</span>
                    </div>
                    <div class="items-container">${inputs.children}</div>
                </div>
            </div>
        `;
    },
});
