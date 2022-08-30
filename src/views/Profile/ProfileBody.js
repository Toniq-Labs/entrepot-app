import {NftCard} from '../../components/shared/NftCard';
import React from 'react';
import {WithFilterPanel} from '../../components/shared/WithFilterPanel';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  ArrowsSort24Icon,
} from '@toniq-labs/design-system';
import {ToniqDropdown} from '@toniq-labs/design-system/dist/esm/elements/react-components';

function createFilterCallback(currentFilters, collections) {
  return nft => {
    return true;
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
            {props.nftCount} NFTs
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
      <div>
        {props.userNfts
          .filter(createFilterCallback(currentFilters, props.userCollections))
          .map(userNft => (
            <NftCard key={userNft.token}>{userNft.token}</NftCard>
          ))}
      </div>
    </WithFilterPanel>
  );
}
