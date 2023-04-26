import {checkIfToniqEarnAllowed} from './location/geo-ip';
import {EarnFeaturesBlocked} from './views/EarnBlocked';
import {Ed25519KeyIdentity} from '@dfinity/identity';
import {EntrepotCreate} from './typescript/ui/elements/main-content-pages/create-page/toniq-entrepot-create-page.element';
import {EntrepotFooter} from './typescript/ui/elements/main-content-pages/main-footer/toniq-entrepot-main-footer.element';
import {fromHexString} from './typescript/augments/string';
import {EntrepotMarketplace} from './typescript/ui/elements/main-content-pages/marketplace-page/toniq-entrepot-marketplace-page.element';
import {EntrepotProfile} from './typescript/ui/elements/main-content-pages/profile-page/toniq-entrepot-profile-page.element';
import {EntrepotTermsOfService} from './typescript/ui/elements/legal-pages/terms-of-service-page/toniq-entrepot-terms-of-service-page.element';
import {EntrepotSaleRoutePage} from './typescript/ui/elements/main-content-pages/sale-page/route/toniq-entrepot-sale-route-page.element';
import {EntrepotTestPage} from './typescript/ui/elements/main-content-pages/test-page/toniq-entrepot-test-page.element';
import {getAllCollectionsWithCaching} from './typescript/data/local-cache/dexie/get-collections';
import {isProd} from './typescript/environment/environment-by-url';
import {makeStyles} from '@material-ui/core/styles';
import {MissingPage404} from './views/MissingPage404';
import {Route, Routes, useLocation} from 'react-router-dom';
import {StoicIdentity} from 'ic-stoic-identity';
import {throttle} from './typescript/augments/function';
import {useNavigate, matchPath} from 'react-router';
import AlertDialog from './components/AlertDialog';
import Backdrop from '@material-ui/core/Backdrop';
import BuyForm from './components/BuyForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmDialog from './components/ConfirmDialog';
import Contact from './views/Contact';
import Detail from './views/Detail/Detail.js';
import DfinityDeckSaleComponent from './components/sale/DfinityDeckSaleComponent';
import extjs from './ic/extjs.js';
import getNri from './ic/nftv.js';
import legacyPrincipalPayouts from './payments.json';
import ListingForm from './components/ListingForm';
import Listings from './views/Listings/Listings.js';
import ListingsActivity from './views/Listings/ListingsActivity';
import UserCollection from './components/UserCollection';
import UserLoan from './components/UserLoan';
import {EntrepotSale} from './typescript/ui/elements/main-content-pages/sale-page/toniq-entrepot-sale-page.element';
import Mint from './views/Mint';
import Navbar from './components/Navbar';
import Opener from './components/Opener';
import OpenLogin from '@toruslabs/openlogin';
import PawnForm from './components/PawnForm';
import React from 'react';
import TransferForm from './components/TransferForm';
import UserActivity from './components/UserActivity';
import VoltTransferForm from './components/VoltTransferForm';
import {
    EntrepotUpdateUSD,
    EntrepotUpdateLiked,
    EntrepotClearLiked,
    EntrepotUpdateStats,
} from './utils';
import {
    createEntrepotApiWithIdentity,
    defaultEntrepotApi,
} from './typescript/api/entrepot-apis/entrepot-data-api';
import {getExtCanisterId} from './typescript/data/canisters/canister-details/wrapped-canister-id';
import {treasureCanisterId} from './typescript/data/canisters/treasure-canister';
import {encodeNftId, decodeNftId} from './typescript/data/nft/nft-id';

const transactionFee = 10000;
const transactionMin = 100000;
const singleSecond = 1000;
const singleMinute = 60 * singleSecond;
const PURCHASE_TIME_LIMIT = 1.85 * singleMinute;

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: 1600,
        color: '#fff',
    },
    inner: {
        flexGrow: 1,
        padding: 32,
        [theme.breakpoints.down('xs')]: {
            padding: 16,
        },
    },
    content: {
        flexGrow: 1,
        marginTop: 73,
        background: '#FFF',
        zIndex: 90,
    },
}));
const emptyAlert = {
    title: '',
    message: '',
};
function capitalize(str) {
    var strVal = '';
    str = str.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
        strVal +=
            str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' ';
    }
    return strVal;
}
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
const _getRandomBytes = () => {
    var bs = [];
    for (var i = 0; i < 32; i++) {
        bs.push(Math.floor(Math.random() * 256));
    }
    return bs;
};
var processingPayments = false;
const emptyListing = {
    price: '',
    tokenid: '',
};
var buttonLoader = false;
var refresher = false;
var otherPrincipalsForPlug = [
    'xkbqi-2qaaa-aaaah-qbpqq-cai',
    'd3ttm-qaaaa-aaaai-qam4a-cai',
    'qcg3w-tyaaa-aaaah-qakea-cai',
    '4nvhy-3qaaa-aaaah-qcnoq-cai',
    'ryjl3-tyaaa-aaaaa-aaaba-cai',
    'qgsqp-byaaa-aaaah-qbi4q-cai',
    '6z5wo-yqaaa-aaaah-qcsfa-cai',
    'flvm3-zaaaa-aaaak-qazaq-cai',
    'fcwhh-piaaa-aaaak-qazba-cai',
    'ffxbt-cqaaa-aaaak-qazbq-cai',
];

