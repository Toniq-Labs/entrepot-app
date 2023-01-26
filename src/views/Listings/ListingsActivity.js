import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import extjs from '../../ic/extjs.js';
import getNri from '../../ic/nftv.js';
import orderBy from 'lodash.orderby';
import {useNavigate} from 'react-router';
import {EntrepotNFTMintNumber, EntrepotGetIcpUsd} from '../../utils';
import {
    ToniqDropdown,
    ToniqMiddleEllipsis,
    ToniqIcon,
    ToniqPagination,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {
    ArrowsSortAscending24Icon,
    ArrowsSortDescending24Icon,
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {NftCard} from '../../shared/NftCard.js';
import Timestamp from 'react-timestamp';
import chunk from 'lodash.chunk';
import {StateContainer} from '../../components/shared/StateContainer.js';
import moment from 'moment';
import PriceUSD from '../../components/PriceUSD.js';
import {getExtCanisterId} from '../../typescript/data/canisters/canister-details/wrapped-canister-ids';

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

export default function ListingsActivity(props) {
    const classes = useStyles();

    const {
        collection,
        setSort,
        storeUserPreferences,
        sort,
        sortOptions,
        sortType,
        setSortType,
        query,
    } = props;

    const [
        listings,
        setListings,
    ] = useState(false);

    const [
        activityPage,
        setActivityPage,
    ] = useState(0);

    const navigate = useNavigate();

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
                    collectionId: getExtCanisterId(canister),
                    nftIndex: index,
                    nftId: listing.token,
                    cachePriority: 0,
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

    function getIcpPrice(n) {
        n = Number(n) / 100000000;
        return n.toFixed(8).replace(/0{1,6}$/, '');
    }

    useInterval(_updates, 60 * 1000);

    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
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
                            sortType === 'asc' ? setSortType('desc') : setSortType('asc');
                            storeUserPreferences('sortType', sortType === 'asc' ? 'desc' : 'asc');
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
                                collectionId={listing.collectionId}
                                nftIndex={listing.nftIndex}
                                nftId={listing.nftId}
                                cachePriority={listing.cachePriority}
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
                                                {getIcpPrice(listing.price)} ICP&nbsp;(
                                                <PriceUSD
                                                    price={EntrepotGetIcpUsd(listing.price)}
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
    );
}
