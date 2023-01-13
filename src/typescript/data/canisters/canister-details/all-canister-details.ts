import {extractErrorMessage, isRuntimeTypeOf} from '@augment-vir/common';
import {
    RawCanisterDetails,
    CanisterDetails,
    GetNftImageHtmlInputs,
    RawGetNftImageHtmlInputs,
} from './canister-details';
import {icTurtlesCanisterDetails} from './specific-canisters/ic-turtles';
import {createDefaultCanisterDetails} from './default-canister-details';
import {icDripCanisterDetails} from './specific-canisters/ic-drip';
import {icPunksCanisterDetails} from './specific-canisters/ic-punks';
import {icatsCanisterDetails} from './specific-canisters/icats';
import {icpBunnyCanisterDetails} from './specific-canisters/icp-bunny';

const allCanisterDetails = [
    icatsCanisterDetails,
    icDripCanisterDetails,
    icpBunnyCanisterDetails,
    icPunksCanisterDetails,
    icTurtlesCanisterDetails,
];

async function fullGetNftImageHtml(
    rawCanisterDetails: RawCanisterDetails,
    inputs: GetNftImageHtmlInputs,
) {
    try {
        const originalCanisterId = isRuntimeTypeOf(rawCanisterDetails.canisterId, 'string')
            ? rawCanisterDetails.canisterId
            : rawCanisterDetails.canisterId.original;

        const inputsForRawCanisterDetails: Omit<RawGetNftImageHtmlInputs, 'nftLinkUrl'> = {
            priority: 10,
            ref: 0,
            fullSize: false,
            ...inputs,
            originalCanisterId,
        };

        const nftLinkUrl = rawCanisterDetails.getNftLinkUrl(inputsForRawCanisterDetails);

        return await rawCanisterDetails.getNftImageHtml({
            ...inputsForRawCanisterDetails,
            nftLinkUrl,
        });
    } catch (error) {
        throw new Error(
            `Failed to get NFT image HTML for '${
                rawCanisterDetails.collectionName
            }' with inputs: '${JSON.stringify(inputs)}': ${extractErrorMessage(error)}`,
        );
    }
}

/**
 * This maps from both the extWrapped canister id (if it exists) and the original canister id. Thus,
 * canister details can be accessed by either canister id.
 */
const mappedCanisterDetails: Readonly<Record<string, CanisterDetails>> = Object.fromEntries(
    allCanisterDetails
        .map((rawCanisterDetails): ReadonlyArray<[string, CanisterDetails]> => {
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

            const fullCanisterDetails: CanisterDetails = {
                ...rawCanisterDetails,
                hasWrappedCanister: isWrappedCanister,
                extCanisterId,
                getNftImageHtml: async inputs => {
                    return fullGetNftImageHtml(rawCanisterDetails, inputs);
                },
            };
            return canisterIds.map((canisterId): [string, CanisterDetails] => [
                canisterId,
                fullCanisterDetails,
            ]);
        })
        .flat(),
);

export function getCanisterDetails(canisterId: string): CanisterDetails | undefined {
    return mappedCanisterDetails[canisterId] ?? createDefaultCanisterDetails(canisterId);
}
