import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {UserIdentity} from '../../../models/user-data/identity';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {RawUserNft, parseRawUserNft, UserNft} from '../../../nft/user-nft';

export type UserNftsInput = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

export function makeUserNftsKey({userAccount, userIdentity}: UserNftsInput) {
    return `${userAccount.address}__${userIdentity.getPrincipal().toText()}`;
}

async function updateUserNfts({userAccount}: UserNftsInput): Promise<UserNft[]> {
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAccount.address,
        'all',
    ]);

    const rawUserNfts: ReadonlyArray<RawUserNft> = await (await fetch(cloudFunctionsUrl)).json();

    // // do we actually need to load NFTs from the wrapped canisters?
    // const rawWrappedNfts = await allWrappedCanistersApi.getTokens(
    //     userAccount.address,
    //     identity.getPrincipal().toText(),
    // );

    const userNfts = rawUserNfts.map(parseRawUserNft);

    return userNfts;
}

export const userNftsCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserNfts>>,
    SubKeyRequirementEnum.Required,
    UserNftsInput
>({
    cacheName: 'user-nfts',
    valueUpdater: updateUserNfts,
    keyGenerator: makeUserNftsKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
