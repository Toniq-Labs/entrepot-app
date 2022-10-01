/* global BigInt */
import React, {createRef, useState} from 'react';
import {makeStyles, Container, Box, Grid, Link} from '@material-ui/core';
import PriceICP, {icpToString} from './PriceICP';
import PriceUSD from './PriceUSD';
import OfferForm from './OfferForm';
import {useNavigate} from 'react-router-dom';
import extjs from '../ic/extjs.js';
import {
    EntrepotNFTImage,
    EntrepotNFTLink,
    EntrepotNFTMintNumber,
    EntrepotGetICPUSD,
    EntrepotCollectionStats,
} from '../utils';
import {useParams} from 'react-router-dom';
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';
import {
    ToniqIcon,
    ToniqChip,
    ToniqButton,
    ToniqMiddleEllipsis,
    ToniqPagination,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {
    ArrowLeft24Icon,
    CircleWavyCheck24Icon,
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {DropShadowCard} from '../shared/DropShadowCard';
import {Accordion} from './Accordion';
import Timestamp from 'react-timestamp';
import chunk from 'lodash.chunk';
import Favourite from './Favourite';
import getGenes from './CronicStats';
import {cronicFilterTraits} from '../model/constants';
import {uppercaseFirstLetterOfWord} from '../utilities/string-utils';
import {isEllipsisActive} from '../utilities/element-utils';

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
const api = extjs.connect('https://boundary.ic0.app/');

const TREASURECANISTER = 'yigae-jqaaa-aaaah-qczbq-cai';
const shorten = a => {
    return a.substring(0, 18) + '...';
};

const Detail = props => {
    let {tokenid} = useParams();
    let {index, canister} = extjs.decodeTokenId(tokenid);
    const navigate = useNavigate();
    const [
        floor,
        setFloor,
    ] = useState(EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '');
    const [
        listing,
        setListing,
    ] = useState(false);
    const [
        detailsUrl,
        setDetailsUrl,
    ] = useState(false);
    const [
        transactions,
        setTransactions,
    ] = useState(false);
    const [
        activity,
        setActivity,
    ] = useState(false);
    const [
        activityPage,
        setActivityPage,
    ] = useState(0);
    const [
        offerPage,
        setOfferPage,
    ] = useState(0);
    const [
        owner,
        setOwner,
    ] = useState(false);
    const [
        offers,
        setOffers,
    ] = useState(false);
    const [
        offerListing,
        setOfferListing,
    ] = useState(false);
    const [
        openOfferForm,
        setOpenOfferForm,
    ] = useState(false);
    const [
        attributes,
        setAttributes,
    ] = useState(false);
    const collection = props.collections.find(e => e.canister === canister);
    const [
        motokoContent,
        setMotokoContent,
    ] = useState('');
    const [
        traitsData,
        setTraitsData,
    ] = useState(false);
    const [
        isBlurbOpen,
        setIsBlurbOpen,
    ] = useState(false);
    const [
        showReadMore,
        setShowReadMore,
    ] = useState(false);
    const blurbRef = createRef();

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const classes = useStyles();

    const reloadOffers = async () => {
        await api
            .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
            .offers(tokenid)
            .then(r => {
                const offerData = r
                    .map(a => {
                        return {buyer: a[0], amount: a[1], time: a[2]};
                    })
                    .sort((a, b) => Number(b.amount) - Number(a.amount));
                if (offerData.length) {
                    setOffers(chunk(offerData, 9));
                    setOfferListing(offers[offerPage]);
                } else {
                    setOfferListing([]);
                }
            });
    };

    const cancelListing = () => {
        props.list(tokenid, 0, props.loader, _afterList);
    };

    const _refresh = async () => {
        reloadOffers();
        await fetch('https://us-central1-entrepot-api.cloudfunctions.net/api/token/' + tokenid)
            .then(r => r.json())
            .then(r => {
                setListing({
                    price: BigInt(r.price),
                    time: r.time,
                });

                setOwner(r.owner);
                if (r.transactions.length) {
                    setTransactions(chunk(r.transactions, 9));
                    setActivity(transactions[activityPage]);
                } else {
                    setActivity([]);
                }
            });

        let {index, canister} = extjs.decodeTokenId(tokenid);
        if (canister === 'ugdkf-taaaa-aaaak-acoia-cai') {
            await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(
                    EntrepotNFTImage(canister, index, tokenid, true),
                )}`,
            )
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    // Overriding Motoko styling
                    const content = data.contents
                        .replace(
                            /(<style\b[^>]*>)[^<>]*(<\/style>)/g,
                            '<style>.container { height: 100%; aspect-ratio: 0.7; margin: 0 auto; display: flex; align-items: center; justify-content: center; flex-direction: column;}.box { width: 100%; height: 100%; position: relative; transform: rotate3d(0, -1, 0, 0); transition: all 500ms ease; transform-style: preserve-3d; }.box.flipped { transform: rotate3d(0, -1, 0, 180deg);}.box img { border-radius: 15px;}.box .front { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; z-index: 2;}.box .back { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg);}</style>',
                        )
                        .replace(
                            /style="width:500px;height:700px;"/g,
                            'style="width:100%;height:100%;"',
                        );
                    setMotokoContent(content);
                });
        }

        await getAttributes(index);
    };

    const _afterList = async () => {
        await _refresh();
    };

    const _afterBuy = async () => {
        await reloadOffers();
        await _refresh();
    };

    const closeOfferForm = () => {
        reloadOffers();
        setOpenOfferForm(false);
    };

    const getFloorDelta = amount => {
        if (!floor) return reloadIcon();
        var fe = floor * 100000000;
        var ne = Number(amount);
        if (ne > fe) {
            return (((ne - fe) / ne) * 100).toFixed(2) + '% above';
        } else if (ne < fe) {
            return ((1 - ne / fe) * 100).toFixed(2) + '% below';
        } else return reloadIcon();
    };

    const makeOffer = async () => {
        setOpenOfferForm(true);
    };

    useInterval(_refresh, 2 * 1000);
    useInterval(() => {
        var nf = EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '';
        setFloor(nf);
    }, 10 * 1000);

    const cancelOffer = async () => {
        props.loader(true, 'Cancelling offer...');
        const _api = extjs.connect('https://boundary.ic0.app/', props.identity);
        await _api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').cancelOffer(tokenid);
        await reloadOffers();
        props.loader(false);
        props.alert('Offer cancelled', 'Your offer was cancelled successfully!');
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

    const imageStyles = cssToReactStyleObject(css`
        background-image: url('${unsafeCSS(
            detailsUrl ? detailsUrl : EntrepotNFTImage(canister, index, tokenid, true),
        )}');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        padding-top: 100%;
        width: 100%;
    `);

    const extractEmbeddedImage = (svgUrl, classes) => {
        getImageDetailsUrl(svgUrl, /image href="([^"]+)"/);

        return (
            <div className={classes.nftImage}>
                <div style={imageStyles} />
            </div>
        );
    };

    const extractEmbeddedVideo = (iframeUrl, classes) => {
        getVideoDetailsUrl(iframeUrl, /source src="([^"]+)"/);
        if (detailsUrl) {
            return (
                <video width="100%" autoPlay muted loop>
                    <source src={detailsUrl} type="video/mp4" />
                </video>
            );
        }
    };

    const displayImage = tokenid => {
        let {index, canister} = extjs.decodeTokenId(tokenid);
        let detailPage;

        if (collection.hasOwnProperty('detailpage')) {
            detailPage = collection['detailpage'];
        } else {
            detailPage = 'Missing';
        }

        // Motoko Mechs specific
        if (canister === 'ugdkf-taaaa-aaaak-acoia-cai') {
            return (
                <div className={classes.nftIframeContainer}>
                    {
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                bottom: '0',
                                right: '0',
                                width: '100%',
                                height: '100%',
                            }}
                            dangerouslySetInnerHTML={{__html: motokoContent}}
                        />
                    }
                </div>
            );
        }

        // console.log(detailPage)

        if (index === 99 && canister === 'kss7i-hqaaa-aaaah-qbvmq-cai')
            detailPage = 'interactive_nfts_or_videos';

        switch (detailPage) {
            // for generative collections where assets are all stored on the same canister
            // case "zvycl-fyaaa-aaaah-qckmq-cai": IC Apes doesn't work
            case 'generative_assets_on_nft_canister':
                return (
                    <div className={classes.nftImage}>
                        <div style={imageStyles} />
                    </div>
                );
                /* eslint-disable no-unreachable */
                break;
            /* eslint-enable */

            // for interactive NFTs or videos
            case 'interactive_nfts_or_videos':
            case TREASURECANISTER:
                return (
                    <div className={classes.nftIframeContainer}>
                        <iframe
                            frameBorder="0"
                            src={EntrepotNFTImage(canister, index, tokenid, true)}
                            alt=""
                            title={tokenid}
                            className={classes.nftIframe}
                        />
                    </div>
                );
                /* eslint-disable no-unreachable */
                break;
            /* eslint-enable */

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
                    <div className={classes.nftImage}>
                        <div style={imageStyles} />
                    </div>
                );
                /* eslint-disable no-unreachable */
                break;
            /* eslint-enable */
        }
    };

    const getAttributes = async index => {
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

        let traits;
        if (traitsData) {
            traits = traitsData[1][EntrepotNFTMintNumber(collection.canister, index) - 1][1].map(
                trait => {
                    const traitCategory = trait[0];
                    const traitValue = trait[1];

                    return {
                        category: uppercaseFirstLetterOfWord(
                            traitsCategories[traitCategory].category,
                        ),
                        value: uppercaseFirstLetterOfWord(
                            typeof traitsCategories[traitCategory].values[traitValue] === 'string'
                                ? traitsCategories[traitCategory].values[traitValue]
                                : Boolean(
                                      traitsCategories[traitCategory].values[traitValue],
                                  ).toString(),
                        ),
                    };
                },
            );
            setAttributes(traits);
        } else if (!traitsData && collection?.route === 'cronics') {
            var result = await api.token(canister).listings();

            if (result.length) {
                var genes = getGenes(result[index][2].nonfungible.metadata[0]).battle;

                if (Object.keys(genes).length) {
                    var arrayObjectGenes = Object.entries(genes).map(gene => ({
                        [gene[0]]: gene[1],
                    }));

                    traits = arrayObjectGenes.map(gene => {
                        const category = Object.keys(gene)[0];
                        const value = `Dominant: ${gene[category].dominant} Recessive: ${gene[category].recessive}`;

                        return {
                            category: uppercaseFirstLetterOfWord(category),
                            value: uppercaseFirstLetterOfWord(
                                typeof value === 'string' ? value : Boolean(value).toString(),
                            ),
                        };
                    });

                    setAttributes(traits);
                }
            }
        }
    };

    const getPriceData = () => {
        if (listing.price > 0n) {
            return listing.price;
        } else if (offers && offers.length > 0) {
            return offers[0].amount;
        } else if (transactions && transactions.length > 0) {
            return transactions[0].price;
        } else {
            return undefined;
        }
    };

    const reloadIcon = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <ToniqIcon
                    style={{
                        color: String(toniqColors.pagePrimary.foregroundColor),
                        alignSelf: 'center',
                    }}
                    icon={LoaderAnimated24Icon}
                />
            </div>
        );
    };

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

    React.useEffect(() => {
        props.loader(true);
        _refresh().then(() => props.loader(false));

        loadTraits().then(traits => {
            if (traits) {
                setTraitsData(traits);
            }
        });
        setShowReadMore(isEllipsisActive(blurbRef.current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Container className={classes.container}>
                <button
                    variant="text"
                    onClick={() => navigate(-1)}
                    className={classes.removeNativeButtonStyles}
                >
                    <Grid container spacing={1}>
                        <Grid item>
                            <ToniqIcon icon={ArrowLeft24Icon}>Return to Collection</ToniqIcon>
                        </Grid>
                        <Grid item>
                            <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>
                                Return to Collection
                            </span>
                        </Grid>
                    </Grid>
                </button>
                <DropShadowCard className={classes.nftCard}>
                    <Container className={classes.nftDescWrapper}>
                        <Box className={classes.nftDescHeader}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <div className={classes.imageWrapper}>
                                        {displayImage(tokenid)}
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.nftDesc}>
                                    <div className={classes.nftDescContainer1}>
                                        <span
                                            style={{
                                                ...cssToReactStyleObject(toniqFontStyles.h2Font),
                                                display: 'block',
                                            }}
                                        >
                                            {collection.name} #
                                            {EntrepotNFTMintNumber(collection.canister, index)}
                                        </span>
                                        <Box style={{cursor: 'pointer'}}>
                                            <div style={{display: 'flex', gap: 32}}>
                                                <Link
                                                    href={EntrepotNFTLink(
                                                        collection.canister,
                                                        index,
                                                        tokenid,
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    underline="none"
                                                >
                                                    <ToniqChip text="View NFT OnChain" />
                                                </Link>
                                                <Favourite
                                                    className={classes.favourite}
                                                    showcount={true}
                                                    count={2}
                                                    refresher={props.faveRefresher}
                                                    identity={props.identity}
                                                    loggedIn={props.loggedIn}
                                                    tokenid={tokenid}
                                                />
                                            </div>
                                        </Box>
                                        <span
                                            style={{
                                                ...cssToReactStyleObject(toniqFontStyles.labelFont),
                                                opacity: '0.64',
                                            }}
                                        >
                                            COLLECTION
                                        </span>
                                    </div>
                                    <div className={classes.nftDescContainer2}>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <button
                                                className={classes.removeNativeButtonStyles}
                                                style={{
                                                    ...cssToReactStyleObject(
                                                        toniqFontStyles.paragraphFont,
                                                    ),
                                                    marginRight: '11px',
                                                }}
                                                onClick={() => {
                                                    navigate('/marketplace/' + collection.route);
                                                }}
                                            >
                                                <span className={classes.hoverText}>
                                                    {collection.name}
                                                </span>
                                            </button>
                                            {collection.kyc ? (
                                                <ToniqIcon
                                                    icon={CircleWavyCheck24Icon}
                                                    style={{
                                                        color: toniqColors.pageInteraction
                                                            .foregroundColor,
                                                    }}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div className={classes.nftDescContainer3}>
                                                {getPriceData() ? (
                                                    <>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <PriceICP
                                                                large={true}
                                                                volume={true}
                                                                clean={false}
                                                                price={getPriceData()}
                                                            />
                                                            <span
                                                                style={{
                                                                    ...cssToReactStyleObject(
                                                                        toniqFontStyles.paragraphFont,
                                                                    ),
                                                                    marginLeft: '8px',
                                                                }}
                                                            >
                                                                {EntrepotGetICPUSD(
                                                                    getPriceData(),
                                                                ) && (
                                                                    <>
                                                                        (
                                                                        <PriceUSD
                                                                            price={EntrepotGetICPUSD(
                                                                                getPriceData(),
                                                                            )}
                                                                        />
                                                                        )
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            style={{
                                                                ...cssToReactStyleObject(
                                                                    toniqFontStyles.boldFont,
                                                                ),
                                                                ...cssToReactStyleObject(
                                                                    toniqFontStyles.h3Font,
                                                                ),
                                                            }}
                                                        >
                                                            Unlisted
                                                        </span>
                                                    </>
                                                )}
                                                {owner &&
                                                props.account &&
                                                props.account.address === owner ? (
                                                    <div style={{display: 'flex', gap: '16px'}}>
                                                        {listing !== false &&
                                                        listing &&
                                                        listing.price > 0n ? (
                                                            <>
                                                                <ToniqButton
                                                                    text="Update Listing"
                                                                    onClick={() => {
                                                                        props.listNft(
                                                                            {
                                                                                id: tokenid,
                                                                                listing: listing,
                                                                            },
                                                                            props.loader,
                                                                            _afterList,
                                                                        );
                                                                    }}
                                                                />
                                                                <ToniqButton
                                                                    text="Cancel Listing"
                                                                    className="toniq-button-secondary"
                                                                    onClick={() => {
                                                                        cancelListing();
                                                                    }}
                                                                />
                                                                {/* <ToniqButton title="More Options" icon={DotsVertical24Icon} className="toniq-button-secondary" /> */}
                                                            </>
                                                        ) : (
                                                            <ToniqButton
                                                                text="List Item"
                                                                onClick={() => {
                                                                    props.listNft(
                                                                        {
                                                                            id: tokenid,
                                                                            listing: listing,
                                                                        },
                                                                        props.loader,
                                                                        _afterList,
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{display: 'flex', gap: '16px'}}>
                                                        <ToniqButton
                                                            text="Buy Now"
                                                            onClick={() => {
                                                                props.buyNft(
                                                                    collection.canister,
                                                                    index,
                                                                    listing,
                                                                    _afterBuy,
                                                                );
                                                            }}
                                                        />
                                                        <ToniqButton
                                                            text="Make Offer"
                                                            className="toniq-button-secondary"
                                                            onClick={() => {
                                                                makeOffer();
                                                            }}
                                                        />
                                                        {/* <ToniqButton title="More Options" icon={DotsVertical24Icon} className="toniq-button-secondary" /> */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {owner ? (
                                            <>
                                                {props.account.address === owner ? (
                                                    <span className={classes.ownerWrapper}>
                                                        Owned by you
                                                    </span>
                                                ) : (
                                                    <span className={classes.ownerWrapper}>
                                                        {/* {`Owned by `} */}
                                                        {`Owner `}
                                                        {/* <span className={classes.ownerName}>ChavezOG</span> */}
                                                        : &nbsp;
                                                        <Link
                                                            href={`https://dashboard.internetcomputer.org/account/${owner}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            underline="none"
                                                        >
                                                            <span className={classes.ownerAddress}>
                                                                {shorten(owner)}
                                                            </span>
                                                        </Link>
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {collection.blurb && (
                                            <div className={classes.blurbWrapper}>
                                                <div
                                                    ref={blurbRef}
                                                    className={`${classes.blurb} ${
                                                        !isBlurbOpen ? classes.blurbCollapsed : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: collection.blurb,
                                                    }}
                                                />
                                                {showReadMore && (
                                                    <button
                                                        style={{
                                                            ...cssToReactStyleObject(
                                                                toniqFontStyles.boldParagraphFont,
                                                            ),
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                                                    >
                                                        {!isBlurbOpen ? 'Read More' : 'Read Less'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box style={{display: 'grid', gap: '16px', padding: '16px 0'}}>
                            <Accordion title="Offers" open={true} center={true}>
                                {offerListing ? (
                                    <>
                                        {offerListing.length > 0 ? (
                                            <Grid container className={classes.accordionWrapper}>
                                                <Grid container className={classes.tableHeader}>
                                                    <Grid
                                                        item
                                                        xs={8}
                                                        sm={6}
                                                        md={4}
                                                        className={classes.tableHeaderName}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        Time
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={2}
                                                        className={classes.tableHeaderName}
                                                    >
                                                        Floor Delta
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={3}
                                                        className={classes.tableHeaderName}
                                                    >
                                                        Buyer
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        md={3}
                                                        className={classes.tableHeaderName}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'right',
                                                        }}
                                                    >
                                                        Price
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    className={classes.ntfCardContainer}
                                                >
                                                    {offerListing.slice().map((offer, index) => (
                                                        <Grid item key={index} xs={12}>
                                                            <DropShadowCard enableHover>
                                                                <Grid
                                                                    container
                                                                    className={classes.tableCard}
                                                                    alignItems="center"
                                                                    spacing={4}
                                                                >
                                                                    <Grid item xs={10} md={4}>
                                                                        <Grid
                                                                            container
                                                                            alignItems="center"
                                                                            spacing={4}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={4}
                                                                                sm={2}
                                                                                md={4}
                                                                                className={
                                                                                    classes.imageWrapperActivity
                                                                                }
                                                                            >
                                                                                {displayImage(
                                                                                    tokenid,
                                                                                )}
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={8}
                                                                                sm={10}
                                                                                md={8}
                                                                            >
                                                                                <div>
                                                                                    <span>
                                                                                        <Timestamp
                                                                                            relative
                                                                                            autoUpdate
                                                                                            date={Number(
                                                                                                offer.time /
                                                                                                    1000000000n,
                                                                                            )}
                                                                                        />
                                                                                    </span>
                                                                                    <span
                                                                                        className={
                                                                                            classes.buyerMobile
                                                                                        }
                                                                                    >
                                                                                        {props.identity &&
                                                                                        props.identity
                                                                                            .getPrincipal()
                                                                                            .toText() ===
                                                                                            offer.buyer.toText() ? (
                                                                                            <ToniqButton
                                                                                                text="Cancel"
                                                                                                onClick={
                                                                                                    cancelOffer
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <ToniqMiddleEllipsis
                                                                                                externalLink={`https://icscan.io/account/${offer.buyer}`}
                                                                                                letterCount={
                                                                                                    5
                                                                                                }
                                                                                                text={offer.buyer.toText()}
                                                                                            />
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={1}
                                                                        sm={2}
                                                                        md={2}
                                                                        className={
                                                                            classes.buyerDesktop
                                                                        }
                                                                        style={{
                                                                            marginLeft: '-16px',
                                                                        }}
                                                                    >
                                                                        {floor ? (
                                                                            getFloorDelta(
                                                                                offer.amount,
                                                                            )
                                                                        ) : (
                                                                            <ToniqIcon
                                                                                style={{
                                                                                    color: String(
                                                                                        toniqColors
                                                                                            .pagePrimary
                                                                                            .foregroundColor,
                                                                                    ),
                                                                                    alignSelf:
                                                                                        'center',
                                                                                }}
                                                                                icon={
                                                                                    LoaderAnimated24Icon
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={1}
                                                                        sm={2}
                                                                        md={3}
                                                                        className={
                                                                            classes.buyerDesktop
                                                                        }
                                                                    >
                                                                        {props.identity &&
                                                                        props.identity
                                                                            .getPrincipal()
                                                                            .toText() ===
                                                                            offer.buyer.toText() ? (
                                                                            <ToniqButton
                                                                                text="Cancel"
                                                                                onClick={
                                                                                    cancelOffer
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <ToniqMiddleEllipsis
                                                                                externalLink={`https://icscan.io/account/${offer.buyer}`}
                                                                                letterCount={5}
                                                                                text={offer.buyer.toText()}
                                                                            />
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={2}
                                                                        md={3}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'right',
                                                                            fontWeight: '700',
                                                                            color: toniqColors
                                                                                .pageInteraction
                                                                                .foregroundColor,
                                                                        }}
                                                                    >
                                                                        +
                                                                        {icpToString(
                                                                            offer.amount,
                                                                            true,
                                                                            true,
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            </DropShadowCard>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                <div className={classes.pagination}>
                                                    <ToniqPagination
                                                        currentPage={offerPage + 1}
                                                        pageCount={offers.length}
                                                        pagesShown={6}
                                                        onPageChange={event => {
                                                            setOfferPage(event.detail - 1);
                                                            setOfferListing(false);
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        ) : (
                                            <Grid className={classes.accordionWrapper}>
                                                <span className={classes.offerDesc}>
                                                    There are currently no offers!
                                                </span>
                                            </Grid>
                                        )}
                                    </>
                                ) : (
                                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                                )}
                            </Accordion>
                            <Accordion title="Attributes" open={true} center={true}>
                                {attributes ? (
                                    <>
                                        {attributes.length > 0 ? (
                                            <Grid container className={classes.accordionWrapper}>
                                                <Grid
                                                    container
                                                    className={classes.attributeWrapper}
                                                    spacing={2}
                                                >
                                                    {attributes.map((attribute, attributeIndex) => (
                                                        <Grid
                                                            item
                                                            key={attributeIndex}
                                                            xs={12}
                                                            md={3}
                                                        >
                                                            <DropShadowCard
                                                                enableHover
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    padding: '0',
                                                                    minHeight: 132,
                                                                }}
                                                            >
                                                                <span
                                                                    className={
                                                                        classes.attributeHeader
                                                                    }
                                                                >
                                                                    <span
                                                                        style={cssToReactStyleObject(
                                                                            toniqFontStyles.paragraphFont,
                                                                        )}
                                                                    >
                                                                        {attribute.category}
                                                                    </span>
                                                                </span>
                                                                <Grid
                                                                    container
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        textAlign: 'center',
                                                                        padding: '8px 8px 16px 8px',
                                                                        flexGrow: 1,
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            ...cssToReactStyleObject(
                                                                                toniqFontStyles.h3Font,
                                                                            ),
                                                                            ...cssToReactStyleObject(
                                                                                toniqFontStyles.boldFont,
                                                                            ),
                                                                            display: '-webkit-box',
                                                                            overflow: 'hidden',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient:
                                                                                'vertical',
                                                                        }}
                                                                    >
                                                                        {attribute.value}
                                                                    </span>
                                                                    {/* <Grid item>
                                      <ToniqChip className="toniq-chip-secondary" text={''}></ToniqChip>
                                    </Grid> */}
                                                                </Grid>
                                                            </DropShadowCard>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid className={classes.accordionWrapper}>
                                                <span className={classes.offerDesc}>
                                                    No Attributes
                                                </span>
                                            </Grid>
                                        )}
                                    </>
                                ) : (
                                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                                )}
                            </Accordion>
                            <Accordion title="Activity" open={true} center={true}>
                                {activity ? (
                                    <>
                                        {activity.length > 0 ? (
                                            <Grid container className={classes.accordionWrapper}>
                                                <Grid container className={classes.tableHeader}>
                                                    <Grid
                                                        item
                                                        xs={8}
                                                        sm={6}
                                                        md={4}
                                                        className={classes.tableHeaderName}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        Date
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={2}
                                                        className={classes.tableHeaderName}
                                                    >
                                                        Activity
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={3}
                                                        className={classes.tableHeaderName}
                                                    >
                                                        Details
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        md={3}
                                                        className={classes.tableHeaderName}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'right',
                                                        }}
                                                    >
                                                        Cost
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    className={classes.ntfCardContainer}
                                                >
                                                    {activity.slice().map((transaction, index) => (
                                                        <Grid item key={index} xs={12}>
                                                            <DropShadowCard enableHover>
                                                                <Grid
                                                                    container
                                                                    className={classes.tableCard}
                                                                    alignItems="center"
                                                                    spacing={4}
                                                                >
                                                                    <Grid item xs={10} md={4}>
                                                                        <Grid
                                                                            container
                                                                            alignItems="center"
                                                                            spacing={4}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={4}
                                                                                sm={2}
                                                                                md={4}
                                                                                className={
                                                                                    classes.imageWrapperActivity
                                                                                }
                                                                            >
                                                                                {displayImage(
                                                                                    tokenid,
                                                                                )}
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={8}
                                                                                sm={10}
                                                                                md={8}
                                                                            >
                                                                                <div>
                                                                                    <span>
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
                                                                                    </span>
                                                                                    <span
                                                                                        className={
                                                                                            classes.buyerMobile
                                                                                        }
                                                                                    >
                                                                                        TO: &nbsp;
                                                                                        <ToniqMiddleEllipsis
                                                                                            externalLink={`https://icscan.io/account/${transaction.buyer}`}
                                                                                            letterCount={
                                                                                                5
                                                                                            }
                                                                                            text={
                                                                                                transaction.buyer
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={1}
                                                                        sm={2}
                                                                        md={2}
                                                                        className={
                                                                            classes.buyerDesktop
                                                                        }
                                                                        style={{
                                                                            marginLeft: '-16px',
                                                                        }}
                                                                    >
                                                                        Sale
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={1}
                                                                        sm={2}
                                                                        md={3}
                                                                        className={
                                                                            classes.buyerDesktop
                                                                        }
                                                                    >
                                                                        TO: &nbsp;
                                                                        <ToniqMiddleEllipsis
                                                                            externalLink={`https://icscan.io/account/${transaction.buyer}`}
                                                                            letterCount={5}
                                                                            text={transaction.buyer}
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={2}
                                                                        md={3}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'right',
                                                                            fontWeight: '700',
                                                                            color: toniqColors
                                                                                .pageInteraction
                                                                                .foregroundColor,
                                                                        }}
                                                                    >
                                                                        +
                                                                        {icpToString(
                                                                            transaction.price,
                                                                            true,
                                                                            true,
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            </DropShadowCard>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                <div className={classes.pagination}>
                                                    <ToniqPagination
                                                        currentPage={activityPage + 1}
                                                        pageCount={transactions.length}
                                                        pagesShown={6}
                                                        onPageChange={event => {
                                                            setActivityPage(event.detail - 1);
                                                            setActivity(false);
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        ) : (
                                            <Grid className={classes.accordionWrapper}>
                                                <span className={classes.offerDesc}>
                                                    No Activity
                                                </span>
                                            </Grid>
                                        )}
                                    </>
                                ) : (
                                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                                )}
                            </Accordion>
                        </Box>
                    </Container>
                </DropShadowCard>
            </Container>
            <OfferForm
                floor={floor}
                address={props.account.address}
                balance={props.balance}
                complete={reloadOffers}
                identity={props.identity}
                alert={props.alert}
                open={openOfferForm}
                close={closeOfferForm}
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
        maxWidth: 1312,
    },
    nftImage: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: '0',
        maxWidth: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    nftVideo: {
        borderRadius: '16px',
    },
    nftIframeContainer: {
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        paddingTop: '100%',
        borderRadius: '16px',
    },
    nftIframe: {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        width: '100%',
        height: '100%',
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
    removeNativeButtonStyles: {
        background: 'none',
        padding: 0,
        margin: 0,
        border: 'none',
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        textTransform: 'inherit',
        textDecoration: 'inherit',
        '-webkit-tap-highlight-color': 'transparent',
    },
    nftDescWrapper: {
        maxWidth: 1312,
        [theme.breakpoints.up('sm')]: {
            padding: '0px 16px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0',
        },
    },
    nftDescHeader: {
        [theme.breakpoints.up('md')]: {
            margin: '16px 0',
        },
    },
    nftDesc: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '32px!important',
        [theme.breakpoints.down('md')]: {
            paddingTop: '16px!important',
        },
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'left',
        },
    },
    nftDescContainer1: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '8px',
        [theme.breakpoints.up('sm')]: {
            gap: '32px',
        },
        [theme.breakpoints.down('xs')]: {
            gap: '16px',
        },
    },
    nftDescContainer2: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '8px',
        [theme.breakpoints.up('sm')]: {
            gap: '40px',
        },
        [theme.breakpoints.down('xs')]: {
            gap: '16px',
        },
    },
    nftDescContainer3: {
        gap: '16px',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center',
        },
        [theme.breakpoints.down('md')]: {
            display: 'grid',
        },
    },
    ownerWrapper: {
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        wordBreak: 'break-all',
    },
    ownerName: {
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        color: toniqColors.pageInteraction.foregroundColor,
    },
    ownerAddress: {
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        cursor: 'pointer',
        '&:hover': {
            color: toniqColors.pageInteraction.foregroundColor,
        },
    },
    hoverText: {
        '&:hover': {
            color: toniqColors.pageInteraction.foregroundColor,
        },
    },
    imageWrapper: {
        [theme.breakpoints.up('md')]: {
            display: 'grid',
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
        },
        '& div': {
            borderRadius: '16px',
        },
        borderRadius: '16px',
        backgroundColor: '#f1f1f1',
    },
    imageWrapperActivity: {
        maxWidth: '96px',
        [theme.breakpoints.up('md')]: {
            display: 'grid',
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
        },
        '& div, & iframe': {
            borderRadius: '8px',
            backgroundColor: '#f1f1f1',
        },
    },
    offerDesc: {
        display: 'flex',
        justifyContent: 'center',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    },
    attributeWrapper: {
        [theme.breakpoints.up('md')]: {
            marginTop: '16px',
            marginBottom: '16px',
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '8px',
            marginBottom: '8px',
        },
    },
    attributeHeader: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#F1F3F6',
        width: '100%',
        padding: '4px 0',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
    },
    accordionWrapper: {
        [theme.breakpoints.up('md')]: {
            margin: '32px 0',
        },
        [theme.breakpoints.down('md')]: {
            margin: '16px 0',
        },
    },
    nftCard: {
        [theme.breakpoints.up('md')]: {
            marginTop: '32px',
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '16px',
        },
    },
    ntfCardContainer: {
        [theme.breakpoints.up('sm')]: {
            margin: '32px 0px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '16px 0px',
        },
    },
    tableHeader: {
        backgroundColor: '#F1F3F6',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            marginTop: '32px',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
            marginTop: '0px',
        },
        padding: '8px 16px',
        borderRadius: '8px',
    },
    tableHeaderName: {
        textTransform: 'uppercase',
        ...cssToReactStyleObject(toniqFontStyles.labelFont),
    },
    tableCard: {
        maxHeight: '96px',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    },
    buyerMobile: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
        },
    },
    buyerDesktop: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    blurbWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    blurb: {
        textAlign: 'center',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '& > a': {
            color: `${toniqColors.pagePrimary.foregroundColor}`,
            '&:hover': {
                color: toniqColors.pageInteractionHover.foregroundColor,
            },
        },
    },
    blurbCollapsed: {
        '-webkit-line-clamp': 3,
        overflow: 'hidden',
    },
    favourite: {
        color: toniqColors.pageInteraction.foregroundColor,
        '& > toniq-icon': {
            color: toniqColors.pageInteraction.foregroundColor,
            filter: 'none',
        },
    },
}));
