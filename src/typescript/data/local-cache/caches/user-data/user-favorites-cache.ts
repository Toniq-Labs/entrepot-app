import {createEntrepotApiWithIdentity} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {UserNft} from '../../../nft/user-nft';
import {nftIdToNft, nftIdsToNfts} from '../../../nft/nft-id';

export type UserFavoritesInputs = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

export function makeUserFavoritesKey({userAccount, userIdentity}: UserFavoritesInputs) {
    return `${userAccount.address}__${userIdentity.getPrincipal().toText()}`;
}

async function updateUserFavorites({
    userAccount,
    userIdentity,
}: UserFavoritesInputs): Promise<UserNft[]> {
    const favoriteNftIds = await createEntrepotApiWithIdentity(userIdentity)
        .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
        .liked();

    return nftIdsToNfts({userAccount, nftIds: favoriteNftIds});
}

export const userFavoritesCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserFavorites>>,
    SubKeyRequirementEnum.Required,
    UserFavoritesInputs
>({
    cacheName: 'user-favorites',
    valueUpdater: updateUserFavorites,
    keyGenerator: makeUserFavoritesKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
