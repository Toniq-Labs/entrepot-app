import {NftCard} from '../../shared/NftCard';
import React from 'react';
import {WithFilterPanel} from '../../shared/WithFilterPanel';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  ArrowsSort24Icon,
} from '@toniq-labs/design-system';
import {ToniqDropdown} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from '../../components/PriceICP';
import {ProfileFilters} from './ProfileFilters';
import {AllFilter, ProfileViewType, ProfileTabs, nftStatusesByTab} from './ProfileTabs';
import {useNavigate, useSearchParams, createSearchParams} from 'react-router-dom';
import {nftCardContents, ListRow} from './ProfileNftCard';
import {spreadableSearchParams} from '../../utilities/search-params';

function createFilterCallback(currentFilters, query) {
  return nft => {
    const price = Number(icpToString(nft.price, true, false));

    const queryMatch = query
      ? nft.collection.name.toLowerCase().includes(query.toLowerCase())
      : true;

    const isWithinPrice =
      currentFilters.price == undefined
        ? true
        : price >= currentFilters.price.min && price <= currentFilters.price.max;

    const isWithinMintNumber =
      currentFilters.mintNumber == undefined
        ? true
        : nft.mintNumber >= currentFilters.mintNumber.min &&
          nft.mintNumber <= currentFilters.mintNumber.max;

    const isWithinCollection = currentFilters.allCollections
      ? true
      : currentFilters.collections.includes(nft.collection.name);

    const matchesStatus =
      currentFilters.status === AllFilter ? true : nft.statuses.has(currentFilters.status);

    const areAnyTraitsSelected = Object.values(currentFilters.traits ?? []).some(collectionTraits =>
      Object.values(collectionTraits ?? []).some(traits =>
        (Object.values(traits) ?? []).some(value => !!value),
      ),
    );

    const matchesRarity =
      currentFilters.rarity == undefined
        ? true
        : nft.nri && nft.nri <= currentFilters.rarity.max && nft.nri >= currentFilters.rarity.min;

    const matchesTraits = areAnyTraitsSelected
      ? currentFilters.traits.hasOwnProperty(nft.collection.id) &&
        Object.keys(currentFilters.traits[nft.collection.id]).some(traitKey => {
          const traitValues = Object.keys(
            currentFilters.traits[nft.collection.id][traitKey],
          ).filter(key => {
            return !!currentFilters.traits[nft.collection.id][traitKey][key];
          });

          return traitValues.some(
            traitValue =>
              nft.traits?.[traitKey]?.includes(Number(traitValue)) ||
              nft.traits?.[traitKey]?.includes(String(traitValue)),
          );
        })
      : true;

    const checks = [
      isWithinPrice,
      isWithinMintNumber,
      isWithinCollection,
      matchesStatus,
      matchesTraits,
      queryMatch,
      matchesRarity,
    ];

    return checks.every(check => check);
  };
}

function createSortCallback(currentSort) {
  return (a, b) => {
    switch (currentSort.value) {
      case 'minting_number_asc':
        return a.mintNumber - b.mintNumber;
      case 'minting_number_desc':
        return b.mintNumber - a.mintNumber;
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rarity_asc':
        return (a.nri || 0) - (b.nri || 0);
      case 'rarity_desc':
        return (b.nri || 0) - (a.nri || 0);
      case 'date_asc':
        return a.time - b.time;
      case 'date_desc':
        return b.time - a.time;
    }
  };
}

const finalListRowTitles = {
  [ProfileTabs.MyNfts]: 'ACTIONS',
  [ProfileTabs.Watching]: 'OFFERS',
  [ProfileTabs.Activity]: 'TIME',
};

const defaultSortOption = {
  value: 'price_desc',
  label: 'Price: High to Low',
};
const sortOptions = [
  {
    value: 'minting_number_asc',
    label: 'Minting #: Low to High',
  },
  {
    value: 'minting_number_desc',
    label: 'Minting #: High to Low',
  },
  defaultSortOption,
  {
    value: 'price_asc',
    label: 'Price: Low to High',
  },
  {
    value: 'rarity_asc',
    label: 'NFT Rarity: Low to High',
  },
  {
    value: 'rarity_desc',
    label: 'NFT Rarity: High to Low',
  },
];

