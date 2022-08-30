import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
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
  Filter24Icon,
  ArrowsSort24Icon,
} from '@toniq-labs/design-system';
import {
  ToniqIcon,
  ToniqInput,
  ToniqDropdown,
  ToniqToggleButton,
  ToniqSlider,
  ToniqCheckbox,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { useSearchParams } from "react-router-dom";
import getNri from "../ic/nftv.js";
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

const defaultSortOption = {
  value: 'floor_asc',
  label: 'Floor Price: Low to High',
};

const sortOptions = [
  defaultSortOption,
  {
    value: 'floor_desc',
    label: 'Floor Price: High to Low',
  },
  {
    value: 'minting_number',
    label: 'Minting #',
  },
  {
    value: 'nft_rarity_index',
    label: 'NFT Rarity Index',
  },
];

const filterTypes = {
  status: {
    forSale: "forSale",
    entireCollection: "entireCollection",
  },
  price: {
    floor: 'floor',
    averageSale: 'averageSale',
  },
  rarity: 'rarity',
  mintNumber: 'mintNumber',
};

function doesCollectionPassFilters(listingStats, currentFilters) {
  if (!listingStats) {
    return false;
  }
  if (currentFilters.price[currentFilters.price.type].range) {
    if (
      Number(listingStats.price) / 100000000 > currentFilters.price[currentFilters.price.type].range.max ||
      Number(listingStats.price) / 100000000 < currentFilters.price[currentFilters.price.type].range.min
    ) {
      return false;
    }
  }

  if (currentFilters.rarity.range) {
    if (
      Number(listingStats.rarity) > currentFilters.rarity.range.max ||
      Number(listingStats.rarity) < currentFilters.rarity.range.min
    ) {
      return false;
    }
  }

  if (currentFilters.mintNumber.range) {
    if (
      Number(listingStats.mintNumber) > currentFilters.mintNumber.range.max ||
      Number(listingStats.mintNumber) < currentFilters.mintNumber.range.min
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
  const [filterData, setFilterData] = useState(false);
  const [collection, setCollection] = useState(getCollectionFromRoute(params?.route));
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [sort, setSort] = useState(defaultSortOption);
  const [currentFilters, setCurrentFilters] = useState({
    status: {
      range: undefined,
      type: 'forSale',
    },
    price: {
      [filterTypes.price.floor]: {
        range: undefined,
      },
      [filterTypes.price.averageSale]: {
        range: undefined,
      },
      type: 'floor'
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

  const loadFilterData = async () => {
    if (collection?.filter){
      try{
        var fd = await fetch('/filter/'+collection?.canister+'.json')
        .then((response) => response.json());
        return fd;
      } catch(error){
        console.error(error);
      }
    }
    return false;
  };
  
  const _updates = async (s, c) => {
    c = c ?? collection?.canister;

    EntrepotUpdateStats().then(() => {
      setStats(EntrepotCollectionStats(c))
    });

    try{
      var listings = await api.token(c).listings();
      setListings(listings);
    } catch(e) {};
  };

  const statusListings = listings
    .filter(listing => (listing[1] === false || listing[1].price >= 1000000n))
    .filter(listing => {
      return currentFilters.status.type === filterTypes.status.forSale ? listing[1] : true;
    });
  
  const lowestPrice = statusListings.reduce((lowest, listing) => {
    const currentValue = Number(listing[1].price) / 100000000;
    if (currentValue < lowest) {
      return currentValue;
    } else {
      return lowest;
    }
  }, Infinity);

  const highestPrice = statusListings.reduce((highest, listing) => {
    const currentValue = Number(listing[1].price) / 100000000;
    if (currentValue > highest) {
      return currentValue;
    } else {
      return highest;
    }
  }, -Infinity);

  const lowestMint = statusListings.reduce((lowest, listing) => {
    const tokenid = extjs.encodeTokenId(collection?.canister, listing[0]);
    const { index, canister} = extjs.decodeTokenId(tokenid);
    const currentValue = EntrepotNFTMintNumber(canister, index);
    if (currentValue < lowest) {
      return currentValue;
    } else {
      return lowest;
    }
  }, Infinity);

  const highestMint = statusListings.reduce((highest, listing) => {
    const tokenid = extjs.encodeTokenId(collection?.canister, listing[0]);
    const { index, canister} = extjs.decodeTokenId(tokenid);
    const currentValue = EntrepotNFTMintNumber(canister, index);
    if (currentValue > highest) {
      return currentValue;
    } else {
      return highest;
    }
  }, -Infinity);

  const priceRanges = {
    [filterTypes.price.floor]: {
      min: lowestPrice,
      max: highestPrice,
    },
    [filterTypes.price.averageSale]: {
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
  
  const filteredAndSortedListings = statusListings
    .filter(listing => {
      const tokenid = extjs.encodeTokenId(collection?.canister, listing[0]);
      const { index, canister} = extjs.decodeTokenId(tokenid);
      const rarity = (getNri(canister, index) * 100).toFixed(1);
      const mintNumber = EntrepotNFTMintNumber(canister, index);

      const listingStats = {
        price: listing[1].price,
        rarity,
        mintNumber,
      }

      const passFilter = showFilters
        ? doesCollectionPassFilters(listingStats, currentFilters)
        : true;
      return passFilter;
    })

  useInterval(_updates, 10 * 1000);

  useEffect(() => {
    if (EntrepotAllStats().length) setStats(EntrepotCollectionStats(collection.canister));
    loadFilterData().then(r => {
      if (r) {        
        setFilterData(r);
      } else {
        _updates();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidMountEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)"}}>
      <div style={{maxWidth:1320, margin:"0 auto 0"}}>
        <CollectionDetails classes={classes} stats={stats} collection={collection} />
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
            width: '1000px',
            maxWidth: '100%',
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
          showFilterPanel={showFilters}
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
                <ToniqToggleButton
                  text="Floor"
                  active={currentFilters.price.type === filterTypes.price.floor}
                  onClick={() => {
                    setCurrentFilters({
                      ...currentFilters,
                      price: {
                        ...currentFilters.price,
                        type: filterTypes.price.floor,
                      },
                    });
                  }}
                />
                <ToniqToggleButton
                  text="Average Sale"
                  active={currentFilters.price.type === filterTypes.price.averageSale}
                  onClick={() => {
                    setCurrentFilters({
                      ...currentFilters,
                      price: {
                        ...currentFilters.price,
                        type: filterTypes.price.averageSale,
                      },
                    });
                  }}
                />
                <ToniqSlider
                  logScale={true}
                  min={priceRanges[currentFilters.price.type].min}
                  max={priceRanges[currentFilters.price.type].max}
                  suffix="ICP"
                  double={true}
                  value={currentFilters.price[currentFilters.price.type].range || priceRanges[currentFilters.price.type]}
                  onValueChange={event => {
                    const values = event.detail;
                    setCurrentFilters({
                      ...currentFilters,
                      price: {
                        ...currentFilters.price,
                        [currentFilters.price.type]: {
                          range: values,
                        },
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
                <div className="title">Traits</div>
              </div>
              <div>
                <ToniqCheckbox text="Current Listings" />
                <ToniqCheckbox text="Sold Listings" />
              </div>
            </>
          }
        >
          <div className={classes.marketplaceControls}>
            <div className={classes.filterSortRow}>
              <div className={classes.filtersTrigger}>
                <div
                  className={classes.filterAndIcon}
                  style={{
                    display: showFilters ? 'none' : 'flex',
                  }}
                  onClick={() => {
                    setShowFilters(true);
                  }}
                >
                  <ToniqIcon icon={Filter24Icon} />
                  <span>Filters</span>
                </div>
                <span
                  className={classes.filtersDotThing}
                  style={{
                    display: showFilters ? 'none' : 'flex',
                  }}
                >
                  •
                </span>
              </div>
              <div className={classes.collectionsAndSort}>
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
              </div>
            </div>
          </div>
          {/* NFT Here */}
        </WithFilterPanel>
      </div>
    </div>
  );
}
const filterOnTopBreakPoint = '@media (max-width: 800px)';
const useStyles = makeStyles((theme) => ({
  filterSortRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
    [filterOnTopBreakPoint]: {
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  filtersTrigger: {
    display: 'flex',
    gap: '16px',
  },
  filtersDotThing: {
    [filterOnTopBreakPoint]: {
      opacity: 0,
    },
  },
  collectionsAndSort: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    [filterOnTopBreakPoint]: {
      marginLeft: '16px',
    },
  },
  marketplaceControls: {
    margin: '4px 0 32px',
  },
  filterAndIcon: {
    cursor: 'pointer',
    marginLeft: '16px',
    gap: '8px',
    flexShrink: 0,
  },
}));
