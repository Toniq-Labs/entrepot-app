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
import {ProfileFilters} from './ProfileFilters';
import {AllFilter, ProfileTabs} from './ProfileTabs';
import {getRelativeDate} from '../../utilities/relative-date';
import {useNavigate} from 'react-router-dom';

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
      currentFilters.status === AllFilter ? true : nft.statuses.has(currentFilters.status);

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
  status: AllFilter,
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

  const navigate = useNavigate();

  console.log({bodyProps: props});

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
          currentTab={props.currentTab}
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

          const formattedDateString = userNft.date
            ? userNft.date.toISOString().replace('T', ' ').replace(/\.\d+/, '')
            : '';
          const relativeDate = userNft.date ? getRelativeDate(userNft.date) : '';
          const isOnlyOfferYours =
            userNft.offers.length === 1 && userNft.offers[0][3] === props.address;

          return (
            <NftCard
              onClick={() => {
                console.log('derp');
                navigate(`/marketplace/asset/${userNft.token}`);
              }}
              imageUrl={userNft.image}
              key={userNft.token}
            >
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
                  <div
                    style={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>
                      {listing}
                    </span>
                    <span style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                      {userNft.nri ? `NRI: ${userNft.nri * 100}%` : ''}
                    </span>
                  </div>
                  {props.currentTab === ProfileTabs.MyNfts ? (
                    <>
                      <ToniqButton
                        style={{marginRight: '16px'}}
                        className="toniq-button-secondary"
                        text="Sell"
                        onClick={event => {
                          props.onSellClick({
                            id: userNft.token,
                            listing: userNft.listing,
                          });
                          event.stopPropagation();
                        }}
                      />
                      <ToniqButton
                        text="Transfer"
                        onClick={event => {
                          props.onTransferClick({
                            id: userNft.token,
                            listing: userNft.listing,
                          });
                          event.stopPropagation();
                        }}
                      />
                    </>
                  ) : props.currentTab === ProfileTabs.Activity ? (
                    <>
                      <span
                        style={{
                          ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                        }}
                        title={formattedDateString}
                      >
                        {relativeDate}
                      </span>
                    </>
                  ) : props.currentTab === ProfileTabs.Watching ? (
                    <>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span
                          style={{
                            ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                          }}
                        >{`${userNft.offers.length} Offer${
                          userNft.offers.length > 1 ? 's' : ''
                        }`}</span>
                        <span
                          style={{
                            ...cssToReactStyleObject(toniqFontStyles.labelFont),
                            color: String(toniqColors.pageSecondary.foregroundColor),
                          }}
                        >
                          {isOnlyOfferYours ? '(yours)' : ''}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </NftCard>
          );
        })}
      </div>
    </WithFilterPanel>
  );
}
