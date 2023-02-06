import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {CanisterId} from '../../../models/canister-id';
import {BaseNft, parseRawNftData} from '../../../nft/base-nft';
import {fetchRawNftListingAndOffers} from '../fetch-raw-nft-listing-and-offers';

export type UserNftsInput = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

type RawUserOwnedNft = {
    canister: CanisterId;
    id: string;
    owner: string;
    price: number;
    time: number;
};

export function makeUserNftsKey({userAccount, userIdentity}: UserNftsInput) {
    return `${userAccount.address}__${userIdentity.getPrincipal().toText()}`;
}

async function updateUserOwnedNfts({userAccount}: UserNftsInput): Promise<BaseNft[]> {
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAccount.address,
        'all',
    ]);

    const rawUserNfts: ReadonlyArray<RawUserOwnedNft> = await (
        await fetch(cloudFunctionsUrl)
    ).json();

    // // do we actually need to load NFTs from the wrapped canisters?
    // const rawWrappedNfts = await allWrappedCanistersApi.getTokens(
    //     userAccount.address,
    //     identity.getPrincipal().toText(),
    // );

    const userOwnedNfts = Promise.all(
        rawUserNfts.map(async (rawUserOwnedNft, index) => {
            const rawNftListingAndOffers = await fetchRawNftListingAndOffers(
                index + 1,
                rawUserOwnedNft.id,
            );

            return parseRawNftData(rawNftListingAndOffers);
        }),
    );

    return userOwnedNfts;
}

export const userOwnedNftsCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserOwnedNfts>>,
    SubKeyRequirementEnum.Required,
    UserNftsInput
>({
    cacheName: 'user-nfts',
    valueUpdater: updateUserOwnedNfts,
    keyGenerator: makeUserNftsKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
