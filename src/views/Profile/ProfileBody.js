import {NftCard} from '../../shared/NftCard';
import React from 'react';
import {WithFilterPanel} from '../../shared/WithFilterPanel';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  ArrowsSort24Icon,
} from '@toniq-labs/design-system';
import {
  ToniqDropdown,
  ToniqButton,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import PriceICP from '../../components/PriceICP';
import {icpToString} from '../../components/PriceICP';
import {ProfileFilters, nftFilterStatus} from './ProfileFilters';

function createFilterCallback(currentFilters) {
  return nft => {
    const price = Number(icpToString(nft.price, true, false));

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
      currentFilters.status === nftFilterStatus.Unlisted
        ? !nft.listing
        : currentFilters.status === nftFilterStatus.ForSale
        ? !!nft.listing
        : currentFilters.status === nftFilterStatus.OffersReceived
        ? !!nft.offers?.length
        : true;

    const checks = [isWithinPrice, isWithinMintNumber, isWithinCollection, matchesStatus];

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
    }
  };
}

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
  status: nftFilterStatus.All,
  price: undefined,
  rarity: undefined,
  mintNumber: undefined,
  allTraits: true,
  traits: [],
  allCollections: true,
  collections: [],
};

export function ProfileBody(props) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentFilters, setCurrentFilters] = React.useState(initFilters);
  const [sort, setSort] = React.useState(defaultSortOption);

  const filteredNfts = props.userNfts
    .filter(createFilterCallback(currentFilters))
    .sort(createSortCallback(sort));

  return (
    <WithFilterPanel
      style={props.style}
      showFilters={showFilters}
      onShowFiltersChange={showFilters => {
        setShowFilters(showFilters);
      }}
      filterControlChildren={
        <ProfileFilters
          userCollections={props.userCollections}
          userNfts={props.userNfts}
          nftFilterStats={props.nftFilterStats}
          updateFilters={setCurrentFilters}
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
            options={sortOptions}
          />
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          justifyContent: 'center',
          maxWidth: '100%',
          backgroundColor: 'white',
          paddingBottom: '32px',
        }}
      >
        {filteredNfts.map(userNft => {
          const listing = userNft.listing ? <PriceICP price={userNft.listing.price} /> : 'Unlisted';

          return (
            <NftCard imageUrl={userNft.image} key={userNft.token}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    marginBottom: '16px',
                    marginTop: '16px',
                    ...cssToReactStyleObject(toniqFontStyles.h3Font),
                  }}
                >
                  #{userNft.mintNumber}
                </span>
                <div style={{display: 'flex'}}>
                  <div style={{flexGrow: 1}}>
                    <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>
                      {listing}
                    </span>
                    <span style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                      {userNft.nri || ''}
                    </span>
                  </div>
                  <ToniqButton
                    style={{marginRight: '16px'}}
                    className="toniq-button-secondary"
                    text="Sell"
                    onClick={() => {
                      props.onSellClick({
                        id: userNft.token,
                        listing: userNft.listing,
                      });
                    }}
                  />
                  <ToniqButton
                    text="Transfer"
                    onClick={() => {
                      props.onTransferClick({
                        id: userNft.token,
                        listing: userNft.listing,
                      });
                    }}
                  />
                </div>
              </div>
            </NftCard>
          );
        })}
      </div>
    </WithFilterPanel>
  );
}
