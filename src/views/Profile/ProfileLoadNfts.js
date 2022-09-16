/* global BigInt */
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister, getEXTID, nftIdToNft} from '../../utilities/load-tokens';
import {EntrepotNFTImage, EntrepotNFTMintNumber} from '../../utils';
import getNri from '../../ic/nftv.js';
import {createNftFilterStats, blankNftFilterStats} from './ProfileNftStats';
import {ProfileTabs, nftStatusesByTab} from './ProfileTabs';

const api = extjs.connect('https://boundary.ic0.app/');

export const emptyAllUserNfts = {
  [ProfileTabs.MyNfts]: undefined,
  [ProfileTabs.Watching]: undefined,
  [ProfileTabs.Activity]: undefined,
};

function includeCollectionsAndStats(nfts, allCollections) {
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

export function loadProfileNftsAndCollections(address, identity, allCollections) {
  const allNftsSets = {
    [ProfileTabs.MyNfts]: new Promise(async resolve =>
      resolve(
        includeCollectionsAndStats(
          await getOwnedNfts(address, identity, allCollections),
          allCollections,
        ),
      ),
    ),
    [ProfileTabs.Watching]: new Promise(async resolve =>
      resolve(
        includeCollectionsAndStats(
          [
            ...(await getFavoritesNfts(address, identity, allCollections)),
            ...(await getOffersMadeNfts(address, identity, allCollections)),
          ],
          allCollections,
        ),
      ),
    ),
    [ProfileTabs.Activity]: includeCollectionsAndStats([], allCollections),
  };

  return allNftsSets;
}

async function getOwnedNfts(address, identity, collections) {
  const allUserNfts = await Promise.all(
    (await Promise.all([loadAllUserTokens(address, identity.getPrincipal().toText())]))
      .flat()
      .map(async nft => {
        console.log('setting status');
        const nftWithData = await getNftData(nft, collections);
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
