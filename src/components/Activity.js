import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import extjs from "../ic/extjs.js";
import getNri from "../ic/nftv.js";
import orderBy from "lodash.orderby";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { icpToString } from './PriceICP';
import CollectionDetails from './CollectionDetails';
import { EntrepotNFTImage, EntrepotNFTMintNumber, EntrepotGetICPUSD } from '../utils';
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';
import { StyledTab, StyledTabs } from "./shared/PageTab.js";
import { WithFilterPanel } from "../shared/WithFilterPanel.js";
import {
  ToniqInput,
  ToniqDropdown,
  ToniqMiddleEllipsis,
  ToniqIcon,
  ToniqPagination
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowsSort24Icon, cssToReactStyleObject, LoaderAnimated24Icon, Search24Icon, toniqColors, toniqFontStyles } from "@toniq-labs/design-system";
import { NftCard } from "../shared/NftCard.js";
import { getEXTCanister } from "../utilities/load-tokens.js";
import PriceUSD from "./PriceUSD.js";
import Timestamp from "react-timestamp";
import chunk from "lodash.chunk";
import { StateContainer } from "./shared/StateContainer.js";

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const _isCanister = c => {
  return c.length === 27 && c.split("-").length === 5;
};

const useStyles = makeStyles(theme => ({
  listRowContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    maxWidth: '100%',
    backgroundColor: 'white',
    paddingBottom: '32px',
    marginTop: '32px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '16px',
      paddingBottom: '16px',
		},
  },
  listRowHeader: {
    display: 'flex',
    backgroundColor: toniqColors.accentSecondary.backgroundColor,
    borderRadius: '8px',
    padding: '0 16px',
    [theme.breakpoints.down("sm")]: {
      display: 'none',
		},
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  activityInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    maxHeight: '64px',
    alignItems: 'center',
    flexGrow: 1,
    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    [theme.breakpoints.down("sm")]: {
      flexDirection: 'column',
      alignItems: 'start',
      ...cssToReactStyleObject(toniqFontStyles.labelFont),
		},
  },
  hideWhenMobile: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
		},
  }
}));

var userPreferences;
var storageKey = 'userPreferences';

const defaultSortOption = {
  value: {
    type: 'price',
    sort: 'asc',
  },
  label: 'Price: Low to High',
};

const sortOptions = [
  {
    value: {
      type: 'mintNumber',
      sort: 'asc',
    },
    label: 'Mint #: Low to High',
  },
  {
    value: {
      type: 'mintNumber',
      sort: 'desc',
    },
    label: 'Mint #: High to Low',
  },
  {
    value: {
      type: 'rarity',
      sort: 'asc',
    },
    label: 'Rarity: Low to High',
  },
  {
    value: {
      type: 'rarity',
      sort: 'desc',
    },
    label: 'Rarity: High to Low',
  },
  defaultSortOption,
  {
    value: {
      type: 'price',
      sort: 'desc',
    },
    label: 'Price: High to Low',
  },
];

