import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {CanisterId} from '../../../models/canister-id';

export type UserNftsInput = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

export type RawUserOwnedNft = {
    canister: CanisterId;
    id: CanisterId;
    owner: string;
    price: number;
    time: number;
};

export function makeUserNftsKey({userAccount, userIdentity}: UserNftsInput) {
    return `${userAccount.address}__${userIdentity.getPrincipal().toText()}`;
}

async function updateUserOwnedNfts({userAccount}: UserNftsInput): Promise<RawUserOwnedNft[]> {
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAccount.address,
        'all',
    ]);

    const rawUserNfts: Array<RawUserOwnedNft> = await (await fetch(cloudFunctionsUrl)).json();
    return rawUserNfts;
}

export const userOwnedNftsStatCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserOwnedNfts>>,
    SubKeyRequirementEnum.Required,
    UserNftsInput
>({
    cacheName: 'user-nfts-stat',
    valueUpdater: updateUserOwnedNfts,
    keyGenerator: makeUserNftsKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
