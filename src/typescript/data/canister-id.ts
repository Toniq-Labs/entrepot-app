export function isCanisterId(canisterId: string): boolean {
    return canisterId.length === 27 && canisterId.split('-').length === 5;
}
