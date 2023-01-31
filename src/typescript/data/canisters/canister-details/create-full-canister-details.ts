import {isRuntimeTypeOf, extractErrorMessage} from '@augment-vir/common';
import {
    CanisterDetails,
    RawCanisterDetails,
    GetNftImageHtmlInputs,
    RawGetNftImageHtmlInputs,
} from './canister-details';
import {createDefaultCanisterDetails} from './default-canister-details';
import {NftImageDisplayData} from '../get-nft-image-data';

async function fullGetNftImageHtml({
    rawCanisterDetails,
    inputs,
    originalCanisterId,
    defaultFallbacks,
}: {
    rawCanisterDetails: RawCanisterDetails;
    inputs: GetNftImageHtmlInputs;
    originalCanisterId: string;
    defaultFallbacks: CanisterDetails;
}): Promise<NftImageDisplayData> {
    try {
        const inputsForRawCanisterDetails: Omit<RawGetNftImageHtmlInputs, 'nftLinkUrl'> = {
            priority: 10,
            fullSize: false,
            ...inputs,
            originalCanisterId,
        };

        const customNftLinkUrl: string | undefined = rawCanisterDetails.getNftLinkUrl?.(
            inputsForRawCanisterDetails,
        );

        const nftLinkUrl: string =
            customNftLinkUrl ?? defaultFallbacks.getNftLinkUrl(inputsForRawCanisterDetails);

        const customData: NftImageDisplayData | undefined =
            (await rawCanisterDetails.getNftImageData?.({
                ...inputsForRawCanisterDetails,
                nftLinkUrl,
            })) ?? (customNftLinkUrl ? {url: customNftLinkUrl} : undefined);

        const finalImageData =
            customData ?? defaultFallbacks.getNftImageData(inputsForRawCanisterDetails);

        return finalImageData;
    } catch (error) {
        console.error({...inputs});
        throw new Error(
            `Failed to get NFT image HTML for '${
                rawCanisterDetails.collectionName
            }' with inputs: ${extractErrorMessage(error)}`,
        );
    }
}

export function createFullCanisterDetails(rawCanisterDetails: RawCanisterDetails) {
    const canisterIds: ReadonlyArray<string> = isRuntimeTypeOf(
        rawCanisterDetails.canisterId,
        'string',
    )
        ? [rawCanisterDetails.canisterId]
        : Object.values(rawCanisterDetails.canisterId);
    const isWrappedCanister = !isRuntimeTypeOf(rawCanisterDetails.canisterId, 'string');
    const extCanisterId = isRuntimeTypeOf(rawCanisterDetails.canisterId, 'string')
        ? rawCanisterDetails.canisterId
        : rawCanisterDetails.canisterId.extWrapped;
    const originalCanisterId = isRuntimeTypeOf(rawCanisterDetails.canisterId, 'string')
        ? rawCanisterDetails.canisterId
        : rawCanisterDetails.canisterId.original;
    const defaultFallbacks = createDefaultCanisterDetails(originalCanisterId);

    const fullCanisterDetails: CanisterDetails = {
        ...rawCanisterDetails,
        hasWrappedCanister: isWrappedCanister,
        extCanisterId,
        originalCanisterId,
        getNftLinkUrl: inputs => {
            return defaultFallbacks.getNftLinkUrl(inputs) ?? defaultFallbacks.getNftLinkUrl(inputs);
        },
        getNftImageData: async inputs => {
            return fullGetNftImageHtml({
                rawCanisterDetails,
                inputs,
                originalCanisterId,
                defaultFallbacks,
            });
        },
    };
    return canisterIds.map((canisterId): [string, CanisterDetails] => [
        canisterId,
        fullCanisterDetails,
    ]);
}
