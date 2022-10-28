import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useSearchParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {EntrepotUpdateStats, EntrepotAllStats} from '../utils';
import {isToniqEarnCollection} from '../location/toniq-earn-collections';
import {
    cssToReactStyleObject,
    toniqFontStyles,
    toniqColors,
    LoaderAnimated24Icon,
    Icp16Icon,
    Search24Icon,
} from '@toniq-labs/design-system';
import {NftCard} from '../shared/NftCard';
import {
    ToniqIcon,
    ToniqInput,
    ToniqDropdown,
    ToniqToggleButton,
    ToniqSlider,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from '../components/PriceICP';
import {WithFilterPanel} from '../shared/WithFilterPanel';
import {ChipWithLabel} from '../shared/ChipWithLabel';
import {gridLargeMaxWidth} from '../model/constants';

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

function getLowestStat(stats, propKey) {
    return stats.reduce((lowest, stat) => {
        const currentValue = Number(stat.stats[propKey]);
        if (currentValue < lowest) {
            return currentValue;
        } else {
            return lowest;
        }
    }, Infinity);
}

function getHighestStat(stats, propKey) {
    return stats.reduce((lowest, stat) => {
        const currentValue = Number(stat.stats[propKey]);
        if (currentValue > lowest) {
            return currentValue;
        } else {
            return lowest;
        }
    }, -Infinity);
}

const useStyles = makeStyles(theme => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    collectionWrapper: {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, ${gridLargeMaxWidth})`,
        justifyContent: 'center',
        gap: 32,
        [theme.breakpoints.down('xs')]: {
            gap: 16,
        },
    },
    root: {
        maxWidth: 345,
    },
    heading: {
        ...cssToReactStyleObject(toniqFontStyles.h1Font),
        ...cssToReactStyleObject(toniqFontStyles.extraBoldFont),
        // 8px here plus 24px padding on wrapper makes 32px total between this and the nav bar
        marginTop: '8px',
        marginBottom: '24px',
    },
    media: {
        cursor: 'pointer',
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    collectionCard: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 490,
        maxWidth: 304,
        [theme.breakpoints.only('md')]: {
            maxWidth: 275,
        },
        '@media (max-width: 400px)': {
            height: 'unset',
        },
    },
    collectionCardBottomHalf: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'stretch',
        gap: 16,
    },
    collectionCardCollectionName: {
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
        ...cssToReactStyleObject(toniqFontStyles.h3Font),
        marginBottom: 0,
        marginTop: 0,
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
    collectionCardBrief: {
        margin: 0,
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'clip',
        padding: '4px 0',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        color: String(toniqColors.pageSecondary.foregroundColor),
    },
    collectionCardBriefWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 0,
        flexGrow: 1,
        justifyContent: 'start',
        alignSelf: 'stretch',
        minHeight: '54px',
    },
    collectionDetailsWrapper: {
        display: 'flex',
        flexShrink: 1,
        justifyContent: 'center',
        gap: '16px',
        [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap',
            flexShrink: 1,
        },
    },
    collectionDetailsCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'stretch',
        textAlign: 'center',
        flexBasis: '0',
        minWidth: '80px',
        flexGrow: 1,
    },
    collectionDetailsChip: {
        ...cssToReactStyleObject(toniqFontStyles.boldFont),
        ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
        fontSize: '15px',
    },
    nftCard: {
        flexGrow: 1,
        gap: 16,
    },
    toggleSort: {
        background: 'none',
        padding: 0,
        margin: 0,
        border: 'none',
        font: 'inherit',
        cursor: 'pointer',
        textTransform: 'inherit',
        textDecoration: 'inherit',
        '-webkit-tap-highlight-color': 'transparent',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
}));

const defaultSortOption = {
    value: 'total',
    label: 'Total Volume',
};
const defaultSortType = 'desc';
const sortOptions = [
    {
        value: 'listings',
        label: 'Listings',
    },
    defaultSortOption,
    {
        value: 'floor',
        label: 'Floor Price',
    },
    {
        value: 'alpha',
        label: 'Alphabetically',
    },
];

const filterTypes = {
    price: {
        floor: 'floor',
        averageSale: 'average sale',
    },
    volume: {},
};

function doesCollectionPassFilters(collectionStats, currentFilters) {
    if (!collectionStats) {
        return false;
    }

    if (currentFilters.price.range) {
        if (currentFilters.price.type === filterTypes.price.floor) {
            if (
                Number(collectionStats.stats.floor) > currentFilters.price.range.max ||
                Number(collectionStats.stats.floor) < currentFilters.price.range.min
            ) {
                return false;
            }
        } else if (currentFilters.price.type === filterTypes.price.averageSale) {
            if (
                Number(collectionStats.stats.average) > currentFilters.price.range.max ||
                Number(collectionStats.stats.average) < currentFilters.price.range.min
            ) {
                return false;
            }
        }
    }

    if (currentFilters.volume.range) {
        if (
            Number(collectionStats.stats.total) > currentFilters.volume.range.max ||
            Number(collectionStats.stats.total) < currentFilters.volume.range.min
        ) {
            return false;
        }
    }

    return true;
}

export default function Marketplace(props) {
    const classes = useStyles();
    const [
        sort,
        setSort,
    ] = React.useState(defaultSortOption);
    const [
        sortType,
        setSortType,
    ] = React.useState(defaultSortType);
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();
    const [
        showFilters,
        setShowFilters,
    ] = React.useState(false);
    const [
        currentFilters,
        setCurrentFilters,
    ] = React.useState({
        price: {
            range: undefined,
            type: 'floor',
        },
        volume: {
            range: undefined,
            type: '30-day',
        },
    });

    const query = searchParams.get('search') || '';
    const [
        stats,
        setStats,
    ] = React.useState([]);

    const _updates = () => {
        EntrepotUpdateStats().then(setStats);
    };
    React.useEffect(() => {
        if (EntrepotAllStats().length === 0) {
            _updates();
        } else {
            setStats(EntrepotAllStats());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const searchbarEl = document.querySelector('.searchbar');
        if (searchbarEl && searchbarEl.shadowRoot && query !== '') {
            const searchInput = searchbarEl.shadowRoot.querySelector('input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);
    useInterval(_updates, 60 * 1000);

    const filteredAndSortedCollections = props.collections
        .filter(collection => {
            // prevent Toniq Earn related collections from showing up in countries where its blocked
            const allowed = isToniqEarnCollection(collection) ? props.isToniqEarnAllowed : true;
            const inQuery =
                [
                    collection.name,
                    collection.brief,
                    collection.keywords,
                ]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) >= 0;
            const currentStats = stats.find(stat => stat.canister === collection.canister);

            const passFilter = showFilters
                ? doesCollectionPassFilters(currentStats, currentFilters)
                : !!currentStats;
            return allowed && passFilter && (query == '' || inQuery);
        })
        .sort((a, b) => {
            switch (`${sort.value}_${sortType}`) {
                case 'featured':
                    return b.priority - a.priority;
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'listings_asc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === a.canister).stats.listings) -
                        Number(stats.find(x => x.canister === b.canister).stats.listings)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'listings_desc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === b.canister).stats.listings) -
                        Number(stats.find(x => x.canister === a.canister).stats.listings)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'total_asc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === a.canister).stats.total) -
                        Number(stats.find(x => x.canister === b.canister).stats.total)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'total_desc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === b.canister).stats.total) -
                        Number(stats.find(x => x.canister === a.canister).stats.total)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'floor_asc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === a.canister).stats.floor) -
                        Number(stats.find(x => x.canister === b.canister).stats.floor)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'floor_desc':
                    if (
                        stats.findIndex(x => x.canister === a.canister) < 0 &&
                        stats.findIndex(x => x.canister === b.canister) < 0
                    )
                        return 0;
                    if (stats.findIndex(x => x.canister === a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister === b.canister) < 0) return -1;
                    if (
                        stats.find(x => x.canister === a.canister).stats === false &&
                        stats.find(x => x.canister === b.canister).stats === false
                    )
                        return 0;
                    if (stats.find(x => x.canister === a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister === b.canister).stats === false) return -1;
                    return (
                        Number(stats.find(x => x.canister === b.canister).stats.floor) -
                        Number(stats.find(x => x.canister === a.canister).stats.floor)
                    );
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'alpha_asc':
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                case 'alpha_desc':
                    if (a.name < b.name) {
                        return 1;
                    }
                    if (a.name > b.name) {
                        return -1;
                    }
                    return 0;
                    /* eslint-disable no-unreachable */
                    break;
                /* eslint-enable */
                default:
                    return 0;
            }
        });

    console.log({filteredAndSortedCollections});

    const priceRanges = {
        [filterTypes.price.floor]: {
            min: getLowestStat(stats, 'floor'),
            max: getHighestStat(stats, 'floor'),
        },
        [filterTypes.price.averageSale]: {
            min: getLowestStat(stats, 'average'),
            max: getHighestStat(stats, 'average'),
        },
    };

    const volumeLimits = {
        min: getLowestStat(stats, 'total'),
        max: getHighestStat(stats, 'total'),
    };

    return (
        <>
            <div style={{width: '100%', display: 'block', position: 'relative'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        margin: '0px auto',
                        minHeight: 'calc(100vh - 221px)',
                    }}
                >
                    <h1 className={classes.heading}>All Collections</h1>
                    <ToniqInput
                        className="searchbar"
                        value={query}
                        style={{
                            '--toniq-accent-tertiary-background-color': 'transparent',
                            width: '500px',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            marginLeft: '-16px',
                        }}
                        placeholder="Search for collections..."
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
                        filterControlChildren={
                            <>
                                <div>
                                    <div className="title">Price</div>
                                    <ToniqToggleButton
                                        text="Floor"
                                        toggled={
                                            currentFilters.price.type === filterTypes.price.floor
                                        }
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
                                        toggled={
                                            currentFilters.price.type ===
                                            filterTypes.price.averageSale
                                        }
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
                                        value={
                                            currentFilters.price.range ||
                                            priceRanges[currentFilters.price.type]
                                        }
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
                                    <div className="title">Volume</div>
                                    <ToniqSlider
                                        logScale={true}
                                        min={volumeLimits.min}
                                        max={volumeLimits.max}
                                        double={true}
                                        value={currentFilters.volume.range || volumeLimits}
                                        onValueChange={event => {
                                            const values = event.detail;
                                            setCurrentFilters({
                                                ...currentFilters,
                                                volume: {
                                                    ...currentFilters.volume,
                                                    range: values,
                                                },
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
                                    {filteredAndSortedCollections.length} Collections
                                </span>
                                <div style={{display: 'flex', gap: 4}}>
                                    <button
                                        className={classes.toggleSort}
                                        onClick={() => {
                                            sortType === 'asc'
                                                ? setSortType('desc')
                                                : setSortType('asc');
                                        }}
                                    >
                                        <img
                                            alt="sort"
                                            src="/icon/svg/sort.svg"
                                            style={{
                                                transform:
                                                    sortType === 'asc' ? 'scaleY(1)' : 'scaleY(-1)',
                                            }}
                                        />
                                    </button>
                                    <ToniqDropdown
                                        style={{
                                            '--toniq-accent-secondary-background-color':
                                                'transparent',
                                            width: 250,
                                        }}
                                        selectedLabelPrefix="Sort By:"
                                        selected={sort}
                                        onSelectChange={event => {
                                            setSort(event.detail);
                                        }}
                                        options={sortOptions}
                                    />
                                </div>
                            </>
                        }
                    >
                        <div className={classes.collectionWrapper}>
                            {filteredAndSortedCollections.map((collection, i) => {
                                return (
                                    <Link
                                        key={i}
                                        className={classes.collectionCard}
                                        style={{textDecoration: 'none'}}
                                        to={'/marketplace/' + collection.route}
                                    >
                                        <NftCard
                                            className={classes.nftCard}
                                            title={collection.name}
                                            imageUrl={
                                                collection.hasOwnProperty('collection') &&
                                                collection.collection
                                                    ? collection.collection
                                                    : '/collections/' + collection.canister + '.jpg'
                                            }
                                        >
                                            <div className={classes.collectionCardBottomHalf}>
                                                <h2
                                                    className={classes.collectionCardCollectionName}
                                                >
                                                    {collection.name}
                                                </h2>
                                                {collection.brief ? (
                                                    <div
                                                        className={
                                                            classes.collectionCardBriefWrapper
                                                        }
                                                    >
                                                        <p className={classes.collectionCardBrief}>
                                                            {collection.brief}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                                {(() => {
                                                    const collectionStatsWrapper = stats.find(
                                                        stat =>
                                                            stat.canister === collection.canister,
                                                    );

                                                    if (collectionStatsWrapper) {
                                                        if (collectionStatsWrapper.stats) {
                                                            const collectionStatDetails = [
                                                                {
                                                                    label: 'Volume',
                                                                    icon: Icp16Icon,
                                                                    value: icpToString(
                                                                        collectionStatsWrapper.stats
                                                                            .total,
                                                                        false,
                                                                        true,
                                                                    ),
                                                                },
                                                                {
                                                                    label: 'Listings',
                                                                    icon: undefined,
                                                                    value: collectionStatsWrapper
                                                                        .stats.listings,
                                                                },
                                                                {
                                                                    label: 'Floor Price',
                                                                    icon: Icp16Icon,
                                                                    value: icpToString(
                                                                        collectionStatsWrapper.stats
                                                                            .floor,
                                                                        false,
                                                                        true,
                                                                    ),
                                                                },
                                                            ];

                                                            return (
                                                                <div
                                                                    className={
                                                                        classes.collectionDetailsWrapper
                                                                    }
                                                                >
                                                                    {collectionStatDetails.map(
                                                                        (
                                                                            cellDetails,
                                                                            _index,
                                                                            fullArray,
                                                                        ) => (
                                                                            <ChipWithLabel
                                                                                key={
                                                                                    cellDetails.label
                                                                                }
                                                                                style={{
                                                                                    maxWidth: `${
                                                                                        100 /
                                                                                        fullArray.length
                                                                                    }%`,
                                                                                }}
                                                                                label={
                                                                                    cellDetails.label
                                                                                }
                                                                                icon={
                                                                                    cellDetails.icon
                                                                                }
                                                                                text={
                                                                                    cellDetails.value
                                                                                }
                                                                            />
                                                                        ),
                                                                    )}
                                                                </div>
                                                            );
                                                        } else {
                                                            return '';
                                                        }
                                                    } else {
                                                        return (
                                                            <ToniqIcon
                                                                style={{
                                                                    color: String(
                                                                        toniqColors.pagePrimary
                                                                            .foregroundColor,
                                                                    ),
                                                                    alignSelf: 'center',
                                                                }}
                                                                icon={LoaderAnimated24Icon}
                                                            />
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </NftCard>
                                    </Link>
                                );
                            })}
                        </div>
                    </WithFilterPanel>
                </div>
            </div>
        </>
    );
}
