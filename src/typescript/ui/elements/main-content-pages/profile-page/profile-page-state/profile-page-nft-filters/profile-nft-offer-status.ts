import {BaseNft} from '../../../../../../data/nft/base-nft';

export type ProfileNftOfferStatus = 'none' | 'received' | 'offered' | 'offered received';

export function calculateOfferStatus(
    currentUserAccountAddress: string,
    nft: BaseNft,
): ProfileNftOfferStatus {
    if (!nft.offers.length) {
        return 'none';
    }

    const received = nft.offers.filter(
        offer => offer.offererAccountAddress === currentUserAccountAddress,
    );

    const offered = nft.offers.length - received.length > 0;

    if (received.length && received) {
        return 'offered received';
    } else if (received.length) {
        return 'received';
    } else if (offered) {
        return 'offered';
    }

    return 'none';
}
