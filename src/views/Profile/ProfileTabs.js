export const ProfileTabs = {
  MyNfts: 'My NFTs',
  Watching: 'Watching',
  Activity: 'Activity',
};

export const AllFilter = 'All';

export const nftStatusesByTab = {
  [ProfileTabs.MyNfts]: {
    All: AllFilter,
    Unlisted: 'Unlisted',
    ForSale: 'For Sale',
    OffersReceived: 'Offers Received',
  },
  [ProfileTabs.Watching]: {
    All: AllFilter,
    OffersMade: 'Offers Made',
    Favorites: 'Favorites',
  },
};
