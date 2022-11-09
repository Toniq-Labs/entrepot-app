/* global BigInt */
import React, {useState} from 'react';
import {makeStyles, Container} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import extjs from '../../ic/extjs.js';
import {EntrepotNFTImage, EntrepotNFTMintNumber, EntrepotCollectionStats} from '../../utils';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import chunk from 'lodash.chunk';
import getGenes from '../../components/CronicStats';
import {cronicFilterTraits} from '../../model/constants';
import {uppercaseFirstLetterOfWord} from '../../utilities/string-utils';
import DetailSectionHeader from './Section/Header';
import DetailSectionDetails from './Section/Details';
import DetailSectionActivity from './Section/Activity';

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

const DetailBody = props => {
    const {
        index,
        canister,
        tokenid,
        offerPage,
        offerListing,
        setOfferListing,
        floor,
        setFloor,
        offers,
        reloadOffers,
        setOfferPage,
        setOpenOfferForm,
    } = props;

    const navigate = useNavigate();
    const [
        listing,
        setListing,
    ] = useState(false);
    const [
        transactions,
        setTransactions,
    ] = useState(false);

    const [
        activityPage,
        setActivityPage,
    ] = useState(0);
    const [
        owner,
        setOwner,
    ] = useState(false);
    const [
        attributes,
        setAttributes,
    ] = useState(false);
    const collection = props.collections.find(e => e.canister === canister);
    const [
        traitsData,
        setTraitsData,
    ] = useState(false);
    const [
        detailsUrl,
        setDetailsUrl,
    ] = useState(false);

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const classes = useStyles();
    const activity = transactions[activityPage];
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
                }
            });

        let {index} = extjs.decodeTokenId(tokenid);
        await getAttributes(index);
    };

    const _afterList = async () => {
        await _refresh();
    };

    const _afterBuy = async () => {
        await reloadOffers();
        await _refresh();
    };

    const getImageDetailsUrl = async (url, regExp) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const text = await blob.text();
        const simplifiedText = text.replace('\n', ' ').replace(/\s{2,}/, ' ');
        setDetailsUrl(simplifiedText.match(regExp) !== null ? simplifiedText.match(regExp)[1] : '');
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
            <div className={classes.nftImage}>
                <img src={svgUrl} alt="" className={classes.nftImage} />
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

        if (index === 99 && canister === 'kss7i-hqaaa-aaaah-qbvmq-cai')
            detailPage = 'interactive_nfts_or_videos';

        switch (detailPage) {
            // for generative collections where assets are all stored on the same canister
            // case "zvycl-fyaaa-aaaah-qckmq-cai": IC Apes doesn't work
            case 'generative_assets_on_nft_canister':
                return extractEmbeddedImage(
                    EntrepotNFTImage(canister, index, tokenid, true),
                    classes,
                );
                /* eslint-disable no-unreachable */
                break;
            /* eslint-enable */

            // for interactive NFTs or videos
            case 'interactive_nfts_or_videos':
            case TREASURECANISTER:
                return (
                    <iframe
                        frameBorder="0"
                        src={EntrepotNFTImage(canister, index, tokenid, true)}
                        alt=""
                        title={tokenid}
                        className={classes.nftIframe}
                    />
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
                    detailsUrl ? detailsUrl : EntrepotNFTImage(canister, index, tokenid, true),
                    classes,
                );

            // default case is to just use the thumbnail on the detail page
            default:
                return extractEmbeddedImage(
                    detailsUrl ? detailsUrl : EntrepotNFTImage(canister, index, tokenid, true),
                    classes,
                );
                /* eslint-disable no-unreachable */
                break;
            /* eslint-enable */
        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Container className={classes.container}>
            <Container className={classes.nftDescWrapper}>
                <DetailSectionHeader
                    index={index}
                    canister={canister}
                    tokenid={tokenid}
                    owner={owner}
                    listing={listing}
                    offers={offers}
                    transactions={transactions}
                    _afterList={_afterList}
                    _afterBuy={_afterBuy}
                    displayImage={displayImage}
                    setOpenOfferForm={setOpenOfferForm}
                    {...props}
                />
                <DetailSectionDetails
                    offerListing={offerListing}
                    floor={floor}
                    index={index}
                    canister={canister}
                    tokenid={tokenid}
                    owner={owner}
                    {...props}
                />
                <DetailSectionActivity
                    activity={activity}
                    activityPage={activityPage}
                    setActivityPage={setActivityPage}
                    transactions={transactions}
                    {...props}
                />
            </Container>
        </Container>
    );
};
export default DetailBody;

const useStyles = makeStyles(theme => ({
    container: {
        maxWidth: 1312,
        [theme.breakpoints.up('md')]: {
            marginTop: '32px',
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '16px',
        },
    },
    nftImage: {
        backgroundColor: '#f1f1f1',
        borderRadius: '16px',
        maxHeight: '100%',
        maxWidth: '604px',
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
        objectFit: 'contain',
    },
    nftVideo: {
        borderRadius: '16px',
    },
    nftIframe: {
        borderRadius: '16px',
        maxHeight: '100%',
        maxWidth: '604px',
        cursor: 'pointer',
        minHeight: '500px',
        height: '100%',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
        overflow: 'hidden',
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
}));
