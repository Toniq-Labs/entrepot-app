export const ProfileTabs = {
    MyNfts: 'my-nfts',
    Favorites: 'favorites',
    Offers: 'offers',
    Activity: 'activity',
};

export const TabTitles = {
    [ProfileTabs.MyNfts]: 'My NFTs',
    [ProfileTabs.Favorites]: 'Favorites',
    [ProfileTabs.Offers]: 'Offers',
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
    [ProfileTabs.Favorites]: {
        All: AllFilter,
        HasOffers: 'has-offers',
    },
    [ProfileTabs.Offers]: {
        All: AllFilter,
        HasOtherOffers: 'has-other-offers',
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
    [nftStatusesByTab[ProfileTabs.Favorites].HasOffers]: 'Has Offers',
    [nftStatusesByTab[ProfileTabs.Offers].HasOtherOffers]: 'Has Other Offers',
    [nftStatusesByTab[ProfileTabs.Activity].Bought]: 'Bought',
    [nftStatusesByTab[ProfileTabs.Activity].Sold]: 'Sold',
};

export const ProfileViewType = {
    List: 'list',
    Grid: 'grid',
};
