import {assign, html} from 'element-vir';
import {defineToniqElement} from '@toniq-labs/design-system';
import {EntrepotNftCardElement, NftCardInputs} from '../../common/toniq-entrepot-nft-card.element';

export const EntrepotProfileCardElement = defineToniqElement<NftCardInputs>()({
    tagName: 'toniq-entrepot-profile-card',
    renderCallback: ({inputs}) => {
        return html`
            <${EntrepotNftCardElement}
                ${assign(EntrepotNftCardElement, {
                    nft: inputs.nft,
                })}
            ></${EntrepotNftCardElement}>
        `;
    },
});
