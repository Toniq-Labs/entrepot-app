import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import extjs from '../../ic/extjs.js';
import getNri from '../../ic/nftv.js';
import orderBy from 'lodash.orderby';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import PriceICP from '../../components/PriceICP';
import CollectionDetails from '../../components/CollectionDetails';
import {EntrepotNFTImage, EntrepotNFTMintNumber, EntrepotGetIcpUsd} from '../../utils';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import {StyledTab, StyledTabs} from '../../components/shared/PageTab.js';
import {WithFilterPanel} from '../../shared/WithFilterPanel.js';
import {
    ToniqInput,
    ToniqDropdown,
    ToniqMiddleEllipsis,
    ToniqIcon,
    ToniqPagination,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {useLocation, useSearchParams} from 'react-router-dom';
import {
    ArrowsSortAscending24Icon,
    ArrowsSortDescending24Icon,
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    Search24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {NftCard} from '../../shared/NftCard.js';
import {getEXTCanister} from '../../utilities/load-tokens.js';
import PriceUSD from '../../components/PriceUSD.js';
import Timestamp from 'react-timestamp';
import chunk from 'lodash.chunk';
import {StateContainer} from '../../components/shared/StateContainer.js';
import moment from 'moment';

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
    return c.length === 27 && c.split('-').length === 5;
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
        [theme.breakpoints.down('sm')]: {
            paddingBottom: '16px',
        },
    },
    listRowHeader: {
        display: 'flex',
        backgroundColor: toniqColors.accentSecondary.backgroundColor,
        borderRadius: '8px',
        padding: '0 16px',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    activityInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        maxHeight: '64px',
        alignItems: 'center',
        flexGrow: 1,
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'start',
            ...cssToReactStyleObject(toniqFontStyles.labelFont),
        },
    },
    hideWhenMobile: {
        [theme.breakpoints.down('sm')]: {
            display: 'none !important',
        },
    },
    hideWhenTablet: {
        [theme.breakpoints.down('md')]: {
            display: 'none !important',
        },
    },
    showWhenMobile: {
        display: 'none',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            alignItems: 'center',
        },
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
    shadowWrapper: {
        display: 'flex',
        width: '100%',
        gap: 24,
        height: 40,
        [theme.breakpoints.down('sm')]: {
            gap: 12,
        },
    },
    sortWrapper: {
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mobileControlWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    contentWrapper: {
        marginTop: 16,
        [theme.breakpoints.down('sm')]: {
            marginTop: 8,
        },
    },
}));

var userPreferences;
var storageKey = 'userPreferences';

const defaultSortOption = {
    value: {
        type: 'time',
    },
    label: 'Time',
};

const defaultSortType = 'asc';

