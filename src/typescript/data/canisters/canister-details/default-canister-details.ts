import {getCanisterDomain} from '../../../api/ic-canister-domain';
import {CanisterDetails, GetNftImageHtmlInputs, RawCanisterDetails} from './canister-details';
import {formEntrepotImagesUrl} from '../../../api/entrepot-apis/entrepot-images-url';

export function createDefaultCanisterDetails(
    canisterId: string,
    rawCanisterDetails?: RawCanisterDetails | undefined,
): CanisterDetails {
    return {
        canisterId,
        collectionName: canisterId,
        extCanisterId: canisterId,
        originalCanisterId: canisterId,
        hasWrappedCanister: false,
        getNftLinkUrl: ({nftId}) => {
            return `https://${canisterId}.raw.icp0.io/?tokenid=${nftId}`;
        },
        getNftImageData: inputs => {
            const priority = inputs.priority ?? 10;
            return getDefaultNftImageData({
                ...inputs,
                priority,
                canisterId,
            });
        },
    };
}

export function getDefaultNftImageData({
    fullSize,
    nftId,
    priority,
    canisterId,
    useCaseBuster,
    entrepotImagesCanisterId,
}: Pick<GetNftImageHtmlInputs, 'fullSize' | 'nftId' | 'priority'> & {
    canisterId: string;
    entrepotImagesCanisterId?: string | undefined;
    useCaseBuster?: boolean | undefined;
}) {
    const imageUrl = fullSize
        ? `${getCanisterDomain(canisterId)}/?cc=0&tokenid=${nftId}`
        : formEntrepotImagesUrl({
              entrepotImagesCanisterId: entrepotImagesCanisterId || canisterId,
              nftId,
              cachePriority: priority,
              useCacheBuster: useCaseBuster,
          });
    return {url: imageUrl};
}
