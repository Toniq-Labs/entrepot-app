import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MuiTooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Timestamp from 'react-timestamp';
import {Link} from 'react-router-dom';
import Favourite from './Favourite';
import PriceICP from './PriceICP';
import getNri from '../ic/nftv.js';
import {makeStyles} from '@material-ui/core';
import {EntrepotEarnDetails} from '../utils';
import {
    CanisterWrappedType,
    isWrappedType,
    getExtCanisterId,
} from '../typescript/data/canisters/canister-details/wrapped-canister-id';
import {defaultEntrepotApi} from '../typescript/api/entrepot-apis/entrepot-data-api';
import {treasureCanisterId} from '../typescript/data/canisters/treasure-canister';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {getExtNftId, decodeNftId} from '../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../typescript/data/nft/user-nft';
import {entrepotCanisters} from '../typescript/api/entrepot-apis/entrepot-canisters';

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
    smallGrid: {
        width: '300px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    bigGrid: {
        width: '200px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

export default function NFT(props) {
    const classes = useStyles();
    const tokenid = props.tokenid;
    const {index, canister} = decodeNftId(tokenid);
    const nri = getNri(canister, index);
    const [
        metadata,
        setMetadata,
    ] = React.useState(false);
    const [
        ref,
        setRef,
    ] = React.useState(0);
    const [
        isNotEXT,
    ] = React.useState(isWrappedType(canister, CanisterWrappedType.UnwrappedOriginal));
    const [
        listing,
        setListing,
    ] = React.useState(props.listing);
    const [
        offerCount,
        setOfferCount,
    ] = React.useState(0);
    const [
        offer,
        setOffer,
    ] = React.useState(false);
    const [
        auction,
        setAuction,
    ] = React.useState(false);
    const [
        showOfferCount,
        setShowOfferCount,
    ] = React.useState(false);
    const [
        imgLoaded,
        setImgLoaded,
    ] = React.useState(false);
    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);
    const [
        currentBtn,
        setCurrentBtn,
    ] = React.useState(null);
    const [
        currentBtnText,
        setCurrentBtnText,
    ] = React.useState(false);
    const [
        earnCollections,
    ] = React.useState(props.collections.filter(a => a.earn == true).map(a => a.id));

    const getCollection = c => {
        if (typeof props.collections.find(e => e.canister === c) == 'undefined') return {};
        return props.collections.find(e => e.canister === c);
    };
    const getListing = () => {
        if (isNotEXT) return setListing(false);
        defaultEntrepotApi
            .token(canister)
            .listings()
            .then(r => {
                var f = r.find(a => a[0] == index);
                if (f[1]) setListing(f[1]);
                else setListing(false);
            });
    };
    const getMetadata = async () => {
        var md = await defaultEntrepotApi.token(tokenid).getMetadata();
        if (typeof md != 'undefined' && md.type == 'nonfungible') {
            setMetadata(md.metadata[0]);
        }
    };
    const getAuction = async () => {
        var resp = await entrepotCanisters.nftAuctions.auction(getExtNftId(tokenid));
        if (resp.length) setAuction(resp[0]);
        else setAuction(false);
    };
    const getOffer = async () => {
        await entrepotCanisters.nftOffers.offers(getExtNftId(tokenid)).then(r => {
            setOfferCount(r.length);
            setOffer(r.sort((a, b) => Number(b.amount) - Number(a.amount))[0]);
        });
    };
    useInterval(() => {
        refresh();
    }, 60 * 1000);

    React.useEffect(() => {
        if (typeof props.listing == 'undefined') {
            getListing();
        }
        getOffer();
        getAuction();
        getMetadata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        if (props.listing) setListing(props.listing);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.listing]);
    const styles = {
        avatarSkeletonContainer: {
            height: 0,
            overflow: 'hidden',
            paddingTop: '100%',
            position: 'relative',
        },
        avatarLoader: {
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
            margin: '0 auto',
        },
        avatarImg: {
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            objectFit: 'contain',
            borderRadius: '50px',
        },
    };
    const _isLocked = () => {
        if (typeof listing == 'undefined') return false;
        if (!listing) return false;
        if (typeof listing.locked == 'undefined') return false;
        if (listing.locked.length === 0) return false;
        if (Date.now() >= Number(listing.locked[0] / 1000000n)) return false;
        return true;
    };

    const refresh = async () => {
        await getOffer();
        await getAuction();
        await getMetadata();
        if (canister == 'yrdz3-2yaaa-aaaah-qcvpa-cai') {
            console.log('updated');
            setRef(ref + 1);
        }
    };
    const buy = async () => {
        return props.buy(canister, index, listing, props.afterBuy);
    };
    const buttonLoader = enabled => {
        if (enabled) setCurrentBtnText(true);
        else setCurrentBtnText(false);
    };
    const buttonPush = btn => {
        var clicker = btn;
        if (typeof btn == 'number') {
            setCurrentBtn(btn);
            clicker = getButtons()[btn][1];
        }
        clicker();
    };
    const transferRefresh = async () => {
        props.hideNft(tokenid);
        await props.refresh('/collected');
    };
    const transferRefreshEarn = async () => {
        props.hideNft(tokenid);
        await props.refresh('/earn-requests');
    };
    var buttonLoadingText = <CircularProgress size={20.77} style={{color: 'white', margin: 1}} />;
    const getButtons = () => {
        var buttons = [];
        if (props.view == 'new-request') {
            if (!listing && earnCollections.indexOf(canister) >= 0) {
                buttons.push([
                    'Select',
                    () =>
                        props.pawnNft(
                            {id: tokenid, canister: canister, listing: listing},
                            props.loader,
                            transferRefreshEarn,
                        ),
                ]);
                //buttons.push([(currentBtn == 1 && currentBtnText ? buttonLoadingText : "Transfer"), () => props.transferNft({id : tokenid, listing:listing}, props.loader, transferRefresh)]);
            }
        } else {
            if (listing) {
                // Contains a listing, must be EXT
                buttons.push([
                    currentBtn == 0 && currentBtnText ? buttonLoadingText : 'Update',
                    () => props.listNft({id: tokenid, listing: listing}, buttonLoader, refresh),
                ]);
                buttons.push([
                    currentBtn == 1 && currentBtnText ? buttonLoadingText : 'Transfer',
                    () =>
                        props.transferNft(
                            {id: tokenid, listing: listing},
                            props.loader,
                            transferRefresh,
                        ),
                ]);
            } else {
                if (isNotEXT) {
                    // Non EXT
                    buttons.push([
                        currentBtn == 0 && currentBtnText ? buttonLoadingText : 'Sell',
                        () =>
                            props.wrapAndListNft(
                                {id: tokenid, listing: listing},
                                props.loader,
                                props.refresh,
                            ),
                    ]);
                    buttons.push([
                        currentBtn == 1 && currentBtnText ? buttonLoadingText : 'Transfer',
                        () =>
                            props.transferNft(
                                {id: tokenid, listing: listing},
                                props.loader,
                                transferRefresh,
                            ),
                    ]);
                } else if (isWrappedType(canister, CanisterWrappedType.WrappedExt)) {
                    // EXT Wrapper
                    buttons.push([
                        currentBtn == 0 && currentBtnText ? buttonLoadingText : 'Sell',
                        () => props.listNft({id: tokenid, listing: listing}, buttonLoader, refresh),
                    ]);
                    buttons.push([
                        'Transfer',
                        () =>
                            props.transferNft(
                                {id: tokenid, listing: listing},
                                props.loader,
                                transferRefresh,
                            ),
                    ]);
                    buttons.push([
                        'Unwrap',
                        () =>
                            props.unwrapNft(
                                {id: tokenid, listing: listing},
                                props.loader,
                                transferRefresh,
                            ),
                    ]);
                } else {
                    //EXT only no wrapper
                    buttons.push([
                        currentBtn == 0 && currentBtnText ? buttonLoadingText : 'Sell',
                        () => props.listNft({id: tokenid, listing: listing}, buttonLoader, refresh),
                    ]);
                    buttons.push([
                        currentBtn == 1 && currentBtnText ? buttonLoadingText : 'Transfer',
                        () =>
                            props.transferNft(
                                {id: tokenid, listing: listing},
                                props.loader,
                                transferRefresh,
                            ),
                    ]);
                }
                //Custom
                if (canister == 'poyn6-dyaaa-aaaah-qcfzq-cai' && index >= 25000 && index < 30000) {
                    buttons.push([
                        'Open',
                        () =>
                            props.unpackNft(
                                {id: tokenid, listing: listing, canister: canister},
                                props.loader,
                                transferRefresh,
                            ),
                    ]);
                }
                if (
                    canister == 'yrdz3-2yaaa-aaaah-qcvpa-cai' &&
                    metadata &&
                    metadata.length == 4 &&
                    Date.now() >= 1647788400000
                ) {
                    buttons.push([
                        'Hatch',
                        () =>
                            props.unpackNft(
                                {id: tokenid, listing: listing, canister: canister},
                                props.loader,
                                refresh,
                            ),
                    ]);
                }
                if (earnCollections.indexOf(canister) >= 0) {
                    buttons.push([
                        'Toniq Earn',
                        () =>
                            props.pawnNft(
                                {id: tokenid, canister: canister, listing: listing},
                                props.loader,
                                transferRefreshEarn,
                            ),
                    ]);
                }
                if (
                    canister == '6wih6-siaaa-aaaah-qczva-cai' &&
                    !metadata &&
                    Date.now() >= 1650034800000
                ) {
                    buttons.push([
                        'Cash Out',
                        () =>
                            props.unpackNft(
                                {id: tokenid, listing: listing, canister: canister},
                                buttonLoader,
                                refresh,
                            ),
                    ]);
                }
            }
        }
        return buttons;
    };
    const mintNumber = () => {
        return getNftMintNumber({
            collectionId: canister,
            nftIndex: index,
        });
    };
    const collection = getCollection(canister);
    const showWrapped = () => {
        if (isNotEXT)
            return (
                <span
                    style={{
                        fontSize: '.9em',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        fontWeight: 'bold',
                        color: 'black',
                        backgroundColor: '#00b894',
                        padding: '2px',
                    }}
                >
                    UNWRAPPED
                </span>
            );
        else return '';
    };
    var t = [
        'Common',
        'Uncommon',
        'Rare',
        'Epic',
        'Legendary',
        'Mythic',
    ];
    const showNri = () => {
        if (typeof nri == 'undefined') return '';
        if (nri === false) return '';
        if (canister == 'poyn6-dyaaa-aaaah-qcfzq-cai') {
            if (!metadata) return '';
            return metadata.nonfungible.metadata[0][0] === 0
                ? 'Pack'
                : '#' +
                      metadata.nonfungible.metadata[0][0] +
                      ' - ' +
                      t[metadata.nonfungible.metadata[0][1]];
        }
        var collection = getCollection(canister);
        if (collection.nftv) {
            return (
                <MuiTooltip
                    title={
                        'NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific ' +
                        collection.unit +
                        ' relative to others. It does not include Mint #, Twin Status or Animation within the index.'
                    }
                >
                    <span>NRI: {(nri * 100).toFixed(1)}%</span>
                </MuiTooltip>
            );
        } else return '';
    };

    return (
        <Grid
            className={props.gridSize === 'small' ? classes.smallGrid : classes.bigGrid}
            style={{display: 'flex'}}
            item
        >
            <Card
                onMouseOver={() => setShowOfferCount(true)}
                onMouseOut={() => setShowOfferCount(false)}
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                <Link
                    style={{textDecoration: 'none', color: 'inherit'}}
                    to={`/marketplace/asset/` + getExtNftId(tokenid)}
                >
                    <EntrepotNftDisplayReact
                        collection={getExtCanisterId(canister)}
                        nftIndex={index}
                        nftId={tokenid}
                        fullSize={false}
                        ref={ref}
                        cachePriority={collection.priority}
                    />
                    {offerCount > 0 ? (
                        <Chip
                            style={{
                                cursor: 'pointer',
                                display: showOfferCount ? 'block' : 'none',
                                fontSize: '13px',
                                paddingTop: 2,
                                marginTop: '-30px',
                                position: 'absolute',
                                left: '5px',
                                color: 'white',
                            }}
                            size="small"
                            color="primary"
                            label={offerCount + ' Offer' + (offerCount > 1 ? 's' : '')}
                        />
                    ) : (
                        ''
                    )}
                    <CardContent style={{height: 110, padding: '10px 16px'}}>
                        {showWrapped()}
                        <Grid container>
                            <Grid item xs={12}>
                                <div
                                    className="nft-rarity-hook"
                                    data-token={index}
                                    data-canister={canister}
                                    style={{
                                        padding: '5px 0',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textAlign: 'left',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    {showNri()}
                                </div>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                <Typography
                                    style={{
                                        fontSize: 11,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    }}
                                    color={'inherit'}
                                    gutterBottom
                                >
                                    <MuiTooltip title="View in browser">
                                        <span>{'#' + mintNumber()}</span>
                                    </MuiTooltip>
                                </Typography>
                            </Grid>
                            {auction ? (
                                <>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography
                                            style={{
                                                fontSize: 13,
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                            }}
                                            color={'inherit'}
                                            gutterBottom
                                        >
                                            {auction.bids.length === 0
                                                ? 'Auction Reserve'
                                                : 'Leading Bid'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            style={{
                                                fontSize: 13,
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                            }}
                                            color={'inherit'}
                                            gutterBottom
                                        >
                                            <PriceICP
                                                price={
                                                    auction.bids.length === 0
                                                        ? auction.reserve
                                                        : auction.bids[auction.bids.length - 1]
                                                              .amount
                                                }
                                            />
                                        </Typography>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    {listing ? (
                                        <>
                                            <Grid item md={6} sm={6} xs={6}>
                                                <Typography
                                                    style={{
                                                        fontSize: 13,
                                                        textAlign: 'right',
                                                        fontWeight: 'bold',
                                                    }}
                                                    color={'inherit'}
                                                    gutterBottom
                                                >
                                                    Price
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography
                                                    style={{
                                                        fontSize: 13,
                                                        textAlign: 'right',
                                                        fontWeight: 'bold',
                                                    }}
                                                    color={'inherit'}
                                                    gutterBottom
                                                >
                                                    <PriceICP price={listing.price} />
                                                </Typography>
                                            </Grid>
                                            {offer ? (
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        fontSize: '.8em',
                                                        textAlign: 'right',
                                                        color: '#',
                                                    }}
                                                >
                                                    Best <PriceICP size={13} price={offer.amount} />
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {offer ? (
                                                <>
                                                    <Grid item md={6} sm={6} xs={6}>
                                                        <Typography
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'right',
                                                                fontWeight: 'bold',
                                                            }}
                                                            color={'inherit'}
                                                            gutterBottom
                                                        >
                                                            Best Offer
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'right',
                                                                fontWeight: 'bold',
                                                            }}
                                                            color={'inherit'}
                                                            gutterBottom
                                                        >
                                                            <PriceICP price={offer.amount} />
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>
                                                    <Grid item md={6} sm={6} xs={6}>
                                                        <Typography
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'right',
                                                                fontWeight: 'bold',
                                                            }}
                                                            color={'inherit'}
                                                            gutterBottom
                                                        >
                                                            Unlisted
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'right',
                                                                fontWeight: 'bold',
                                                            }}
                                                            color={'inherit'}
                                                            gutterBottom
                                                        >
                                                            -
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                            {typeof props.view !== 'undefined' &&
                            props.view == 'marketplace' &&
                            canister === treasureCanisterId ? (
                                <Grid item xs={12}>
                                    {EntrepotEarnDetails(tokenid, listing.price)}
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    </CardContent>
                </Link>
                {typeof props.view !== 'undefined' &&
                [
                    'collected',
                    'selling',
                    'offers-received',
                    'new-request',
                    'earn-nfts',
                ].indexOf(props.view) >= 0 ? (
                    <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {props.loggedIn ? (
                            <Grid
                                justifyContent="center"
                                direction="row"
                                alignItems="center"
                                container
                                spacing={1}
                            >
                                {getButtons().length > 0 ? (
                                    <>
                                        <Grid style={{width: '100%'}} item lg={6} md={6}>
                                            <Button
                                                onMouseDown={e => e.stopPropagation()}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    buttonPush(0);
                                                }}
                                                size={'small'}
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                style={{backgroundColor: '#003240', color: 'white'}}
                                            >
                                                {getButtons()[0][0]}
                                            </Button>
                                        </Grid>
                                        {getButtons().length == 2 ? (
                                            <Grid style={{width: '100%'}} item lg={6} md={6}>
                                                <Button
                                                    onMouseDown={e => e.stopPropagation()}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        buttonPush(1);
                                                    }}
                                                    size={'small'}
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    style={{
                                                        backgroundColor: '#003240',
                                                        color: 'white',
                                                    }}
                                                >
                                                    {getButtons()[1][0]}
                                                </Button>
                                            </Grid>
                                        ) : (
                                            <>
                                                {getButtons().length > 2 ? (
                                                    <Grid
                                                        style={{width: '100%'}}
                                                        item
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <Button
                                                            onMouseDown={e => e.stopPropagation()}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                setAnchorEl(e.currentTarget);
                                                            }}
                                                            size={'small'}
                                                            fullWidth
                                                            variant="contained"
                                                            color="primary"
                                                            style={{
                                                                backgroundColor: '#003240',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            More
                                                        </Button>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            getContentAnchorEl={null}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={() => setAnchorEl(null)}
                                                        >
                                                            {getButtons()
                                                                .slice(1)
                                                                .map((a, i) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={i}
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                setAnchorEl(null);
                                                                                buttonPush(a[1]);
                                                                            }}
                                                                        >
                                                                            {a[0]}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                        </Menu>
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    ''
                                )}
                            </Grid>
                        ) : (
                            ''
                        )}
                    </CardActions>
                ) : (
                    <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {listing && props.loggedIn ? (
                            <>
                                {_isLocked() ? (
                                    <span style={{display: 'block'}}>
                                        Unlocks{' '}
                                        <Timestamp
                                            relative
                                            autoUpdate
                                            date={Number(listing.locked[0] / 1000000000n)}
                                        />
                                    </span>
                                ) : (
                                    <Button
                                        onClick={ev => {
                                            ev.stopPropagation();
                                            buy();
                                        }}
                                        onMouseDown={ev => ev.stopPropagation()}
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        style={{
                                            marginRight: 'auto',
                                            backgroundColor: '#003240',
                                            color: 'white',
                                        }}
                                    >
                                        Buy Now
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                                {auction ? (
                                    <span style={{display: 'block'}}>
                                        Auction ends{' '}
                                        <Timestamp
                                            relative
                                            autoUpdate
                                            date={Number(auction.end / 1000000000n)}
                                        />
                                    </span>
                                ) : (
                                    ''
                                )}
                            </>
                        )}
                        <Favourite
                            refresher={props.faveRefresher}
                            identity={props.identity}
                            loggedIn={props.loggedIn}
                            tokenid={tokenid}
                        />
                    </CardActions>
                )}
            </Card>
        </Grid>
    );
}
