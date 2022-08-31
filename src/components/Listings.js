import React, { useEffect, useState } from "react";
import { Grid, makeStyles} from "@material-ui/core";
import getGenes from "./CronicStats.js";
import extjs from "../ic/extjs.js";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import CollectionDetails from './CollectionDetails';
import { EntrepotUpdateStats, EntrepotAllStats, EntrepotCollectionStats, EntrepotNFTMintNumber } from '../utils';
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';
import { StyledTab, StyledTabs } from "./shared/PageTab.js";
import { WithFilterPanel } from "./shared/WithFilterPanel.js";
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  Search24Icon,
  ArrowsSort24Icon,
  toniqShadows,
} from '@toniq-labs/design-system';
import {
  ToniqInput,
  ToniqDropdown,
  ToniqToggleButton,
  ToniqSlider,
  ToniqCheckbox,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { Link, useSearchParams } from "react-router-dom";
import getNri from "../ic/nftv.js";
import orderBy from "lodash.orderby";
import LazyLoad from 'react-lazyload';
const api = extjs.connect("https://boundary.ic0.app/");

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

const useDidMountEffect = (func, deps) => {
    const didMount = React.useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
};

const useStyles = makeStyles(theme => ({
  traitCategoryWrapper: {
    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
    "& input": {
      display: "none",
      "&:checked + label > span:last-child": {
        backgroundColor: "#00D093",
        color: "#FFFFFF"
      },
    }
  },
  traitCategory: {
    display: "flex",
    justifyContent: "space-between",
    "& span:last-child": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 24,
      height: 24,
      borderRadius: "16px",
      backgroundColor: "#F1F3F6",
      ...cssToReactStyleObject(toniqFontStyles.boldLabelFont),
    }
  },
}));

const defaultSortOption = {
  value: {
    type: 'price',
    sort: 'asc',
  },
  label: 'Price: Low to High',
};

