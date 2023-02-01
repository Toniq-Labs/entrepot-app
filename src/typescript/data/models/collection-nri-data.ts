import {CanisterId} from './canister-id';

export type CollectionNriData = {
    collectionId: CanisterId;
    nriData:
        | number[]
        // undefined happens for canisters that do not have NRI data
        | undefined;
};
