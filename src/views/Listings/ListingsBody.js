import React, {useEffect, useState, useRef, createRef, useMemo} from 'react';
import {makeStyles} from '@material-ui/core';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import {WithFilterPanel} from '../../shared/WithFilterPanel.js';
import {useLocation, useSearchParams} from 'react-router-dom';
import getNri from '../../ic/nftv.js';
import orderBy from 'lodash.orderby';
import sortBy from 'lodash.sortby';
import {forceCheck} from 'react-lazyload';
import {cronicFilterTraits} from '../../model/constants.js';
import {ListingsTabs} from './ListingsTabs.js';
import {ListingsFilters} from './ListingsFilters.js';
import {ListingsNftCard} from './ListingsNftCard.js';
import {isInRange} from '../../utilities/number-utils.js';
import getGenes from '../../components/CronicStats.js';
import {ListingsOtherControls} from './ListingsOtherControls';
import {ListingsOtherControlsActivity} from './ListingsOtherControlsActivity';
import ListingsActivity from './ListingsActivity';
import {defaultEntrepotApi} from '../../typescript/api/entrepot-apis/entrepot-data-api';
import {encodeNftId, decodeNftId} from '../../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../../typescript/data/nft/user-nft';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

var userPreferences;
var storageKey = 'userPreferences';

const defaultSortOptionNfts = {
    value: {
        type: 'price',
    },
    label: 'Price',
};

const defaultSortOptionActivity = {
    value: {
        type: 'time',
    },
    label: 'Time',
};

const defaultSortType = 'asc';

const defaultOpenedAccordions = [
    'status',
    'price',
    'rarity',
    'mintNumber',
    'traits',
];

const sortOptionsActivity = [
    defaultSortOptionActivity,
    {
        value: {
            type: 'price',
        },
        label: 'Price',
    },
    {
        value: {
            type: 'rarity',
        },
        label: 'Rarity',
    },
    {
        value: {
            type: 'mintNumber',
        },
        label: 'Mint #',
    },
];

const filterTypes = {
    status: {
        listed: 'listed',
        unlisted: 'unlisted',
        type: 'status',
    },
    price: 'price',
    rarity: 'rarity',
    mintNumber: 'mintNumber',
    traits: 'traits',
};

function doesCollectionPassFilters(listing, currentFilters, traitsData, collection) {
    if (!listing) {
        return false;
    }

    if (currentFilters.price.min || currentFilters.price.max) {
        if (
            !isInRange(
                Number(listing.price) / 100000000,
                currentFilters.price.min,
                currentFilters.price.max,
            )
        ) {
            return false;
        }
    }

    if (currentFilters.rarity.min || currentFilters.rarity.max) {
        if (!isInRange(listing.rarity, currentFilters.rarity.min, currentFilters.rarity.max)) {
            return false;
        }
    }

    if (currentFilters.mintNumber.min || currentFilters.mintNumber.max) {
        if (
            !isInRange(
                Number(listing.mintNumber),
                currentFilters.mintNumber.min,
                currentFilters.mintNumber.max,
            )
        ) {
            return false;
        }
    }

    if (currentFilters.traits.values.length) {
        return currentFilters.traits.values.reduce((currentCategory, category) => {
            const listingCategory = listing.traits.find(listingTrait => {
                return listingTrait.category === category.category;
            });

            const trait = listingCategory
                ? category.values.reduce((currentTrait, trait) => {
                      return currentTrait || String(trait) === String(listingCategory.value);
                  }, false)
                : false;

            return currentCategory && trait;
        }, true);
    }

    if (!traitsData && collection?.route === 'cronics') {
        return cronicFilterTraits.reduce((currentCategory, category) => {
            return (
                currentCategory &&
                isInRange(
                    listing.traits[category].dominant,
                    currentFilters.traits.values[category].dominant.min,
                    currentFilters.traits.values[category].dominant.max,
                ) &&
                isInRange(
                    listing.traits[category].recessive,
                    currentFilters.traits.values[category].recessive.min,
                    currentFilters.traits.values[category].recessive.max,
                )
            );
        }, true);
    }

    return true;
}

function getCronicFilters() {
    var filters = {};
    cronicFilterTraits.forEach(trait => {
        const range = {min: 0, max: 63};
        filters[trait] = {
            dominant: range,
            recessive: range,
        };
    });
    return filters;
}

function useForceUpdate() {
    const [
        ,
        setValue,
    ] = useState(0);
    return () => setValue(value => value + 1);
}

