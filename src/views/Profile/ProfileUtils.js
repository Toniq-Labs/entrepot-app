/* global BigInt */
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister, getEXTID} from '../../utilities/load-tokens';
import {EntrepotNFTImage, EntrepotNFTMintNumber} from '../../utils';
import getNri from '../../ic/nftv.js';
import {icpToString} from '../../components/PriceICP';

const api = extjs.connect('https://boundary.ic0.app/');

export async function loadProfileNftsAndCollections(address, identity, collections) {
  const allUserNfts = (
    await Promise.all([loadAllUserTokens(address, identity.getPrincipal().toText())])
  ).flat();

  const allUserNftCanisterIds = new Set(allUserNfts.map(userNft => userNft.canister));

  const userCollections = collections.filter(collection => {
    const isAllowedToView = !collection.dev;

    return isAllowedToView && allUserNftCanisterIds.has(collection.canister);
  });

  const userCollectionCanisterIds = new Set(userCollections.map(collection => collection.canister));

  const rawAllowedUserNfts = allUserNfts.filter(nft => {
    return userCollectionCanisterIds.has(nft.canister);
  });

  const finalUserNfts = await Promise.all(
    rawAllowedUserNfts.map(nft => getNftData(nft, userCollections)),
  );

  return {
    userNfts: finalUserNfts,
    userCollections,
  };
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

  console.log({userNft});

  return userNft;
}

export const blankNftFilterStats = {
  price: {
    min: 0,
    max: 0,
  },
  rarity: {
    min: 0,
    max: 100,
  },
  traits: [],
};

export function createNftFilterStats(nfts) {
  if (!nfts.length) {
    return JSON.parse(JSON.stringify(blankNftFilterStats));
  }
  const initStats = {
    price: {
      min: Infinity,
      max: -Infinity,
    },
    rarity: {
      min: Infinity,
      max: -Infinity,
    },
    mintNumber: {
      min: Infinity,
      max: -Infinity,
    },
    traits: {},
    collections: {},
  };
  const filterStats = nfts.reduce((accum, nft) => {
    const price = Number(icpToString(nft.price, true, false));

    if (price < accum.price.min) {
      accum.price.min = price;
    }
    if (price > accum.price.max) {
      accum.price.max = price;
    }
    if (nft.mintNumber < accum.mintNumber.min) {
      accum.mintNumber.min = nft.mintNumber;
    }
    if (nft.mintNumber > accum.mintNumber.max) {
      accum.mintNumber.max = nft.mintNumber;
    }
    if (typeof nft.nri === 'number') {
      if (nft.nri < accum.rarity.min) {
        accum.rarity.min = nft.nri;
      }
      if (nft.nri > accum.rarity.max) {
        accum.rarity.max = nft.nri;
      }
    }
    if (!accum.collections.hasOwnProperty(nft.collection.name)) {
      accum.collections[nft.collection.name] = 0;
    }
    accum.collections[nft.collection.name]++;

    if (nft.traits && nft.traits.length) {
      nft.traits.forEach(trait => {
        if (!accum.traits.hasOwnProperty(trait)) {
          accum.traits[trait] = 0;
        }
        accum.traits[trait]++;
      });
    }

    return accum;
  }, initStats);

  const keysToCheck = ['price', 'rarity', 'mintNumber'];
  keysToCheck.forEach(key => {
    const values = filterStats[key];
    if (Math.abs(values.min) === Infinity) {
      values.min = 0;
    }
    if (Math.abs(values.max) === Infinity) {
      values.max = 0;
    }
  });

  return filterStats;
}
