import {isRuntimeTypeOf, extractErrorMessage} from '@augment-vir/common';
import {
    CanisterDetails,
    RawCanisterDetails,
    GetNftImageHtmlInputs,
    RawGetNftImageHtmlInputs,
} from './canister-details';
import {createDefaultCanisterDetails} from './default-canister-details';
import {TemplateResult} from 'lit';

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
}): Promise<TemplateResult> {
    try {
        const inputsForRawCanisterDetails: Omit<RawGetNftImageHtmlInputs, 'nftLinkUrl'> = {
            priority: 10,
            fullSize: false,
            ...inputs,
            originalCanisterId,
        };

        const nftLinkUrl: string =
            rawCanisterDetails.getNftLinkUrl?.(inputsForRawCanisterDetails) ??
            defaultFallbacks.getNftLinkUrl(inputsForRawCanisterDetails);

        const customTemplate = await rawCanisterDetails.getNftImageHtml?.({
            ...inputsForRawCanisterDetails,
            nftLinkUrl,
        });

        const finalTemplate =
            customTemplate ?? defaultFallbacks.getNftImageHtml(inputsForRawCanisterDetails);

        console.log({finalTemplate});

        return finalTemplate;
    } catch (error) {
        throw new Error(
            `Failed to get NFT image HTML for '${
                rawCanisterDetails.collectionName
            }' with inputs: '${JSON.stringify(inputs)}': ${extractErrorMessage(error)}`,
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
        getNftLinkUrl: inputs => {
            return defaultFallbacks.getNftLinkUrl(inputs) ?? defaultFallbacks.getNftLinkUrl(inputs);
        },
        getNftImageHtml: async inputs => {
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
