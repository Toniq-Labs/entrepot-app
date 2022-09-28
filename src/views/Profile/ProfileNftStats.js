/* global BigInt */
import {icpToString} from '../../components/PriceICP';

export const blankNftFilterStats = {
  price: {
    min: 0,
    max: 0,
  },
  rarity: {
    min: 0,
    max: 100,
  },
  mintNumber: {
    min: 0,
    max: 100,
  },
  traits: {},
  collections: {},
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

    if (nft.traits && nft.collection.traits) {
      const collection = nft.collection;
      if (!accum.traits.hasOwnProperty(collection.id)) {
        accum.traits[collection.id] = {
          collection,
          traitsInUse: {},
        };
      }
      Object.keys(nft.traits).forEach(traitId => {
        const traitValues = nft.traits[traitId];
        if (!accum.traits[collection.id].traitsInUse[traitId]) {
          accum.traits[collection.id].traitsInUse[traitId] = {};
        }
        traitValues.forEach(traitValue => {
          if (!accum.traits[collection.id].traitsInUse[traitId][traitValue]) {
            accum.traits[collection.id].traitsInUse[traitId][traitValue] = 0;
          }
          accum.traits[collection.id].traitsInUse[traitId][traitValue]++;
        });
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
