/* global BigInt */
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getExtId, nftIdToNft} from '../../utilities/load-tokens';
import {EntrepotNFTMintNumber} from '../../utils';
import {createNftFilterStats} from './ProfileNftStats';
import {ProfileTabs, nftStatusesByTab} from './ProfileTabs';
import {wait} from '@augment-vir/common';
import {
    defaultEntrepotApi,
    createEntrepotApiWithIdentity,
} from '../../typescript/api/entrepot-data-api';
import {getExtCanisterId} from '../../typescript/data/canisters/canister-details/wrapped-canister-ids';

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
            resolve(
                await includeCollectionsAndStats(
                    await getOwnedNfts(address, identity, allCollections),
                    allCollections,
                ),
            ),
        ),
        [ProfileTabs.Favorites]: new Promise(async resolve =>
            resolve(
                await includeCollectionsAndStats(
                    [
                        ...(await getFavoritesNfts(address, identity, allCollections)),
                    ],
                    allCollections,
                ),
            ),
        ),
        [ProfileTabs.Offers]: new Promise(async resolve =>
            resolve(
                await includeCollectionsAndStats(
                    [
                        ...(await getOffersMadeNfts(address, identity, allCollections)),
                    ],
                    allCollections,
                ),
            ),
        ),
        [ProfileTabs.Activity]: new Promise(async resolve =>
            resolve(
                await includeCollectionsAndStats(
                    await getActivityNfts(address, allCollections),
                    allCollections,
                ),
            ),
        ),
    };

    return allNftsSets;
}

async function getActivityNfts(address, collections) {
    const rawData = (
        await (
            await fetch(
                'https://us-central1-entrepot-api.cloudfunctions.net/api/user/' +
                    address +
                    '/transactions',
            )
        ).json()
    ).filter(nft => nft.token !== '');
    const activityData = await Promise.all(
        rawData.map(async (nft, index) => {
            const isBuyer = nft.buyer === address;
            const nftWithData = await getNftData(nft, collections, index, false, address);
            return {
                ...nftWithData,
                type: isBuyer ? 'Purchase' : 'Sale',
                date: new Date(nftWithData.time / 1_000_000),
                statuses: new Set([
                    isBuyer
                        ? nftStatusesByTab[ProfileTabs.Activity].Bought
                        : nftStatusesByTab[ProfileTabs.Activity].Sold,
                ]),
            };
        }),
    );

    return activityData;
}

async function getOwnedNfts(address, identity, collections) {
    const allUserNfts = await Promise.all(
        (await Promise.all([loadAllUserTokens(address, identity.getPrincipal().toText())]))
            .flat()
            .map(async (nft, index) => {
                const nftWithData = await getNftData(nft, collections, index, false, address);
                return {
                    ...nftWithData,
                    statuses: new Set(
                        [
                            nftWithData.listing
                                ? nftStatusesByTab[ProfileTabs.MyNfts].ForSale
                                : nftStatusesByTab[ProfileTabs.MyNfts].Unlisted,
                            nftWithData.offers?.length
                                ? nftStatusesByTab[ProfileTabs.MyNfts].OffersReceived
                                : undefined,
                        ].filter(a => !!a),
                    ),
                };
            }),
    );

    return allUserNfts;
}

async function getOffersMadeNfts(address, identity, collections) {
    const offersMadeNftIds = await createEntrepotApiWithIdentity(identity)
        .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
        .offered();
    const offersMadeNfts = await Promise.all(
        offersMadeNftIds.map(async (nftId, index) => {
            const nft = nftIdToNft(address, nftId);
            const nftWithData = await getNftData(nft, collections, index, true, address);
            return {
                ...nftWithData,
                statuses: new Set(
                    nftWithData.offers.length - nftWithData.selfOffers.length
                        ? [nftStatusesByTab[ProfileTabs.Offers].HasOtherOffers]
                        : [],
                ),
            };
        }),
    );
    return offersMadeNfts;
}

async function getFavoritesNfts(address, identity, collections) {
    const favoriteNftIds = await createEntrepotApiWithIdentity(identity)
        .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
        .liked();
    const favoriteNfts = await Promise.all(
        favoriteNftIds.map(async (nftId, index) => {
            const nft = nftIdToNft(address, nftId);
            const nftWithData = await getNftData(nft, collections, index, false, address);
            return {
                ...nftWithData,
                statuses: new Set(
                    nftWithData.offers.length - nftWithData.selfOffers.length
                        ? [nftStatusesByTab[ProfileTabs.Favorites].HasOffers]
                        : [],
                ),
            };
        }),
    );
    return favoriteNfts;
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
                  'https://us-central1-entrepot-api.cloudfunctions.net/api/token/' + rawNft.token,
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
