import {createEntrepotApiWithIdentity} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {fetchRawNftListingAndOffers} from '../fetch-raw-nft-listing-and-offers';
import {BaseNft, parseRawNftData} from '../../../nft/base-nft';

export type UserFavoritesInputs = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

export function makeUserFavoritesKey({userIdentity}: UserFavoritesInputs) {
    return userIdentity.getPrincipal().toText();
}

async function updateUserFavorites({userIdentity}: UserFavoritesInputs): Promise<BaseNft[]> {
    const favoriteNftIds = await createEntrepotApiWithIdentity(userIdentity)
        .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
        .liked();

    const userOfferedNfts = Promise.all(
        favoriteNftIds.map(async (favoriteNftId, index) => {
            const rawNftListingAndOffers = await fetchRawNftListingAndOffers(
                index + 1,
                favoriteNftId,
            );

            return parseRawNftData(rawNftListingAndOffers);
        }),
    );

    return userOfferedNfts;
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
