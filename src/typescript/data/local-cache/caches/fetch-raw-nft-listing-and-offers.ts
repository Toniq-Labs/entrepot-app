import {createCloudFunctionsEndpointUrl} from '../../../api/entrepot-apis/entrepot-data-api';
import {getExtNftId} from '../../nft/nft-id';
import {entrepotCanisters} from '../../../api/entrepot-apis/entrepot-canisters';
import {wait} from '@augment-vir/common';
import {RawNftListing} from '../../nft/nft-listing';
import {parseRawNftData} from '../../nft/base-nft';

export async function fetchRawNftListingAndOffers(
    waitIndex: number,
    nftId: string,
): Promise<Parameters<typeof parseRawNftData>[0]> {
    if (waitIndex <= 0) {
        throw new Error(`Must provide positive wait index to prevent DOSing canisters.`);
    }

    await wait(waitIndex + (Math.random() * waitIndex || 1) / 10);

    const rawNftOffers = await entrepotCanisters.nftOffers.offers(getExtNftId(nftId));

    console.log({rawNftOffers, nftId, extId: getExtNftId(nftId)});

    const rawNftListing: RawNftListing = await (
        await fetch(
            createCloudFunctionsEndpointUrl([
                'token',
                nftId,
            ]),
        )
    ).json();

    return {rawNftListing, rawNftOffers};
}
