/* global BigInt */
import React, { useEffect } from "react";
import extjs from "../../ic/extjs.js";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
export default function ICApes(props) {
  const [page, setPage] = React.useState(1);
  const [price, setPrice] = React.useState(150000000n);
  const [remaining, setRemaining] = React.useState(false);
  const [startTime, setStartTime] = React.useState(1638457200000);
  const [round, setRound] = React.useState("Loading...");
  const [roundRemaining, setRoundRemaining] = React.useState(0);
  const [publicSale, setPublicSale] = React.useState(false);
  const [whitelist, setWhitelist] = React.useState(false);
  const [publicTimer, setPublicTimer] = React.useState(false);
  const [currentRoundNumber, setCurrentRoundNumber] = React.useState(2);
  var saleOver = false;  
  const params = useParams();
  
  const _updates = async () => {
    var stats = await api.canister("zvycl-fyaaa-aaaah-qckmq-cai").salesStats((props.account ? props.account.address : ""));
    console.log(stats);
    setRound(stats[2][0]);
    console.log(stats[2][0]);
    var cr = ["Round 3", "Public Round 1", "Public Round 2"].indexOf(stats[2][0]);
    setCurrentRoundNumber((cr < 0 ? 3 : cr));
    setPrice(stats[2][1]);
    setRoundRemaining(Number(stats[2][2]));
    setPublicSale(!stats[2][3]);
    setWhitelist(stats[3]);
    setRemaining(Number(stats[0]));
    if (stats[1].length) setPublicTimer(Number(stats[1][0]/1000000n));
  };
  const theme = useTheme();
  const classes = useStyles();
  const styles = {
    main: {
      maxWidth: 1200,
      margin: "0 auto",
      textAlign: "center",
      minHeight:"calc(100vh - 221px)"
    },
  };
  const buyFromSale = async (qty, price) => {
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
        props.loader(true, "Reserving ICApe...");
      } else {
        props.loader(true, "Reserving ICApes..");
      }
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister("zvycl-fyaaa-aaaah-qckmq-cai", "sale")
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
          r3 = await api.canister("zvycl-fyaaa-aaaah-qckmq-cai", "sale").retreive(paytoaddress);
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
    [
      [1, 90000000n],
    ],
    [
      [1, 120000000n],
      [3, 340000000n],
      [10, 1000000000n],
      [20, 1800000000n],
    ],
    [
      [1, 150000000n],
      [3, 400000000n],
      [10, 1200000000n],
      [20, 2000000000n],
    ],
    [[]],
  ]
  return (
    <>
      <div style={styles.main}>
        <div className={classes.banner}>
        <div style={{width: "100%", height: 200, borderRadius:10,backgroundPosition: "top", backgroundSize: "cover",backgroundImage:"url('/collections/icapes/banner.jpg')"}}></div>
        <h1>Welcome to the official ICApes sale</h1>
        </div>
        <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>ROUND</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{round}</span>
          </Grid>
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>ROUND PRICE</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{_showListingPrice(price)} ICP</span>
          </Grid>
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>REMAINING</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{roundRemaining}</span>
          </Grid>
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>SOLD</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining !== false ? 9829-remaining : "Loading..."}</span>
          </Grid>
        </Grid>
        <br /><br />
        {remaining === false ? 
          <>
            <p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p>
          </>
        : 
          <>{(!saleOver && remaining > 0) ?
            <>
              {Date.now() >= startTime ? 
                <>
                  {publicSale ?
                    <>
                      <Grid justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                        {buyOptions[currentRoundNumber].map(o => {
                          return (<Grid className={classes.stat} item sm={3}>
                            <Button
                              variant={"contained"}
                              color={"primary"}
                              onClick={() => buyFromSale(o[0], o[1])}
                              style={{ fontWeight: "bold", margin: "0 auto" }}
                            >
                              Buy {o[0]} Ape{o[0] === 1 ? "" : "s"}<br />for {_showListingPrice(o[1])} ICP
                            </Button>
                          </Grid>);
                        })}
                      </Grid>
                      <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                    </>
                  :
                    <>
                    {whitelist ? 
                      <>
                        <p><strong><span style={{fontSize:"20px",color:"black"}}>You are on the whitelist!</span></strong></p>
                        
                        <Grid justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                          <Grid className={classes.stat} item sm={3}>
                            <Button
                              variant={"contained"}
                              color={"primary"}
                              onClick={() => buyFromSale(1, price)}
                              style={{ fontWeight: "bold", margin: "0 auto" }}
                            >
                              Buy 1 Ape<br />for {_showListingPrice(price)} ICP
                            </Button>
                          </Grid>
                        </Grid>
                      </>:
                      <>
                        {publicTimer ? 
                          <p><strong><span style={{fontSize:"20px",color:"black"}}>The public sale starts <Timestamp relative autoUpdate date={publicTimer/1000} />!</span></strong></p>
                          :
                          <p><strong><span style={{fontSize:"20px",color:"black"}}>The sale is only open to those on the whitelist. The public sale will start when the private sale has ended.</span></strong></p>
                        }
                      </>
                    }
                    </>
                  }
                </>
                 :
                <>
                  {whitelist ? 
                  <>
                    <p><strong><span style={{fontSize:"20px",color:"black"}}>You are on the whitelist!</span></strong></p>
                  </>: "" }
                  <p><strong><span style={{fontSize:"20px",color:"black"}}>The private (whitelist only) sale starts <Timestamp relative autoUpdate date={startTime/1000} />!</span></strong></p>
                </>
              }
            </>
          : 
            <p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your ICApe from the marketplace soon!</span></strong></p>
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
