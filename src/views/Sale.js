/* global BigInt */
import React, { useEffect } from "react";
import extjs from "../ic/extjs.js";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Listings from "../components/Listings";
import Wallet from "../components/Wallet";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Timestamp from "react-timestamp";
import { StoicIdentity } from "ic-stoic-identity";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router";
import Navbar from "../containers/Navbar.js";
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
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
const collections = [
  {
    canister: "ahl3d-xqaaa-aaaaj-qacca-cai",
    name: "ICTuTs",
    route: "ictuts",
    mature: false,
    commission: 0.025,
    comaddress:
      "b53a735c40994ddbc7bb4f6dbfbf9b2c67052842241f1c445f2255bdf4bd8982",
    blurb: (
      <>
        We will have all of the 10,000 NFTs available for sale at launch, there will be 5 pirce tiers (Thirty NFTs will be reserved for the creators). We will try to distrube them fairly as possible by whitelisting.
      </>
    ),
  },
  {
    canister: "e3izy-jiaaa-aaaah-qacbq-cai",
    name: "Cronic Critters",
    route: "cronics",
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: (
      <>
        Cronics is a Play-to-earn NFT game being developed by ToniqLabs for the
        Internet Computer. Cronics incorporates breeding mechanics, wearable
        NFTs and a p2e minigame ecosystem and more. Join the{" "}
        <a href="https://t.me/cronic_fun" target="_blank" rel="noreferrer">
          Telegram group
        </a>{" "}
        or read more on{" "}
        <a
          href="https://toniqlabs.medium.com/cronics-breeding-and-supply-604fa374776d"
          target="_blank"
          rel="noreferrer"
        >
          Medium
        </a>
      </>
    ),
  },
  {
    canister: "nbg4r-saaaa-aaaah-qap7a-cai",
    name: "Starverse",
    route: "starverse",
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "njgly-uaaaa-aaaah-qb6pa-cai",
    name: "ICPuppies",
    route: "icpuppies",
    mature: false,
    commission: 0.035,
    comaddress:
      "9f76290b181807c5fa3c7cfcfca2525d578a3770f40ae8b14a03a4a3530368e2",
    blurb: (
      <>
        10,000 randomly generated 8-bit puppy NFTs. Join the{" "}
        <a href="discord.gg/A3rmDSjBaJ" target="_blank" rel="noreferrer">
          Discord
        </a>{" "}
        or follow us on{" "}
        <a
          href="https://twitter.com/ICPuppies"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
      </>
    ),
  },
  {
    canister: "bxdf4-baaaa-aaaah-qaruq-cai",
    name: "ICPunks",
    route: "icpunks",
    mature: false,
    commission: 0.035,
    comaddress:
      "c47942416fa8e7151f679d57a6b2d2e01a92fecd5e6f9ac99f6db548ea4f37aa",
    blurb: (
      <>
        Are you down with the clown? Get your hands on the latest NFT to hit the
        Internet Computer! You can wrap and trade them on the Marketplace!{" "}
        <strong>
          Wrapped ICPunks are 1:1 wrapped versions of actual ICPunks
        </strong>{" "}
        - you can read more about how to wrap, unwrap, and how safe it is{" "}
        <a
          href="https://medium.com/@toniqlabs/wrapped-nfts-8c91fd3a4c1"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
      </>
    ),
  },
  {
    canister: "3db6u-aiaaa-aaaah-qbjbq-cai",
    name: "IC Drip",
    route: "icdrip",
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: (
      <>
        IC Drip are randomly generated meta-commerce shopping carts for outfits
        and personas stored on chain. Stats, images, and other functionality are
        intentionally omitted for others to interpret. Feel free to use IC Drip
        in any way you want.{" "}
        <a
          href="https://dvr6e-lqaaa-aaaai-qam5a-cai.raw.ic0.app/"
          target="_blank"
          rel="noreferrer"
        >
          IC Drip Website
        </a>
      </>
    ),
  },
  {
    canister: "73xld-saaaa-aaaah-qbjya-cai",
    name: "Wing",
    route: "wing",
    mature: true,
    commission: 0.025,
    comaddress:
      "1d978f4f38d19dca4218832e856c956678de0aa470cd492f5d8ac4377db6f2a2",
    blurb: (
      <>
        To escape from containment and restriction, releasing the stressors held
        so long in the body, Wings’s ego is jettisoned as she explores a more
        fundamental form of existence, expressing her humanity in this elemental
        piece.
        <br />
        She is framed within the themes of air, water, to take flight on chalky
        cliff tops overlooking distant horizons, to express the existential
        freedom that lives within. No borders.
        <br />
        And so through this series I invite the viewer to celebrate their own
        sovereignty of consciousness; to be bold as we emerge from our cocoons
        and open ourselves up to the world and each other again.
      </>
    ),
  },
  {
    canister: "kss7i-hqaaa-aaaah-qbvmq-cai",
    name: "ICelebrity",
    route: "icelebrity",
    mature: false,
    commission: 0.035,
    comaddress:
      "8b6840cb0e67738e69dbb6d79a3963f7bd93c35f593a393be5cc39cd59ed993e",
    blurb: false,
  },
  {
    canister: "k4qsa-4aaaa-aaaah-qbvnq-cai",
    name: "Faceted Meninas",
    route: "faceted-meninas",
    mature: false,
    commission: 0.02,
    comaddress:
      "12692014390fbdbb2f0a1ecd440f02d29962601a782553b45bb1a744f167f13b",
    blurb: (
      <>
        Faceted Meninas is a creature species that holds the power of the
        universe to act as a magic pillar giving their allies the essence of
        outer worlds to maximize their powers.
      </>
    ),
  },
  {
    canister: "uzhxd-ziaaa-aaaah-qanaq-cai",
    name: "ICP News",
    mature: false,
    route: "icp-news",
    commission: 0.02,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "tde7l-3qaaa-aaaah-qansa-cai",
    name: "Cronic Wearables",
    route: "wearables",
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "gevsk-tqaaa-aaaah-qaoca-cai",
    name: "ICmojis",
    route: "icmojis",
    mature: false,
    commission: 0.02,
    comaddress:
      "df13f7ef228d7213c452edc3e52854bc17dd4189dfc0468d8cb77403e52b5a69",
    blurb: false,
  },
  {
    canister: "owuqd-dyaaa-aaaah-qapxq-cai",
    name: "ICPuzzle",
    route: "icpuzzle",
    mature: true,
    commission: 0.02,
    comaddress:
      "12692014390fbdbb2f0a1ecd440f02d29962601a782553b45bb1a744f167f13b",
    blurb: false,
  },
  {
    canister: "q6hjz-kyaaa-aaaah-qcama-cai",
    name: "ICPBunny",
    route: "icpbunny",
    mature: false,
    commission: 0.025,
    comaddress:
      "9f04077bd8ef834f7bcca5177f28fb655a7e68d8f2da9c1e6441c4f567f5dce7",
    blurb: false,
  },
];
const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
var processingPayments = false,
  processingRefunds = false;