export default function App() {
    const {pathname} = useLocation();
    const classes = useStyles();

    React.useEffect(() => {
        setRootPage(pathname.split('/')[1]);
        window.scrollTo(0, 0);
    }, [pathname]);

    const [
        collections,
        setCollections,
    ] = React.useState([]);
    const [
        collectionMap,
        setCollectionMap,
    ] = React.useState({});
    const [
        appLoaded,
        setAppLoaded,
    ] = React.useState(false);

    const [
        isToniqEarnAllowed,
        setToniqEarnAllowed,
    ] = React.useState(undefined);

    const [
        buyFormData,
        setBuyFormData,
    ] = React.useState(emptyListing);
    const [
        showBuyForm,
        setShowBuyForm,
    ] = React.useState(false);
    const [
        stats,
        setStats,
    ] = React.useState([]);
    const [
        openListingForm,
        setOpenListingForm,
    ] = React.useState(false);
    const [
        openVoltTransferForm,
        setOpenVoltTransferForm,
    ] = React.useState(false);
    const [
        openTransferForm,
        setOpenTransferForm,
    ] = React.useState(false);
    const [
        openPawnForm,
        setOpenPawnForm,
    ] = React.useState(false);
    const [
        playOpener,
        setPlayOpener,
    ] = React.useState(false);
    const [
        tokenNFT,
        setTokenNFT,
    ] = React.useState('');

    const [
        rootPage,
        setRootPage,
    ] = React.useState('');
    const [
        loaderOpen,
        setLoaderOpen,
    ] = React.useState(false);
    const [
        loaderText,
        setLoaderText,
    ] = React.useState('');
    const [
        alertData,
        setAlertData,
    ] = React.useState(emptyAlert);
    const [
        confirmData,
        setConfirmData,
    ] = React.useState(emptyAlert);
    const [
        showAlert,
        setShowAlert,
    ] = React.useState(false);
    const [
        showConfirm,
        setShowConfirm,
    ] = React.useState(false);

    const [
        showHeaderShadow,
        setShowHeaderShadow,
    ] = React.useState(false);
    //Account

    const [
        identity,
        setIdentity,
    ] = React.useState(false);
    const [
        loggedIn,
        setLoggedIn,
    ] = React.useState(false);
    const [
        address,
        setAddress,
    ] = React.useState(false);
    const [
        balance,
        setBalance,
    ] = React.useState(0);
    const [
        accounts,
        setAccounts,
    ] = React.useState(false);
    const [
        currentAccount,
        setCurrentAccount,
    ] = React.useState(0);

    const _updates = async () => {
        EntrepotUpdateUSD();
        setStats(await EntrepotUpdateStats());
    };

    const navigate = useNavigate();

    const _buyForm = (tokenid, price) => {
        return new Promise(async (resolve, reject) => {
            let {index, canister} = decodeNftId(tokenid);
            setBuyFormData({
                index: index,
                canister: canister,
                tokenid: tokenid,
                price: price,
                handler: v => {
                    setShowBuyForm(false);
                    resolve(v);
                    setTimeout(() => setBuyFormData(emptyListing), 100);
                },
            });
            setShowBuyForm(true);
        });
    };
    const repayContract = async (token, repaymentAddress, amount, reward, refresh) => {
        loader(true, 'Making repayment...');
        try {
            const rBalance = BigInt(await defaultEntrepotApi.token().getBalance(repaymentAddress));
            var owed = amount + reward - rBalance;
            if (owed > 0n) {
                if (balance < owed + 10000n) {
                    return alert(
                        'There was an error',
                        'Your balance is insufficient to complete this transaction',
                    );
                }
                loader(true, 'Transferring ICP...');
                createEntrepotApiWithIdentity(identity)
                    .token()
                    .transfer(
                        identity.getPrincipal(),
                        currentAccount,
                        repaymentAddress,
                        owed,
                        10000,
                    );
            }
            loader(true, 'Closing contract...');
            var r2 = await createEntrepotApiWithIdentity(identity)
                .canister(treasureCanisterId)
                .tp_close(token);
            if (r2.hasOwnProperty('err')) throw r2.err;
            if (!r2.hasOwnProperty('ok')) throw 'Unknown Error';
            loader(true, 'Reloading contracts...');
            await refresh();
            loader(false);
            return alert(
                'Contract Closed',
                'You have repaid this contract, and you will receive your NFT back shortly.',
            );
        } catch (e) {
            loader(false);
            return error(e);
        }
    };
    const cancelRequest = async (tokenid, refresh) => {
        loader(false);
        var v = await confirm('Please confirm', 'Are you sure you want to cancel this request?');
        if (v) {
            try {
                loader(true, 'Cancelling request...');
                var r = createEntrepotApiWithIdentity(identity)
                    .canister(treasureCanisterId)
                    .tp_cancel(tokenid);
                if (r.hasOwnProperty('err')) throw r.err;
                if (!r.hasOwnProperty('ok')) throw 'Unknown Error';
                loader(true, 'Reloading requests...');
                await refresh();
                loader(false);
                return alert('Request Cancelled', 'Your Earn Request was cancelled successfully!');
            } catch (e) {
                loader(false);
                return error(e);
            }
        }
    };
    const fillRequest = async (tokenid, amount, refresh) => {
        loader(false);
        var v = await confirm(
            'Please confirm',
            'Are you sure you want to accept this request and transfer ' +
                (Number(amount) / 100000000).toFixed(2) +
                'ICP?',
        );
        if (v) {
            try {
                loader(true, 'Accepting request...');
                var r = createEntrepotApiWithIdentity(identity)
                    .canister(treasureCanisterId)
                    .tp_fill(tokenid, accounts[currentAccount].address, amount);
                if (r.hasOwnProperty('err')) throw r.err;
                if (!r.hasOwnProperty('ok')) throw 'Unknown Error';
                var payToAddress = r.ok;
                loader(true, 'Transferring ICP...');
                createEntrepotApiWithIdentity(identity)
                    .token()
                    .transfer(identity.getPrincipal(), currentAccount, payToAddress, amount, 10000);
                loader(true, 'Finalizing contract...');
                var r2 = createEntrepotApiWithIdentity(identity)
                    .canister(treasureCanisterId)
                    .tp_settle(payToAddress);
                loader(true, 'Reloading requests...');
                await refresh();
                loader(false);
                return alert(
                    'Contract Accepted',
                    'You have accepted an Earn Contract, and you will receive an NFT representing that contract shortly.',
                );
            } catch (e) {
                loader(false);
                return error(e);
            }
        }
    };
    const buyNft = async (canisterId, index, listing, ah) => {
        if (balance < listing.price + 10000n)
            return alert(
                'There was an error',
                'Your balance is insufficient to complete this transaction',
            );
        const purchaseStartTime = Date.now();
        var tokenid = encodeNftId(canisterId, index);
        try {
            var answer = await _buyForm(tokenid, listing.price);
            if (!answer) {
                loader(false);
                return false;
            }
            loader(true, 'Locking NFT...');
            const entrepotApi = createEntrepotApiWithIdentity(identity);
            var r = await entrepotApi
                .canister(canisterId)
                .lock(tokenid, listing.price, accounts[currentAccount].address, _getRandomBytes());
            if (r.hasOwnProperty('err')) throw r.err;
            var payToAddress = r.ok;
            const lockTimeDuration = Date.now() - purchaseStartTime;
            if (lockTimeDuration > PURCHASE_TIME_LIMIT) {
                throw new Error(
                    `Purchase timed out: took ${(lockTimeDuration / 1000).toFixed(1)} seconds`,
                );
            }
            loader(true, 'Transferring ICP...');
            await entrepotApi
                .token()
                .transfer(
                    identity.getPrincipal(),
                    currentAccount,
                    payToAddress,
                    listing.price,
                    10000,
                );
            var r3;
            loader(true, 'Settling purchase...');
            await entrepotApi.canister(canisterId).settle(tokenid);
            loader(false);
            alert(
                'Transaction complete',
                'Your purchase was made successfully - your NFT will be sent to your address shortly',
            );
            if (ah) await ah();
            return true;
        } catch (e) {
            loader(false);
            console.log(e);
            alert(
                'There was an error',
                e.Other ?? 'You may need to enable cookies or try a different browser',
            );
            return false;
        }
    };

    const whitelistedCanisters = () =>
        collections.map(a => a.canister).concat(otherPrincipalsForPlug);
    const processPayments = async () => {
        loader(true, 'Processing payments... (this can take a few minutes)');
        await _processPayments();
        loader(false);
    };

    const _processPayments = async () => {
        if (!identity) return;
        if (processingPayments) return;
        processingPayments = true;

        //Process legacy payments first
        var p = identity.getPrincipal().toText();
        if (legacyPrincipalPayouts.hasOwnProperty(p)) {
            for (const canister in legacyPrincipalPayouts[p]) {
                loader(true, 'Payments found, processing...');
                await _processPaymentForCanister(collections.find(a => a.canister == canister));
            }
        }
        loader(true, 'Processing payments... (this can take a few minutes)');

        var canistersToProcess = [
            'po6n2-uiaaa-aaaaj-qaiua-cai',
            'pk6rk-6aaaa-aaaae-qaazq-cai',
            'nges7-giaaa-aaaaj-qaiya-cai',
        ];
        var _collections = collections.filter(a => canistersToProcess.indexOf(a.canister) >= 0);
        for (var j = 0; j < _collections.length; j++) {
            loader(true, 'Processing payments... (this can take a few minutes)');
            await _processPaymentForCanister(_collections[j]);
        }
        processingPayments = false;
        return true;
    };
    const _processPaymentForCanister = async _collection => {
        if (
            typeof _collection == 'undefined' ||
            !_collection ||
            !_collection.hasOwnProperty('legacy') ||
            !_collection.legacy
        )
            return true;
        const entrepotApi = createEntrepotApiWithIdentity(identity);
        var payments = await entrepotApi.canister(_collection.canister).payments();
        if (payments.length === 0) return true;
        if (payments[0].length === 0) return true;
        if (payments[0].length === 1) loader(true, 'Payment found, processing...');
        else loader(true, 'Payments found, processing...');
        var a, b, c, payment;
        for (var i = 0; i < payments[0].length; i++) {
            payment = payments[0][i];
            a = extjs.toAddress(identity.getPrincipal().toText(), payment);
            b = Number(await defaultEntrepotApi.token().getBalance(a));
            c = Math.round(b * _collection.commission);
            try {
                var txs = [];
                if (b > transactionMin) {
                    txs.push(
                        entrepotApi
                            .token()
                            .transfer(
                                identity.getPrincipal().toText(),
                                payment,
                                address,
                                BigInt(b - (transactionFee + c)),
                                BigInt(transactionFee),
                            ),
                    );
                    txs.push(
                        entrepotApi
                            .token()
                            .transfer(
                                identity.getPrincipal().toText(),
                                payment,
                                _collection.legacy,
                                BigInt(c - transactionFee),
                                BigInt(transactionFee),
                            ),
                    );
                }
                await Promise.all(txs);
                console.log('Payment extracted successfully', _collection.canister);
            } catch (e) {
                console.log(e);
            }
        }
        return true;
    };
    const logout = async () => {
        localStorage.removeItem('_loginType');
        StoicIdentity.disconnect();
        setIdentity(false);
        setAccounts([]);
        setBalance(0);
    };
    var openlogin = false;
    const loadOpenLogin = async () => {
        if (!openlogin) {
            openlogin = new OpenLogin({
                clientId:
                    // cspell:disable-next-line
                    'BHGs7-pkZO-KlT_BE6uMGsER2N1PC4-ERfU_c7BKN1szvtUaYFBwZMC2cwk53yIOLhdpaOFz4C55v_NounQBOfU',
                network: 'mainnet',
                uxMode: 'popup',
            });
        }
        await openlogin.init();
        return openlogin;
    };
    const login = async t => {
        loader(true, 'Connecting your wallet...');
        try {
            var id;
            switch (t) {
                case 'stoic':
                    id = await StoicIdentity.connect();
                    if (id) {
                        setIdentity(id);
                        id.accounts().then(accounts => {
                            setAccounts(JSON.parse(accounts));
                        });
                        setCurrentAccount(0);
                        localStorage.setItem('_loginType', t);
                    } else {
                        throw new Error('Failed to connect to your wallet');
                    }
                    break;
                case 'torus':
                    const openlogin = await loadOpenLogin();
                    if (openlogin.privKey) {
                        await openlogin.logout();
                    }
                    await openlogin.login();
                    id = Ed25519KeyIdentity.generate(
                        new Uint8Array(fromHexString(openlogin.privKey)),
                    );
                    if (id) {
                        setIdentity(id);
                        setAccounts([
                            {
                                name: 'Torus Wallet',
                                address: extjs.toAddress(id.getPrincipal().toText(), 0),
                            },
                        ]);
                        setCurrentAccount(0);
                        localStorage.setItem('_loginType', t);
                    } else {
                        throw new Error('Failed to connect to your wallet');
                    }
                    break;
                case 'plug':
                case 'infinityWallet':
                    var result = await window.ic[t].requestConnect({
                        whitelist: whitelistedCanisters(),
                    });
                    if (result) {
                        var p = await window.ic[t].getPrincipal();
                        var id = {
                            type: t,
                            getPrincipal: () => p,
                        };
                        setIdentity(id);
                        setAccounts([
                            {
                                name: capitalize(t),
                                address: extjs.toAddress(id.getPrincipal().toText(), 0),
                            },
                        ]);
                        setCurrentAccount(0);
                        localStorage.setItem('_loginType', t);
                    } else {
                        throw new Error('Failed to connect to your wallet');
                    }
                    break;
                default:
                    break;
            }
        } catch (e) {
            error(e);
        }
        loader(false);
    };

    useInterval(() => EntrepotUpdateLiked(identity), 10 * 1000);
    useInterval(() => updateCollections(), 5 * 60 * 1000);
    useInterval(_updates, 2 * 60 * 1000);
    const alert = (title, message, buttonLabel) => {
        return new Promise(async (resolve, reject) => {
            setAlertData({
                title: title,
                message: message,
                buttonLabel: buttonLabel,
                handler: () => {
                    setShowAlert(false);
                    resolve(true);
                    setTimeout(() => setAlertData(emptyAlert), 100);
                },
            });
            setShowAlert(true);
        });
    };
    const error = e => {
        alert('There was an error', e);
    };
    const confirm = (title, message, buttonCancel, buttonConfirm) => {
        return new Promise(async (resolve, reject) => {
            setConfirmData({
                title: title,
                message: message,
                buttonCancel: buttonCancel,
                buttonConfirm: buttonConfirm,
                handler: v => {
                    setShowConfirm(false);
                    resolve(v);
                    setTimeout(() => setConfirmData(emptyAlert), 100);
                },
            });
            setShowConfirm(true);
        });
    };
    const loader = (l, t) => {
        setLoaderText(t);
        setLoaderOpen(l);
        if (!l) {
            setLoaderText('');
        }
    };

    const unpackNft = (token, loader, refresh) => {
        setTokenNFT(token);
        buttonLoader = loader;
        refresher = refresh;
        setPlayOpener(true);
    };
    const closeUnpackNft = token => {
        setPlayOpener(false);
        refresher();
        setTimeout(() => setTokenNFT(''), 300);
    };
    const listNft = (token, loader, refresh) => {
        setTokenNFT(token);
        buttonLoader = loader;
        refresher = refresh;
        setOpenListingForm(true);
    };
    const pawnNft = (token, loader, refresh) => {
        setTokenNFT(token);
        buttonLoader = loader;
        refresher = refresh;
        setOpenPawnForm(true);
    };
    const voltTransfer = async (loader, refresh) => {
        buttonLoader = loader;
        refresher = refresh;
        setOpenVoltTransferForm(true);
    };
    const transferNft = async (token, loader, refresh) => {
        setTokenNFT(token);
        buttonLoader = loader;
        refresher = refresh;
        setOpenTransferForm(true);
    };
    const closeListingForm = () => {
        setOpenListingForm(false);
        setTimeout(() => setTokenNFT(''), 300);
    };
    const closeVoltTransferForm = () => {
        setOpenVoltTransferForm(false);
    };
    const closeTransferForm = () => {
        setOpenTransferForm(false);
        setTimeout(() => setTokenNFT(''), 300);
    };
    const closePawnForm = () => {
        setOpenPawnForm(false);
        setTimeout(() => setTokenNFT(''), 300);
    };

    const unwrapNft = async (token, loader, refresh) => {
        loader(true, 'Unwrapping NFT...');
        var canister = decodeNftId(token.id).canister;
        var r = await createEntrepotApiWithIdentity(identity)
            .canister(canister)
            .unwrap(token.id, [extjs.toSubAccount(currentAccount ?? 0)]);
        if (!r) {
            loader(false);
            return error("Couldn't unwrap!");
        }
        loader(true, 'Loading NFTs...');
        if (refresh) await refresh();
        loader(false);
        return alert('Success!', 'Your NFT has been unwrapped!');
    };
    const wrapAndListNft = async (token, loader, refresh) => {
        var v = await confirm(
            'We need to wrap this',
            'You are trying to list a non-compatible NFT for sale. We need to securely wrap this NFT first. Would you like to proceed?',
        );
        if (v) {
            var decoded = decodeNftId(token.id);
            var canister = getExtCanisterId([decoded.canister]);
            if (loader) loader(true, 'Creating wrapper...this may take a few minutes');
            try {
                var r = createEntrepotApiWithIdentity(identity).canister(canister).wrap(token.id);
                if (!r) return error('There was an error wrapping this NFT!');
                if (loader) loader(true, 'Sending NFT to wrapper...');
                var r2 = await createEntrepotApiWithIdentity(identity)
                    .token(token.id)
                    .transfer(
                        identity.getPrincipal().toText(),
                        currentAccount,
                        canister,
                        BigInt(1),
                        BigInt(0),
                        '00',
                        false,
                    );
                if (!r2) return error('There was an error wrapping this NFT!');
                if (loader) loader(true, 'Wrapping NFT...');
                await createEntrepotApiWithIdentity(identity).canister(canister).mint(token.id);
                if (!r) return error('There was an error wrapping this NFT!');
                if (loader) loader(true, 'Loading NFTs...');
                if (refresh) await refresh();
                if (loader) loader(false);
                //New token id
                token.id = encodeNftId(canister, decoded.index);
                token.canister = canister;
                token.wrapped = true;
                listNft(token, loader, refresh);
            } catch (e) {
                if (loader) loader(false);
                console.log(e);
                return error('Unknown error!');
            }
        }
    };
    const updateCollections = async () => {
        const collectionMap = await getAllCollectionsWithCaching();
        const allCollectionsWithCaching = Object.values(collectionMap);
        setCollections(allCollectionsWithCaching);
        setCollectionMap(collectionMap);
        allCollectionsWithCaching.filter(a => a?.nftv).forEach(a => getNri(a.id));

        if (isToniqEarnAllowed === undefined) {
            setToniqEarnAllowed(await checkIfToniqEarnAllowed());
        }
        if (!appLoaded) {
            setAppLoaded(true);
        }
    };

    const showFooter = () => {
        const match = matchPath({path: '/marketplace/:route'}, pathname);
        return match ? 'none' : 'flex';
    };

    React.useEffect(() => {
        _updates();
        updateCollections();
        window.document.addEventListener(
            'scroll',
            throttle(250, () => {
                if (window.document.body.parentElement.scrollTop <= 10) {
                    setShowHeaderShadow(false);
                } else {
                    setShowHeaderShadow(true);
                }
            }),
        );
        if (identity) EntrepotUpdateLiked(identity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const profileRoutes = (
        <>
            <Route
                path=":tab"
                exact
                element={
                    <EntrepotProfile
                        style={{
                            margin: '-32px',
                        }}
                        onSellClick={event =>
                            listNft({
                                ...event.detail,
                                id: event.detail.nftId,
                            })
                        }
                        onNftClick={event => {
                            navigate({
                                pathname: '/marketplace/asset/' + event.detail.nftId,
                            });
                        }}
                        onTransferClick={event => transferNft(event.detail)}
                        userIdentity={identity || undefined}
                        userAccount={accounts[currentAccount]}
                        collectionMap={collectionMap}
                        toniqEarnAllowed={isToniqEarnAllowed}
                    />
                }
            />
            <Route
                path=""
                exact
                element={
                    <EntrepotProfile
                        style={{
                            margin: '-32px',
                        }}
                        onSellClick={event =>
                            listNft({
                                ...event.detail,
                                id: event.detail.nftId,
                            })
                        }
                        onNftClick={event => {
                            navigate({
                                pathname: '/marketplace/asset/' + event.detail.nftId,
                            });
                        }}
                        onTransferClick={event => transferNft(event.detail)}
                        userIdentity={identity || undefined}
                        userAccount={accounts[currentAccount]}
                        collectionMap={collectionMap}
                        toniqEarnAllowed={isToniqEarnAllowed}
                    />
                }
            />
        </>
    );

    const restrictedEarnAccess = allowedAccessElement => {
        if (isToniqEarnAllowed) {
            return allowedAccessElement;
        } else {
            return <EarnFeaturesBlocked />;
        }
    };

    //Form powered
    const pawn = async (id, amount, reward, length, loader, refresh) => {
        if (loader) loader(true, 'Creating Earn Request...');
        try {
            var r = await createEntrepotApiWithIdentity(identity)
                .canister(treasureCanisterId)
                .tp_create(
                    id,
                    extjs.toSubAccount(currentAccount ?? 0),
                    BigInt(Math.floor(amount * 100000000)),
                    BigInt(length) * 24n * 60n * 60n * 1000000000n,
                    BigInt(Math.floor(reward * 100000000)),
                    2500,
                    2500,
                );
            if (r.hasOwnProperty('err')) throw r.err;
            if (!r.hasOwnProperty('ok')) throw 'Unknown Error';
            if (loader) loader(true, 'Sending NFT to canister...');
            var r2 = await createEntrepotApiWithIdentity(identity)
                .token(id)
                .transfer(
                    identity.getPrincipal().toText(),
                    currentAccount,
                    treasureCanisterId,
                    BigInt(1),
                    BigInt(0),
                    '00',
                    true,
                );
            if (loader) loader(true, 'Loading NFTs...');
            if (refresh) await refresh();
            if (loader) loader(false);
            return alert('Request Received', 'Your Earn Request was created successfully!');
        } catch (e) {
            if (loader) loader(false);
            return error(e);
        }
    };
    const _voltCreate = async showAlert => {
        loader(true, 'Creating Volt wallet...');
        try {
            var voltFactoryAPI = createEntrepotApiWithIdentity(identity).canister(
                'flvm3-zaaaa-aaaak-qazaq-cai',
            );
            var volt = await voltFactoryAPI.getOwnerCanister(identity.getPrincipal());
            if (volt.length) {
                loader(false);
                throw 'Volt wallet already exists...';
            }
            var promo = await voltFactoryAPI.hasFreeCanister(identity.getPrincipal());
            if (promo) {
                var volt = await voltFactoryAPI.create();
                if (!volt.length) throw 'This was an issue creating your Volt...';
                loader(false);
                if (showAlert)
                    alert(
                        'Volt Created',
                        'Congratulations, you were eligible for a free Volt! This is now ready to go!',
                    );
                return volt;
            } else {
                loader(false);
                if (
                    await confirm(
                        'Please confirm',
                        'To create a Volt wallet you must pay a 0.25ICP setup fee. Do you want to continue?',
                    )
                ) {
                    loader(true, 'Transferring ICP...');
                    var address = await voltFactoryAPI.getPaymentAddress(identity.getPrincipal());
                    await createEntrepotApiWithIdentity(identity)
                        .token()
                        .transfer(
                            identity.getPrincipal(),
                            currentAccount,
                            address,
                            25000000,
                            10000,
                        );
                    loader(true, 'Creating Volt wallet...');
                    var volt = await voltFactoryAPI.create();
                    if (!volt.length) throw 'This was an issue creating your Volt...';
                    loader(false);
                    if (showAlert)
                        alert('Volt Created', 'Congratulations, your Volt is now ready to go!');
                    return volt;
                } else return false;
            }
        } catch (e) {
            loader(false);
            if (showAlert) error(e);
            return false;
        }
    };
    const _voltTransfer = async (deposit, amount, loader, refresh) => {
        if (loader) {
            if (deposit) {
                loader(true, 'Transferring ICP to Volt');
            } else {
                loader(true, 'Withdrawing ICP from Volt');
            }
        }
        try {
            var voltFactoryAPI = createEntrepotApiWithIdentity(identity).canister(
                'flvm3-zaaaa-aaaak-qazaq-cai',
            );
            var volt = await voltFactoryAPI.getOwnerCanister(identity.getPrincipal());
            if (volt.length) {
            } else throw 'There was a problem finding your Volt!';
            var voltAPI = createEntrepotApiWithIdentity(identity).canister(
                volt[0].toText(),
                'volt',
            );

            if (deposit) {
                loader(true, 'Transferring ICP to Volt');
                var address = await voltAPI.getAddress();
                var r2 = createEntrepotApiWithIdentity(identity)
                    .token()
                    .transfer(identity.getPrincipal(), currentAccount, address, amount, 10000);
                if (refresh) {
                    loader(true, 'Updating Balances');
                    await refresh();
                }
                if (loader) loader(false);
                return alert('Deposit complete', 'Your transfer was successful!');
            } else {
                loader(true, 'Withdrawing ICP from Volt');
                var resp = await voltAPI.transfer({
                    standard: 'icpledger',
                    canister: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
                    to: accounts[currentAccount].address,
                    amount: amount,
                    id: [],
                    memo: [],
                    notify: [],
                    other: [],
                });
                if (resp.hasOwnProperty('ok')) {
                    if (resp.ok.success) {
                        if (refresh) {
                            loader(true, 'Updating Balances');
                            await refresh();
                        }
                        if (loader) loader(false);
                        return alert('Withdraw complete', 'Your transfer was successful!');
                    } else {
                        throw 'Transfer failed.';
                    }
                } else {
                    throw resp.err;
                }
            }
        } catch (e) {
            if (loader) loader(false);
            return error(e);
        }
    };
    const transfer = async (id, address, loader, refresh) => {
        if (loader) loader(true, 'Transferring NFT...');
        try {
            var r2 = await createEntrepotApiWithIdentity(identity)
                .token(id)
                .transfer(
                    identity.getPrincipal().toText(),
                    currentAccount,
                    address,
                    BigInt(1),
                    BigInt(0),
                    '00',
                    false,
                );
            if (!r2) return error('There was an error transferring this NFT!');
            if (loader) loader(true, 'Loading NFTs...');
            if (refresh) await refresh();
            if (loader) loader(false);
            return alert('Transaction complete', 'Your transfer was successful!');
        } catch (e) {
            if (loader) loader(false);
            return error(e);
        }
    };
    const list = async (id, price, loader, refresh) => {
        if (loader) loader(true);
        try {
            var r = await createEntrepotApiWithIdentity(identity)
                .token(id)
                .list(currentAccount, price);
            if (r) {
                if (refresh) await refresh();
                if (loader) loader(false);
                return;
            } else {
                if (loader) loader(false);
                return;
            }
        } catch (e) {
            if (loader) loader(false);
            return error(e);
        }
    };

    React.useEffect(() => {
        if (appLoaded) {
            var t = localStorage.getItem('_loginType');
            if (t) {
                switch (t) {
                    case 'stoic':
                        StoicIdentity.load()
                            .then(async identity => {
                                if (identity !== false) {
                                    //ID is a already connected wallet!
                                    setIdentity(identity);
                                    identity.accounts().then(accounts => {
                                        setAccounts(JSON.parse(accounts));
                                    });
                                } else {
                                    console.log('Error from stoic connect');
                                }
                            })
                            .catch(e => {});
                        break;
                    case 'torus':
                        loadOpenLogin().then(openlogin => {
                            if (!openlogin.privKey || openlogin.privKey.length === 0) {
                            } else {
                                var id = Ed25519KeyIdentity.generate(
                                    new Uint8Array(fromHexString(openlogin.privKey)),
                                );
                                if (id) {
                                    setIdentity(id);
                                    setAccounts([
                                        {
                                            name: 'Torus Wallet',
                                            address: extjs.toAddress(id.getPrincipal().toText(), 0),
                                        },
                                    ]);
                                }
                            }
                        });
                        break;
                    case 'plug':
                        (async () => {
                            const connected = await window.ic[t].isConnected();
                            if (connected) {
                                const {agent, principalId} =
                                    window.ic[t].sessionManager.sessionData;
                                if (!agent) {
                                    await window.ic[t].requestConnect({
                                        whitelist: whitelistedCanisters(),
                                    });
                                }
                                var p = await window.ic[t].getPrincipal();
                                var id = {
                                    type: t,
                                    getPrincipal: () => p,
                                };
                                setIdentity(id);
                                setAccounts([
                                    {
                                        name: capitalize(t),
                                        address: extjs.toAddress(principalId, 0),
                                    },
                                ]);
                            }
                        })();
                        break;
                    case 'infinityWallet':
                        (async () => {
                            const connected = await window.ic[t].isConnected();
                            if (!connected) {
                                await window.ic[t].requestConnect({
                                    whitelist: whitelistedCanisters(),
                                });
                            }
                            var p = await window.ic[t].getPrincipal();
                            var id = {
                                type: t,
                                getPrincipal: () => p,
                            };
                            setIdentity(id);
                            setAccounts([
                                {
                                    name: capitalize(t),
                                    address: extjs.toAddress(id.getPrincipal().toText(), 0),
                                },
                            ]);
                        })();
                        break;
                    default:
                        break;
                }
            }
            if (identity) EntrepotUpdateLiked(identity);
        }
    }, [appLoaded]);
    React.useEffect(() => {
        if (identity) {
            setLoggedIn(true);
            setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
            //This is where we check for payments
            if (legacyPrincipalPayouts.hasOwnProperty(identity.getPrincipal().toText())) {
                for (const canister in legacyPrincipalPayouts[identity.getPrincipal().toText()]) {
                    if (legacyPrincipalPayouts[identity.getPrincipal().toText()][canister].length) {
                        //alert("You have payments owing, please use the Check Payments button");
                        break;
                    }
                }
            }
            EntrepotUpdateLiked(identity);
        } else {
            EntrepotClearLiked();
            setLoggedIn(false);
            setAddress(false);
            setAccounts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [identity]);

    return (
        <>
            {appLoaded ? (
                <>
                    <Navbar
                        showHeaderShadow={showHeaderShadow}
                        view={rootPage}
                        processPayments={processPayments}
                        voltCreate={_voltCreate}
                        setBalance={setBalance}
                        voltTransfer={voltTransfer}
                        identity={identity}
                        account={accounts.length > 0 ? accounts[currentAccount] : false}
                        loader={loader}
                        alert={alert}
                        error={error}
                        confirm={confirm}
                        logout={logout}
                        login={login}
                        collections={collections}
                        collection={false}
                        currentAccount={currentAccount}
                        changeAccount={setCurrentAccount}
                        accounts={accounts}
                    />
                    <main className={classes.content}>
                        <div className={classes.inner}>
                            <Routes>
                                <Route path="/profile">{profileRoutes}</Route>
                                <Route path="/:address/profile">{profileRoutes}</Route>
                                <Route
                                    path="/marketplace/asset/:tokenid"
                                    exact
                                    element={
                                        <Detail
                                            isToniqEarnAllowed={isToniqEarnAllowed}
                                            error={error}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            voltCreate={_voltCreate}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                            buyNft={buyNft}
                                        />
                                    }
                                />
                                <Route
                                    path="/marketplace/:route/activity"
                                    exact
                                    element={
                                        <ListingsActivity
                                            error={error}
                                            view={'listings'}
                                            stats={stats}
                                            isToniqEarnAllowed={isToniqEarnAllowed}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/marketplace/:route"
                                    exact
                                    element={
                                        <Listings
                                            error={error}
                                            view={'listings'}
                                            isToniqEarnAllowed={isToniqEarnAllowed}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                            buyNft={buyNft}
                                        />
                                    }
                                />
                                <Route
                                    path="/marketplace"
                                    exact
                                    element={
                                        <EntrepotMarketplace
                                            style={{
                                                margin: '-32px',
                                            }}
                                            isToniqEarnAllowed={isToniqEarnAllowed}
                                            onCollectionSelected={event => {
                                                navigate({
                                                    pathname: '/marketplace/' + event.detail.route,
                                                });
                                            }}
                                            error={error}
                                            view={'collections'}
                                            alert={alert}
                                            confirm={confirm}
                                            loader={loader}
                                            stats={stats}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/favorites"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'favorites'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/selling"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'selling'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/offers-made"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'offers-made'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/offers-received"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'offers-received'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/collected"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'collected'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/:address/activity"
                                    exact
                                    element={
                                        <UserActivity
                                            error={error}
                                            view={'activity'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />

                                <Route
                                    path="/favorites"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'favorites'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/selling"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'selling'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/offers-made"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'offers-made'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/offers-received"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'offers-received'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/collected"
                                    exact
                                    element={
                                        <UserCollection
                                            error={error}
                                            view={'collected'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/earn"
                                    exact
                                    element={restrictedEarnAccess(
                                        <UserLoan
                                            error={error}
                                            view={'earn'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            repayContract={repayContract}
                                            fillRequest={fillRequest}
                                            cancelRequest={cancelRequest}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />,
                                    )}
                                />
                                <Route
                                    path="/earn-requests"
                                    exact
                                    element={restrictedEarnAccess(
                                        <UserLoan
                                            error={error}
                                            view={'earn-requests'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            repayContract={repayContract}
                                            fillRequest={fillRequest}
                                            cancelRequest={cancelRequest}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />,
                                    )}
                                />
                                <Route
                                    path="/earn-contracts"
                                    exact
                                    element={restrictedEarnAccess(
                                        <UserLoan
                                            error={error}
                                            view={'earn-contracts'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            repayContract={repayContract}
                                            fillRequest={fillRequest}
                                            cancelRequest={cancelRequest}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />,
                                    )}
                                />
                                <Route
                                    path="/new-request"
                                    exact
                                    element={restrictedEarnAccess(
                                        <UserCollection
                                            error={error}
                                            view={'new-request'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />,
                                    )}
                                />
                                <Route
                                    path="/earn-nfts"
                                    exact
                                    element={restrictedEarnAccess(
                                        <UserCollection
                                            error={error}
                                            view={'earn-nfts'}
                                            alert={alert}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />,
                                    )}
                                />
                                <Route
                                    path="/activity"
                                    exact
                                    element={
                                        <UserActivity
                                            error={error}
                                            view={'activity'}
                                            alert={alert}
                                            list={list}
                                            unpackNft={unpackNft}
                                            listNft={listNft}
                                            wrapAndListNft={wrapAndListNft}
                                            unwrapNft={unwrapNft}
                                            transferNft={transferNft}
                                            pawnNft={pawnNft}
                                            confirm={confirm}
                                            loggedIn={loggedIn}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/sale/DfinityDeckElements"
                                    exact
                                    element={
                                        <DfinityDeckSaleComponent
                                            error={error}
                                            view={'sale'}
                                            alert={alert}
                                            confirm={confirm}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                {/* <Route
                                    path="/sale/:route"
                                    exact
                                    element={
                                        <GeneralSaleComponent
                                            error={error}
                                            view={'sale'}
                                            alert={alert}
                                            confirm={confirm}
                                            loader={loader}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                /> */}
                                <Route
                                    path="/sale/:route"
                                    exact
                                    element={
                                        <EntrepotSaleRoutePage
                                            collections={collections}
                                            userAccount={accounts[currentAccount]}
                                        />
                                    }
                                />
                                <Route
                                    path="/mint"
                                    exact
                                    element={
                                        <Mint
                                            error={error}
                                            alert={alert}
                                            confirm={confirm}
                                            loader={loader}
                                            address={address}
                                            balance={balance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route path="/create" exact element={<EntrepotCreate />} />
                                <Route path="/tos" exact element={<EntrepotTermsOfService />} />
                                <Route
                                    path="/contact"
                                    exact
                                    element={
                                        <Contact
                                            error={error}
                                            alert={alert}
                                            confirm={confirm}
                                            loader={loader}
                                            setBalance={setBalance}
                                            identity={identity}
                                            account={
                                                accounts.length > 0
                                                    ? accounts[currentAccount]
                                                    : false
                                            }
                                            logout={logout}
                                            login={login}
                                            collections={collections}
                                            collection={false}
                                            currentAccount={currentAccount}
                                            changeAccount={setCurrentAccount}
                                            accounts={accounts}
                                        />
                                    }
                                />
                                <Route
                                    path="/"
                                    exact
                                    element={
                                        <EntrepotTestPage
                                            collections={collections}
                                            onCollectionRouteClicked={event => {
                                                navigate(event.detail);
                                            }}
                                        />
                                    }
                                />
                                <Route
                                    path="/sale"
                                    element={
                                        <EntrepotSale
                                            collections={collections}
                                            onCollectionSelected={event => {
                                                const collection = event.detail;
                                                if (
                                                    typeof collection == 'undefined' ||
                                                    typeof collection.sale == 'undefined' ||
                                                    collection.sale == false
                                                ) {
                                                    navigate(`/marketplace/${collection?.route}`);
                                                } else {
                                                    navigate(`/sale/${collection?.route}`);
                                                }
                                            }}
                                        />
                                    }
                                />
                                <Route path="*" element={<MissingPage404 />} />
                            </Routes>
                            <BuyForm open={showBuyForm} {...buyFormData} />
                            <TransferForm
                                refresher={refresher}
                                buttonLoader={buttonLoader}
                                transfer={transfer}
                                alert={alert}
                                open={openTransferForm}
                                close={closeTransferForm}
                                loader={loader}
                                error={error}
                                nft={tokenNFT}
                            />
                            <VoltTransferForm
                                refresher={refresher}
                                buttonLoader={buttonLoader}
                                voltTransfer={_voltTransfer}
                                alert={alert}
                                open={openVoltTransferForm}
                                close={closeVoltTransferForm}
                                loader={loader}
                                error={error}
                            />
                            <ListingForm
                                refresher={refresher}
                                buttonLoader={buttonLoader}
                                collections={collections}
                                list={list}
                                alert={alert}
                                open={openListingForm}
                                close={closeListingForm}
                                stats={stats}
                                loader={loader}
                                confirm={confirm}
                                error={error}
                                nft={tokenNFT}
                            />
                            <PawnForm
                                refresher={refresher}
                                buttonLoader={buttonLoader}
                                stats={stats}
                                collections={collections}
                                pawn={pawn}
                                alert={alert}
                                open={openPawnForm}
                                close={closePawnForm}
                                loader={loader}
                                error={error}
                                nft={tokenNFT}
                            />
                            <Opener
                                alert={alert}
                                nft={tokenNFT}
                                identity={identity}
                                currentAccount={currentAccount}
                                open={playOpener}
                                onEnd={closeUnpackNft}
                            />
                        </div>
                    </main>
                    <EntrepotFooter style={{zIndex: 100, display: showFooter()}} />

                    <Backdrop className={classes.backdrop} open={loaderOpen}>
                        <CircularProgress color="inherit" />
                        <h2 style={{position: 'absolute', marginTop: '120px'}}>
                            {loaderText ?? 'Loading...'}
                        </h2>
                    </Backdrop>
                    <AlertDialog
                        open={showAlert}
                        title={alertData.title}
                        message={alertData.message}
                        buttonLabel={alertData.buttonLabel}
                        handler={alertData.handler}
                    />
                    <ConfirmDialog
                        open={showConfirm}
                        title={confirmData.title}
                        message={confirmData.message}
                        buttonCancel={confirmData.buttonCancel}
                        buttonConfirm={confirmData.buttonConfirm}
                        handler={confirmData.handler}
                    />
                </>
            ) : (
                ''
            )}
        </>
    );
}
