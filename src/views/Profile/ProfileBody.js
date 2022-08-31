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
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import PriceICP from '../../components/PriceICP';

function createFilterCallback(currentFilters, collections) {
  return nft => {
    return true;
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

export function ProfileBody(props) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentFilters, setCurrentFilters] = React.useState({});
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
          <div>
            <div className="title">stuff</div>
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
