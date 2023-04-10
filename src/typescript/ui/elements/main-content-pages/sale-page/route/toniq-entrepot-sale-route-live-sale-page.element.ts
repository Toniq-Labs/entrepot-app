import {PartialAndNullable} from '@augment-vir/common';
import {DimensionConstraints} from '@electrovir/resizable-image-element';
import {assign, css, defineElement, html} from 'element-vir';
import parse from 'html-react-parser';
import {NftImageInputs} from '../../../../../data/canisters/get-nft-image-data';
import {CollectionSales} from '../../../../../data/models/sales';
import {EntrepotNftDisplayElement} from '../../../common/toniq-entrepot-nft-display.element';
import {routeStyle} from './common/route-style';

export const EntrepotSaleRouteLiveSalePageElement = defineElement<{
    collectionSale: CollectionSales;
    nftImageInputs: NftImageInputs & PartialAndNullable<DimensionConstraints>;
}>()({
    tagName: 'toniq-entrepot-sale-route-live-sale-page',
    styles: css`
        ${routeStyle}
    `,
    renderCallback: ({inputs}) => {
        const {collectionId, fullSize, cachePriority, nftId, nftIndex, ref, min, max} =
            inputs.nftImageInputs;
        const {name, blurb} = inputs.collectionSale;

        console.log(inputs.collectionSale);
        return html`
            <div class="page-wrapper">
                <div class="section-overview">
                    <div class="image-wrapper">
                        <${EntrepotNftDisplayElement}
                            ${assign(EntrepotNftDisplayElement, {
                                collectionId,
                                fullSize,
                                cachePriority,
                                nftId,
                                nftIndex,
                                ref,
                                min,
                                max,
                            })}
                        ></${EntrepotNftDisplayElement}>
                    </div>
                    <div class="overview-wrapper">
                        <span class="collection-name">${name}</span>
                        <span class="collection-team">by Team Name</span>
                        <div class="collection-social">
                            ${[
                                'telegram',
                                'twitter',
                                'medium',
                                'discord',
                                'dscvr',
                                'distrikt',
                            ]
                                .filter(
                                    social =>
                                        inputs.collectionSale.hasOwnProperty(social) &&
                                        inputs.collectionSale[social as keyof CollectionSales],
                                )
                                .map(social => {
                                    return html`
                                        <a
                                            href=${inputs.collectionSale[
                                                social as keyof CollectionSales
                                            ]}
                                            target="_blank"
                                            rel="noreferrer"
                                            class="socialLinkIcon"
                                        >
                                            <img
                                                alt=${social}
                                                style="width: 24px"
                                                src=${'/icon/svg/' + social + '.svg'}
                                            />
                                        </a>
                                    `;
                                })}
                        </div>
                        <div class="collection-blurb">
                            ${parse(blurb)}
                        </div>
                    </div>
                </div>
                <div class="section-info"></div>
                <div class="section-details"></div>
                <div class="section-artwork"></div>
            </div>
        `;
    },
});
