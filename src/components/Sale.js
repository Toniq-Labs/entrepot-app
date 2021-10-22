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
const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
export default function Sale(props) {
  const [salesOnline, setSalesOnline] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [sold, setSold] = React.useState(0);
  const [unsold, setUnsold] = React.useState(9937);
 
  var publicPrice = 300000000n;
  const [whitelistPrice, setWhitelistPrice] = React.useState(publicPrice);
  const params = useParams();
  
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
  const buyFromSale = async (qty) => {
    var ps = {
      1 : whitelistPrice,
      5 : 1500000000n,
      10 : 3000000000n,
      20 : 6000000000n,
    };
    var price = ps[qty];
    if (props.balance < (price + 10000n)){
      return props.alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    }
    try {
      props.loader(true, "Reserving ICTuT...");
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister("ahl3d-xqaaa-aaaaj-qacca-cai")
        .reserve(
          price,
          qty,
          props.account.address,
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
          props.identity.getPrincipal(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.address]);
  
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
        <br /><br />
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
              
            </> :
            <>
              <p><strong><span style={{color:"red"}}>Sorry, the sale is now over! You can grab your ICTuT from the marketplace soon!</span></strong></p>
            </>
          }
        </>
      </div>
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