export default function Activity(props) {
  const params = useParams();
  const classes = useStyles();
  const location = useLocation();
  
  const getCollectionFromRoute = r => {
    if (_isCanister(r)) {
      return props.collections.find(e => e.canister === r)
    } else {
      return props.collections.find(e => e.route === r)
    };
  };

  const [listings, setListings] = useState(false);
  const [collection] = useState(getCollectionFromRoute(params?.route, props.collections));

  const storeUserPreferences = (preferenceKey, value) => {
    var storage = JSON.stringify({
      ...userPreferences,
      [preferenceKey]: value,
    })
    localStorage.setItem(`${storageKey}${location.pathname}${collection.canister}`, preferenceKey ? storage : JSON.stringify(value));
  }

  const currentCanister = getCollectionFromRoute(params?.route).canister;
  userPreferences = localStorage.getItem(`${storageKey}${location.pathname}${currentCanister}`);
  if (userPreferences) {
    userPreferences = JSON.parse(userPreferences);
  } else {
    userPreferences = {
      sortOption: defaultSortOption,
    };
    storeUserPreferences(false, userPreferences);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [sort, setSort] = useState(userPreferences.sortOption);
  const [activityPage, setActivityPage] = useState(0);
  
  const navigate = useNavigate();
  
  redirectIfBlockedFromEarnFeatures(navigate, collection, props);

  function ListRow({items, style}) {
    return (
      <div
        className="profile-list-view-nft-details-row"
        style={{
          display: 'flex',
          gap: '16px',
          maxHeight: '64px',
          alignItems: 'center',
          flexGrow: 1,
          ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
          ...style,
        }}
      >
        {items[0] ? (
          <div
            style={{
              flexBasis: '48px',
              flexShrink: 0,
            }}
          >
            &nbsp;
          </div>
        ) : (
          ''
        )}
        <div
          className={classes.activityInfoContainer}
          style={{ ...style }}
        >
          <div
            style={{
              flexBasis: 0,
              marginLeft: '32px',
              flexGrow: 1,
              maxWidth: '72px',
            }}
          >
            {items[1]}
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: 0,
              maxWidth: '78px',
              marginLeft: '32px',
            }}
          >
            {items[2]}
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: 0,
              maxWidth: '180px',
            }}
            className={classes.hideWhenMobile}
          >
            {items[3]}
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: 0,
              maxWidth: '185px',
            }}
            className={classes.hideWhenMobile}
          >
            {items[4]}
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: 0,
            }}
            className={classes.hideWhenMobile}
          >
            {items[5]}
          </div>
        </div>
        {items[6]}
      </div>
    );
  }

  const _updates = async () => {
    await refresh();
  };

  const refresh = async (canister) => {
    canister = canister ?? collection?.canister;

    try {
      var result = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/canister/"+ canister +"/transactions").then(r => r.json());
      var listings = result
        .map((e) => {
          const { index, canister} = extjs.decodeTokenId(e.token);
          const rarity = Number((getNri(canister, index) * 100).toFixed(1));
          const mintNumber = EntrepotNFTMintNumber(canister, index);

          return {
            ...e,
            image: EntrepotNFTImage(getEXTCanister(canister), index, e.token, false, 0),
            rarity,
            mintNumber,
          };
        });

      setListings(listings);
    } catch(error) {
      console.error(error);
    };
  };

  const filteredStatusListings = listings ? listings
    .filter((listing, listingIndex) => listings.findIndex(list => list.id === listing.id) === listingIndex)
    .filter(listing => listing.token !== '') : [];

  const filteredAndSortedListings = orderBy(
    filteredStatusListings.filter((listing) => {
      const inQuery =
        [listing.tokenid, listing.mintNumber]
          .join(' ')
          .toLowerCase()
          .indexOf(query.toLowerCase()) >= 0;
      return (query === '' || inQuery);
    }),
    [sort.value.type],
    [sort.value.sort]
  );

  const activity = chunk(filteredAndSortedListings, 9);
  const activityListing = activity[activityPage];

  useInterval(_updates, 60 * 1000);

  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div style={{ minHeight:"calc(100vh - 221px)"}}>
      <div style={{maxWidth:1320, margin:"0 auto 0"}}>
        <CollectionDetails collection={collection} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <StyledTabs
          value={"activity"}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, tab) => {
            if (tab === "nfts") navigate(`/marketplace/${collection?.route}/`)
          }}
        >
          <StyledTab value="nfts" label="NFTs" />
          <StyledTab value="activity" label="Activity" />
        </StyledTabs>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ToniqInput
            value={query}
            style={{
              '--toniq-accent-tertiary-background-color': 'transparent',
              maxWidth: '300px',
              boxSizing: 'border-box',
              flexGrow: '1',
              marginLeft: '-16px',
            }}
            placeholder="Search for mint # or token ID"
            icon={Search24Icon}
            onValueChange={event => {
              const search = event.detail;
              if (search) {
                setSearchParams({search});
              } else {
                setSearchParams({});
              }
            }}
          />
        </div>
        <WithFilterPanel
          noFilters={true}
          otherControlsChildren={
            <>
              <span
                style={{
                  display: 'flex',
                  ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
                  color: toniqColors.pageSecondary.foregroundColor,
                }}
              >
                NFTs&nbsp;{listings ? `(${filteredAndSortedListings.length})` : <ToniqIcon icon={LoaderAnimated24Icon} />}
              </span>
              <ToniqDropdown
                style={{
                  display: 'flex',
                  '--toniq-accent-secondary-background-color': 'transparent',
                  width: '360px',
                }}
                icon={ArrowsSort24Icon}
                selectedLabelPrefix="Sort By:"
                selected={sort}
                onSelectChange={event => {
                  setSort(event.detail);
                  storeUserPreferences('sortOption', event.detail);
                }}
                options={sortOptions}
              />
            </>
          }
        >
          {
            filteredAndSortedListings.length ?
            <div className={classes.listRowContainer}>
              <div className={classes.listRowHeader}>
                <ListRow
                  items={[true, 'MINT #', 'NRI', 'PRICE', 'FROM', 'TO', 'TIME']}
                  style={{
                    ...cssToReactStyleObject(toniqFontStyles.labelFont),
                    maxHeight: '32px',
                  }}
                />
              </div>
              {activityListing.map(listing => {
                return (
                  <NftCard
                    listStyle={true}
                    onClick={() => {
                      navigate(`/marketplace/asset/${listing.token}`);
                    }}
                    imageUrl={listing.image}
                    key={listing.id}
                  >
                    <>
                      <ListRow
                        items={[
                          '',
                          `#${listing.mintNumber}`,
                          `${listing.rarity}%`,
                          <>
                            {icpToString(listing.price, true, true)}&nbsp;ICP&nbsp;(<PriceUSD price={EntrepotGetICPUSD(listing.price)} />)
                          </>,
                          <>
                            <ToniqMiddleEllipsis externalLink={`https://icscan.io/account/${listing.seller}`} letterCount={5} text={listing.seller} />
                          </>,
                          <>
                            <ToniqMiddleEllipsis externalLink={`https://icscan.io/account/${listing.buyer}`} letterCount={5} text={listing.buyer} />
                          </>,
                          <Timestamp
                            relative
                            autoUpdate
                            date={Number(listing.time / 1000000000)}
                            style={{...cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}}
                          />
                        ]}
                      />
                    </>
                  </NftCard>
                );
              })}
            </div> : ''
          }
          <StateContainer show={listings && !filteredAndSortedListings.length}>No Result</StateContainer>
          <StateContainer show={!listings}>
            <ToniqIcon icon={LoaderAnimated24Icon} />&nbsp;Loading...
          </StateContainer>
          <div className={classes.pagination}>
            <ToniqPagination
              currentPage={activityPage + 1}
              pageCount={activity.length}
              pagesShown={6}
              onPageChange={(event) => {
                setActivityPage(event.detail - 1);
              }}
              onNext={(event) => {
                setActivityPage(event.detail - 1);
              }}
              onPrevious={(event) => {
                setActivityPage(event.detail - 1);
              }}
            />
          </div>
        </WithFilterPanel>
      </div>
    </div>
  );
}
