import {CanisterDetails} from './canister-details';
import {icTurtlesCanisterDetails} from './specific-canisters/ic-turtles';
import {createDefaultCanisterDetails} from './default-canister-details';
import {icDripCanisterDetails} from './specific-canisters/ic-drip';
import {icPunksCanisterDetails} from './specific-canisters/ic-punks';
import {icatsCanisterDetails} from './specific-canisters/icats';
import {icpBunnyCanisterDetails} from './specific-canisters/icp-bunny';
import {createFullCanisterDetails} from './create-full-canister-details';
import {btcFlowerCanisterDetails} from './specific-canisters/btc-flower';
import {icpFlowerCanisterDetails} from './specific-canisters/icp-flower';
import {ethFlowerCanisterDetails} from './specific-canisters/eth-flower';
import {pineapplePunksCanisterDetails} from './specific-canisters/pineapple-punks';
import {dfinityDeckOriginsCanisterDetails} from './specific-canisters/dfinity-deck-origins';
import {icDinosCanisterDetails} from './specific-canisters/ic-dinos';
import {icKittiesCanisterDetails} from './specific-canisters/ic-kitties';
import {icPuppiesCanisterDetails} from './specific-canisters/ic-puppies';
import {cronicCrittersCanisterDetails} from './specific-canisters/cronic-critters';
import {icBucksCanisterDetails} from './specific-canisters/ic-bucks';
import {icelebrityCanisterDetails} from './specific-canisters/icelebrity';
import {pokeBotsCanisterDetails} from './specific-canisters/poked-bots';
import {motokoMechsCanisterDetails} from './specific-canisters/motoko-mechs';
import {genesisIICanisterDetails} from './specific-canisters/genesis-ii';
import {moonWalkersCanisterDetails} from './specific-canisters/moon-walkers';
import {petBotsCanisterDetails} from './specific-canisters/pet-bots';
import {flightCanisterDetails} from './specific-canisters/flight';
import {dripBangCanisterDetails} from './specific-canisters/drip-bang';
import {imaginationProjectCanisterDetails} from './specific-canisters/imagination-project';

const allCanisterDetails = [
    btcFlowerCanisterDetails,
    cronicCrittersCanisterDetails,
    dfinityDeckOriginsCanisterDetails,
    dripBangCanisterDetails,
    ethFlowerCanisterDetails,
    flightCanisterDetails,
    genesisIICanisterDetails,
    icatsCanisterDetails,
    icBucksCanisterDetails,
    icDinosCanisterDetails,
    icDripCanisterDetails,
    icelebrityCanisterDetails,
    icKittiesCanisterDetails,
    icpBunnyCanisterDetails,
    icpFlowerCanisterDetails,
    icPunksCanisterDetails,
    icPuppiesCanisterDetails,
    icTurtlesCanisterDetails,
    imaginationProjectCanisterDetails,
    moonWalkersCanisterDetails,
    motokoMechsCanisterDetails,
    petBotsCanisterDetails,
    pineapplePunksCanisterDetails,
    pokeBotsCanisterDetails,
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

export const allWrappedCanisters: ReadonlyArray<CanisterDetails> = Object.values(
    mappedCanisterDetails,
).filter(canisterDetails => canisterDetails.hasWrappedCanister);