export function ListingsBody(props) {
    const {collection, getCollectionFromRoute, buyNft, faveRefresher, identity, loggedIn} = props;
    const params = useParams();
    const classes = useStyles();
    const location = useLocation();
    const componentMounted = useRef(true);
    const pageListing = useRef(0);
    const hasListing = useRef(false);
    const loadingRef = createRef();
    const forceUpdate = useForceUpdate();

    const [
        listings,
        setListings,
    ] = useState(false);
    const [
        traitsData,
        setTraitsData,
    ] = useState(false);
    const [
        traitsCategories,
        setTraitsCategories,
    ] = useState([]);
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();
    const [
        size,
        setSize,
    ] = useState(false);
    const query = searchParams.get('search') || '';

    const storeUserPreferences = (preferenceKey, value) => {
        var storage = JSON.stringify({
            ...userPreferences,
            [preferenceKey]: value,
        });
        localStorage.setItem(
            `${storageKey}${location.pathname}${collection.canister}`,
            preferenceKey ? storage : JSON.stringify(value),
        );
    };

    const defaultFilter = {
        status: {
            listed: true,
            unlisted: false,
            type: 'status',
        },
        price: {
            min: undefined,
            max: undefined,
            type: 'price',
        },
        rarity: {
            min: undefined,
            max: undefined,
            type: 'rarity',
        },
        mintNumber: {
            min: undefined,
            max: undefined,
            type: 'mintNumber',
        },
        traits: {
            values: !traitsData && collection?.route === 'cronics' ? getCronicFilters() : [],
            type: 'traits',
        },
    };

    const currentCanister = getCollectionFromRoute(params?.route).canister;
    userPreferences = localStorage.getItem(`${storageKey}${location.pathname}${currentCanister}`);
    if (userPreferences) {
        userPreferences = JSON.parse(userPreferences);
    } else {
        userPreferences = {
            filterOptions: {
                ...defaultFilter,
            },
            sortOptionNfts: defaultSortOptionNfts,
            sortOptionActivity: defaultSortOptionActivity,
            sortTypeNfts: defaultSortType,
            sortTypeActivity: defaultSortType,
            gridSize: 'large',
            currentTab: 'nfts',
            openedAccordion: defaultOpenedAccordions,
        };
        storeUserPreferences(false, userPreferences);
    }

    const [
        showFilters,
        setShowFilters,
    ] = useState(true);
    const [
        sortNfts,
        setSortNfts,
    ] = useState(userPreferences.sortOptionNfts || defaultSortOptionNfts);

    const [
        sortActivity,
        setSortActivity,
    ] = useState(userPreferences.sortOptionActivity || defaultSortOptionActivity);

    const [
        sortTypeNfts,
        setSortTypeNfts,
    ] = useState(userPreferences.sortTypeNfts || defaultSortType);

    const [
        sortTypeActivity,
        setSortTypeActivity,
    ] = useState(userPreferences.sortTypeActivity || defaultSortType);
    const [
        currentTab,
        setCurrentTab,
    ] = useState(userPreferences.currentTab || 'nfts');
    const [
        gridSize,
        setGridSize,
    ] = useState(userPreferences.gridSize);
    const [
        openedAccordion,
        setOpenedAccordion,
    ] = useState(userPreferences.openedAccordion);
    const [
        currentFilters,
        setCurrentFilters,
    ] = useState(userPreferences.filterOptions);

    const sortOptionsNfts = useMemo(() => {
        const sortOptionNftsInit = (listed, unlisted) => {
            const options =
                listed && !unlisted
                    ? [
                          defaultSortOptionNfts,
                          {
                              value: {
                                  type: 'rarity',
                              },
                              label: 'Rarity',
                          },
                          {
                              value: {
                                  type: 'mintNumber',
                              },
                              label: 'Mint #',
                          },
                      ]
                    : [
                          {
                              value: {
                                  type: 'rarity',
                              },
                              label: 'Rarity',
                          },
                          {
                              value: {
                                  type: 'mintNumber',
                              },
                              label: 'Mint #',
                          },
                      ];
            const findOption = options.find(option => {
                return option.value.type === sortNfts.value.type;
            });

            if (!findOption) setSortNfts(options[0]);
            return options;
        };

        return sortOptionNftsInit(
            currentFilters.status[filterTypes.status.listed],
            currentFilters.status[filterTypes.status.unlisted],
        );
    }, [
        currentFilters.status,
        sortNfts.value.type,
    ]);

    const navigate = useNavigate();

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const loadTraits = async () => {
        if (collection?.filter) {
            try {
                return await fetch('/filter/' + collection?.canister + '.json').then(response =>
                    response.json(),
                );
            } catch (error) {
                console.error(error);
            }
        }
        return false;
    };

    const _updates = async (s, canister) => {
        canister = canister ?? collection?.canister;
        setSize(await defaultEntrepotApi.token(collection.canister).size());

        try {
            var result = await defaultEntrepotApi.token(canister).listings();
            let traitsCategories;
            if (traitsData) {
                traitsCategories = traitsData[0].map(trait => {
                    return {
                        category: trait[1],
                        values: trait[2].map(trait => {
                            return trait[1];
                        }),
                    };
                });
            } else if (collection?.route === 'cronics') {
                traitsCategories = cronicFilterTraits.map(trait => {
                    return {
                        category: trait,
                    };
                });
            }

            var listings = result.map((listing, listingIndex) => {
                const tokenid = encodeNftId(collection?.canister, listing[0]);
                const {index, canister} = decodeNftId(tokenid);
                const rarity =
                    typeof getNri(canister, index) === 'number'
                        ? Number((getNri(canister, index) * 100).toFixed(1))
                        : false;
                const mintNumber = getNftMintNumber({
                    collectionId: canister,
                    nftIndex: index,
                });
                // eslint-disable-next-line no-undef
                const price = listing[1].price ? BigInt(listing[1].price) : listing[1].price;
                let traits;
                if (traitsData) {
                    traits = traitsData[1][listingIndex][1].map(trait => {
                        const traitCategory = trait[0];
                        const traitValue = trait[1];
                        return {
                            category: traitsCategories[traitCategory].category,
                            value: traitsCategories[traitCategory].values[traitValue],
                        };
                    });
                } else if (!traitsData && collection?.route === 'cronics') {
                    traits = getGenes(listing[2].nonfungible.metadata[0]).battle;
                }

                return {
                    ...listing,
                    price,
                    rarity,
                    mintNumber,
                    tokenid,
                    index,
                    canister,
                    traits,
                };
            });

            if (traitsData) {
                traitsCategories = sortBy(
                    traitsCategories.map(category => {
                        const traitsCount = category.values
                            .map(traits => {
                                const traitCount = listings.reduce((current, listing) => {
                                    const categoryIndex = listing.traits.findIndex(listingTrait => {
                                        return listingTrait.category === category.category;
                                    });

                                    if (categoryIndex === -1) {
                                        return current;
                                    }

                                    return (
                                        current +
                                        (traits === listing.traits[categoryIndex].value ? 1 : 0)
                                    );
                                }, 0);

                                return {
                                    [traits]: traitCount,
                                };
                            })
                            .sort((a, b) => {
                                return Object.values(b)[0] - Object.values(a)[0];
                            })
                            .reduce((currentTraitCount, traitCount) => {
                                const traitKey = Object.keys(traitCount)[0];
                                return (
                                    (currentTraitCount[traitKey] = traitCount[traitKey]),
                                    currentTraitCount
                                );
                            }, {});

                        return {
                            ...category,
                            values: Object.keys(traitsCount),
                            count: traitsCount,
                        };
                    }),
                    ['category'],
                );
            }

            setTraitsCategories(traitsCategories);
            setListings(listings);
        } catch (error) {
            console.error(error);
        }
    };

    const hasRarity = () => {
        if (!listings) return false;
        return listings.reduce((rarity, listing) => {
            return rarity || listing.rarity;
        }, false);
    };

    const filteredStatusListings = listings
        ? listings
              .filter(listing => listing[1] === false || listing.price >= 1000000n)
              .filter((listing, listingIndex) => {
                  if (collection?.canister === '46sy3-aiaaa-aaaah-qczza-cai') {
                      return listingIndex < size;
                  }
                  return true;
              })
              .filter(listing => {
                  return currentFilters.status.listed && currentFilters.status.unlisted
                      ? true
                      : currentFilters.status.unlisted
                      ? !listing[1]
                      : typeof listing[1] === 'object';
              })
        : [];

    const filteredAndSortedListings = orderBy(
        filteredStatusListings.filter(listing => {
            const inQuery =
                [
                    listing.tokenid,
                    listing.mintNumber,
                ]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) >= 0;
            const passFilter = doesCollectionPassFilters(
                listing,
                currentFilters,
                traitsData,
                collection,
            );

            return passFilter && (query === '' || inQuery);
        }),
        [
            value => {
                if (
                    sortNfts.value.type === 'price' &&
                    typeof value[sortNfts.value.type] !== 'bigint' &&
                    isNaN(value[sortNfts.value.type])
                ) {
                    return sortNfts.value.sort === 'asc' ? Infinity : -Infinity;
                }

                return value[sortNfts.value.type];
            },
        ],
        [sortTypeNfts],
    );

    useInterval(_updates, 10 * 1000);

    useEffect(() => {
        loadTraits().then(traits => {
            if (traits) {
                setTraitsData(traits);
            } else {
                _updates();
            }
        });

        const loadingRefEl = loadingRef.current;

        const options = {
            root: null,
            rootMargin: '-32px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (hasListing.current && entry.intersectionRatio > 0) {
                    hasListing.current = false;
                    pageListing.current += 1;
                    forceUpdate();
                }
            });
        }, options);

        if (loadingRefEl) {
            observer.observe(loadingRefEl);
        }

        return () => {
            componentMounted.current = false;
            observer.observe(loadingRefEl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useDidMountEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [traitsData]);

    return (
        <div className={classes.contentWrapper}>
            <ListingsTabs
                gridSize={gridSize}
                setGridSize={setGridSize}
                storeUserPreferences={storeUserPreferences}
                forceCheck={forceCheck}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <WithFilterPanel
                noFilters={currentTab === 'activity' ? true : false}
                showFilters={currentTab === 'activity' ? false : showFilters}
                onShowFiltersChange={newShowFilters => {
                    setShowFilters(newShowFilters);
                }}
                onFilterClose={() => {
                    setShowFilters(false);
                }}
                onClearFiltersChange={() => {
                    setCurrentFilters(defaultFilter);
                    storeUserPreferences('filterOptions', defaultFilter);
                }}
                filterControlChildren={
                    <ListingsFilters
                        currentFilters={currentFilters}
                        filteredStatusListings={filteredStatusListings}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        openedAccordion={openedAccordion}
                        setOpenedAccordion={setOpenedAccordion}
                        filterTypes={filterTypes}
                        hasRarity={hasRarity}
                        storeUserPreferences={storeUserPreferences}
                        traitsData={traitsData}
                        collection={collection}
                        traitsCategories={traitsCategories}
                        setCurrentFilters={setCurrentFilters}
                    />
                }
                otherControlsChildren={
                    currentTab === 'nfts' ? (
                        <ListingsOtherControls
                            setSort={setSortNfts}
                            storeUserPreferences={storeUserPreferences}
                            pageListing={pageListing}
                            forceCheck={forceCheck}
                            hasRarity={hasRarity}
                            sort={sortNfts}
                            sortOptions={sortOptionsNfts}
                            sortType={sortTypeNfts}
                            setSortType={setSortTypeNfts}
                            gridSize={gridSize}
                            setGridSize={setGridSize}
                            query={query}
                            setSearchParams={setSearchParams}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                        />
                    ) : (
                        <ListingsOtherControlsActivity
                            setSort={setSortActivity}
                            storeUserPreferences={storeUserPreferences}
                            hasRarity={hasRarity}
                            sort={sortActivity}
                            sortOptions={sortOptionsActivity}
                            sortType={sortTypeActivity}
                            setSortType={setSortTypeActivity}
                            query={query}
                            setSearchParams={setSearchParams}
                        />
                    )
                }
            >
                {currentTab === 'nfts' ? (
                    <ListingsNftCard
                        collection={collection}
                        gridSize={gridSize}
                        filteredAndSortedListings={filteredAndSortedListings}
                        hasListing={hasListing}
                        pageListing={pageListing}
                        _updates={_updates}
                        listings={listings}
                        loadingRef={loadingRef}
                        buyNft={buyNft}
                        faveRefresher={faveRefresher}
                        identity={identity}
                        loggedIn={loggedIn}
                        showFilters={showFilters}
                        sort={sortNfts}
                        setSort={setSortNfts}
                        storeUserPreferences={storeUserPreferences}
                        forceCheck={forceCheck}
                        sortOptions={sortOptionsNfts}
                        hasRarity={hasRarity}
                        sortType={sortTypeNfts}
                        setSortType={setSortTypeNfts}
                        currentFilters={currentFilters}
                        setCurrentFilters={setCurrentFilters}
                        defaultFilter={defaultFilter}
                    />
                ) : (
                    <ListingsActivity
                        collection={collection}
                        setSort={setSortActivity}
                        storeUserPreferences={storeUserPreferences}
                        sort={sortActivity}
                        sortOptions={sortOptionsActivity}
                        sortType={sortTypeActivity}
                        setSortType={setSortTypeActivity}
                        query={query}
                    />
                )}
            </WithFilterPanel>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: 32,
    },
}));
