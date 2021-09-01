/* global BigInt */
import React from 'react';
import extjs from '../ic/extjs.js';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Listings from '../components/Listings';
import Wallet from '../components/Wallet';
import Button from '@material-ui/core/Button';
import {StoicIdentity} from "ic-stoic-identity";
import Sidebar from '../components/Sidebar';
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
const txcomm = 0.015;
const collections = [
  {
    canister : "e3izy-jiaaa-aaaah-qacbq-cai",
    name : "Cronic Critters",
    mature : false,
    comaddress : "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
  },
  {
    canister : "nbg4r-saaaa-aaaah-qap7a-cai",
    name : "Starverse",
    mature : false,
    comaddress : "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
  },
  {
    canister : "bxdf4-baaaa-aaaah-qaruq-cai",
    name : "Wrapped ICPunks",
    mature : false,
    comaddress : "38bc2ce470085db3a3223806e61946f645106915a0a7da8fa9368969db7a3264",
  },
  {
    canister : "uzhxd-ziaaa-aaaah-qanaq-cai",
    name : "ICP News",
    mature : false,
    comaddress : "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
  },
  {
    canister : "tde7l-3qaaa-aaaah-qansa-cai",
    name : "Cronic Wearables",
    mature : false,
    comaddress : "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
  },
  {
    canister : "gevsk-tqaaa-aaaah-qaoca-cai",
    name : "ICmojis",
    mature : false,
    comaddress : "df13f7ef228d7213c452edc3e52854bc17dd4189dfc0468d8cb77403e52b5a69",
  },
  {
    canister : "owuqd-dyaaa-aaaah-qapxq-cai",
    name : "ICPuzzle",
    mature : true,
    comaddress : "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
  },
];
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
const useStyles = makeStyles((theme) => ({
  walletBtn : {
    [theme.breakpoints.up('sm')]: {
      display: "none",
    },
  },
  content : {
    flexGrow: 1,
    marginTop: 73,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 300,
    },
  },
}));
export default function Marketplace(props) {
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [accounts, setAccounts] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const _updates = async () => {
    await processPayments();
    await processRefunds();
  };
  const processPayments = async () => {
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    for(var j = 0; j < collections.length; j++){
      var payments = await _api.canister(collections[j].canister).payments();
      if (payments.length === 0) continue;
      if (payments[0].length === 0) continue;
      console.log("Payments found: " + payments[0].length);
      var a, b, c, payment;
      for(var i = 0; i < payments[0].length; i++) {
        payment = payments[0][i];
        a = extjs.toAddress(identity.getPrincipal().toText(), payment);
        b = Number(await api.token().getBalance(a));
        c = Math.round(b * txcomm);
        try {
          if (b > txmin) {
            await _api.token().transfer(identity.getPrincipal().toText(), payment, address, BigInt(b-(txfee + c)), txfee);
            await _api.token().transfer(identity.getPrincipal().toText(), payment, collections[j].comaddress, BigInt(c-txfee), txfee);
          }
          await _api.canister(collections[j].canister).removePayments([payment]);
          console.log("Payment extracted successfully");
        } catch (e) {
          console.log(e);
        };
      };
    };
  };
  const processRefunds = async () => {
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    for(var j = 0; j < collections.length; j++){
      var refunds = await _api.canister(collections[j].canister).refunds();
      if (refunds.length === 0) continue;
      if (refunds[0].length === 0) continue;
      console.log("Refunds found: " + refunds[0].length);
      var a, b, refund;
      for(var i = 0; i < refunds[0].length; i++) {
        refund = refunds[0][i];
        a = extjs.toAddress(identity.getPrincipal().toText(), refund);
        b = Number(await api.token().getBalance(a));
        try {
          if (b > txfee) {
            //Process refunds
            await _api.token().transfer(identity.getPrincipal().toText(), refund, "07ce335b2451bec20426497d97afb0352d89dc3f1286bf26909ecb90cf370c76", BigInt(b-txfee), txfee);
          }
          await _api.canister(collections[j].canister).removeRefunds([refund]);
          console.log("Refund removed successfully");
        } catch (e) {};
      };
    };
  };
  const theme = useTheme();
  const classes = useStyles();
  const styles = {
    root : {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    empty : {
      maxWidth:800,
      margin : "0 auto",
      textAlign:"center"
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2)
    },

    largeIcon: {
      width: 60,
      height: 60,
    },
  };
  
  const logout = async () => {
    StoicIdentity.disconnect();
    setIdentity(false);
  };
  const login = async () => {
    props.loader(true);
    var id = await StoicIdentity.connect();
    if (id) {
      setIdentity(id);
    }
    props.loader(false);
  };
  
  useInterval(_updates, 30 *1000);
  React.useEffect(() => {
    StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        //ID is a already connected wallet!
        setIdentity(identity);
      }
    })
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (identity) {
      setLoggedIn(true);
      identity.accounts().then(accs => {
        setAccounts(JSON.parse(accs));
      });
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
    } else {
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  
  return (
    <>
      <Sidebar view={view} setView={setView} loader={props.loader} logout={logout} login={login} collections={collections} accounts={accounts} address={address} onClose={handleDrawerToggle} open={mobileOpen} />
      <main className={classes.content}>      
        <div style={styles.root}>
          <Button className={classes.walletBtn} fullWidth variant={"contained"} onClick={handleDrawerToggle} color={"primary"} style={{fontWeight:"bold", margin:"0 auto"}}>View Wallet</Button>
          {view === false ?
          <Listings identity={identity} confirm={props.confirm} address={address} loggedIn={loggedIn} collections={collections} loader={props.loader} alert={props.alert} error={props.error}  />: "" }
          {view !== false ?
          <Wallet identity={identity} confirm={props.confirm} address={address} loggedIn={loggedIn} collections={collections} collection={view} loader={props.loader} alert={props.alert} error={props.error}  />: "" }
        </div>
      </main>
    </>
  );
}

