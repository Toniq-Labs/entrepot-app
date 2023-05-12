import React, {useState} from 'react';
import {makeStyles, Container} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import {EntrepotCollectionStats} from '../../utils';
import {redirectIfBlockedFromEarnFeatures} from '../../location/redirect-from-marketplace';
import {chunk} from 'lodash';
import getGenes from '../../components/CronicStats';
import {cronicFilterTraits} from '../../model/constants';
import {uppercaseFirstLetterOfWord} from '../../utilities/string-utils';
import DetailSectionHeader from './Section/Header';
import DetailSectionDetails from './Section/Details';
import DetailSectionActivity from './Section/Activity';
import {
    defaultEntrepotApi,
    createEntrepotApiWithIdentity,
    createCloudFunctionsEndpointUrl,
} from '../../typescript/api/entrepot-apis/entrepot-data-api';
import {decodeNftId} from '../../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../../typescript/data/nft/nft-mint-number';

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

const DetailBody = props => {
    const {
        index,
        canister,
        tokenid,
        offerListing,
        floor,
        setFloor,
        offers,
        reloadOffers,
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

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const classes = useStyles();
    const activity = transactions[activityPage];
    const _refresh = async () => {
        reloadOffers();
        await fetch(
            createCloudFunctionsEndpointUrl([
                'token',
                tokenid,
            ]),
        )
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

        let {index} = decodeNftId(tokenid);
        await getAttributes(index);
    };

    const _afterList = async () => {
        await _refresh();
    };

    const _afterBuy = async () => {
        await reloadOffers();
        await _refresh();
    };

    useInterval(_refresh, 2 * 1000);
    useInterval(() => {
        var nf = EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '';
        setFloor(nf);
    }, 10 * 1000);

    const cancelOffer = async () => {
        props.loader(true, 'Cancelling offer...');
        const entrepotApi = createEntrepotApiWithIdentity(props.identity);
        await entrepotApi.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').cancelOffer(tokenid);
        await reloadOffers();
        props.loader(false);
        props.alert('Offer cancelled', 'Your offer was cancelled successfully!');
    };

    const acceptOffer = async offer => {
        if (await props.confirm('Please confirm', 'Are you sure you want to accept this offer?')) {
            props.loader(true, 'Accepting offer...');
            const entrepotApi = createEntrepotApiWithIdentity(props.identity);
            var offersAPI = entrepotApi.canister('fcwhh-piaaa-aaaak-qazba-cai');
            var memo = await offersAPI.createMemo2(tokenid, offer.offerer, offer.amount);
            await entrepotApi
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

    const getAttributes = async index => {
        let traitsCategories;
        if (typeof traitsData === 'object' && traitsData.length) {
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
        if (typeof traitsData === 'object' && traitsData.length) {
            traits = traitsData[1][
                getNftMintNumber({
                    collectionId: collection.canister,
                    nftIndex: index,
                }) - 1
            ][1].map(trait => {
                const traitCategory = trait[0];
                const traitValue = trait[1];

                return {
                    category: uppercaseFirstLetterOfWord(traitsCategories[traitCategory].category),
                    value: uppercaseFirstLetterOfWord(
                        typeof traitsCategories[traitCategory].values[traitValue] === 'string'
                            ? traitsCategories[traitCategory].values[traitValue]
                            : Boolean(
                                  traitsCategories[traitCategory].values[traitValue],
                              ).toString(),
                    ),
                };
            });
            setAttributes(traits);
        } else if (
            typeof traitsData === 'object' &&
            !traitsData.length &&
            collection?.route !== 'cronics'
        ) {
            setAttributes([]);
        } else if (
            typeof traitsData === 'object' &&
            !traitsData.length &&
            collection?.route === 'cronics'
        ) {
            var result = await defaultEntrepotApi.token(canister).listings();

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

    const getPriceData = () => {
        if (listing.price > 0n) {
            return listing.price;
        } else if (offers && offers.length > 0) {
            return offers[0][0].amount;
        } else if (transactions && transactions.length > 0) {
            return transactions[0][0].price;
        } else {
            return undefined;
        }
    };

    React.useEffect(() => {
        props.loader(true);
        _refresh().then(() => props.loader(false));

        loadTraits().then(traits => {
            if (traits) {
                setTraitsData(traits);
            } else {
                setTraitsData([]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Container className={`${classes.container} detail-body-container`}>
            <Container className={classes.nftDescWrapper}>
                <DetailSectionHeader
                    index={index}
                    canister={canister}
                    tokenid={tokenid}
                    owner={owner}
                    listing={listing}
                    getPriceData={getPriceData}
                    _afterList={_afterList}
                    _afterBuy={_afterBuy}
                    setOpenOfferForm={setOpenOfferForm}
                    {...props}
                />
                <DetailSectionDetails
                    offerListing={offerListing}
                    getPriceData={getPriceData}
                    floor={floor}
                    canister={canister}
                    tokenid={tokenid}
                    owner={owner}
                    attributes={attributes}
                    cancelOffer={cancelOffer}
                    acceptOffer={acceptOffer}
                    setOpenOfferForm={setOpenOfferForm}
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
        padding: 0,
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
    },
}));
