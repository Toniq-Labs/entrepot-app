export const ProfileTabs = {
    MyNfts: 'my-nfts',
    Watching: 'watching',
    Activity: 'activity',
};

export const TabTitles = {
    [ProfileTabs.MyNfts]: 'My NFTs',
    [ProfileTabs.Watching]: 'Watching',
    [ProfileTabs.Activity]: 'Activity',
};

export const AllFilter = 'all';

export const nftStatusesByTab = {
    [ProfileTabs.MyNfts]: {
        All: AllFilter,
        Unlisted: 'unlisted',
        ForSale: 'for-sale',
        OffersReceived: 'offers-received',
    },
    [ProfileTabs.Watching]: {
        All: AllFilter,
        OffersMade: 'offers-made',
        Favorites: 'favorites',
    },
    [ProfileTabs.Activity]: {
        All: AllFilter,
        Bought: 'bought',
        Sold: 'sold',
    },
};

export const NftStatusTitles = {
    [AllFilter]: 'All',
    [nftStatusesByTab[ProfileTabs.MyNfts].Unlisted]: 'Unlisted',
    [nftStatusesByTab[ProfileTabs.MyNfts].ForSale]: 'For Sale',
    [nftStatusesByTab[ProfileTabs.MyNfts].OffersReceived]: 'Offers Received',
    [nftStatusesByTab[ProfileTabs.Watching].OffersMade]: 'Offers Made',
    [nftStatusesByTab[ProfileTabs.Watching].Favorites]: 'Favorites',
    [nftStatusesByTab[ProfileTabs.Activity].Bought]: 'Bought',
    [nftStatusesByTab[ProfileTabs.Activity].Sold]: 'Sold',
};

export const ProfileViewType = {
    List: 'list',
    Grid: 'grid',
};
