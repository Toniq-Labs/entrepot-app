import {CanisterDetails} from './canister-details';
import {icTurtlesCanisterDetails} from './specific-canisters/ic-turtles';
import {createDefaultCanisterDetails} from './default-canister-details';
import {icDripCanisterDetails} from './specific-canisters/ic-drip';
import {icPunksCanisterDetails} from './specific-canisters/ic-punks';
import {icatsCanisterDetails} from './specific-canisters/icats';
import {icpBunnyCanisterDetails} from './specific-canisters/icp-bunny';
import {createFullCanisterDetails} from './full-canister-details';
import {icpFlowerCanisterDetails} from './specific-canisters/icp-flower';

const allCanisterDetails = [
    icatsCanisterDetails,
    icDripCanisterDetails,
    icpBunnyCanisterDetails,
    icPunksCanisterDetails,
    icTurtlesCanisterDetails,
    icpFlowerCanisterDetails,
];

/**
 * This maps from both the extWrapped canister id (if it exists) and the original canister id. Thus,
 * canister details can be accessed by either canister id.
 */
const mappedCanisterDetails: Readonly<Record<string, CanisterDetails>> = Object.fromEntries(
    allCanisterDetails.map(createFullCanisterDetails).flat(),
);

export function getCanisterDetails(canisterId: string): CanisterDetails {
    return mappedCanisterDetails[canisterId] ?? createDefaultCanisterDetails(canisterId);
}