const sortOptions = [
  defaultSortOption,
  {
    value: {
      type: 'price',
      sort: 'desc',
    },
    label: 'Price: High to Low',
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
];

const filterTypes = {
  status: {
    forSale: "forSale",
    entireCollection: "entireCollection",
  },
  price: 'price',
  rarity: 'rarity',
  mintNumber: 'mintNumber',
};

function doesCollectionPassFilters(listing, currentFilters) {
  if (!listing) {
    return false;
  }
  if (currentFilters.price.range) {
    if (
      listing.price > currentFilters.price.range.max ||
      listing.price < currentFilters.price.range.min
    ) {
      return false;
    }
  }

  if (currentFilters.rarity.range) {
    if (
      Number(listing.rarity) > currentFilters.rarity.range.max ||
      Number(listing.rarity) < currentFilters.rarity.range.min
    ) {
      return false;
    }
  }

  if (currentFilters.mintNumber.range) {
    if (
      Number(listing.mintNumber) > currentFilters.mintNumber.range.max ||
      Number(listing.mintNumber) < currentFilters.mintNumber.range.min
    ) {
      return false;
    }
  }
  return true;
}

export default function Listings(props) {
  const params = useParams();
  const classes = useStyles();
  const getCollectionFromRoute = r => {
    if (_isCanister(r)) {
      return props.collections.find(e => e.canister === r)
    } else {
      return props.collections.find(e => e.route === r)
    };
  };
  const [stats, setStats] = useState(false);
  const [listings, setListings] = useState([]);
  const [traitsData, setTraitsData] = useState(false);
  const [traitsCategories, setTraitsCategories] = useState([]);
  const [collection] = useState(getCollectionFromRoute(params?.route));
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [sort, setSort] = useState(defaultSortOption);
  const [page, setPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({
    status: {
      range: undefined,
      type: 'forSale',
    },
    price: {
      range: undefined,
      type: 'price',
    },
    rarity: {
      range: undefined,
      type: 'rarity',
    },
    mintNumber: {
      range: undefined,
      type: 'mintNumber',
    },
  });

  const navigate = useNavigate();
  
  redirectIfBlockedFromEarnFeatures(navigate, collection, props);
  
  const cronicFilterTraits = ["health","base","speed","attack","range","magic","defense","resistance","basic","special"];
  var cftState = {};
  cronicFilterTraits.forEach(a => {
    cftState[a+"Dom"] = [0, 63];
    cftState[a+"Rec"] = [0, 63];
  });
  const [legacyFilterState, setLegacyFilterState] = React.useState(cftState);
  const cronicSetFilterTrait = (name, v) => {
    var t = {...legacyFilterState};
    t[name] = v;
    setLegacyFilterState(t);
  };

  var filterHooks = [];
  if (collection.route == 'cronics'){
    filterHooks.push((results) => {
      return results.filter(result => {
        for(var i = 0; i < cronicFilterTraits.length; i++){        
          if (legacyFilterState[cronicFilterTraits[i]+"Dom"][0] > getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]].dominant) return false;
          if (legacyFilterState[cronicFilterTraits[i]+"Dom"][1] < getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]].dominant) return false;
          if (legacyFilterState[cronicFilterTraits[i]+"Rec"][0] > getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]].recessive) return false;
          if (legacyFilterState[cronicFilterTraits[i]+"Rec"][1] < getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]].recessive) return false;
        };
        return true;
      });
    });
  }

  const loadTraits = async () => {
    if (collection?.filter) {
      try {
        return await fetch("/filter/" + collection?.canister + ".json").then(
          (response) => response.json()
        );
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  };
  
  const _updates = async (s, canister) => {
    canister = canister ?? collection?.canister;

    EntrepotUpdateStats().then(() => {
      setStats(EntrepotCollectionStats(canister))
    });

    try {
      var result = await api.token(canister).listings();

      var traitsCategories = traitsData[0].map((trait) => {
        return {
          category: trait[1],
          values: trait[2].map((trait) => {
            return trait[1];
          }),
          isOpen: false,
        };
      })
      setTraitsCategories(traitsCategories);

      var listings = result
        .map((listing) => {
          const tokenid = extjs.encodeTokenId(collection?.canister, listing[0]);
          const { index, canister} = extjs.decodeTokenId(tokenid);
          const rarity = (getNri(canister, index) * 100).toFixed(1);
          const mintNumber = EntrepotNFTMintNumber(canister, index);
          const traits = traitsData[1][index][1].map((trait) => {
            const traitCategory = trait[0];
            const traitValue = trait[1];
            return {
              category: traitsCategories[traitCategory].category,
              values: traitsCategories[traitCategory].values[traitValue],
            }
          })

          return {
            ...listing,
            price: Number(listing[1].price) / 100000000,
            rarity,
            mintNumber,
            tokenid,
            index,
            canister,
            traits
          }
        })
      setListings(listings);
    } catch(e) {};
  };

  const filteredStatusListings = listings
    .filter(listing => (listing[1] === false || listing.price >= 0.01))
    .filter(listing => {
      return currentFilters.status.type === filterTypes.status.forSale ? listing[1] : true;
    });
  
  const lowestPrice = filteredStatusListings.reduce((lowest, listing) => {
    const currentValue = listing.price;
    if (currentValue < lowest) {
      return currentValue;
    } else {
      return lowest;
    }
  }, Infinity);

  const highestPrice = filteredStatusListings.reduce((highest, listing) => {
    const currentValue = listing.price;
    if (currentValue > highest) {
      return currentValue;
    } else {
      return highest;
    }
  }, -Infinity);

  const lowestMint = filteredStatusListings.reduce((lowest, listing) => {
    const currentValue = EntrepotNFTMintNumber(listing?.canister, listing?.index);
    if (currentValue < lowest) {
      return currentValue;
    } else {
      return lowest;
    }
  }, Infinity);

  const highestMint = filteredStatusListings.reduce((highest, listing) => {
    const currentValue = EntrepotNFTMintNumber(listing?.canister, listing?.index);
    if (currentValue > highest) {
      return currentValue;
    } else {
      return highest;
    }
  }, -Infinity);

  const priceRanges = {
    [filterTypes.price]: {
      min: lowestPrice,
      max: highestPrice,
    },
    [filterTypes.rarity]: {
      min: 0,
      max: 100,
    },
    [filterTypes.mintNumber]: {
      min: lowestMint,
      max: highestMint,
    },
  };

  const filteredAndSortedListings = orderBy(
    filteredStatusListings.filter((listing) => {
      const inQuery =
        [listing.tokenid, listing.mintNumber]
          .join(' ')
          .toLowerCase()
          .indexOf(query.toLowerCase()) >= 0;
      const passFilter = showFilters
        ? doesCollectionPassFilters(listing, currentFilters)
        : true;
      return passFilter && (query === '' || inQuery);
    }),
    [sort.value.type],
    [sort.value.sort]
  );

  var toWrappedMap = {
    "qcg3w-tyaaa-aaaah-qakea-cai" : "bxdf4-baaaa-aaaah-qaruq-cai",
    "4nvhy-3qaaa-aaaah-qcnoq-cai" : "y3b7h-siaaa-aaaah-qcnwa-cai",
    "d3ttm-qaaaa-aaaai-qam4a-cai" : "3db6u-aiaaa-aaaah-qbjbq-cai",
    "xkbqi-2qaaa-aaaah-qbpqq-cai" : "q6hjz-kyaaa-aaaah-qcama-cai",
    "fl5nr-xiaaa-aaaai-qbjmq-cai" : "jeghr-iaaaa-aaaah-qco7q-cai"
  };

  const getEXTCanister = canister => {
    if (toWrappedMap.hasOwnProperty(canister)) return toWrappedMap[canister];
    else return canister;
  };

  const getEXTID = listing => {
    return extjs.encodeTokenId(getEXTCanister(listing.canister), listing.index);
  };

  useInterval(_updates, 10 * 1000);

  useEffect(() => {
    if (EntrepotAllStats().length) setStats(EntrepotCollectionStats(collection.canister));
    loadTraits().then(traits => {
      if (traits) {        
        setTraitsData(traits);
      } else {
        _updates();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidMountEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traitsData]);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)"}}>
      <div style={{maxWidth:1320, margin:"0 auto 0"}}>
        <CollectionDetails stats={stats} collection={collection} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <StyledTabs
          value={"nfts"}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, tab) => {
            if (tab === "activity") navigate(`/marketplace/${collection?.route}/activity`)
          }}
        >
          <StyledTab value="nfts" label="NFTs" />
          <StyledTab value="activity" label="Activity" />
        </StyledTabs>
        <ToniqInput
          value={query}
          style={{
            '--toniq-accent-tertiary-background-color': 'transparent',
            maxWidth: '300px',
            boxSizing: 'border-box',
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
        <WithFilterPanel
          showFilters={showFilters}
          onShowFiltersChange={newShowFilters => {
            setShowFilters(newShowFilters);
          }}
          onFilterClose={() => {
            setShowFilters(false);
          }}
          filterControlChildren={
            <>
              <div>
                <div className="title">Status</div>
                <ToniqToggleButton
                  text="For Sale"
                  active={currentFilters.status.type === filterTypes.status.forSale}
                  onClick={() => {
                    setCurrentFilters({
                      ...currentFilters,
                      status: {
                        ...currentFilters.status,
                        type: filterTypes.status.forSale,
                      },
                    });
                  }}
                />
                <ToniqToggleButton
                  text="Entire Collection"
                  active={currentFilters.status.type === filterTypes.status.entireCollection}
                  onClick={() => {
                    setCurrentFilters({
                      ...currentFilters,
                      status: {
                        ...currentFilters.status,
                        type: filterTypes.status.entireCollection,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <div className="title">Price</div>
                <ToniqSlider
                  logScale={true}
                  min={priceRanges[currentFilters.price.type].min}
                  max={priceRanges[currentFilters.price.type].max}
                  suffix="ICP"
                  double={true}
                  value={currentFilters.price.range || priceRanges[currentFilters.price]}
                  onValueChange={event => {
                    const values = event.detail;
                    setCurrentFilters({
                      ...currentFilters,
                      price: {
                        ...currentFilters.price,
                        range: values,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <div className="title">Rarity</div>
                <ToniqSlider
                  logScale={true}
                  min={priceRanges[currentFilters.rarity.type].min}
                  max={priceRanges[currentFilters.rarity.type].max}
                  suffix="%"
                  double={true}
                  value={currentFilters.rarity.range || priceRanges[currentFilters.rarity.type]}
                  onValueChange={event => {
                    const values = event.detail;
                    setCurrentFilters({
                      ...currentFilters,
                      rarity: {
                        ...currentFilters.rarity,
                        range: values,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <div className="title">Mint #</div>
                <ToniqSlider
                  logScale={true}
                  min={priceRanges[currentFilters.mintNumber.type].min}
                  max={priceRanges[currentFilters.mintNumber.type].max}
                  double={true}
                  value={currentFilters.mintNumber.range || priceRanges[currentFilters.mintNumber.type]}
                  onValueChange={event => {
                    const values = event.detail;
                    setCurrentFilters({
                      ...currentFilters,
                      mintNumber: {
                        ...currentFilters.mintNumber,
                        range: values,
                      },
                    });
                  }}
                />
              </div>
              <div>
                <div className="title">Traits ({traitsCategories.length})</div>
                <Grid container spacing={2}>
                  {traitsCategories.map((traitsCategory, index) => {
                    return (
                      <Grid key={index} item xs={12} className={classes.traitCategoryWrapper}>
                        <input
                          id={traitsCategory.category}
                          type="checkbox"
                          onChange={() => {
                            var currentCategory = traitsCategories;
                            currentCategory[index] = {
                              ...currentCategory[index],
                              isOpen: !currentCategory[index].isOpen,
                            }
                            setTraitsCategories(currentCategory);
                          }}
                        />
                        <label htmlFor={traitsCategory.category} className={classes.traitCategory}>
                          <span>{traitsCategory.category}</span>
                          <span className={classes.traitCategoryCounter}>{traitsCategory.values.length}</span>
                        </label>
                      </Grid>
                    )
                  })}
                </Grid>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ToniqCheckbox text="Current Listings" />
                </Grid>
                <Grid item xs={12}>
                  <ToniqCheckbox text="Sold Listings" />
                </Grid>
              </Grid>
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
                  NFTs ({filteredAndSortedListings.length})
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
                    setSort(event.detail);
                  }}
                  options={sortOptions}
                />
            </>
          }
        >
          {
            filteredAndSortedListings.length ?
              <Grid container spacing={2}>
                {filteredAndSortedListings.map((listing, index) => {
                  return (
                    <Grid key={index} item style={{ padding: "16px", background: "#FFF", ...cssToReactStyleObject(toniqShadows.popupShadow), }}>
                      <LazyLoad  offset={100}>
                        {/* TODO: Create NFT Individual Card component */}
                        <Link to={`/marketplace/asset/` + getEXTID(listing)}>
                          <span>{listing.mintNumber}</span>
                        </Link>
                        {/* TODO: Create NFT Individual Card component */}
                      </LazyLoad>
                    </Grid>
                  );
                })}
              </Grid> : ""
          }
        </WithFilterPanel>
      </div>
    </div>
  );
}
