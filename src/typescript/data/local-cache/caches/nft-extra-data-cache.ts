import {
    createCloudFunctionsEndpointUrl,
    defaultEntrepotApi,
} from '../../../api/entrepot-apis/entrepot-data-api';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../define-local-cache';
import {UserNft} from '../../nft/user-nft';
import {getExtNftId} from '../../nft/nft-id';
import {wait, JsonCompatibleValue} from '@augment-vir/common';
import {NftExtraData} from '../../nft/nft-extra-data';
import {parseRawNftOffer} from '../../nft/nft-offers';

export type NftExtraDataCacheInputs = {
    userNft: Pick<UserNft, 'listPrice' | 'nftId'>;
    waitIndex: number;
};

export function makeUserNftsKey({userNft}: NftExtraDataCacheInputs) {
    return `${userNft.nftId}`;
}

async function updateNftExtraData({
    userNft,
    waitIndex,
}: NftExtraDataCacheInputs): Promise<NftExtraData> {
    await wait(waitIndex + (Math.random() * waitIndex || 1) / 10);
    const offersMadeOnCurrentNft = (
        await defaultEntrepotApi
            .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
            .offers(getExtNftId(userNft.nftId))
    ).map(parseRawNftOffer);

    const rawListing = await (
        await fetch(
            createCloudFunctionsEndpointUrl([
                'token',
                userNft.nftId,
            ]),
        )
    ).json();

    const listing: NftExtraData['listing'] = rawListing?.price
        ? {
              price: rawListing.price,
              locked: rawListing.time > 0 ? [rawListing.time] : [],
          }
        : userNft.listPrice
        ? {
              price: userNft.listPrice,
              locked: false,
          }
        : undefined;

    const nftExtraData: NftExtraData = {
        nftId: userNft.nftId,
        listing,
        offers: offersMadeOnCurrentNft,
    };

    const derp: JsonCompatibleValue = nftExtraData;

    return nftExtraData;
}

export const nftExtraDataCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateNftExtraData>>,
    SubKeyRequirementEnum.Required,
    NftExtraDataCacheInputs
>({
    cacheName: 'nft-extra-data',
    valueUpdater: updateNftExtraData,
    keyGenerator: makeUserNftsKey,
    subKeyRequirement: SubKeyRequirementEnum.Required,
    minUpdateInterval: 30_000,
});
