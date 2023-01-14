import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CachedIcon from '@material-ui/icons/Cached';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FilterListIcon from '@material-ui/icons/FilterList';
import {Grid, makeStyles} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import getGenes from '../CronicStats.js';
import extjs from '../../ic/extjs.js';
import getNri from '../../ic/nftv.js';
import {useTheme} from '@material-ui/core/styles';
import NFT from '../NFT';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import CollectionDetails from '../CollectionDetailsAuction.js';
import {EntrepotAllStats, EntrepotCollectionStats} from '../../utils';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import {defaultEntrepotApi} from '../../typescript/api/entrepot-data-api';

const perPage = 60;
const drawerWidth = 0; //300;

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
};

const _isCanister = c => {
    return c.length == 27 && c.split('-').length == 5;
};
const _showListingPrice = n => {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
};
const emptyListing = {
    pricing: '',
    img: '',
};
var _ss,
    canUpdateListings = true;
export default function Listings(props) {
    const params = useParams();
    const classes = useStyles();
    const getCollectionFromRoute = r => {
        if (_isCanister(r)) {
            return props.collections.find(e => e.canister === r);
        } else {
            return props.collections.find(e => e.route === r);
        }
    };
    const [
        stats,
        setStats,
    ] = React.useState(false);
    const [
        listings,
        setListings,
    ] = useState(false);
    const [
        displayListings,
        setDisplayListings,
    ] = useState(false);
    if (!_ss) {
        _ss = localStorage.getItem(
            '_searchSettings' + getCollectionFromRoute(params?.route).canister,
        );
        if (_ss) {
            _ss = JSON.parse(_ss);
        } else {
            _ss = {
                sort: 'price_asc',
                selectedFilters: [],
                showing: 'listed',
                page: 1,
                minPrice: '',
                maxPrice: '',
            };
        }
    }
    const [
        minPrice,
        setMinPrice,
    ] = useState(_ss.minPrice ?? '');
    const [
        maxPrice,
        setMaxPrice,
    ] = useState(_ss.maxPrice ?? '');
    const [
        page,
        setPage,
    ] = useState(_ss.page);
    const [
        sort,
        setSort,
    ] = useState(_ss.sort);
    const [
        showing,
        setShowing,
    ] = useState('auction');
    const [
        selectedFilters,
        setSelectedFilters,
    ] = useState(_ss.selectedFilters);
    const [
        toggleFilter,
        setToggleFilter,
    ] = useState(
        window.innerWidth < 600 ? false : JSON.parse(localStorage.getItem('_toggleFilter')) ?? true,
    );
    const [
        openFilters,
        setOpenFilters,
    ] = useState([]);
    const [
        filterData,
        setFilterData,
    ] = useState(false);
    const [
        collapseOpen,
        setCollapseOpen,
    ] = useState(false);
    const [
        gridSize,
        setGridSize,
    ] = React.useState(localStorage.getItem('_gridSize') ?? 'small');
    const [
        wearableFilter,
        setWearableFilter,
    ] = useState('all');
    const [
        collection,
        setCollection,
    ] = useState(getCollectionFromRoute(params?.route));
    const [
        size,
        setSize,
    ] = useState(3000);

    const navigate = useNavigate();

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const cronicFilterTraits = [
        'health',
        'base',
        'speed',
        'attack',
        'range',
        'magic',
        'defense',
        'resistance',
        'basic',
        'special',
    ];
    var cftState = {};
    cronicFilterTraits.forEach(a => {
        cftState[a + 'Dom'] = [
            0,
            63,
        ];
        cftState[a + 'Rec'] = [
            0,
            63,
        ];
    });
    const [
        legacyFilterState,
        setLegacyFilterState,
    ] = React.useState(cftState);
    const cronicSetFilterTrait = (name, v) => {
        var t = {...legacyFilterState};
        t[name] = v;
        setLegacyFilterState(t);
    };

    var filterHooks = [];
    if (collection.route == 'cronics') {
        filterHooks.push(results => {
            return results.filter(result => {
                for (var i = 0; i < cronicFilterTraits.length; i++) {
                    if (
                        legacyFilterState[cronicFilterTraits[i] + 'Dom'][0] >
                        getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]]
                            .dominant
                    )
                        return false;
                    if (
                        legacyFilterState[cronicFilterTraits[i] + 'Dom'][1] <
                        getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]]
                            .dominant
                    )
                        return false;
                    if (
                        legacyFilterState[cronicFilterTraits[i] + 'Rec'][0] >
                        getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]]
                            .recessive
                    )
                        return false;
                    if (
                        legacyFilterState[cronicFilterTraits[i] + 'Rec'][1] <
                        getGenes(result[2].nonfungible.metadata[0]).battle[cronicFilterTraits[i]]
                            .recessive
                    )
                        return false;
                }
                return true;
            });
        });
    }

    const changeWearableFilter = async event => {
        setPage(1);
        setWearableFilter(event.target.value);
    };
    const changeSort = event => {
        setPage(1);
        setSort(event.target.value);
    };
    const changeShowing = event => {
        setPage(1);
        setShowing(event.target.value);
    };
    const applyAdvancedFilters = a => {
        var _a = a;
        for (var i = 0; i < filterHooks.length; i++) {
            _a = filterHooks[i](_a);
        }
        return _a;
    };

    const loadFilterData = async () => {
        if (collection?.filter) {
            try {
                var fd = await fetch('/filter/' + collection?.canister + '.json').then(response =>
                    response.json(),
                );
                return fd;
            } catch (error) {
                console.error(error);
            }
        }
        return false;
    };
    const isOpenFilter = traitId => {
        return openFilters.indexOf(traitId) >= 0;
    };
    const handleToggleFilter = traitId => {
        if (isOpenFilter(traitId)) {
            setOpenFilters(openFilters.filter(b => traitId != b));
        } else {
            setOpenFilters(openFilters.concat([traitId]));
        }
    };
    const filterGetCount = (traitId, traitValueId) => {
        return filterData[1].filter(a => a[1].find(b => b[0] == traitId && b[1] == traitValueId))
            .length;
    };
    const isFilterValueSelected = (traitId, traitValueId) => {
        return selectedFilters.find(a => a[0] == traitId && a[1] == traitValueId) ? true : false;
    };
    const handleToggleFilterTrait = (traitId, traitValueId) => {
        if (isFilterValueSelected(traitId, traitValueId)) {
            setSelectedFilters(
                selectedFilters.filter(b => !(b[0] == traitId && b[1] == traitValueId)),
            );
        } else {
            setSelectedFilters(
                selectedFilters.concat([
                    [
                        traitId,
                        traitValueId,
                    ],
                ]),
            );
        }
    };
    const showSelectedFilters = () => {
        if (!filterData) return [];
        return selectedFilters.map(a => [
            filterData[0]
                .find(b => a[0] == b[0])
                .map((c, i) => {
                    if (i == 0) return [''];
                    if (i == 1) return [c + ':'];
                    else return [c.find(d => a[1] == d[0])[1]];
                })
                .join(''),
            a,
        ]);
    };
    const filterListings = (_listings, sf) => {
        var _selectedFilters = sf ?? selectedFilters;
        if (!_selectedFilters.length) return applyAdvancedFilters(applyFilters(_listings));
        if (!filterData) return applyAdvancedFilters(applyFilters(_listings));
        var alteredFilters = {};
        _selectedFilters.forEach(a => {
            if (!alteredFilters.hasOwnProperty(a[0])) alteredFilters[a[0]] = [];
            alteredFilters[a[0]].push(a[1]);
        });
        var ft = filterData[1]
            .filter(a => {
                for (const b in alteredFilters) {
                    if (!alteredFilters.hasOwnProperty(b)) continue;
                    var fnd = a[1].find(c => c[0] == b);
                    if (fnd) {
                        if (alteredFilters[b].indexOf(fnd[1]) < 0) return false;
                    }
                }
                return true;
            })
            .map(a => {
                switch (collection.canister) {
                    case 'y3b7h-siaaa-aaaah-qcnwa-cai':
                    case 'bxdf4-baaaa-aaaah-qaruq-cai':
                        return a[0] + 1;
                    default:
                        return a[0];
                }
            });

        return applyAdvancedFilters(applyFilters(_listings)).filter(a => ft.indexOf(a[0]) >= 0);
    };
    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const applyFilters = a => {
        if (collection?.canister === 'tde7l-3qaaa-aaaah-qansa-cai' && wearableFilter !== 'all') {
            var map = [
                'accessories',
                'hats',
                'eyewear',
                'pets',
            ];
            a = a.filter(_a => map[_a[2].nonfungible.metadata[0][0]] === wearableFilter);
        }

        return a;
    };

    const _updates = async (s, c) => {
        c = c ?? collection?.canister;
        if (!_isCanister(c)) return updateListings([]);
        if (!collection.market) return updateListings([]);

        setSize(await defaultEntrepotApi.token(collection.canister).size());
        try {
            var listings = await defaultEntrepotApi.token(c).listings();
            if (collection?.canister === '46sy3-aiaaa-aaaah-qczza-cai') {
                listings = listings.filter((val, idx) => {
                    if (idx >= size) return false;
                    return true;
                });
            }
            //Remove listings below 0.01ICP
            listings = listings.filter(l => l[1] == false || l[1].price >= 1000000n);
            updateListings(listings);
        } catch (e) {}
    };
    const updateListings = async (l, s, so, sf) => {
        if (canUpdateListings) {
            canUpdateListings = false;
            var _listings = l ?? listings;
            var _showing = s ?? showing;
            var _sort = s ?? sort;
            var _selectedFilters = sf ?? selectedFilters;
            if (!_listings) {
                canUpdateListings = true;
                return;
            }
            if (l) setListings(l);
            var _displayListings = _listings;
            if (minPrice) {
                _displayListings = _displayListings.filter(a => {
                    if (!a[1]) return false;
                    return Number(a[1].price) / 100000000 >= Number(minPrice);
                });
            }
            if (maxPrice) {
                _displayListings = _displayListings.filter(a => {
                    if (!a[1]) return false;
                    return Number(a[1].price) / 100000000 <= Number(maxPrice);
                });
            }
            var auctions = [];
            if (_showing == 'auction') {
                var auctionsAPI = defaultEntrepotApi.canister('ffxbt-cqaaa-aaaak-qazbq-cai');
                auctions = (await auctionsAPI.allAuctions())
                    .map(a => extjs.decodeTokenId(a))
                    .filter(a => a.canister == collection.canister)
                    .map(a => a.index);
            }
            _displayListings = _displayListings.filter(a => {
                switch (_showing) {
                    case 'all':
                        return true;
                        break;
                    case 'auction':
                        return auctions.indexOf(a[0]) >= 0;
                        break;
                    case 'listed':
                        return a[1];
                        break;
                }
            });
            _displayListings = filterListings(_displayListings, _selectedFilters);
            _displayListings = _displayListings.sort((a, b) => {
                switch (_sort) {
                    case 'price_asc':
                        if (!a[1]) return 1;
                        if (!b[1]) return -1;
                        return Number(a[1].price) - Number(b[1].price);
                    case 'price_desc':
                        if (!a[1]) return 1;
                        if (!b[1]) return -1;
                        return Number(b[1].price) - Number(a[1].price);
                    case 'gri':
                        return (
                            Number(getNri(collection?.canister, b[0])) * 100 -
                            Number(getNri(collection?.canister, a[0])) * 100
                        );
                    case 'recent':
                        if (!a[1]) return 1;
                        if (!b[1]) return -1;
                        return 1;
                    case 'oldest':
                        if (!a[1]) return 1;
                        if (!b[1]) return -1;
                        return -1;
                    case 'mint_number':
                        return a[0] - b[0];
                    case 'type':
                        if (collection?.canister === 'poyn6-dyaaa-aaaah-qcfzq-cai') {
                            if (
                                a[2].nonfungible.metadata[0][0] === 0 &&
                                b[2].nonfungible.metadata[0][0] === 0
                            )
                                return 0;
                            else if (a[2].nonfungible.metadata[0][0] === 0) return 1;
                            else if (b[2].nonfungible.metadata[0][0] === 0) return -1;
                            else if (
                                a[2].nonfungible.metadata[0][1] === b[2].nonfungible.metadata[0][1]
                            )
                                return (
                                    a[2].nonfungible.metadata[0][0] -
                                    b[2].nonfungible.metadata[0][0]
                                );
                            return (
                                b[2].nonfungible.metadata[0][1] - a[2].nonfungible.metadata[0][1]
                            );
                        }
                        var _a, _b, d;
                        if (collection?.canister === 'nbg4r-saaaa-aaaah-qap7a-cai') {
                            _a = a[2].nonfungible.metadata[0][0];
                            _b = b[2].nonfungible.metadata[0][0];
                            d = _b - _a;
                            if (d === 0) {
                                if (Number(a[1].price) > Number(b[1].price)) return 1;
                                if (Number(a[1].price) < Number(b[1].price)) return -1;
                            }
                            return d;
                        } else {
                            _a = a[2].nonfungible.metadata[0][30] % 41;
                            _b = b[2].nonfungible.metadata[0][30] % 41;
                            if (_a === 2) _a = 1;
                            if (_a > 1) _a = 2;
                            if (_b === 2) _b = 1;
                            if (_b > 1) _b = 2;
                            d = _a - _b;
                            if (d === 0) {
                                if (Number(a[1].price) > Number(b[1].price)) return 1;
                                if (Number(a[1].price) < Number(b[1].price)) return -1;
                            }
                            return d;
                        }
                    default:
                        return 0;
                }
            });
            setDisplayListings(_displayListings);
            canUpdateListings = true;
        }
    };
    const theme = useTheme();
    const styles = {
        empty: {
            maxWidth: 1200,
            margin: '0 auto',
            textAlign: 'center',
        },
        details: {
            textAlign: 'center',
            paddingBottom: 50,
            marginBottom: 50,
        },
        grid: {
            flexGrow: 1,
            padding: theme.spacing(2),
        },
    };
    const changeGrid = (e, a) => {
        localStorage.setItem('_gridSize', a);
        setGridSize(a);
    };
    const changeToggleFilter = () => {
        localStorage.setItem('_toggleFilter', !toggleFilter);
        setToggleFilter(!toggleFilter);
    };
    const minPriceChange = ev => {
        setMinPrice(Number(ev.target.value));
    };
    const maxPriceChange = ev => {
        setMaxPrice(Number(ev.target.value));
    };

    useDidMountEffect(() => {
        _ss = {
            sort: sort,
            selectedFilters: selectedFilters,
            showing: showing,
            page: page,
            minPrice: minPrice,
            maxPrice: maxPrice,
        };
        localStorage.setItem('_searchSettings' + collection.canister, JSON.stringify(_ss));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        sort,
        selectedFilters,
        showing,
        page,
        minPrice,
        maxPrice,
    ]);
    useDidMountEffect(() => {
        setDisplayListings(false);
        setTimeout(updateListings, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);
    useDidMountEffect(() => {
        setPage(1);
        setDisplayListings(false);
        setTimeout(updateListings, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedFilters,
        showing,
        minPrice,
        maxPrice,
        legacyFilterState,
        wearableFilter,
    ]);

    useInterval(_updates, 60 * 1000);
    React.useEffect(() => {
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
        //maxWidth:1200, margin:"0 auto",
        <div style={{minHeight: 'calc(100vh - 221px)', marginBottom: -75}}>
            {/*<Drawer classes={{paper: classes.drawerPaper}} variant="permanent" open>
      </Drawer>*/}
            <div style={{}}>
                <div style={{maxWidth: 1200, margin: '0 auto 0'}}>
                    <div style={{textAlign: 'center'}}>
                        <CollectionDetails
                            classes={classes}
                            stats={stats}
                            collection={collection}
                        />
                    </div>
                </div>
                <br />
                <br />
                <br />
                {_isCanister(collection.canister) && collection.market ? (
                    <div
                        id="mainListings"
                        style={{
                            position: 'relative',
                            marginLeft: -24,
                            marginRight: -24,
                            marginBottom: -24,
                            borderTop: '1px solid #aaa',
                            borderBottom: '1px solid #aaa',
                            display: 'flex',
                        }}
                    >
                        <div
                            className={classes.listingsView}
                            style={{flexGrow: 1, padding: '10px 100px 50px 100px'}}
                        >
                            <div style={{}}>
                                <div className={classes.filters} style={{}}>
                                    <Grid container style={{minHeight: 66}}>
                                        <Grid item xs={12} sm={'auto'} style={{marginBottom: 10}}>
                                            <ToggleButtonGroup
                                                className={classes.hideDesktop}
                                                style={{marginTop: 5, marginRight: 10}}
                                                size="small"
                                            >
                                                <ToggleButton
                                                    value={''}
                                                    onClick={changeToggleFilter}
                                                >
                                                    <FilterListIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            <ToggleButtonGroup
                                                style={{marginTop: 5, marginRight: 10}}
                                                size="small"
                                            >
                                                <ToggleButton
                                                    value={''}
                                                    onClick={async () => {
                                                        setDisplayListings(false);
                                                        await _updates();
                                                        setTimeout(updateListings, 300);
                                                    }}
                                                >
                                                    <CachedIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            <ToggleButtonGroup
                                                style={{marginTop: 5, marginRight: 10}}
                                                size="small"
                                                value={gridSize}
                                                exclusive
                                                onChange={changeGrid}
                                            >
                                                <ToggleButton value={'small'}>
                                                    <ViewModuleIcon />
                                                </ToggleButton>
                                                <ToggleButton value={'large'}>
                                                    <ViewComfyIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                        {displayListings && displayListings.length > perPage ? (
                                            <Grid
                                                xs={12}
                                                md={'auto'}
                                                item
                                                style={{marginLeft: 'auto'}}
                                            >
                                                <Pagination
                                                    className={classes.pagination}
                                                    size="small"
                                                    count={Math.ceil(
                                                        displayListings.length / perPage,
                                                    )}
                                                    page={page}
                                                    onChange={(e, v) => setPage(v)}
                                                />
                                            </Grid>
                                        ) : (
                                            ''
                                        )}
                                    </Grid>
                                </div>
                                <div style={{minHeight: 500}}>
                                    <div style={{}}>
                                        {displayListings === false ? (
                                            <>
                                                <Typography
                                                    paragraph
                                                    style={{fontWeight: 'bold'}}
                                                    align="left"
                                                >
                                                    Loading...
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                {displayListings.length === 0 ? (
                                                    <Typography
                                                        paragraph
                                                        style={{fontWeight: 'bold'}}
                                                        align="left"
                                                    >
                                                        We found no results
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        paragraph
                                                        style={{fontWeight: 'bold'}}
                                                        align="left"
                                                    >
                                                        {displayListings.length} items
                                                    </Typography>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {selectedFilters.length > 0 || minPrice || maxPrice ? (
                                        <div>
                                            <Typography
                                                paragraph
                                                style={{fontWeight: 'bold'}}
                                                align="left"
                                            >
                                                {minPrice ? (
                                                    <Chip
                                                        style={{marginRight: 10, marginBottom: 10}}
                                                        label={'Min. Price:' + minPrice}
                                                        onDelete={() => setMinPrice('')}
                                                        color="primary"
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                                {maxPrice ? (
                                                    <Chip
                                                        style={{marginRight: 10, marginBottom: 10}}
                                                        label={'Max. Price:' + maxPrice}
                                                        onDelete={() => setMaxPrice('')}
                                                        color="primary"
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                                {selectedFilters.length > 0 ? (
                                                    <>
                                                        {showSelectedFilters().map((a, i) => {
                                                            return (
                                                                <Chip
                                                                    key={a[1][0] + '_' + a[1][1]}
                                                                    style={{
                                                                        marginRight: 10,
                                                                        marginBottom: 10,
                                                                    }}
                                                                    label={a[0]}
                                                                    onDelete={() =>
                                                                        handleToggleFilterTrait(
                                                                            a[1][0],
                                                                            a[1][1],
                                                                        )
                                                                    }
                                                                    color="primary"
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    ''
                                                )}
                                                <Chip
                                                    style={{marginRight: 10, marginBottom: 10}}
                                                    label={'Reset'}
                                                    onClick={() => {
                                                        setSelectedFilters([]);
                                                        setMinPrice('');
                                                        setMaxPrice('');
                                                    }}
                                                    color="default"
                                                />
                                            </Typography>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {displayListings ? (
                                        <div>
                                            <Grid
                                                container
                                                spacing={2}
                                                direction="row"
                                                alignItems="stretch"
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns:
                                                        gridSize === 'small'
                                                            ? 'repeat(auto-fill, 300px)'
                                                            : 'repeat(auto-fill, 200px)',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                {displayListings
                                                    .filter(
                                                        (token, i) =>
                                                            i >= (page - 1) * perPage &&
                                                            i < page * perPage,
                                                    )
                                                    .map((listing, i) => {
                                                        return (
                                                            <NFT
                                                                collections={props.collections}
                                                                gridSize={gridSize}
                                                                loggedIn={props.loggedIn}
                                                                identity={props.identity}
                                                                tokenid={extjs.encodeTokenId(
                                                                    collection?.canister,
                                                                    listing[0],
                                                                )}
                                                                key={extjs.encodeTokenId(
                                                                    collection?.canister,
                                                                    listing[0],
                                                                )}
                                                                floor={stats.floor}
                                                                buy={props.buyNft}
                                                                afterBuy={_updates}
                                                                view="marketplace"
                                                                listing={listing[1]}
                                                                metadata={listing[2]}
                                                            />
                                                        );
                                                    })}
                                            </Grid>
                                        </div>
                                    ) : (
                                        ''
                                    )}

                                    {displayListings && displayListings.length > perPage ? (
                                        <Pagination
                                            className={classes.pagination}
                                            size="small"
                                            count={Math.ceil(displayListings.length / perPage)}
                                            page={page}
                                            onChange={(e, v) => setPage(v)}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    listingsView: {
        [theme.breakpoints.down('xs')]: {
            '& .MuiGrid-container.MuiGrid-spacing-xs-2': {
                gridTemplateColumns: 'repeat(auto-fill, 50%)!important',
            },
        },
    },
    hideDesktop: {
        display: 'none',
        [theme.breakpoints.down('xs')]: {
            display: 'inline-flex',
        },
    },
    filtersViewOpen: {
        position: 'sticky',
        top: 72,
        width: 330,
        height: 'calc(100vh - 72px)',
        borderRight: '1px solid #aaa',
        overflowY: 'scroll',
        overflowX: 'hidden',
        paddingBottom: 50,
        [theme.breakpoints.down('xs')]: {
            //display:"none",
            position: 'fixed',
            backgroundColor: 'white',
            zIndex: 100,
            left: 0,
            right: 0,
            bottom: 0,
            width: '80%',
        },
    },
    filtersViewClosed: {
        position: 'sticky',
        top: 72,
        width: 60,
        height: 'calc(100vh - 72px)',
        borderRight: '1px solid #aaa',
        overflowY: 'hidden',
        overflowX: 'hidden',
        paddingBottom: 50,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        zIndex: 1,
    },
    filters: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
        marginBottom: '20px',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center',
        },
    },
}));
