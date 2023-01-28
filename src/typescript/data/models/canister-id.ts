// canister id, collection id, same thing
export type CanisterId = `${string}-${string}-${string}-${string}-${string}`;

export function isCanisterId(canisterId: string): canisterId is CanisterId {
    return canisterId.length === 27 && canisterId.split('-').length === 5;
}
