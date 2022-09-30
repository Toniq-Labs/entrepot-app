/* global BigInt */
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister, getEXTID, nftIdToNft} from '../../utilities/load-tokens';
import {EntrepotNFTImage, EntrepotNFTMintNumber} from '../../utils';
import getNri from '../../ic/nftv.js';
import {createNftFilterStats} from './ProfileNftStats';
import {ProfileTabs, nftStatusesByTab} from './ProfileTabs';
import {wait} from 'augment-vir';

const api = extjs.connect('https://boundary.ic0.app/');

function trait2dArrayToObject(traitArray) {
  return traitArray.reduce((accum, currentTrait) => {
    if (currentTrait[0] in accum) {
      accum[currentTrait[0]].push(currentTrait[1]);
    }
    accum[currentTrait[0]] = [currentTrait[1]];
    return accum;
  }, {});
}

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

  await Promise.all(
    collections.map(async collection => {
      if (!('traits' in collection)) {
        const traits = await loadTraits(collection);
        collection.traits = traits;
      }
    }),
  );

  const allowedNfts = nfts.filter(nft => allowedCanistersSet.has(nft.canister));
  allowedNfts.forEach(nft => {
    if (nft.collection.traits?.length) {
      nft.traits = trait2dArrayToObject(nft.collection.traits[1][nft.index][1]);
    }
  });

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
    [ProfileTabs.Watching]: new Promise(async resolve =>
      resolve(
        await includeCollectionsAndStats(
          [
            ...(await getFavoritesNfts(address, identity, allCollections)),
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

async function loadTraits(collection) {
  if (collection?.filter) {
    try {
      const traitData = await fetch('/filter/' + collection.canister + '.json').then(response =>
        response.json(),
      );
      console.log({traitData});
      return traitData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

async function getActivityNfts(address, collections) {
  const rawData = (
    await (
      await fetch(
        'https://us-central1-entrepot-api.cloudfunctions.net/api/user/' + address + '/transactions',
      )
    ).json()
  ).filter(nft => nft.token !== '');
  const activityData = await Promise.all(
    rawData.map(async nft => {
      const isBuyer = nft.buyer === address;
      const nftWithData = await getNftData(nft, collections);
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

  console.log({activityData});

  return activityData;
}

async function getOwnedNfts(address, identity, collections) {
  const allUserNfts = await Promise.all(
    (await Promise.all([loadAllUserTokens(address, identity.getPrincipal().toText())]))
      .flat()
      .map(async (nft, index) => {
        const nftWithData = await getNftData(nft, collections);
        // throttle requests a bit so we don't overload the browser
        await wait(index);
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
  const offersMadeNftIds = await extjs
    .connect('https://boundary.ic0.app/', identity)
    .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
    .offered();
  const offersMadeNfts = await Promise.all(
    offersMadeNftIds.map(async nftId => {
      const nft = nftIdToNft(address, nftId);
      const nftWithData = await getNftData(nft, collections);
      return {
        ...nftWithData,
        statuses: new Set([nftStatusesByTab[ProfileTabs.Watching].OffersMade]),
      };
    }),
  );
  console.log('offers made here');
  return offersMadeNfts;
}

async function getFavoritesNfts(address, identity, collections) {
  const favoriteNftIds = await extjs
    .connect('https://boundary.ic0.app/', identity)
    .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
    .liked();
  const favoriteNfts = await Promise.all(
    favoriteNftIds.map(async nftId => {
      const nft = nftIdToNft(address, nftId);
      const nftWithData = await getNftData(nft, collections);
      return {
        ...nftWithData,
        statuses: new Set([nftStatusesByTab[ProfileTabs.Watching].Favorites]),
      };
    }),
  );
  return favoriteNfts;
}

async function getNftData(rawNft, collections) {
  const {index} = extjs.decodeTokenId(rawNft.token);

  const tokenMetadata = await api.token(rawNft.token).getMetadata();
  const mintNumber = EntrepotNFTMintNumber(rawNft.canister, index);
  const offers = await api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').offers(getEXTID(rawNft.token));
  const rawListing = await (
    await fetch('https://us-central1-entrepot-api.cloudfunctions.net/api/token/' + rawNft.token)
  ).json();

  const listing = rawListing?.price
    ? {
        price: BigInt(rawListing.price),
        locked: rawListing.time > 0 ? [BigInt(rawListing.time)] : [],
      }
    : undefined;
  const nri = getNri(rawNft.canister, index);
  const collection = collections.find(collection => collection.canister === rawNft.canister);

  const userNft = {
    ...rawNft,
    index,
    rawListing,
    image: EntrepotNFTImage(getEXTCanister(rawNft.canister), index, rawNft.token, false, 0),
    tokenMetadata,
    mintNumber,
    collection,
    offers,
    listing,
    nri,
    traits: undefined,
  };

  return userNft;
}
