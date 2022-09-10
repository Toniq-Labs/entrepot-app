/* global BigInt */
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister, getEXTID, nftIdToNft} from '../../utilities/load-tokens';
import {EntrepotNFTImage, EntrepotNFTMintNumber} from '../../utils';
import getNri from '../../ic/nftv.js';
import {createNftFilterStats, blankNftFilterStats} from './ProfileNftStats';
import {ProfileTabs} from './ProfileTabs';

const api = extjs.connect('https://boundary.ic0.app/');

export const emptyAllUserNfts = {
  [ProfileTabs.MyNfts]: {
    nfts: [],
    collections: [],
    stats: blankNftFilterStats,
  },
  [ProfileTabs.Watching]: {
    nfts: [],
    collections: [],
    stats: blankNftFilterStats,
  },
};

async function includeCollections(nftsObject, allCollections) {
  const allowedCollections = allCollections.filter(collection => {
    const isAllowedToView = !collection.dev;
    return isAllowedToView;
  });
  const allowedCanistersSet = new Set(allowedCollections.map(collection => collection.canister));

  return await Object.keys(nftsObject).reduce(async (accumPromise, type) => {
    const accum = await accumPromise;
    const nfts = nftsObject[type];

    const allNftCanisters = new Set(nfts.map(nft => nft.canister));

    const collections = allowedCollections.filter(collection => {
      return allNftCanisters.has(collection.canister);
    });

    const allowedNfts = nfts.filter(nft => allowedCanistersSet.has(nft.canister));

    const finalUserNfts = await Promise.all(allowedNfts.map(nft => getNftData(nft, collections)));

    accum[type] = {
      nfts: finalUserNfts,
      collections,
      stats: createNftFilterStats(finalUserNfts),
    };

    return accum;
  }, Promise.resolve({}));
}

export async function loadProfileNftsAndCollections(address, identity, allCollections) {
  const allNftsSets = await includeCollections(
    {
      [ProfileTabs.MyNfts]: await getOwnedNfts(address, identity),
      [ProfileTabs.Watching]: [
        ...(await getFavoritesNfts(address, identity)),
        ...(await getOffersMadeNfts(address, identity)),
      ],
    },
    allCollections,
  );

  return allNftsSets;
}

async function getOwnedNfts(address, identity) {
  const allUserNfts = (
    await Promise.all([loadAllUserTokens(address, identity.getPrincipal().toText())])
  ).flat();

  return allUserNfts;
}

async function getOffersMadeNfts(address, identity) {
  const offersMadeNftIds = await extjs
    .connect('https://boundary.ic0.app/', identity)
    .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
    .offered();
  const offersMadeNfts = offersMadeNftIds.map(nftId => nftIdToNft(address, nftId));
  console.log('offers made here');
  return offersMadeNfts;
}

async function getFavoritesNfts(address, identity) {
  const favoriteNftIds = await extjs
    .connect('https://boundary.ic0.app/', identity)
    .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
    .liked();
  const favoriteNfts = favoriteNftIds.map(nftId => nftIdToNft(address, nftId));
  console.log('favorites here');
  return favoriteNfts;
}

async function getNftData(rawNft, collections) {
  const {index} = extjs.decodeTokenId(rawNft.token);

  const tokenMetadata = await api.token(rawNft.token).getMetadata();
  const mintNumber = EntrepotNFTMintNumber(rawNft.canister, index);
  const offers = await api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').offers(getEXTID(rawNft.token));
  const listing = rawNft.price
    ? {
        price: BigInt(rawNft.price),
        locked: rawNft.time > 0 ? [BigInt(rawNft.time)] : [],
      }
    : undefined;
  const nri = getNri(rawNft.canister, index);
  // figure out how to retrieve traits
  const traits = [];
  const collection = collections.find(collection => collection.canister === rawNft.canister);

  const userNft = {
    ...rawNft,
    image: EntrepotNFTImage(getEXTCanister(rawNft.canister), index, rawNft.token, false, 0),
    tokenMetadata,
    mintNumber,
    collection,
    offers,
    listing,
    nri,
    traits,
  };

  return userNft;
}
