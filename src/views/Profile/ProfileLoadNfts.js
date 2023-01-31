/* global BigInt */
import extjs from '../../ic/extjs.js';
import {getExtId} from '../../utilities/load-tokens';
import {EntrepotNFTMintNumber} from '../../utils';
import {createNftFilterStats} from './ProfileNftStats';
import {ProfileTabs, nftStatusesByTab} from './ProfileTabs';
import {wait} from '@augment-vir/common';
import {
    defaultEntrepotApi,
    createEntrepotApiWithIdentity,
    createCloudFunctionsEndpointUrl,
} from '../../typescript/api/entrepot-apis/entrepot-data-api';

async function includeCollectionsAndStats(nfts, allCollections) {
    const allowedCollections = allCollections.filter(collection => {
        const isAllowedToView = !collection.dev;
        return isAllowedToView;
    });
    const allowedCanistersSet = new Set(allowedCollections.map(collection => collection.canister));

    const allNftCanisters = new Set(nfts.map(nft => nft.canister));

    const collections = allowedCollections.filter(collection => {
        return allNftCanisters.has(collection.canister);
    });

    const allowedNfts = nfts.filter(nft => allowedCanistersSet.has(nft.canister));

    return {
        nfts: allowedNfts,

        collections,
        stats: createNftFilterStats(allowedNfts),
    };
}

export function startLoadingProfileNftsAndCollections(address, identity, allCollections) {
    const allNftsSets = {
        [ProfileTabs.MyNfts]: new Promise(async resolve =>
            resolve(await includeCollectionsAndStats({})),
        ),
        [ProfileTabs.Favorites]: new Promise(async resolve =>
            resolve(await includeCollectionsAndStats([], allCollections)),
        ),
        [ProfileTabs.Offers]: new Promise(async resolve =>
            resolve(await includeCollectionsAndStats([], allCollections)),
        ),
        [ProfileTabs.Activity]: new Promise(async resolve =>
            resolve(await includeCollectionsAndStats({})),
        ),
    };

    return allNftsSets;
}

async function getNftData(rawNft, collections, waitIndex, loadListing, address) {
    await wait(waitIndex + (Math.random() * waitIndex || 1) / 10);
    const {index} = extjs.decodeTokenId(rawNft.token);

    const mintNumber = EntrepotNFTMintNumber(rawNft.canister, index);
    const offers = loadListing
        ? await defaultEntrepotApi
              .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
              .offers(getExtId(rawNft.token))
        : [];
    const rawListing = loadListing
        ? await (
              await fetch(
                  createCloudFunctionsEndpointUrl([
                      'token',
                      rawNft.token,
                  ]),
              )
          ).json()
        : undefined;

    const listing = rawListing?.price
        ? {
              price: BigInt(rawListing.price),
              locked: rawListing.time > 0 ? [BigInt(rawListing.time)] : [],
          }
        : rawNft.price
        ? {
              price: BigInt(rawNft.price),
              locked: false,
          }
        : undefined;
    const collection = collections.find(collection => collection.canister === rawNft.canister);

    const selfOffers = offers.filter(offer => offer[3] === address);
    const userNft = {
        ...rawNft,
        index,
        rawListing,
        selfOffers,
        image: '',
        // image: EntrepotNFTImage(getExtCanisterId(rawNft.canister), index, rawNft.token, false, 0),
        mintNumber,
        collection,
        offers,
        listing,
        traits: undefined,
    };

    return userNft;
}

export async function loadNri(nfts) {}
