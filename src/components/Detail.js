/* global BigInt */
import React, {useState} from 'react';
import {
    makeStyles,
    Container,
    Grid,
    Typography,
    Button,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    IconButton,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons//Dashboard';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import GavelIcon from '@material-ui/icons/Gavel';
import PeopleIcon from '@material-ui/icons/People';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShopIcon from '@material-ui/icons/Shop';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import ListIcon from '@material-ui/icons/List';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import DetailsIcon from '@material-ui/icons/Details';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Timestamp from 'react-timestamp';
import Favourite from './Favourite';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import Alert from '@material-ui/lab/Alert';
import OfferForm from './OfferForm';
import AuctionForm from './AuctionForm';
import {useNavigate} from 'react-router-dom';
import extjs from '../ic/extjs.js';
import {
    EntrepotNFTImage,
    EntrepotNFTLink,
    EntrepotNFTMintNumber,
    EntrepotDisplayNFT,
    EntrepotGetICPUSD,
    EntrepotGetOffers,
    EntrepotCollectionStats,
} from '../utils';
import {useParams} from 'react-router-dom';
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';
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
const api = extjs.connect('https://ic0.app/');

const TREASURECANISTER = 'yigae-jqaaa-aaaah-qczbq-cai';
const shorten = a => {
    return a.substring(0, 12) + '...';
};
const emptyListing = {
    pricing: '',
    img: '',
};

const _getRandomBytes = () => {
    var bs = [];
    for (var i = 0; i < 32; i++) {
        bs.push(Math.floor(Math.random() * 256));
    }
    return bs;
};
const Detail = props => {
    let {tokenid} = useParams();
    let {index, canister} = extjs.decodeTokenId(tokenid);
    const navigate = useNavigate();
    const [
        floor,
        setFloor,
    ] = React.useState(
        EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '',
    );
    const [
        expandLicense,
        setExpandLicense,
    ] = React.useState(false);
    const [
        license,
        setLicense,
    ] = React.useState(false);
    const [
        listing,
        setListing,
    ] = React.useState(false);
    const [
        detailsUrl,
        setDetailsUrl,
    ] = React.useState(false);
    const [
        transactions,
        setTransactions,
    ] = React.useState(false);
    const [
        owner,
        setOwner,
    ] = React.useState(false);
    const [
        auction,
        setAuction,
    ] = React.useState(false);
    const [
        offers,
        setOffers,
    ] = React.useState(false);
    const [
        openOfferForm,
        setOpenOfferForm,
    ] = React.useState(false);
    const [
        openAuctionForm,
        setOpenAuctionForm,
    ] = React.useState(false);
    const collection = props.collections.find(e => e.canister === canister);
    const [
        motokoContent,
        setMotokoContent,
    ] = useState('');
    const [
        overrideDetailPage,
        setOverrideDetailPage,
    ] = React.useState(false);

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const classes = useStyles();
    const reloadOffers = async () => {
        var os = await api.canister('fcwhh-piaaa-aaaak-qazba-cai').offers(tokenid);
        setOffers(os.sort((a, b) => Number(b.amount) - Number(a.amount)));
    };
    const reloadAuction = async () => {
        var resp = await api.canister('ffxbt-cqaaa-aaaak-qazbq-cai').auction(tokenid);
        if (resp.length) setAuction(resp[0]);
        else setAuction(false);
    };
    const cancelListing = () => {
        props.list(tokenid, 0, props.loader, _afterList);
    };
    const _refresh = async () => {
        reloadOffers();
        reloadAuction();
        getLicense();
        try {
            await fetch('https://us-central1-entrepot-api.cloudfunctions.net/api/token/' + tokenid)
                .then(r => r.json())
                .then(r => {
                    setListing({
                        price: BigInt(r.price),
                        time: r.time,
                    });
                    setOwner(r.owner);
                    setTransactions(r.transactions);
                });
        } catch (e) {
            //console.log(e);
        }
        let {index, canister} = extjs.decodeTokenId(tokenid);
        if (canister === '7i54s-nyaaa-aaaal-abomq-cai ')
            try {
                let x = await fetch(EntrepotNFTImage(canister, index, tokenid, true));
                let contentType = x.headers.get('Content-Type');
                if (contentType === 'image/svg+xml') {
                    setOverrideDetailPage('asset_canisters');
                } else {
                    setOverrideDetailPage('videos_that_dont_fit_in_frame');
                }
            } catch (e) {}
        // let {index, canister} = extjs.decodeTokenId(tokenid);
        // if (canister === 'ugdkf-taaaa-aaaak-acoia-cai') {
        //   await fetch(
        //     `https://api.allorigins.win/get?url=${encodeURIComponent(
        //       EntrepotNFTImage(canister, index, tokenid, true),
        //     )}`,
        //   )
        //     .then(response => {
        //       if (response.ok) return response.json();
        //       throw new Error('Network response was not ok.');
        //     })
        //     .then(data => {
        //       // Overriding Motoko styling
        //       const content = data.contents;
        //       setMotokoContent(content);
        //     });
        // }
    };
    const _afterList = async () => {
        await _refresh();
    };
    const _afterBuy = async () => {
        await _refresh();
    };
    const closeOfferForm = () => {
        _refresh();
        setOpenOfferForm(false);
    };
    const getLicense = async () => {
        if (!license || license == 'Coming soon!') {
            try {
                var resp = await extjs
                    .connect('https://ic0.app/')
                    .canister(extjs.decodeTokenId(tokenid).canister, 'license')
                    .license(tokenid);
                if (resp.hasOwnProperty('ok')) {
                    setLicense(resp.ok);
                } else throw '';
            } catch (e) {
                setLicense('Coming soon!');
            }
        }
    };
    const closeAuctionForm = () => {
        _refresh();
        setOpenAuctionForm(false);
    };
    const getFloorDelta = amount => {
        if (!floor) return '-';
        var fe = floor * 100000000;
        var ne = Number(amount);
        if (ne > fe) {
            return (((ne - fe) / ne) * 100).toFixed(2) + '% above';
        } else if (ne < fe) {
            return ((1 - ne / fe) * 100).toFixed(2) + '% below';
        } else return '-';
    };
    const gmtOffset = () => {
        var offset = new Date().getTimezoneOffset();
        var sign = offset < 0 ? '+' : '-';
        offset = Math.abs(offset);
        return 'GMT' + sign + ((offset / 60) | 0) + (offset % 60 != 0 ? offset % 60 : '');
    };
    const placeBid = async () => {
        //TODO
        setOpenAuctionForm(true);
    };
    const makeOffer = async () => {
        setOpenOfferForm(true);
    };

    useInterval(_refresh, 10 * 1000);
    useInterval(() => {
        var nf = EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '';
        setFloor(nf);
    }, 10 * 1000);

    const cancelOffer = async () => {
        props.loader(true, 'Cancelling offer...');
        const _api = extjs.connect('https://ic0.app/', props.identity);
        await _api.canister('fcwhh-piaaa-aaaak-qazba-cai').cancelOffer(tokenid);
        await reloadOffers();
        props.loader(false);
        props.alert('Offer cancelled', 'Your offer was cancelled successfully!');
    };
    const acceptOffer = async offer => {
        if (await props.confirm('Please confirm', 'Are you sure you want to accept this offer?')) {
            props.loader(true, 'Accepting offer...');
            var offersAPI = extjs
                .connect('https://ic0.app/', props.identity)
                .canister('fcwhh-piaaa-aaaak-qazba-cai');
            var memo = await offersAPI.createMemo2(tokenid, offer.offerer, offer.amount);
            var r2 = await extjs
                .connect('https://ic0.app/', props.identity)
                .token(tokenid)
                .transfer(
                    props.identity.getPrincipal().toText(),
                    props.currentAccount,
                    'fcwhh-piaaa-aaaak-qazba-cai',
                    BigInt(1),
                    BigInt(0),
                    memo,
                    true,
                );
            await _refresh();
            props.loader(false);
            props.alert(
                'Offer accepted',
                'You have accepted this offer. Your ICP will be transferred to you shortly!',
            );
        }
    };

    const getImageDetailsUrl = async (url, regExp) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const text = await blob.text();
        const simplifiedText = text.replace('\n', ' ').replace(/\s{2,}/, ' ');
        setDetailsUrl(simplifiedText.match(regExp)[1]);
    };

    const getVideoDetailsUrl = async (url, regExp, regExp2) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const text = await blob.text();
        const simplifiedText = text.replace('\n', ' ').replace(/\s{2,}/, ' ');
        if (simplifiedText.includes('URL=')) {
            setDetailsUrl(simplifiedText.match(regExp2)[1]);
        } else if (simplifiedText.includes('source')) {
            setDetailsUrl(simplifiedText.match(regExp)[1]);
        } else {
            setDetailsUrl(url);
        }
    };

    const extractEmbeddedImage = (svgUrl, classes) => {
        getImageDetailsUrl(svgUrl, /image href="([^"]+)"/);

        return (
            <img
                src={detailsUrl}
                alt=""
                className={classes.nftImage}
                style={{
                    border: 'none',
                    maxWidth: 500,
                    maxHeight: '100%',
                    cursor: 'pointer',
                    height: '100%',
                    width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                }}
            />
        );
    };

    const extractEmbeddedVideo = (iframeUrl, classes) => {
        getVideoDetailsUrl(iframeUrl, /source src="([^"]+)"/, 'URL=([^"]+)"');
        if (detailsUrl) {
            return (
                <video width="100%" autoPlay loop>
                    <source src={detailsUrl} type="video/mp4" />
                </video>
            );
        }
    };

    const displayImage = tokenid => {
        let {index, canister} = extjs.decodeTokenId(tokenid);
        if (collection.hasOwnProperty('detailpage')) {
            var detailPage = collection['detailpage'];
        } else {
            var detailPage = 'Missing';
        }
        if (overrideDetailPage) detailPage = overrideDetailPage;
        // Motoko Mechs specific
        // if (canister === 'ugdkf-taaaa-aaaak-acoia-cai') {
        //   return (
        //     <div className={classes.nftIframeContainer}>
        //       {<div dangerouslySetInnerHTML={{__html: motokoContent}} />}
        //     </div>
        //   );
        // }

        if (index == 99 && canister == 'kss7i-hqaaa-aaaah-qbvmq-cai')
            detailPage = 'interactive_nfts_or_videos';

        switch (detailPage) {
            // for generative collections where assets are all stored on the same canister
            // case "zvycl-fyaaa-aaaah-qckmq-cai": IC Apes doesn't work
            case 'generative_assets_on_nft_canister':
                return (
                    <img
                        src={EntrepotNFTImage(canister, index, tokenid, true)}
                        alt=""
                        className={classes.nftImage}
                        style={{
                            border: 'none',
                            maxWidth: 500,
                            maxHeight: '100%',
                            cursor: 'pointer',
                            height: '100%',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'block',
                            objectFit: 'contain',
                        }}
                    />
                );
                break;

            // for interactive NFTs or videos
            //case "xcep7-sqaaa-aaaah-qcukq-cai":
            //case "rqiax-3iaaa-aaaah-qcyta-cai":

            case 'interactive_nfts_or_videos':
                //case TREASURECANISTER:
                return (
                    <iframe
                        frameBorder="0"
                        src={EntrepotNFTImage(canister, index, tokenid, true)}
                        alt=""
                        className={classes.nftImage}
                        style={{
                            border: 'none',
                            maxWidth: 500,
                            maxHeight: '100%',
                            cursor: 'pointer',
                            minHeight: 500,
                            height: '100%',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'block',
                            overflow: 'hidden',
                        }}
                    />
                );
                break;

            // for videos that don't fit in the iframe and need a video tag
            case 'videos_that_dont_fit_in_frame':
                return extractEmbeddedVideo(
                    EntrepotNFTImage(canister, index, tokenid, true),
                    classes,
                );
            // for pre-generated images residing on asset canisters
            // case "rw623-hyaaa-aaaah-qctcq-cai": doesn't work for OG medals
            case 'asset_canisters':
                return extractEmbeddedImage(
                    EntrepotNFTImage(canister, index, tokenid, true),
                    classes,
                );

            // default case is to just use the thumbnail on the detail page
            default:
                return (
                    <img
                        src={EntrepotNFTImage(canister, index, tokenid, false)}
                        alt=""
                        className={classes.nftImage}
                        style={{
                            border: 'none',
                            maxWidth: 500,
                            maxHeight: '100%',
                            cursor: 'pointer',
                            height: '100%',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'block',
                            objectFit: 'contain',
                        }}
                    />
                );
                break;
        }
    };

    React.useEffect(() => {
        getLicense();
        props.loader(true);
        _refresh().then(() => props.loader(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={5}>
                        <div
                            style={{
                                border: '1px solid #E9ECEE',
                                marginBottom: '20px',
                                borderRadius: 4,
                            }}
                        >
                            {displayImage(tokenid)}
                        </div>

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                            >
                                <FormatAlignLeftIcon style={{marginTop: 3}} />
                                <Typography className={classes.heading}>Description</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classes.div}>
                                    <p>
                                        {collection.description
                                            ? collection.description
                                            : collection.blurb}
                                    </p>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                            >
                                <GavelIcon style={{marginTop: 3}} />
                                <Typography className={classes.heading}>License</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classes.div}>
                                    <p>{license === false ? 'Loading' : license}</p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                            >
                                <ArtTrackIcon style={{marginTop: 3}} />
                                <Typography className={classes.heading}>Properties</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <div style={{textAlign: 'center'}}>
                                        <Typography
                                            paragraph
                                            style={{paddingTop: 20, fontWeight: 'bold'}}
                                            align="center"
                                        >
                                            Coming Soon!{/*Loading...*/}
                                        </Typography>
                                    </div>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7}>
                        <div className={classes.personal}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => navigate(-1)}
                                style={{fontWeight: 'bold', color: 'black', borderColor: 'black'}}
                            >
                                Back
                            </Button>
                        </div>
                        <Typography variant="h4" className={classes.typo}>
                            <a
                                onClick={() => navigate('/marketplace/' + collection.route)}
                                style={{
                                    color: '#648DE2',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {collection.name}
                            </a>{' '}
                            #{EntrepotNFTMintNumber(collection.canister, index)}
                        </Typography>
                        <Grid container>
                            <Grid item style={{marginRight: 20}}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    style={{fontWeight: 'bold'}}
                                    component="a"
                                    target="_blank"
                                    href={EntrepotNFTLink(collection.canister, index, tokenid)}
                                >
                                    View NFT onchain
                                </Button>
                            </Grid>
                            <Grid item>
                                <div style={{marginTop: -5}} className={classes.icon}>
                                    <Favourite
                                        identity={props.identity}
                                        loggedIn={props.loggedIn}
                                        showcount={true}
                                        size={'large'}
                                        tokenid={tokenid}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                        <div
                            style={{
                                border: '1px solid #E9ECEE',
                                padding: '20px 15px',
                                margin: '20px 0px',
                            }}
                        >
                            {listing === false ? (
                                <div style={{textAlign: 'center'}}>
                                    <Typography
                                        paragraph
                                        style={{paddingTop: 20, fontWeight: 'bold'}}
                                        align="center"
                                    >
                                        Loading...
                                    </Typography>
                                </div>
                            ) : (
                                <>
                                    {listing.price > 0n ? (
                                        <>
                                            <Typography variant="h6">
                                                <strong>Price</strong>
                                            </Typography>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '10px 0px',
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    style={{fontWeight: 'bold'}}
                                                >
                                                    <PriceICP size={30} price={listing.price} />
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    style={{marginLeft: '10px'}}
                                                >
                                                    (
                                                    <PriceUSD
                                                        price={EntrepotGetICPUSD(listing.price)}
                                                    />
                                                    )
                                                </Typography>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {auction !== false ? (
                                                <div style={{marginBottom: 20}}>
                                                    <Typography variant="h6">
                                                        <strong>On Auction</strong>
                                                    </Typography>
                                                    {auction.bids.length === 0 ? (
                                                        <>
                                                            <span style={{fontSize: '12px'}}>
                                                                No Bids - Reserve:
                                                            </span>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '0px 0px 10px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h5"
                                                                    style={{fontWeight: 'bold'}}
                                                                >
                                                                    <PriceICP
                                                                        size={30}
                                                                        price={auction.reserve}
                                                                    />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    style={{marginLeft: '10px'}}
                                                                >
                                                                    (
                                                                    <PriceUSD
                                                                        price={EntrepotGetICPUSD(
                                                                            auction.reserve,
                                                                        )}
                                                                    />
                                                                    )
                                                                </Typography>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span style={{fontSize: '12px'}}>
                                                                {auction.bids.length} Bid
                                                                {auction.bids.length === 1
                                                                    ? ''
                                                                    : 's'}{' '}
                                                                - Leading Bid:
                                                            </span>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '10px 0px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h5"
                                                                    style={{fontWeight: 'bold'}}
                                                                >
                                                                    <PriceICP
                                                                        size={30}
                                                                        price={
                                                                            auction.bids[
                                                                                auction.bids
                                                                                    .length - 1
                                                                            ].amount
                                                                        }
                                                                    />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    style={{marginLeft: '10px'}}
                                                                >
                                                                    (
                                                                    <PriceUSD
                                                                        price={EntrepotGetICPUSD(
                                                                            auction.bids[
                                                                                auction.bids
                                                                                    .length - 1
                                                                            ].amount,
                                                                        )}
                                                                    />
                                                                    )
                                                                </Typography>
                                                            </div>
                                                            {props.account &&
                                                            auction.bids[auction.bids.length - 1]
                                                                .address ==
                                                                props.account.address ? (
                                                                <strong>You are leading</strong>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </>
                                                    )}
                                                    {Number(auction.end / 1000000n) >=
                                                    Date.now() ? (
                                                        <>
                                                            <div style={{marginBottom: 10}}>
                                                                <span style={{fontSize: '14px'}}>
                                                                    Auction ends{' '}
                                                                    <Timestamp
                                                                        date={Number(
                                                                            auction.end /
                                                                                1000000000n,
                                                                        )}
                                                                    />{' '}
                                                                    {gmtOffset()} (
                                                                    <Timestamp
                                                                        relative
                                                                        autoUpdate
                                                                        date={Number(
                                                                            auction.end /
                                                                                1000000000n,
                                                                        )}
                                                                    />
                                                                    )
                                                                </span>
                                                                <br />
                                                                <small>
                                                                    This auction may auto-extend
                                                                </small>
                                                            </div>
                                                            <Button
                                                                onClick={ev => {
                                                                    placeBid();
                                                                }}
                                                                variant="contained"
                                                                color="primary"
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginRight: '10px',
                                                                    marginBottom: 10,
                                                                }}
                                                            >
                                                                Place Bid
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span style={{fontSize: '14px'}}>
                                                                Auction ending...
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {offers && offers.length > 0 ? (
                                                        <>
                                                            <Typography variant="h6">
                                                                <strong>Best Offer Price</strong>
                                                            </Typography>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '10px 0px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h5"
                                                                    style={{fontWeight: 'bold'}}
                                                                >
                                                                    <PriceICP
                                                                        size={30}
                                                                        price={offers[0].amount}
                                                                    />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    style={{marginLeft: '10px'}}
                                                                >
                                                                    (
                                                                    <PriceUSD
                                                                        price={EntrepotGetICPUSD(
                                                                            offers[0].amount,
                                                                        )}
                                                                    />
                                                                    )
                                                                </Typography>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {transactions &&
                                                            transactions.length > 0 ? (
                                                                <>
                                                                    <Typography variant="h6">
                                                                        <strong>Last Price</strong>
                                                                    </Typography>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            padding: '10px 0px',
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="h5"
                                                                            style={{
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            <PriceICP
                                                                                size={30}
                                                                                price={
                                                                                    transactions[0]
                                                                                        .price
                                                                                }
                                                                            />
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="body2"
                                                                            style={{
                                                                                marginLeft: '10px',
                                                                            }}
                                                                        >
                                                                            (
                                                                            <PriceUSD
                                                                                price={EntrepotGetICPUSD(
                                                                                    transactions[0]
                                                                                        .price,
                                                                                )}
                                                                            />
                                                                            )
                                                                        </Typography>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Typography variant="h6">
                                                                        <strong>Unlisted</strong>
                                                                    </Typography>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            padding: '10px 0px',
                                                                        }}
                                                                    ></div>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                            {owner && props.account && props.account.address == owner ? (
                                <>
                                    <div className={classes.button}>
                                        {listing !== false && listing && listing.price > 0n ? (
                                            <>
                                                <Button
                                                    onClick={ev => {
                                                        props.listNft(
                                                            {id: tokenid, listing: listing},
                                                            props.loader,
                                                            _afterList,
                                                        );
                                                    }}
                                                    variant="contained"
                                                    color="primary"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginRight: '10px',
                                                        backgroundColor: '#003240',
                                                        color: 'white',
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    Update Listing
                                                </Button>
                                                <Button
                                                    onClick={ev => {
                                                        cancelListing();
                                                    }}
                                                    variant="outlined"
                                                    color="primary"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginRight: '10px',
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    Cancel Listing
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={ev => {
                                                    props.listNft(
                                                        {id: tokenid, listing: listing},
                                                        props.loader,
                                                        _afterList,
                                                    );
                                                }}
                                                variant="contained"
                                                color="primary"
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginRight: '10px',
                                                    backgroundColor: '#003240',
                                                    color: 'white',
                                                    marginBottom: 10,
                                                }}
                                            >
                                                List Item
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {listing !== false && props.loggedIn ? (
                                        <div className={classes.button}>
                                            {listing && listing.price > 0n ? (
                                                <Button
                                                    onClick={ev => {
                                                        props.buyNft(
                                                            collection.canister,
                                                            index,
                                                            listing,
                                                            _afterBuy,
                                                        );
                                                    }}
                                                    variant="contained"
                                                    color="primary"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginRight: '10px',
                                                        backgroundColor: '#003240',
                                                        color: 'white',
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            ) : (
                                                ''
                                            )}

                                            <Button
                                                onClick={ev => {
                                                    makeOffer();
                                                }}
                                                variant="outlined"
                                                color="primary"
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginRight: '10px',
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Submit Offer
                                            </Button>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                            {owner && props.account.address == owner ? (
                                <div style={{marginTop: 20}}>
                                    <strong>Owned by you</strong>
                                </div>
                            ) : (
                                ''
                            )}
                            {owner && props.account.address != owner ? (
                                <div style={{marginTop: 20}}>
                                    <strong>Owner:</strong>{' '}
                                    <a
                                        href={
                                            'https://dashboard.internetcomputer.org/account/' +
                                            owner
                                        }
                                        target="_blank"
                                    >
                                        {shorten(owner)}
                                    </a>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        {auction && auction.bids.length ? (
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                                >
                                    <GavelIcon style={{marginTop: 3}} />
                                    <Typography className={classes.heading}>Latest Bids</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer>
                                        <Table
                                            sx={{minWidth: 1500, fontWeight: 'bold'}}
                                            aria-label="a dense table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left"></TableCell>
                                                    <TableCell align="right">
                                                        <strong>Price</strong>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <strong>Time</strong>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <strong>Bidder</strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {auction.bids
                                                    .slice()
                                                    .reverse()
                                                    .slice(0, 5)
                                                    .map((a, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell>
                                                                    <GavelIcon
                                                                        style={{
                                                                            fontSize: 18,
                                                                            verticalAlign: 'middle',
                                                                        }}
                                                                    />{' '}
                                                                    <strong>Bid</strong>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <strong>
                                                                        <PriceICP
                                                                            price={a.amount}
                                                                        />
                                                                    </strong>
                                                                    <br />
                                                                    {EntrepotGetICPUSD(a.amount) ? (
                                                                        <small>
                                                                            <PriceUSD
                                                                                price={EntrepotGetICPUSD(
                                                                                    a.amount,
                                                                                )}
                                                                            />
                                                                        </small>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Timestamp
                                                                        relative
                                                                        autoUpdate
                                                                        date={Number(
                                                                            a.time / 1000000000n,
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {props.account &&
                                                                    props.account.address ==
                                                                        a.address ? (
                                                                        <>
                                                                            <strong>You</strong>
                                                                        </>
                                                                    ) : (
                                                                        <a
                                                                            href={
                                                                                'https://icscan.io/account/' +
                                                                                a.address
                                                                            }
                                                                            target="_blank"
                                                                        >
                                                                            {shorten(a.address)}
                                                                        </a>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        ) : (
                            ''
                        )}
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                            >
                                <LocalOfferIcon style={{marginTop: 3}} />
                                <Typography className={classes.heading}>Offers</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    {offers === false ? (
                                        <div style={{textAlign: 'center'}}>
                                            <Typography
                                                paragraph
                                                style={{paddingTop: 20, fontWeight: 'bold'}}
                                                align="center"
                                            >
                                                Loading...
                                            </Typography>
                                        </div>
                                    ) : (
                                        <>
                                            {offers.length === 0 ? (
                                                <>
                                                    <div style={{textAlign: 'center'}}>
                                                        <Typography
                                                            paragraph
                                                            style={{
                                                                paddingTop: 20,
                                                                fontWeight: 'bold',
                                                            }}
                                                            align="center"
                                                        >
                                                            There are currently no offers!
                                                        </Typography>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Alert severity="info">
                                                        Offers are binding.
                                                    </Alert>
                                                    <Table
                                                        sx={{minWidth: 1500, fontWeight: 'bold'}}
                                                        aria-label="a dense table"
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left"></TableCell>
                                                                <TableCell align="right">
                                                                    <strong>Price</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>Floor Delta</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>Time</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>Buyer</strong>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {offers.slice().map((offer, i) => {
                                                                return (
                                                                    <TableRow key={i}>
                                                                        <TableCell>
                                                                            <LocalOfferIcon
                                                                                style={{
                                                                                    fontSize: 18,
                                                                                    verticalAlign:
                                                                                        'middle',
                                                                                }}
                                                                            />{' '}
                                                                            <strong>Offer</strong>
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            <strong>
                                                                                <PriceICP
                                                                                    price={
                                                                                        offer.amount
                                                                                    }
                                                                                />
                                                                            </strong>
                                                                            <br />
                                                                            {EntrepotGetICPUSD(
                                                                                offer.amount,
                                                                            ) ? (
                                                                                <small>
                                                                                    <PriceUSD
                                                                                        price={EntrepotGetICPUSD(
                                                                                            offer.amount,
                                                                                        )}
                                                                                    />
                                                                                </small>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {floor
                                                                                ? getFloorDelta(
                                                                                      offer.amount,
                                                                                  )
                                                                                : '-'}
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Timestamp
                                                                                relative
                                                                                autoUpdate
                                                                                date={Number(
                                                                                    offer.time /
                                                                                        1000000000n,
                                                                                )}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {owner &&
                                                                            props.account &&
                                                                            props.account.address ==
                                                                                owner ? (
                                                                                <Button
                                                                                    onClick={() =>
                                                                                        acceptOffer(
                                                                                            offer,
                                                                                        )
                                                                                    }
                                                                                    size={'small'}
                                                                                    style={{
                                                                                        color: 'white',
                                                                                        backgroundColor:
                                                                                            '#c32626',
                                                                                    }}
                                                                                    variant={
                                                                                        'contained'
                                                                                    }
                                                                                >
                                                                                    Accept
                                                                                </Button>
                                                                            ) : (
                                                                                <>
                                                                                    {props.identity &&
                                                                                    props.identity
                                                                                        .getPrincipal()
                                                                                        .toText() ==
                                                                                        offer.offerer.toText() ? (
                                                                                        <Button
                                                                                            onClick={
                                                                                                cancelOffer
                                                                                            }
                                                                                            size={
                                                                                                'small'
                                                                                            }
                                                                                            style={{
                                                                                                color: 'white',
                                                                                                backgroundColor:
                                                                                                    '#c32626',
                                                                                            }}
                                                                                            variant={
                                                                                                'contained'
                                                                                            }
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <a
                                                                                            href={
                                                                                                'https://icscan.io/account/' +
                                                                                                offer.offerer.toText()
                                                                                            }
                                                                                            target="_blank"
                                                                                        >
                                                                                            {shorten(
                                                                                                offer.offerer.toText(),
                                                                                            )}
                                                                                        </a>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </>
                                            )}
                                        </>
                                    )}
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fontSize: 35}} />}
                            >
                                <ShowChartIcon style={{marginTop: 3}} />
                                <Typography className={classes.heading}>Activity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    {transactions === false ? (
                                        <div style={{textAlign: 'center'}}>
                                            <Typography
                                                paragraph
                                                style={{paddingTop: 20, fontWeight: 'bold'}}
                                                align="center"
                                            >
                                                Loading...
                                            </Typography>
                                        </div>
                                    ) : (
                                        <>
                                            {transactions.length == 0 ? (
                                                <div style={{textAlign: 'center'}}>
                                                    <Typography
                                                        paragraph
                                                        style={{paddingTop: 20, fontWeight: 'bold'}}
                                                        align="center"
                                                    >
                                                        No activity
                                                    </Typography>
                                                </div>
                                            ) : (
                                                <>
                                                    <Table
                                                        sx={{minWidth: 1500, fontWeight: 'bold'}}
                                                        aria-label="a dense table"
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left"></TableCell>
                                                                <TableCell align="right">
                                                                    <strong>Price</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>From</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>To</strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>Time</strong>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {transactions
                                                                .slice()
                                                                .map((transaction, i) => {
                                                                    return (
                                                                        <TableRow key={i}>
                                                                            <TableCell>
                                                                                <ShoppingCartIcon
                                                                                    style={{
                                                                                        fontSize: 18,
                                                                                        verticalAlign:
                                                                                            'middle',
                                                                                    }}
                                                                                />{' '}
                                                                                <strong>
                                                                                    Sale
                                                                                </strong>
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <strong>
                                                                                    <PriceICP
                                                                                        price={BigInt(
                                                                                            transaction.price,
                                                                                        )}
                                                                                    />
                                                                                </strong>
                                                                                <br />
                                                                                {EntrepotGetICPUSD(
                                                                                    BigInt(
                                                                                        transaction.price,
                                                                                    ),
                                                                                ) ? (
                                                                                    <small>
                                                                                        <PriceUSD
                                                                                            price={EntrepotGetICPUSD(
                                                                                                BigInt(
                                                                                                    transaction.price,
                                                                                                ),
                                                                                            )}
                                                                                        />
                                                                                    </small>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <a
                                                                                    href={
                                                                                        'https://dashboard.internetcomputer.org/account/' +
                                                                                        transaction.seller
                                                                                    }
                                                                                    target="_blank"
                                                                                >
                                                                                    {shorten(
                                                                                        transaction.seller,
                                                                                    )}
                                                                                </a>
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <a
                                                                                    href={
                                                                                        'https://dashboard.internetcomputer.org/account/' +
                                                                                        transaction.buyer
                                                                                    }
                                                                                    target="_blank"
                                                                                >
                                                                                    {shorten(
                                                                                        transaction.buyer,
                                                                                    )}
                                                                                </a>
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <Timestamp
                                                                                    relative
                                                                                    autoUpdate
                                                                                    date={Number(
                                                                                        BigInt(
                                                                                            transaction.time,
                                                                                        ) /
                                                                                            1000000000n,
                                                                                    )}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                        </TableBody>
                                                    </Table>
                                                </>
                                            )}
                                        </>
                                    )}
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Container>
            <OfferForm
                floor={floor}
                address={props.account.address}
                balance={props.balance}
                voltCreate={props.voltCreate}
                complete={reloadOffers}
                identity={props.identity}
                confirm={props.confirm}
                alert={props.alert}
                open={openOfferForm}
                close={closeOfferForm}
                loader={props.loader}
                error={props.error}
                tokenid={tokenid}
            />
            <AuctionForm
                auction={auction}
                address={props.account.address}
                balance={props.balance}
                voltCreate={props.voltCreate}
                complete={reloadAuction}
                identity={props.identity}
                confirm={props.confirm}
                alert={props.alert}
                open={openAuctionForm}
                close={closeAuctionForm}
                loader={props.loader}
                error={props.error}
                tokenid={tokenid}
            />
        </>
    );
};
export default Detail;

const useStyles = makeStyles(theme => ({
    btn: {
        backgroundColor: '#ffffff',
        marginLeft: '10px',
        color: '#2B74DC',
        fontWeight: 'bold',
        boxShadow: 'none',
        border: '1px solid #2B74DC',
        textTransform: 'capitalize',
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0px',
            marginTop: '10px',
        },
    },
    button: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    typo: {
        fontWeight: 'bold',
        padding: '20px 0px',
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
        },
    },
    personal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    container: {
        padding: '20px 120px 120px',
        [theme.breakpoints.down('md')]: {
            padding: '110px 66px',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '5px 5px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '5px 5px',
        },
    },
    nftImage: {
        [theme.breakpoints.up('md')]: {
            minHeight: 600,
        },
        [theme.breakpoints.down('sm')]: {},
        [theme.breakpoints.down('xs')]: {},
    },
    iconsBorder: {
        border: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
    div: {
        display: 'flex',
        padding: '10px',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: 'bold',
        marginLeft: 20,
    },
}));
