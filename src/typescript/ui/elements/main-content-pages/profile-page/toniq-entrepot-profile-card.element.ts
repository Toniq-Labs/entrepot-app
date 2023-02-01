import {assign, html} from 'element-vir';
import {defineToniqElement} from '@toniq-labs/design-system';
import {EntrepotNftCardElement} from '../../common/toniq-entrepot-nft-card.element';
import {NftExtraData} from '../../../../data/nft/nft-extra-data';
import {UserNft} from '../../../../data/nft/user-nft';
import {UserNftTransaction} from '../../../../data/nft/user-nft-transaction';

export const EntrepotProfileCardElement = defineToniqElement<{
    nftExtraData: NftExtraData;
    userNft: UserNft | undefined;
    nftTransaction: UserNftTransaction | undefined;
}>()({
    tagName: 'toniq-entrepot-profile-card',
    renderCallback: ({inputs}) => {
        return html`
            <${EntrepotNftCardElement}
                ${assign(EntrepotNftCardElement, {
                    nft: {
                        ...inputs.userNft!,
                        ...inputs.nftExtraData,
                    },
                })}
            ></${EntrepotNftCardElement}>
        `;
    },
});
