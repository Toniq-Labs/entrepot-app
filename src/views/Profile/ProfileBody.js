import {NftCard} from '../../components/shared/NftCard';
import React from 'react';
import {WithFilterPanel} from '../../components/shared/WithFilterPanel';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  ArrowsSort24Icon,
} from '@toniq-labs/design-system';
import {
  ToniqDropdown,
  ToniqButton,
  ToniqSlider,
  ToniqCheckbox,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import PriceICP from '../../components/PriceICP';
import {SelectableNameWithCount} from '../../shared/SelectableNameWithCount';
import {icpToString} from '../../components/PriceICP';

function createFilterCallback(currentFilters, collections) {
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

    const isListingShown = currentFilters.currentListings ? true : !nft.listing;
    return isWithinPrice && isWithinMintNumber && isWithinCollection && isListingShown;
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
  status: [],
  price: undefined,
  rarity: undefined,
  mintNumber: undefined,
  allTraits: true,
  traits: [],
  allCollections: true,
  collections: [],
  currentListings: true,
  soldListings: false,
};

export function ProfileBody(props) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentFilters, setCurrentFilters] = React.useState(initFilters);
  const [sort, setSort] = React.useState(defaultSortOption);

  return (
    <WithFilterPanel
      style={props.style}
      showFilters={showFilters}
      onShowFiltersChange={showFilters => {
        setShowFilters(showFilters);
      }}
      filterControlChildren={
        <>
          {props.nftFilterStats.price.min !== props.nftFilterStats.price.max && (
            <div>
              <div className="title">Listing Price</div>
              <ToniqSlider
                min={props.nftFilterStats.price.min}
                max={props.nftFilterStats.price.max}
                suffix="ICP"
                step="0.01"
                double={true}
                value={currentFilters.price || props.nftFilterStats.price}
                onValueChange={event => {
                  const values = event.detail;
                  setCurrentFilters({
                    ...currentFilters,
                    price: {
                      ...values,
                    },
                  });
                }}
              />
            </div>
          )}
          {props.nftFilterStats.rarity.min !== props.nftFilterStats.rarity.max && (
            <div>
              <div className="title">Rarity</div>
              <ToniqSlider
                min={props.nftFilterStats.rarity.min}
                max={props.nftFilterStats.rarity.max}
                suffix="%"
                double={true}
                value={currentFilters.rarity || props.nftFilterStats.rarity}
                onValueChange={event => {
                  const values = event.detail;
                  setCurrentFilters({
                    ...currentFilters,
                    rarity: {
                      ...values,
                    },
                  });
                }}
              />
            </div>
          )}
          {props.nftFilterStats.mintNumber.min !== props.nftFilterStats.mintNumber.max > 1 && (
            <div>
              <div className="title">Mint #</div>
              <ToniqSlider
                min={props.nftFilterStats.mintNumber.min}
                max={props.nftFilterStats.mintNumber.max}
                double={true}
                value={currentFilters.mintNumber || props.nftFilterStats.mintNumber}
                onValueChange={event => {
                  const values = event.detail;
                  setCurrentFilters({
                    ...currentFilters,
                    mintNumber: {
                      ...values,
                    },
                  });
                }}
              />
            </div>
          )}
          {props.userCollections.length > 1 && (
            <div>
              <div className="title">Collections ({props.userCollections.length})</div>
              <div
                style={{
                  borderBottom: `1px solid ${String(toniqColors.divider.foregroundColor)}`,
                  paddingBottom: '24px',
                }}
              >
                <SelectableNameWithCount
                  title="All Collections"
                  selected={currentFilters.allCollections}
                  count={props.userNfts.length}
                  onClick={() => {
                    setCurrentFilters({
                      ...currentFilters,
                      allCollections: true,
                      collections: [],
                    });
                  }}
                />
              </div>
              <div style={{paddingTop: '32px'}}>
                {props.userCollections
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(collection => {
                    return (
                      <SelectableNameWithCount
                        title={collection.name}
                        imageUrl={collection.avatar}
                        selected={currentFilters.collections.includes(collection.name)}
                        count={props.nftFilterStats.collections[collection.name]}
                        onClick={() => {
                          const isAlreadyIncluded = currentFilters.collections.includes(
                            collection.name,
                          );

                          const newCollections = isAlreadyIncluded
                            ? currentFilters.collections.filter(collectionName => {
                                return collectionName !== collection.name;
                              })
                            : currentFilters.collections.concat(collection.name);

                          setCurrentFilters({
                            ...currentFilters,
                            allCollections: !newCollections.length,
                            collections: newCollections,
                          });
                        }}
                      />
                    );
                  })}
              </div>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <ToniqCheckbox
              checked={currentFilters.currentListings}
              text="Current Listings"
              onCheckedChange={event => {
                const value = event.detail;
                setCurrentFilters({
                  ...currentFilters,
                  currentListings: value,
                });
              }}
            />
            <ToniqCheckbox
              checked={currentFilters.soldListings}
              text="Sold Listings"
              onCheckedChange={event => {
                const value = event.detail;
                setCurrentFilters({
                  ...currentFilters,
                  soldListings: value,
                });
              }}
            />
          </div>
        </>
      }
      otherControlsChildren={
        <>
          <span
            style={{
              ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
              color: toniqColors.pageSecondary.foregroundColor,
            }}
          >
            {props.userNfts.length} NFTs
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
          maxWidth: '100%',
          paddingBottom: '32px',
        }}
      >
        {props.userNfts
          .filter(createFilterCallback(currentFilters, props.userCollections))
          .sort(createSortCallback(sort))
          .map(userNft => {
            const listing = userNft.listing ? (
              <PriceICP price={userNft.listing.price} />
            ) : (
              'Unlisted'
            );

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
                    />
                    <ToniqButton text="Transfer" />
                  </div>
                </div>
              </NftCard>
            );
          })}
      </div>
    </WithFilterPanel>
  );
}