const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
export default function Sale(props) {
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [accounts, setAccounts] = React.useState(false);
  const [currentAccount, setCurrentAccount] = React.useState(0);
  const [view, setView] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [salesOnline, setSalesOnline] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [sold, setSold] = React.useState(0);
  const [unsold, setUnsold] = React.useState(9937);
  var publicPrice = 300000000n;
  const [whitelistPrice, setWhitelistPrice] = React.useState(publicPrice);
  const params = useParams();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const _updates = async () => {
    var stats = await api.token("ahl3d-xqaaa-aaaaj-qacca-cai").call.salesStats("");
    setSalesOnline(stats[0]);
    setUnsold(Number(stats[1]));
    setSold(Number(stats[2]));
    setWhitelistPrice(stats[3]);
    console.log(stats);
  };
  const theme = useTheme();
  const classes = useStyles();
  const styles = {
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    empty: {
      maxWidth: 800,
      margin: "0 auto",
      textAlign: "center",
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },

    largeIcon: {
      width: 60,
      height: 60,
    },
  };

  const logout = async () => {
    localStorage.removeItem("_loginType");
    StoicIdentity.disconnect();
    setIdentity(false);
    setAccounts([]);
  };
  const login = async (t) => {
    props.loader(true, "Connecting your wallet...");
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
        case "plug":
          const result = await window.ic.plug.requestConnect({
            whitelist: [
              ...collections.map((a) => a.canister),
              "d3ttm-qaaaa-aaaai-qam4a-cai",
              "qcg3w-tyaaa-aaaah-qakea-cai",
              "ryjl3-tyaaa-aaaaa-aaaba-cai",
              "qgsqp-byaaa-aaaah-qbi4q-cai",
            ],
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
      props.error(e);
    }
    props.loader(false);
  };
  
  const buyFromSale = async (qty) => {
    var ps = {
      1 : whitelistPrice,
      5 : 1500000000n,
      10 : 3000000000n,
      20 : 6000000000n,
    };
    var price = ps[qty];
    if (balance < (price + 10000n)){
      return props.alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    }
    try {
      props.loader(true, "Reserving ICTuT...");
      const api = extjs.connect("https://boundary.ic0.app/", identity);
      var r = await api
        .canister("ahl3d-xqaaa-aaaaj-qacca-cai")
        .reserve(
          price,
          qty,
          accounts[currentAccount].address,
          _getRandomBytes()
        );
      console.log(r);
      if (r.hasOwnProperty("err")) {
        throw r.err;
      }
      var paytoaddress = r.ok[0];
      var pricetopay = r.ok[1];
      props.loader(true, "Transferring ICP...");
      await api
        .token()
        .transfer(
          identity.getPrincipal(),
          0,
          paytoaddress,
          pricetopay,
          10000
        );
      var r3;
      while (true) {
        try {
          props.loader(true, "Completing purchase...");
          r3 = await api.canister("ahl3d-xqaaa-aaaaj-qacca-cai").retreive(paytoaddress);
          if (r3.hasOwnProperty("ok")) break;
        } catch (e) {}
      }
      props.loader(false);
      props.alert(
        "Transaction complete",
        "Your purchase was made successfully - your NFT will be sent to your address shortly"
      );
      _updates();
    } catch (e) {
      props.loader(false);
      console.log(e);
      props.alert(
        "There was an error",
        e.Other ?? (typeof e == "string" ? e : "You may need to enable cookies or try a different browser")
      );
    }
  };
  
  useInterval(_updates, 10 * 1000);
  React.useEffect(() => {
    _updates();
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
            }
          });
          break;
        case "plug":
          (async () => {
            const connected = await window.ic.plug.isConnected();
            if (connected) {
              if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({
                  whitelist: [
                    ...collections.map((a) => a.canister),
                    "d3ttm-qaaaa-aaaai-qam4a-cai",
                    "qcg3w-tyaaa-aaaah-qakea-cai",
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    "qgsqp-byaaa-aaaah-qbi4q-cai",
                  ],
                });
              }
              var id = await window.ic.plug.agent._identity;
              setIdentity(id);
              setAccounts([
                {
                  name: "PlugWallet",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (identity) {
      extjs
        .connect("https://boundary.ic0.app/", identity)
        .canister("qgsqp-byaaa-aaaah-qbi4q-cai")
        .log();
      setLoggedIn(true);
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
    } else {
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  const getRemaining = ti => {
    ti += 1000;
    if (ti < 2000) return 2000-ti;
    if (ti < 3000) return 3000-ti;
    if (ti < 4000) return 4000-ti;
    if (ti < 5000) return 5000-ti;
    if (ti < 6000) return 6000-ti;
    if (ti < 8000) return 8000-ti;
    else return 10000-ti;
  };
  const getPrice = ti => {
    ti += 1000;
    if (ti < 2000) return 40000000n;
    if (ti < 3000) return 50000000n;
    if (ti < 4000) return 60000000n;
    if (ti < 5000) return 70000000n;
    if (ti < 6000) return 80000000n;
    if (ti < 8000) return 90000000n;
    else return 100000000n;
  };
  return (
    <>
      <Navbar />
      <Sidebar
        setBalance={setBalance}
        identity={identity}
        view={view}
        setView={setView}
        account={accounts.length > 0 ? accounts[currentAccount] : false}
        loader={props.loader}
        logout={logout}
        login={login}
        collections={collections}
        currentAccount={currentAccount}
        accounts={accounts}
        onClose={handleDrawerToggle}
        open={mobileOpen}
      />
      <main className={classes.content}>
        <div style={styles.root}>
          <Button
            className={classes.walletBtn}
            fullWidth
            variant={"contained"}
            onClick={handleDrawerToggle}
            color={"primary"}
            style={{ fontWeight: "bold", margin: "0 auto" }}
          >
            View Wallet
          </Button>
          <div style={{maxWidth:"1200px", margin: "0 auto",textAlign:"center"}}>
          <div className={classes.banner}>
            <img style={{height:300}} alt="starverse" className={classes.bannerimg} src="/banner/ictuts2.gif" />
          </div>
          
          <h1>Welcome to the ICTuTs Official Sale!</h1>
          <p><strong>We will have all of the 10,000 NFTs available for sale at launch, there will be 5 pirce tiers (Thirty NFTs will be reserved for the creators). We will try to distrube them fairly as possible by whitelisting.</strong></p>
          <Grid container spacing={2} style={{}}>
            <Grid className={classes.stat} item xs={3}>
              <strong>TOTAL SOLD</strong><br />
              <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{sold}</span>
            </Grid>
            <Grid className={classes.stat} item xs={3}>
              <strong>CURRENT PRICE</strong><br />
              <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{_showListingPrice(whitelistPrice)} ICP</span>
            </Grid>
            <Grid className={classes.stat} item xs={3}>
              <strong>NEXT PRICE</strong><br />
              {Date.now() < 1634421600000  ?
              <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{_showListingPrice(300000000n)} ICP</span>:
              <span style={{fontWeight:"bold",color:"red",fontSize:"2em"}}>BURN</span>}
            </Grid>
            <Grid className={classes.stat} item xs={3}>
              {Date.now() <= 1634508000000  ?
                <>
                  <strong>TOTAL UNSOLD</strong><br />
                  <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{unsold}</span>
                </>
              :
                <>
                  <strong>TOTAL BURNT</strong><br />
                  <span style={{fontWeight:"bold",color:"red",fontSize:"2em"}}>{unsold}</span>                
                </>
              }
            </Grid>
          </Grid>
          {Date.now() < 1634421600000  ?
            <p><strong><span style={{fontSize:"1.5em",color:"red"}}>The price will increase <Timestamp relative autoUpdate date={1634421600}/></span></strong></p>
          :
          <>
          {Date.now() < 1634508000000  ?
            <p><strong><span style={{fontSize:"1.5em",color:"red"}}>All remaining ICTuTs will be burnt <Timestamp relative autoUpdate date={1634508000}/></span></strong></p>
          :""}
          </>
          }
          <br />
          <br />
            <>
              {salesOnline && Date.now() < 1634508000000 ? 
                <>
                  <Grid container spacing={2} style={{}}>
                    <Grid className={classes.stat} item sm={3}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => buyFromSale(1)}
                    style={{ fontWeight: "bold", margin: "0 auto" }}
                  >
                    Buy 1 ICTuT<br />for {_showListingPrice(whitelistPrice)} ICP
                  </Button>
                  </Grid>
                    <Grid className={classes.stat} item sm={3}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => buyFromSale(5)}
                    style={{ fontWeight: "bold", margin: "0 auto" }}
                  >
                    Buy 5 ICTuT<br />for {_showListingPrice(whitelistPrice*5n)} ICP
                  </Button>
                  </Grid>
                    <Grid className={classes.stat} item sm={3}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => buyFromSale(10)}
                    style={{ fontWeight: "bold", margin: "0 auto" }}
                  >
                    Buy 10 ICTuT<br />for {_showListingPrice(whitelistPrice*10n)} ICP
                  </Button>
                  </Grid>
                    <Grid className={classes.stat} item sm={3}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => buyFromSale(20)}
                    style={{ fontWeight: "bold", margin: "0 auto" }}
                  >
                    Buy 20 ICTuT<br />for {_showListingPrice(whitelistPrice*20n)} ICP
                  </Button>
                  </Grid>
                  </Grid>
                  <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking the button below you show acceptance of our Terms of Service</p>
                  
                  </>
                :
                  <>
                  <p><strong><span style={{color:"red"}}>Sorry, the sale is now over! You can grab your ICTuT from the marketplace soon!</span></strong></p>
                  </>
                }
              </>
          </div>
        </div>
      </main>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  walletBtn: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  stat: {
    span : {
      fontSize: "2em"
    }
  },
  content: {
    flexGrow: 1,
    marginTop: 73,
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 300,
    },
  },
}));
