import React, {useEffect, useState, useRef, createRef} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import {WithFilterPanel} from '../../shared/WithFilterPanel.js';
import {useLocation, useSearchParams} from 'react-router-dom';
import getNri from '../../ic/nftv.js';
import orderBy from 'lodash.orderby';
import {forceCheck} from 'react-lazyload';
import {cronicFilterTraits} from '../../model/constants.js';
import {ListingsTabs} from './ListingsTabs.js';
import {ListingsFilters} from './ListingsFilters.js';
import {ListingsNftCard} from './ListingsNftCard.js';
import {EntrepotNFTMintNumber} from '../../utils.js';
import {isInRange} from '../../utilities/number-utils.js';
import getGenes from '../../components/CronicStats.js';
import extjs from '../../ic/extjs';
import {ListingsOtherControls} from './ListingsOtherControls';
const api = extjs.connect('https://boundary.ic0.app/');

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

const defaultSortOption = {
    value: {
        type: 'price',
    },
    label: 'Price',
};

const defaultSortType = 'asc';

const defaultOpenedAccordions = [
    'status',
    'price',
    'rarity',
    'mintNumber',
    'traits',
];

const sortOptions = [
    defaultSortOption,
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
        entireCollection: 'entireCollection',
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
    if (currentFilters.price.range) {
        if (
            Number(listing.price) / 100000000 > currentFilters.price.range.max ||
            Number(listing.price) / 100000000 < currentFilters.price.range.min
        ) {
            return false;
        }
    }

    if (currentFilters.rarity.range) {
        if (
            listing.rarity > currentFilters.rarity.range.max ||
            listing.rarity < currentFilters.rarity.range.min
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

    if (currentFilters.traits.values.length) {
        return currentFilters.traits.values.reduce((currentCategory, category) => {
            const categoryIndex = listing.traits.findIndex(listingTrait => {
                return listingTrait.category === category.category;
            });

            const trait = category.values.reduce((currentTrait, trait) => {
                return currentTrait || trait === listing.traits[categoryIndex].value;
            }, false);

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
            type: 'listed',
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
            sortOption: defaultSortOption,
            sortType: defaultSortType,
            toggleFilterPanel: true,
            gridSize: 'large',
            openedAccordion: defaultOpenedAccordions,
        };
        storeUserPreferences(false, userPreferences);
    }

    const [
        showFilters,
        setShowFilters,
    ] = useState(userPreferences.toggleFilterPanel);
    const [
        sort,
        setSort,
    ] = useState(userPreferences.sortOption);
    const [
        sortType,
        setSortType,
    ] = useState(userPreferences.sortType || defaultSortType);
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
        setSize(await api.token(collection.canister).size());

        try {
            var result = await api.token(canister).listings();
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
                const tokenid = extjs.encodeTokenId(collection?.canister, listing[0]);
                const {index, canister} = extjs.decodeTokenId(tokenid);
                const rarity =
                    typeof getNri(canister, index) === 'number'
                        ? Number((getNri(canister, index) * 100).toFixed(1))
                        : false;
                const mintNumber = EntrepotNFTMintNumber(canister, index);
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
                traitsCategories = traitsCategories.map((category, categoryIndex) => {
                    const traitsCount = category.values
                        .map(traits => {
                            const traitCount = listings.reduce((current, listing) => {
                                const categoryIndex = listing.traits.findIndex(listingTrait => {
                                    return listingTrait.category === category.category;
                                });

                                return (
                                    current +
                                    (traits === listing.traits[categoryIndex].value ? 1 : 0)
                                );
                            }, 0);

                            return {
                                [traits]: traitCount,
                            };
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
                        count: traitsCount,
                    };
                });
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
                  return currentFilters.status.type === filterTypes.status.listed
                      ? listing[1]
                      : true;
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
                    sort.value.type === 'price' &&
                    typeof value[sort.value.type] !== 'bigint' &&
                    isNaN(value[sort.value.type])
                ) {
                    return sort.value.sort === 'asc' ? Infinity : -Infinity;
                }

                return value[sort.value.type];
            },
        ],
        [sortType],
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

        observer.observe(loadingRefEl);

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
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <ListingsTabs
                collection={collection}
                gridSize={gridSize}
                setGridSize={setGridSize}
                query={query}
                setSearchParams={setSearchParams}
                storeUserPreferences={storeUserPreferences}
            />
            <WithFilterPanel
                showFilters={showFilters}
                onShowFiltersChange={newShowFilters => {
                    setShowFilters(newShowFilters);
                    storeUserPreferences('toggleFilterPanel', newShowFilters);
                }}
                onFilterClose={() => {
                    setShowFilters(false);
                    storeUserPreferences('toggleFilterPanel', false);
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
                    <ListingsOtherControls
                        listings={listings}
                        filteredAndSortedListings={filteredAndSortedListings}
                        setSort={setSort}
                        storeUserPreferences={storeUserPreferences}
                        pageListing={pageListing}
                        forceCheck={forceCheck}
                        hasRarity={hasRarity}
                        sort={sort}
                        sortOptions={sortOptions}
                        sortType={sortType}
                        setSortType={setSortType}
                    />
                }
            >
                <ListingsNftCard
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
                />
            </WithFilterPanel>
        </div>
    );
}
