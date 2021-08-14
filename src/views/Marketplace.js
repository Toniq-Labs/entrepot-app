/* global BigInt */
import React from 'react';
import extjs from '../ic/extjs.js';
import { useTheme } from '@material-ui/core/styles';
import Listings from '../components/Listings';
import {StoicIdentity} from "ic-stoic-identity";
import Sidebar from '../components/Sidebar';
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
const txcomm = 0.015;
const collections = [
  {
    canister : "e3izy-jiaaa-aaaah-qacbq-cai",
    name : "Cronic Critters"
  },
  {
    canister : "uzhxd-ziaaa-aaaah-qanaq-cai",
    name : "ICP News"
  },
  {
    canister : "tde7l-3qaaa-aaaah-qansa-cai",
    name : "Cronic Wearables"
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
export default function Marketplace(props) {
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [view, setView] = React.useState(false);
  
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
            await _api.token().transfer(identity.getPrincipal().toText(), payment, props.address, BigInt(b-(txfee + c)), BigInt(txfee));
            await _api.token().transfer(identity.getPrincipal().toText(), payment, "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9", BigInt(c-txfee), BigInt(txfee));
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
        a = extjs.toAddress(identity.getPrincipal(), refund);
        b = Number(await api.token().getBalance(a));
        try {
          if (b > txfee) {
            //Process refunds
            await _api.token().transfer(identity.getPrincipal(), refund, "07ce335b2451bec20426497d97afb0352d89dc3f1286bf26909ecb90cf370c76", BigInt(b-txfee), BigInt(txfee));
          }
          await _api.canister(collections[j].canister).removeRefunds([refund]);
          console.log("Refund removed successfully");
        } catch (e) {};
      };
    };
  };
  const theme = useTheme();
  const styles = {
    root : {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    content : {
      flexGrow: 1,
      marginTop: 73,
      marginLeft: 300
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
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
    } else {
      setLoggedIn(false);
      setAddress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  
  return (
    <>
      <Sidebar view={view} setView={setView} loader={props.loader} logout={logout} login={login} collections={collections} address={address} />
      <main style={styles.content}>      
        <div style={styles.root}>
          {view === false ?
          <Listings identity={identity} confirm={props.confirm} address={address} loggedIn={loggedIn} collections={collections} loader={props.loader} alert={props.alert} error={props.error}  />: "" };
        </div>
      </main>
    </>
  );
}

