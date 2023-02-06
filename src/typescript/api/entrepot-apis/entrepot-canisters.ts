import {defaultEntrepotApi, NftIds, createEntrepotApiWithIdentity} from './entrepot-data-api';
import {RawNftOffer} from '../../data/nft/nft-offer';
import {Sales} from '../../data/models/sales';
import {UserIdentity} from '../../data/models/user-data/identity';
import {CanisterId} from '../../data/models/canister-id';
import {treasureCanisterId} from '../../data/canisters/treasure-canister';
import {Principal} from '@dfinity/principal';

/**
 * This API has been filled in by looking at previous JavaScrip code, so it might not be entirely
 * accurate.
 */
type CollectionCanisterApi = {
    lock: (
        tokenId: string,
        price: number | BigInt,
        accountAddress: string,
        randomBytes: number[],
    ) => Promise<{err: Error; ok: string}>;
    settle: (tokenId: string) => Promise<void>;
    payments: () => Promise<unknown[][]>;
};

export const entrepotCanisters = getEntrepotCanister();

export function getEntrepotCanister({userIdentity}: {userIdentity?: UserIdentity} = {}) {
    const entrepotApi = userIdentity
        ? createEntrepotApiWithIdentity(userIdentity)
        : defaultEntrepotApi;

    return {
        /**
         * Idl JS file: src/ic/candid/volt-offers.did.js
         *
         * You may see another canister id floating around for offers
         * ("6z5wo-yqaaa-aaaah-qcsfa-cai"), but that's the old way. This canister is the new way.
         */
        nftOffers: entrepotApi.canister('fcwhh-piaaa-aaaak-qazba-cai') as {
            offers: (nftId: string) => Promise<RawNftOffer[]>;
            /** Offers made */
            offered: () => Promise<string[]>;
            /** Offers received */
            allOffers: () => Promise<RawNftOffer[]>;
            createMemo: (nftId: string, userAccountAddress: string) => Promise<unknown>;
            /** Make an offer. */
            offer: (
                nftId: string,
                amount: bigint,
                userAccountAddress: string,
                authorized: number,
                voltPrincipal: Principal,
            ) => Promise<unknown>;
        },
        nftAuctions: entrepotApi.canister('ffxbt-cqaaa-aaaak-qazbq-cai') as {
            auction: (nftId: string) => Promise<unknown[]>;
        },
        toniqEarn: entrepotApi.canister(treasureCanisterId) as {
            tp_close: Promise<unknown>;
            tp_cancel: Promise<unknown>;
            tp_fill: Promise<unknown>;
            tp_settle: Promise<unknown>;
        },
        launch: entrepotApi.canister('uczwa-vyaaa-aaaam-abdba-cai', 'launch') as {
            get_all_launch_settings: () => Promise<Sales[]>;
        },
        favorites: entrepotApi.canister('6z5wo-yqaaa-aaaah-qcsfa-cai') as {
            liked: () => Promise<NftIds>;
        },
        collection: (collectionId: CanisterId) => {
            return entrepotApi.canister(collectionId) as CollectionCanisterApi;
        },
    };
}