const initFilters = {
  status: AllFilter,
  price: undefined,
  rarity: undefined,
  mintNumber: undefined,
  allTraits: true,
  traits: {},
  allCollections: true,
  collections: [],
};

export function ProfileBody(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentFilters, setCurrentFilters] = React.useState(initFilters);
  const [sort, setSort] = React.useState(defaultSortOption);

  const navigate = useNavigate();

  const statusParam = searchParams.get('status');

  if (statusParam) {
    if (!Object.values(nftStatusesByTab[props.currentTab]).includes(statusParam)) {
      setSearchParams({
        ...spreadableSearchParams(searchParams),
        status: AllFilter,
      });
    } else if (Object.values(nftStatusesByTab[props.currentTab]).includes(statusParam)) {
      if (currentFilters.status !== statusParam) {
        if (!showFilters && statusParam !== AllFilter) {
          setShowFilters(true);
        }
        setCurrentFilters({
          ...currentFilters,
          status: statusParam,
        });
      }
      if (statusParam === AllFilter) {
        const params = spreadableSearchParams(searchParams);
        delete params.status;
        setSearchParams(params);
      }
    }
  } else if (currentFilters.status !== AllFilter) {
    setCurrentFilters({
      ...currentFilters,
      status: AllFilter,
    });
  }

  if (sort.value.startsWith('date') && props.currentTab !== ProfileTabs.Activity) {
    setSort(defaultSortOption);
  }

  const filteredNfts = props.userNfts
    .filter(createFilterCallback(currentFilters, props.query))
    .sort(createSortCallback(sort));

  const isListView = props.viewType === ProfileViewType.List;

  return (
    <WithFilterPanel
      style={props.style}
      showFilters={showFilters}
      onShowFiltersChange={showFilters => {
        setShowFilters(showFilters);
      }}
      filterControlChildren={
        <ProfileFilters
          currentTab={props.currentTab}
          userCollections={props.userCollections}
          userNfts={props.userNfts}
          nftFilterStats={props.nftFilterStats}
          updateFilters={newFilters => {
            setCurrentFilters(newFilters);
            if (newFilters.status && newFilters.status !== currentFilters.status) {
              setSearchParams(createSearchParams({status: newFilters.status}));
            }
          }}
          filters={currentFilters}
        />
      }
      otherControlsChildren={
        <>
          <span
            style={{
              ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
              color: toniqColors.pageSecondary.foregroundColor,
            }}
          >
            {filteredNfts.length} NFTs
          </span>
          <ToniqDropdown
            style={{
              '--toniq-accent-secondary-background-color': 'transparent',
              width: '360px',
            }}
            icon={ArrowsSort24Icon}
            selectedLabelPrefix="Sort By:"
            selected={sort}
            onSelectChange={event => {
              console.log(event.detail);
              setSort(event.detail);
            }}
            options={sortOptions.concat(
              props.currentTab === ProfileTabs.Activity
                ? [
                    {
                      value: 'date_asc',
                      label: 'Date: Oldest to Newest',
                    },
                    {
                      value: 'date_desc',
                      label: 'Date: Newest to Lowest',
                    },
                  ]
                : [],
            )}
          />
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isListView ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: isListView ? '16px' : '32px',
          justifyContent: 'center',
          maxWidth: '100%',
          backgroundColor: 'white',
          paddingBottom: '32px',
        }}
      >
        {isListView ? (
          <div
            style={{
              display: 'flex',
              backgroundColor: String(toniqColors.accentSecondary.backgroundColor),
              borderRadius: '8px',
              padding: '0 16px',
            }}
          >
            <ListRow
              items={[true, 'MINT #', 'NRI', 'PRICE', finalListRowTitles[props.currentTab]]}
              style={{
                ...cssToReactStyleObject(toniqFontStyles.labelFont),
                maxHeight: '32px',
              }}
            />
          </div>
        ) : (
          ''
        )}
        {filteredNfts.map(userNft => {
          return (
            <NftCard
              listStyle={isListView}
              onClick={() => {
                navigate(`/marketplace/asset/${userNft.token}`);
              }}
              imageUrl={userNft.image}
              key={userNft.token}
            >
              {nftCardContents(userNft, props)}
            </NftCard>
          );
        })}
      </div>
    </WithFilterPanel>
  );
}
