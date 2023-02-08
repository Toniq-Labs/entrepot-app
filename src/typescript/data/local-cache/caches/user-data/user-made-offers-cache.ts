import {createEntrepotApiWithIdentity} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {BaseNft, parseRawNftData} from '../../../nft/base-nft';
import {fetchRawNftListingAndOffers} from '../fetch-raw-nft-listing-and-offers';
import {getEntrepotCanister} from '../../../../api/entrepot-apis/entrepot-canisters';

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
}: UserOffersInputs): Promise<BaseNft[]> {
    const offersMadeNftIds = await getEntrepotCanister({userIdentity}).nftOffers.offered();

    const userOfferedNfts = Promise.all(
        offersMadeNftIds.map(async (offerMadeNftId, index) => {
            const rawNftListingAndOffers = await fetchRawNftListingAndOffers(
                index + 1,
                offerMadeNftId,
            );

            return parseRawNftData(rawNftListingAndOffers);
        }),
    );

    return userOfferedNfts;
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