const sortOptions = [
    defaultSortOption,
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

export default function ListingsActivity(props) {
    const params = useParams();
    const classes = useStyles();
    const location = useLocation();

    const getCollectionFromRoute = r => {
        if (_isCanister(r)) {
            return props.collections.find(e => e.canister === r);
        } else {
            return props.collections.find(e => e.route === r);
        }
    };

    const [
        listings,
        setListings,
    ] = useState(false);
    const [collection] = useState(getCollectionFromRoute(params?.route, props.collections));

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

    const currentCanister = getCollectionFromRoute(params?.route).canister;
    userPreferences = localStorage.getItem(`${storageKey}${location.pathname}${currentCanister}`);
    if (userPreferences) {
        userPreferences = JSON.parse(userPreferences);
    } else {
        userPreferences = {
            sortOption: defaultSortOption,
            sortType: defaultSortType,
        };
        storeUserPreferences(false, userPreferences);
    }

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();
    const query = searchParams.get('search') || '';
    const [
        sort,
        setSort,
    ] = useState(userPreferences.sortOption || defaultSortOption);
    const [
        sortType,
        setSortType,
    ] = useState(userPreferences.sortType || defaultSortType);
    const [
        activityPage,
        setActivityPage,
    ] = useState(0);

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
                    style={{display: 'flex', justifyContent: 'space-between', flexGrow: 1, gap: 16}}
                >
                    <div className={classes.activityInfoContainer} style={{...style}}>
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
                                minWidth: 150,
                            }}
                            className={classes.hideWhenMobile}
                        >
                            {items[3]}
                        </div>
                    </div>
                    <div
                        className={`${classes.activityInfoContainer} ${classes.hideWhenMobile}`}
                        style={{justifyContent: 'end', ...style}}
                    >
                        <div
                            style={{
                                width: 180,
                            }}
                            className={classes.hideWhenMobile}
                        >
                            {items[4]}
                        </div>
                        <div
                            style={{
                                width: 180,
                            }}
                            className={classes.hideWhenMobile}
                        >
                            {items[5]}
                        </div>
                        <div
                            style={{
                                width: 250,
                            }}
                            className={classes.hideWhenTablet}
                        >
                            {items[6]}
                        </div>
                        <div
                            style={{
                                width: 120,
                            }}
                            className={classes.hideWhenTablet}
                        >
                            {items[7]}
                        </div>
                    </div>
                    <div className={classes.showWhenMobile}>{items[7]}</div>
                </div>
            </div>
        );
    }

    const _updates = async () => {
        await refresh();
    };

    const refresh = async canister => {
        canister = canister ?? collection?.canister;

        try {
            var result = await fetch(
                'https://us-central1-entrepot-api.cloudfunctions.net/api/canister/' +
                    canister +
                    '/transactions',
            ).then(r => r.json());
            var listings = result.map(listing => {
                const {index, canister} = extjs.decodeTokenId(listing.token);
                const rarity = Number((getNri(canister, index) * 100).toFixed(1));
                const mintNumber = EntrepotNFTMintNumber(canister, index);

                return {
                    ...listing,
                    image: EntrepotNFTImage(
                        getEXTCanister(canister),
                        index,
                        listing.token,
                        false,
                        0,
                    ),
                    rarity,
                    mintNumber,
                };
            });

            setListings(listings);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredStatusListings = listings
        ? listings
              .filter(
                  (listing, listingIndex) =>
                      listings.findIndex(list => list.id === listing.id) === listingIndex,
              )
              .filter(listing => listing.token !== '')
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
            return query === '' || inQuery;
        }),
        [
            value => {
                if (sort.value.type === 'time') {
                    return new moment.unix(Number(value[sort.value.type] / 1000000000)).format(
                        'YYYYMMDD',
                    );
                }

                return value[sort.value.type];
            },
        ],
        [sortType],
    );

    const activity = chunk(filteredAndSortedListings, 9);
    const activityListing = activity[activityPage];

    useInterval(_updates, 60 * 1000);

    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{minHeight: 'calc(100vh - 221px)'}}>
            <div style={{margin: '0 auto'}}>
                <CollectionDetails collection={collection} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <StyledTabs
                    value={'activity'}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, tab) => {
                        if (tab === 'nfts') navigate(`/marketplace/${collection?.route}/`);
                    }}
                >
                    <StyledTab value="nfts" label="NFTs" />
                    <StyledTab value="activity" label="Activity" />
                </StyledTabs>
                <WithFilterPanel
                    noFilters={true}
                    otherControlsChildren={
                        <div className={classes.shadowWrapper}>
                            <ToniqInput
                                value={query}
                                style={{
                                    flexGrow: '1',
                                }}
                                className="toniq-input-outline"
                                placeholder="Search for mint # or token ID..."
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
                            <div className={`${classes.hideWhenMobile} ${classes.sortWrapper}`}>
                                <button
                                    className={classes.toggleSort}
                                    onClick={() => {
                                        sortType === 'asc'
                                            ? setSortType('desc')
                                            : setSortType('asc');
                                        storeUserPreferences(
                                            'sortType',
                                            sortType === 'asc' ? 'desc' : 'asc',
                                        );
                                    }}
                                >
                                    {sortType === 'asc' ? (
                                        <ToniqIcon icon={ArrowsSortAscending24Icon} />
                                    ) : (
                                        <ToniqIcon icon={ArrowsSortDescending24Icon} />
                                    )}
                                </button>
                                <ToniqDropdown
                                    style={{
                                        '--toniq-accent-secondary-background-color': 'transparent',
                                        width: 'unset',
                                    }}
                                    selected={sort}
                                    onSelectChange={event => {
                                        setSort(event.detail);
                                        storeUserPreferences('sortOption', event.detail);
                                    }}
                                    options={sortOptions}
                                />
                            </div>
                        </div>
                    }
                >
                    <div className={classes.contentWrapper}>
                        <div className={classes.mobileControlWrapper}>
                            <span
                                style={{
                                    display: 'flex',
                                    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
                                    color: toniqColors.pageSecondary.foregroundColor,
                                }}
                            >
                                NFTs&nbsp;{listings ? `(${filteredAndSortedListings.length})` : ''}
                            </span>
                            <div className={classes.sortWrapper}>
                                <button
                                    className={classes.toggleSort}
                                    onClick={() => {
                                        sortType === 'asc'
                                            ? setSortType('desc')
                                            : setSortType('asc');
                                        storeUserPreferences(
                                            'sortType',
                                            sortType === 'asc' ? 'desc' : 'asc',
                                        );
                                    }}
                                >
                                    {sortType === 'asc' ? (
                                        <ToniqIcon icon={ArrowsSortAscending24Icon} />
                                    ) : (
                                        <ToniqIcon icon={ArrowsSortDescending24Icon} />
                                    )}
                                </button>
                                <ToniqDropdown
                                    style={{
                                        '--toniq-accent-secondary-background-color': 'transparent',
                                        width: 'unset',
                                    }}
                                    selected={sort}
                                    onSelectChange={event => {
                                        setSort(event.detail);
                                        storeUserPreferences('sortOption', event.detail);
                                    }}
                                    options={sortOptions}
                                />
                            </div>
                        </div>
                        {filteredAndSortedListings.length ? (
                            <div className={classes.listRowContainer}>
                                <div className={classes.listRowHeader}>
                                    <ListRow
                                        items={[
                                            true,
                                            'MINT #',
                                            'NRI',
                                            'PRICE',
                                            'FROM',
                                            'TO',
                                            'DATE',
                                            'TIME',
                                        ]}
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
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignContent: 'center',
                                                                justifyContent: 'left',
                                                            }}
                                                        >
                                                            <PriceICP
                                                                large={false}
                                                                volume={true}
                                                                clean={false}
                                                                price={listing.price}
                                                            />
                                                            &nbsp; (
                                                            <PriceUSD
                                                                price={EntrepotGetIcpUsd(
                                                                    listing.price,
                                                                )}
                                                            />
                                                            )
                                                        </div>,
                                                        listing.seller ? (
                                                            <ToniqMiddleEllipsis
                                                                externalLink={`https://icscan.io/account/${listing.seller}`}
                                                                letterCount={5}
                                                                text={listing.seller}
                                                            />
                                                        ) : (
                                                            '-'
                                                        ),
                                                        listing.buyer ? (
                                                            <ToniqMiddleEllipsis
                                                                externalLink={`https://icscan.io/account/${listing.buyer}`}
                                                                letterCount={5}
                                                                text={listing.buyer}
                                                            />
                                                        ) : (
                                                            '-'
                                                        ),
                                                        moment
                                                            .unix(Number(listing.time / 1000000000))
                                                            .format('MMMM D, YYYY (h:mm a)'),
                                                        <Timestamp
                                                            relative
                                                            autoUpdate
                                                            date={Number(listing.time / 1000000000)}
                                                            style={{
                                                                ...cssToReactStyleObject(
                                                                    toniqFontStyles.boldParagraphFont,
                                                                ),
                                                            }}
                                                        />,
                                                    ]}
                                                />
                                            </>
                                        </NftCard>
                                    );
                                })}
                            </div>
                        ) : (
                            ''
                        )}
                        <StateContainer show={listings && !filteredAndSortedListings.length}>
                            No Result
                        </StateContainer>
                        <StateContainer show={!listings}>
                            <ToniqIcon icon={LoaderAnimated24Icon} />
                            &nbsp;Loading...
                        </StateContainer>
                        <div className={classes.pagination}>
                            <ToniqPagination
                                currentPage={activityPage + 1}
                                pageCount={activity.length}
                                pagesShown={6}
                                onPageChange={event => {
                                    setActivityPage(event.detail - 1);
                                }}
                                onNext={event => {
                                    setActivityPage(event.detail - 1);
                                }}
                                onPrevious={event => {
                                    setActivityPage(event.detail - 1);
                                }}
                            />
                        </div>
                    </div>
                </WithFilterPanel>
            </div>
        </div>
    );
}
