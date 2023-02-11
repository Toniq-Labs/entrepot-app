import {BaseNft} from '../../../../../../data/nft/base-nft';

export type ProfileNftOfferStatus = 'none' | 'received' | 'offered' | 'offered received';

export function calculateOfferStatus(
    currentUserAccountAddress: string,
    nft: BaseNft,
): ProfileNftOfferStatus {
    if (!nft.offers.length) {
        return 'none';
    }

    const offered = nft.offers.filter(
        offer => offer.offererAccountAddress === currentUserAccountAddress,
    );

    const received = nft.offers.length - offered.length > 0;

    if (offered.length && received) {
        return 'offered received';
    } else if (offered.length) {
        return 'offered';
    } else if (received) {
        return 'received';
    }

    return 'none';
}
