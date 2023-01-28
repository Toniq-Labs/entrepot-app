import {isRuntimeTypeOf} from '@augment-vir/common';
import {getCanisterDetails} from './all-canister-details';

/** Or, in other words, get the wrapped canister id. */
export function getExtCanisterId(canisterId: string): string {
    const details = getCanisterDetails(canisterId);
    if (!details) {
        return canisterId;
    }

    return details.extCanisterId;
}

export function getOriginalCanisterId(canisterId: string): string {
    const details = getCanisterDetails(canisterId);
    if (!details) {
        return canisterId;
    }
    if (isRuntimeTypeOf(details.canisterId, 'string')) {
        return details.canisterId;
    } else {
        return details.canisterId.original;
    }
}

export enum CanisterWrappedType {
    // has no wrapping going on
    ExtOnly = 'ext-only',
    // the original, unwrapped, version of the wrapped canister
    UnwrappedOriginal = 'wrapped-original',
    // the EXT version of the wrapped canister
    WrappedExt = 'wrapped-ext',
}

export function getCanisterWrappedType(canisterId: string): CanisterWrappedType {
    const details = getCanisterDetails(canisterId);

    if (!details || isRuntimeTypeOf(details.canisterId, 'string')) {
        return CanisterWrappedType.ExtOnly;
    }
    if (canisterId === details.canisterId.extWrapped) {
        return CanisterWrappedType.WrappedExt;
    } else if (canisterId === details.canisterId.original) {
        return CanisterWrappedType.UnwrappedOriginal;
    } else {
        // this should never happen but this covers it just in case
        throw new Error(
            `Got details for wrapped canister '${canisterId}' but it matches none of the internal canister ids.`,
        );
    }
}

export function isWrappedType(canisterId: string, type: CanisterWrappedType): boolean {
    return getCanisterWrappedType(canisterId) === type;
}
