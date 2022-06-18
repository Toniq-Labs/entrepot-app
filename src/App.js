/* global BigInt */
import React from "react";
import extjs from "./ic/extjs.js";
import Navbar from "./components/Navbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialog from "./components/AlertDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import { StoicIdentity } from "ic-stoic-identity";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import OpenLogin from "@toruslabs/openlogin";
import { Route, Routes, useLocation } from "react-router-dom";
import Detail from "./components/Detail";
import Listings from "./components/Listings";
import BuyForm from "./components/BuyForm";
import Activity from "./components/Activity";
import UserCollection from "./components/UserCollection";
import UserLoan from "./components/UserLoan";
import UserActivity from "./components/UserActivity";
import Marketplace from "./views/Marketplace";
import Mint from "./views/Mint";
import Create from "./views/Create";
import Home from "./views/Home";
import CardTest from "./views/CardTest";
import Typography from "@material-ui/core/Typography";
import Iconic from "./views/Iconic";
import Sale from "./views/Sale";
import Contact from "./views/Contact";
import Opener from './components/Opener';
import ListingForm from './components/ListingForm';
import TransferForm from './components/TransferForm';
import PawnForm from './components/PawnForm';
import GeneralSaleComponent from "./components/sale/GeneralSaleComponent";
import DfinityDeckSaleComponent from "./components/sale/DfinityDeckSaleComponent";
import legacyPrincipalPayouts from './payments.json';
import getNri from "./ic/nftv.js";
import { EntrepotUpdateUSD, EntrepotUpdateLiked, EntrepotClearLiked, EntrepotUpdateStats } from './utils';
import { MissingPage404 } from './views/MissingPage404';
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
};
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1600,
    color: "#fff",
  },
  inner: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  content: {
    flexGrow: 1,
    marginTop: 73,
    paddingBottom:50,

  },
  footer: {
    textAlign: "center",
    bottom: 0,
    height: "100px !important",
    background: "#091216",
    color: "white",
    paddingTop: 30,
    // marginLeft : -24,
    // marginRight : -24,
    // marginBottom : -24,
    // marginTop : 80,
  },
}));
const emptyAlert = {
  title: "",
  message: "",
};
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
  price: "",
  tokenid: "",
};
var buttonLoader= false;
var refresher= false;
const canisterMap= {
  "fl5nr-xiaaa-aaaai-qbjmq-cai" : "jeghr-iaaaa-aaaah-qco7q-cai",
  "4nvhy-3qaaa-aaaah-qcnoq-cai" : "y3b7h-siaaa-aaaah-qcnwa-cai",
  "qcg3w-tyaaa-aaaah-qakea-cai" : "bxdf4-baaaa-aaaah-qaruq-cai",
  "d3ttm-qaaaa-aaaai-qam4a-cai" : "3db6u-aiaaa-aaaah-qbjbq-cai",
  "xkbqi-2qaaa-aaaah-qbpqq-cai" : "q6hjz-kyaaa-aaaah-qcama-cai",
};
var otherPrincipalsForPlug = [
  "xkbqi-2qaaa-aaaah-qbpqq-cai",
  "d3ttm-qaaaa-aaaai-qam4a-cai",
  "qcg3w-tyaaa-aaaah-qakea-cai",
  "4nvhy-3qaaa-aaaah-qcnoq-cai",
  "ryjl3-tyaaa-aaaaa-aaaba-cai",
  "qgsqp-byaaa-aaaah-qbi4q-cai",
  "6z5wo-yqaaa-aaaah-qcsfa-cai",
];
const isDevEnv = () => {
  if (window.location.hostname == "localhost") return true;
  if(window.location.host.indexOf("deploy-preview") == 0) return true;
  return false;
};
const TREASURECANISTER = "yigae-jqaaa-aaaah-qczbq-cai";
export default function App() {
  const { pathname } = useLocation();
  const classes = useStyles();

  
  React.useEffect(() => {
    setRootPage(pathname.split("/")[1]);
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const [collections, setCollections] = React.useState([]);
  const [appLoaded, setAppLoaded] = React.useState(false);
  
  const [buyFormData, setBuyFormData] = React.useState(emptyListing);
  const [showBuyForm, setShowBuyForm] = React.useState(false);
  const [openListingForm, setOpenListingForm] = React.useState(false);
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [openPawnForm, setOpenPawnForm] = React.useState(false);
  const [playOpener, setPlayOpener] = React.useState(false);
  const [tokenNFT, setTokenNFT] = React.useState('');
  
  const [rootPage, setRootPage] = React.useState("");
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [loaderText, setLoaderText] = React.useState("");
  const [alertData, setAlertData] = React.useState(emptyAlert);
  const [confirmData, setConfirmData] = React.useState(emptyAlert);
  const [showAlert, setShowAlert] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  //Account
  
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [accounts, setAccounts] = React.useState(false);
  const [currentAccount, setCurrentAccount] = React.useState(0);

  const _updates = async () => {
    EntrepotUpdateUSD();
    EntrepotUpdateStats();
  };
  
  const _buyForm = (tokenid, price) => {
    return new Promise(async (resolve, reject) => {
      let { index, canister} = extjs.decodeTokenId(tokenid);
      setBuyFormData({
        index: index,
        canister: canister,
        tokenid: tokenid,
        price: price,
        handler: (v) => {
          setShowBuyForm(false);
          resolve(v);
          setTimeout(() => setBuyFormData(emptyListing), 100);
        },
      });
      setShowBuyForm(true);
    });
  };
  const repayContract = async (token, repaymentaddress, amount, reward, refresh) => {
    loader(true, "Making repayment...");
    try{
      var rbalance = BigInt(await api.token().getBalance(repaymentaddress));
      var owed = (amount+reward) - rbalance;
      if (owed > 0n){
        if (balance < (owed + 10000n)){
          return alert(
          "There was an error",
          "Your balance is insufficient to complete this transaction"
          );
        }
        loader(true, "Transferring ICP...");
        await extjs.connect("https://boundary.ic0.app/", identity).token().transfer(
          identity.getPrincipal(),
          currentAccount,
          repaymentaddress,
          owed,
          10000
        );
      };
      loader(true, "Closing contract...");
      var r2 = await extjs.connect("https://boundary.ic0.app/", identity).canister(TREASURECANISTER).tp_close(token);
      if (r2.hasOwnProperty("err")) throw r2.err;
      if (!r2.hasOwnProperty("ok")) throw "Unknown Error";
      loader(true, "Reloading contracts...");
      await refresh();
      loader(false);
      return alert("Contract Closed", "You have repaid this contract, and you will receive your NFT back shortly.");
    } catch (e) {
      loader(false);
      return error(e);
    };
  };
  const cancelRequest = async (tokenid, refresh) => {
    loader(false);
    var v = await confirm("Please confirm", "Are you sure you want to cancel this request?");
    if (v){
      try {
        loader(true, "Cancelling request...");
        var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(TREASURECANISTER).tp_cancel(tokenid);
        if (r.hasOwnProperty("err")) throw r.err;
        if (!r.hasOwnProperty("ok")) throw "Unknown Error";
        loader(true, "Reloading requests...");
        await refresh();
        loader(false);
        return alert("Request Cancelled", "Your Earn Request was cancelled successfully!");
      } catch (e) {
        loader(false);
        return error(e);
      };
    };
  };
  const fillRequest = async (tokenid, amount, refresh) => {
    loader(false);
    var v = await confirm("Please confirm", "Are you sure you want to accept this request and transfer "+(Number(amount)/100000000).toFixed(2)+"ICP?");
    if (v){
      try {
        loader(true, "Accepting request...");
        var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(TREASURECANISTER).tp_fill(tokenid, accounts[currentAccount].address, amount);
        if (r.hasOwnProperty("err")) throw r.err;
        if (!r.hasOwnProperty("ok")) throw "Unknown Error";
        var paytoaddress = r.ok;
        loader(true, "Transferring ICP...");
        await extjs.connect("https://boundary.ic0.app/", identity).token().transfer(
          identity.getPrincipal(),
          currentAccount,
          paytoaddress,
          amount,
          10000
        );
        loader(true, "Finalizing contract...");
        var r2 = await extjs.connect("https://boundary.ic0.app/", identity).canister(TREASURECANISTER).tp_settle(paytoaddress);
        loader(true, "Reloading requests...");
        await refresh();
        loader(false);
        return alert("Contract Accepted", "You have accepted an Earn Contract, and you will receive an NFT representing that contract shortly.");
      } catch (e) {
        loader(false);
        return error(e);
      };
    };
  };
  const buyNft = async (canisterId, index, listing, ah) => {
    if (balance < listing.price + 10000n)
      return alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    var tokenid = extjs.encodeTokenId(canisterId, index);
    try {
      var answer = await _buyForm(tokenid, listing.price);
      if (!answer) {
        loader(false);
        return false;
      }
      loader(true, "Locking NFT...");
      const _api = extjs.connect("https://boundary.ic0.app/", identity);
      var r = await _api
        .canister(canisterId)
        .lock(
          tokenid,
          listing.price,
          accounts[currentAccount].address,
          _getRandomBytes()
        );
      if (r.hasOwnProperty("err")) throw r.err;
      var paytoaddress = r.ok;
      loader(true, "Transferring ICP...");
      await _api
        .token()
        .transfer(
          identity.getPrincipal(),
          currentAccount,
          paytoaddress,
          listing.price,
          10000
        );
      var r3;
      loader(true, "Settling purchase...");
      await _api.canister(canisterId).settle(tokenid);
      loader(false);
      alert(
        "Transaction complete",
        "Your purchase was made successfully - your NFT will be sent to your address shortly"
      );
      if (ah) await ah();
      return true;
    } catch (e) {
      loader(false);
      console.log(e);
      alert(
        "There was an error",
        e.Other ?? "You may need to enable cookies or try a different browser"
      );
      return false;
    }
  };
  
  const processPayments = async () => {
    loader(true, "Processing payments... (this can take a few minutes)");
    await _processPayments();
    loader(false);
  };
  
  const _processPayments = async () => {
    if (!identity) return;
    if (processingPayments) return;
    processingPayments = true;
    
    //Process legacy payments first
    var p = identity.getPrincipal().toText();
    console.log("Scanning for principal...", p);
    if (legacyPrincipalPayouts.hasOwnProperty(p)) {
      for (const canister in legacyPrincipalPayouts[p]) {
        loader(true, "Payments found, processing...");
        await _processPaymentForCanister(collections.find(a => a.canister == canister));
      }
    };
    loader(true, "Processing payments... (this can take a few minutes)");
    
    var canistersToProcess = ["po6n2-uiaaa-aaaaj-qaiua-cai","pk6rk-6aaaa-aaaae-qaazq-cai","nges7-giaaa-aaaaj-qaiya-cai"];
    var _collections = collections.filter(a => canistersToProcess.indexOf(a.canister) >= 0);
    for (var j = 0; j < _collections.length; j++) {
      loader(true, "Processing payments... (this can take a few minutes)");
      await _processPaymentForCanister(_collections[j]);
    }
    processingPayments = false;
    return true;
  };
  const _processPaymentForCanister = async _collection => {
    if (!_collection.hasOwnProperty('legacy') || !_collection.legacy) return true;
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    var payments = await _api.canister(_collection.canister).payments();
    if (payments.length === 0) return true;
    if (payments[0].length === 0) return true;
    if (payments[0].length === 1) loader(true, "Payment found, processing...");
    else loader(true, "Payments found, processing...");
    var a, b, c, payment;
    for (var i = 0; i < payments[0].length; i++) {
      payment = payments[0][i];
      a = extjs.toAddress(identity.getPrincipal().toText(), payment);
      b = Number(await api.token().getBalance(a));
      c = Math.round(b * _collection.commission);
      try {
        var txs = [];
        if (b > txmin) {
          txs.push(
            _api
              .token()
              .transfer(
                identity.getPrincipal().toText(),
                payment,
                address,
                BigInt(b - (txfee + c)),
                BigInt(txfee)
              )
          );
          txs.push(
            _api
              .token()
              .transfer(
                identity.getPrincipal().toText(),
                payment,
                _collection.legacy,
                BigInt(c - txfee),
                BigInt(txfee)
              )
          );
        }
        await Promise.all(txs);
        console.log("Payment extracted successfully");
      } catch (e) {
        console.log(e);
      }
    }
    return true;
  };
  const logout = async () => {
    localStorage.removeItem("_loginType");
    StoicIdentity.disconnect();
    setIdentity(false);
    setAccounts([]);
    setBalance(0);
  };
  var openlogin = false;
  const oauths = ['google', 'twitter', 'facebook', 'github'];
  const loadOpenLogin = async () => {
    if (!openlogin) {
      openlogin = new OpenLogin({
        clientId: "BHGs7-pkZO-KlT_BE6uMGsER2N1PC4-ERfU_c7BKN1szvtUaYFBwZMC2cwk53yIOLhdpaOFz4C55v_NounQBOfU",
        network: "mainnet",
        uxMode : 'popup',
      });
    }
    await openlogin.init();
    return openlogin;
  }
  const fromHexString = (hex) => {
    if (hex.substr(0,2) === "0x") hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
  const login = async (t) => {
    loader(true, "Connecting your wallet...");
    try {
      var id;
      switch (t) {
        case "stoic":
          id = await StoicIdentity.connect();
          if (id) {
            setIdentity(id);
            id.accounts().then((accs) => {
              setAccounts(JSON.parse(accs));
            });
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        case "torus":
          const openlogin = await loadOpenLogin();
          if (openlogin.privKey) {
            await openlogin.logout();
          }
          await openlogin.login();
          id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(openlogin.privKey)));
          if (id) {
            setIdentity(id);
            setAccounts([
              {
                name: "Torus Wallet",
                address: extjs.toAddress(id.getPrincipal().toText(), 0),
              },
            ]);
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        case "plug":
          const result = await window.ic.plug.requestConnect({
            whitelist: collections.map(a => a.canister).concat(otherPrincipalsForPlug),
          });
          if (result) {
            id = await window.ic.plug.agent._identity;
            setIdentity(id);
            setAccounts([
              {
                name: "PlugWallet",
                address: extjs.toAddress(id.getPrincipal().toText(), 0),
              },
            ]);
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
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
  useInterval(_updates, 10 * 60 * 1000);
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
  const error = (e) => {
    alert("There was an error", e);
  };
  const confirm = (title, message, buttonCancel, buttonConfirm) => {
    return new Promise(async (resolve, reject) => {
      setConfirmData({
        title: title,
        message: message,
        buttonCancel: buttonCancel,
        buttonConfirm: buttonConfirm,
        handler: (v) => {
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
      setLoaderText("");
    }
  };

  const unpackNft = (token, loader, refresh) => {
    setTokenNFT(token);
    buttonLoader = loader;
    refresher = refresh;
    setPlayOpener(true);
  };
  const closeUnpackNft = (token) => {
    setPlayOpener(false)
    refresher();
    setTimeout(() => setTokenNFT(''), 300);
  };
  const listNft = (token, loader, refresh) => {
    setTokenNFT(token);
    buttonLoader = loader;
    refresher = refresh;
    setOpenListingForm(true);
  }
  const pawnNft = (token, loader, refresh) => {
    setTokenNFT(token);
    buttonLoader = loader;
    refresher = refresh;
    setOpenPawnForm(true);
  }
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
  const closeTransferForm = () => {
    setOpenTransferForm(false);
    setTimeout(() => setTokenNFT(''), 300);
  };
  const closePawnForm = () => {
    setOpenPawnForm(false);
    setTimeout(() => setTokenNFT(''), 300);
  };
  
  const unwrapNft = async (token, loader, refresh) => {
    loader(true, "Unwrapping NFT...");
    var canister = extjs.decodeTokenId(token.id).canister;
    var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).unwrap(token.id, [extjs.toSubaccount(currentAccount ?? 0)]);
    if (!r) {
      loader(false);
      return error("Couldn't unwrap!");
    }
    loader(true, "Loading NFTs...");
    if (refresh) await refresh();
    loader(false);
    return alert("Success!", "Your NFT has been unwrapped!");
  }
  const wrapAndlistNft = async (token, loader, refresh) => {
    var v = await confirm("We need to wrap this", "You are trying to list a non-compatible NFT for sale. We need to securely wrap this NFT first. Would you like to proceed?")
    if (v) {
      var decoded = extjs.decodeTokenId(token.id);
      var canister = canisterMap[decoded.canister];
      if (loader) loader(true, "Creating wrapper...this may take a few minutes");
      try{
        var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).wrap(token.id);
        if (!r) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Sending NFT to wrapper...");
        var r2 = await extjs.connect("https://boundary.ic0.app/", identity).token(token.id).transfer(identity.getPrincipal().toText(), currentAccount, canister, BigInt(1), BigInt(0), "00", false);
        if (!r2) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Wrapping NFT...");
        await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).mint(token.id);
        if (!r) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Loading NFTs...");
        if (refresh) await refresh();
        if (loader) loader(false);
        //New token id
        token.id = extjs.encodeTokenId(canister, decoded.index);
        token.canister = canister;
        token.wrapped = true;
        listNft(token, loader, refresh);
      } catch(e) {
        if (loader) loader(false);
        console.log(e);
        return error("Unknown error!");
      };
    }
  }
  
  //Form powered
  const pawn = async (id, amount, reward, length, loader, refresh) => {
    if (loader) loader(true, "Creating Earn Request...");
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", identity).canister("yigae-jqaaa-aaaah-qczbq-cai").tp_create(id, extjs.toSubaccount(currentAccount ?? 0), BigInt(Math.floor(amount*100000000)), BigInt(length)*24n*60n*60n*1000000000n, BigInt(Math.floor(reward*100000000)), 2500, 2500);
      if (r.hasOwnProperty("err")) throw r.err;
      if (!r.hasOwnProperty("ok")) throw "Unknown Error";
      if (loader) loader(true, "Sending NFT to canister...");
      var r2 = await extjs.connect("https://boundary.ic0.app/", identity).token(id).transfer(identity.getPrincipal().toText(), currentAccount, "yigae-jqaaa-aaaah-qczbq-cai", BigInt(1), BigInt(0), "00", true);
      console.log(r2);
      if (loader) loader(true, "Loading NFTs...");
      if (refresh) await refresh();
      if (loader) loader(false);
      return alert("Request Received", "Your Earn Request was created successfully!");
    } catch (e) {
      if (loader) loader(false);
      return error(e);
    };
  };
  const transfer = async (id, address, loader, refresh) => {
    if (loader) loader(true, "Transferring NFT...");
    try {
      var r2 = await extjs.connect("https://boundary.ic0.app/", identity).token(id).transfer(identity.getPrincipal().toText(), currentAccount, address, BigInt(1), BigInt(0), "00", false);
      if (!r2) return error("There was an error transferring this NFT!");
      if (loader) loader(true, "Loading NFTs...");
      console.log(refresh);
      if (refresh) await refresh();
      if (loader) loader(false);
      return alert("Transaction complete", "Your transfer was successful!");
    } catch (e) {
      if (loader) loader(false);
      return error(e);
    };
  };
  const updateCollections = () => {
     fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/collections").then(r => r.json()).then(r => {
      var r2 = r;
      //Remove dev marked canisters
      if (isDevEnv() == false) {
        r2 = r2.filter(a => !a.dev);
      };
      r2 = r2.map(a => ({...a, canister : a.id})).filter(a => _isCanister(a.canister));
      if (collections.length == 0) {
        setCollections(r2);
        r2.filter(a => a?.nftv).forEach(a => getNri(a.canister));
      } else {
        for(var i = 0; i < r2.length; i++){
          var n = r2[i];
          var o = collections.find(a => a.canister == n.id);
          if (typeof o == 'undefined' || JSON.stringify(n) != JSON.stringify(o)) {
            setCollections(r2);
            r2.filter(a => a?.nftv).forEach(a => getNri(a.canister));
            console.log("UPDATED");
            break;
          }
        };
      };
      if (!appLoaded) setAppLoaded(true);
    });
  };
  const list = async (id, price, loader, refresh) => {
    if (loader) loader(true);
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", identity).token(id).list(currentAccount, price)
      console.log(r);
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
    };
  };
  
  
  React.useEffect(() => {
    updateCollections();
    EntrepotUpdateUSD();
    EntrepotUpdateStats();
    if (identity) EntrepotUpdateLiked(identity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (appLoaded){
      var t = localStorage.getItem("_loginType");
      if (t) {
        switch (t) {
          case "stoic":
            StoicIdentity.load().then(async (identity) => {
              if (identity !== false) {
                //ID is a already connected wallet!
                setIdentity(identity);
                identity.accounts().then((accs) => {
                  setAccounts(JSON.parse(accs));
                });
              } else {              
                console.log("Error from stoic connect");
              }
            }).catch(e => {
            });
            break;
          case "torus":
            loadOpenLogin().then(openlogin => {
              if (!openlogin.privKey || openlogin.privKey.length === 0) {

              } else {
                var id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(openlogin.privKey)));
                if (id) {
                  setIdentity(id);
                  setAccounts([
                    {
                      name: "Torus Wallet",
                      address: extjs.toAddress(id.getPrincipal().toText(), 0),
                    },
                  ]);
                };
              }
            });
            break;
          case "plug":
            (async () => {
              const connected = await window.ic.plug.isConnected();
              if (connected) {
                if (!window.ic.plug.agent) {
                  await window.ic.plug.createAgent({
                    whitelist: collections.map(a => a.canister).concat(otherPrincipalsForPlug),
                  });
                }
                var id = await window.ic.plug.agent._identity;
                setIdentity(id);
                setAccounts([
                  {
                    name: "Plug Wallet",
                    address: extjs.toAddress(id.getPrincipal().toText(), 0),
                  },
                ]);
              }
            })();
            break;
          default:
            break;
        }
      }
      if (identity) EntrepotUpdateLiked(identity);
    };
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
          };
        }
      };
      EntrepotUpdateLiked(identity)
    } else {
      EntrepotClearLiked()
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  const footer = (
  <div className={classes.footer}>
    <Typography variant="body1">
      Developed by ToniqLabs &copy; All rights reserved 2021<br /><a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a>
    </Typography>
  </div>);
  
  return (
    <>
      {appLoaded ? <>
        <Navbar view={rootPage} processPayments={processPayments} setBalance={setBalance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} loader={loader} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} />
        <main className={classes.content}>
          <div className={classes.inner}>
            <Routes>
              <Route path="/marketplace/asset/:tokenid" exact element={
                <Detail
                  error={error}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} buyNft={buyNft}
                />} />
              <Route path="/marketplace/:route/activity" exact element={
                <Activity
                  error={error}
                  view={"listings"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/marketplace/:route" exact element={
                <Listings
                  error={error}
                  view={"listings"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} buyNft={buyNft}
                />} />
              <Route path="/marketplace" exact element={
                <Marketplace
                  error={error}
                  view={"collections"}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/favorites" exact element={
                <UserCollection
                  error={error}
                  view={"favorites"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/selling" exact element={
                <UserCollection
                  error={error}
                  view={"selling"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/offers-made" exact element={
                <UserCollection
                  error={error}
                  view={"offers-made"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/offers-received" exact element={
                <UserCollection
                  error={error}
                  view={"offers-received"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/collected" exact element={
                <UserCollection
                  error={error}
                  view={"collected"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/:address/activity" exact element={
                <UserActivity
                  error={error}
                  view={"activity"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
                
              <Route path="/favorites" exact element={
                <UserCollection
                  error={error}
                  view={"favorites"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/selling" exact element={
                <UserCollection
                  error={error}
                  view={"selling"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/offers-made" exact element={
                <UserCollection
                  error={error}
                  view={"offers-made"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/offers-received" exact element={
                <UserCollection
                  error={error}
                  view={"offers-received"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/collected" exact element={
                <UserCollection
                  error={error}
                  view={"collected"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/earn" exact element={
                <UserLoan
                  error={error}
                  view={"earn"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  repayContract={repayContract} 
                  fillRequest={fillRequest} 
                  cancelRequest={cancelRequest} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/earn-requests" exact element={
                <UserLoan
                  error={error}
                  view={"earn-requests"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  repayContract={repayContract} 
                  fillRequest={fillRequest} 
                  cancelRequest={cancelRequest} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/earn-contracts" exact element={
                <UserLoan
                  error={error}
                  view={"earn-contracts"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  repayContract={repayContract} 
                  fillRequest={fillRequest} 
                  cancelRequest={cancelRequest} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/new-request" exact element={
                <UserCollection
                  error={error}
                  view={"new-request"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/earn-nfts" exact element={
                <UserCollection
                  error={error}
                  view={"earn-nfts"}
                  alert={alert}
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/activity" exact element={
                <UserActivity
                  error={error}
                  view={"activity"}
                  alert={alert}
                  list={list}
                  unpackNft={unpackNft} 
                  listNft={listNft} 
                  wrapAndlistNft={wrapAndlistNft} 
                  unwrapNft={unwrapNft} 
                  transferNft={transferNft} 
                  pawnNft={pawnNft} 
                  confirm={confirm}
                  loggedIn={loggedIn} 
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/sale/DfinityDeckElements" exact element={
                <DfinityDeckSaleComponent
                  error={error}
                  view={"sale"}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/sale/:route" exact element={
                <GeneralSaleComponent
                  error={error}
                  view={"sale"}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/mint" exact element={
                <Mint
                  error={error}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} address={address} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/create" exact element={
                <Create
                  error={error}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/contact" exact element={
                <Contact
                  error={error}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} setBalance={setBalance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
              <Route path="/" exact element={
                <Home collections={collections} error={error} alert={alert} confirm={confirm} loader={loader} />} />
              <Route path="/sale" exact element={
                <Sale 
                  error={error}
                  view={"sale"}
                  alert={alert}
                  confirm={confirm}
                  loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
                />} />
                <Route path="*" element={<MissingPage404 />} />
            </Routes>
            <BuyForm open={showBuyForm} {...buyFormData} />
            <TransferForm refresher={refresher} buttonLoader={buttonLoader} transfer={transfer} alert={alert} open={openTransferForm} close={closeTransferForm} loader={loader} error={error} nft={tokenNFT} />
            <ListingForm refresher={refresher} buttonLoader={buttonLoader} collections={collections} list={list} alert={alert} open={openListingForm} close={closeListingForm} loader={loader} error={error} nft={tokenNFT} />
            <PawnForm refresher={refresher} buttonLoader={buttonLoader} collections={collections} pawn={pawn} alert={alert} open={openPawnForm} close={closePawnForm} loader={loader} error={error} nft={tokenNFT} />
            <Opener alert={alert} nft={tokenNFT} identity={identity} currentAccount={currentAccount} open={playOpener} onEnd={closeUnpackNft} />
          </div>
        </main>
        {footer}
        
        <Backdrop className={classes.backdrop} open={loaderOpen}>
          <CircularProgress color="inherit" />
          <h2 style={{ position: "absolute", marginTop: "120px" }}>
            {loaderText ?? "Loading..."}
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
      </>:""}
    </>
  );
}
