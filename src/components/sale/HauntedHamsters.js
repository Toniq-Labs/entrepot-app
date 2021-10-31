/* global BigInt */
import React, { useEffect } from "react";
import extjs from "../../ic/extjs.js";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Listings from "../Listings";
import Wallet from "../Wallet";
import SaleListing from "../SaleListing";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Timestamp from "react-timestamp";
import Pagination from "@material-ui/lab/Pagination";
import { StoicIdentity } from "ic-stoic-identity";
import Sidebar from "../Sidebar";
import { useParams } from "react-router";
import Navbar from "../../containers/Navbar.js";
const api = extjs.connect("https://boundary.ic0.app/");
const perPage = 60;
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
export default function HauntedHamsters(props) {
  const [page, setPage] = React.useState(1);
  const [price, setPrice] = React.useState(66000000n);
  const [remaining, setRemaining] = React.useState(6500);
  const [startTime, setStartTime] = React.useState(1635724800000);

  const params = useParams();
  
  const _updates = async () => {
    // var stats = await api.token("nfvlz-jaaaa-aaaah-qcciq-cai").call.salesStats((props.account ? props.account.address : ""));
    // setStartTime(Number(stats[0]/1000000n));
    // setPrice(stats[1]);
    // setRemaining(Number(stats[2]));
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
  const buyFromSale = async (qty, price) => {
    return false;
    if (props.balance < (price + 10000n)){
      return props.alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    }
    var v = await props.confirm("Please confirm", "Are you sure you want to continue with this purchase of " + qty + " NFT"+(qty === 1 ? "" : "s")+" for the total price of " + _showListingPrice(price) + " ICP. All transactions are final on confirmation and can't be reversed.")
    if (!v) return;
    try {
      if (qty === 1) {
        props.loader(true, "Reserving IC3D Scene...");
      } else {
        props.loader(true, "Reserving IC3D Scenes...");
      }
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister("nfvlz-jaaaa-aaaah-qcciq-cai")
        .reserve(
          price,
          qty,
          props.account.address,
          _getRandomBytes()
        );
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
          props.currentAccount,
          paytoaddress,
          pricetopay,
          10000
        );
      var r3;
      while (true) {
        try {
          props.loader(true, "Completing purchase...");
          r3 = await api.canister("nfvlz-jaaaa-aaaah-qcciq-cai").retreive(paytoaddress);
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
      props.alert(
        "There was an error",
        e.Other ?? (typeof e == "string" ? e : "You may need to enable cookies or try a different browser")
      );
    }
  };
  useInterval(_updates, 5 * 1000);
  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var buyOptions = [
    [1, 200000000n],
    [5, 1000000000n],
    [10, 2000000000n],
    [20, 4000000000n],
  ]
  return (
    <>
      <div style={styles.empty}>
        <div className={classes.banner}>
          <img style={{height:300}} alt="Haunted Hamsters" className={classes.bannerimg} src="/banner/hauntedhamsters.jpg" />
        <h1>Welcome to the official Haunted Hamsters Public Sale</h1>
        </div>
        <Grid container spacing={2} style={{}}>
          <Grid className={classes.stat} item md={4} xs={6}>
            <strong>AVAILABLE</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining ? remaining : "Loading..."}</span>
          </Grid>
          <Grid className={classes.stat} item md={4} xs={6}>
            <strong>SALE PRICE</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{_showListingPrice(price)} ICP</span>
          </Grid>
          <Grid className={classes.stat} item md={4} xs={6}>
            <strong>SOLD</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining ? 6500-remaining : "Loading..."}</span>
          </Grid>
        </Grid>
        <br /><br />
        {remaining === false ? 
          <>
            <p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p>
          </>
        : 
          <>{remaining > 0 ?
            <>
              {Date.now() >= startTime ? 
                <>
                  <Grid container spacing={2} style={{}}>
                    {buyOptions.map(o => {
                      return (<Grid className={classes.stat} item sm={3}>
                        <Button
                          variant={"contained"}
                          color={"primary"}
                          onClick={() => buyFromSale(o[0], o[1])}
                          style={{ fontWeight: "bold", margin: "0 auto" }}
                        >
                          Buy {o[0]} IC3D Scene{o[0] === 1 ? "" : "s"}<br />for {_showListingPrice(o[1])} ICP
                        </Button>
                      </Grid>);
                    })}
                  </Grid>
                  <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking the button below you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                  
                </> :
                <>
                  <p><strong><span style={{fontSize:"20px",color:"black"}}>The public sale starts <Timestamp relative autoUpdate date={startTime/1000} />!</span></strong></p>
                </>
              }
            </>
          : 
            <p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your IC3D scenes from the marketplace soon!</span></strong></p>
          }</>
        }
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
