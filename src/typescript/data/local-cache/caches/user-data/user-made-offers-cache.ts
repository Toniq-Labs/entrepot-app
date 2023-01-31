import {createEntrepotApiWithIdentity} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {UserNft} from '../../../nft/user-nft';
import {nftIdsToNfts} from '../../../nft/nft-id';

export type UserOffersInputs = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

export function makeUserOffersKey({userAccount, userIdentity}: UserOffersInputs) {
    return `${userAccount.address}__${userIdentity.getPrincipal().toText()}`;
}

async function updateUserMadeOffers({
    userAccount,
    userIdentity,
}: UserOffersInputs): Promise<UserNft[]> {
    const offersMadeNftIds = await createEntrepotApiWithIdentity(userIdentity)
        .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
        .offered();

    return nftIdsToNfts({userAccount, nftIds: offersMadeNftIds});
}

export const userMadeOffersCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserMadeOffers>>,
    SubKeyRequirementEnum.Required,
    UserOffersInputs
>({
    cacheName: 'user-offers',
    valueUpdater: updateUserMadeOffers,
    keyGenerator: makeUserOffersKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
