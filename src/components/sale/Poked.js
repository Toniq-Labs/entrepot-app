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
import Alert from '@material-ui/lab/Alert';
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
export default function Poked(props) {
  const [page, setPage] = React.useState(1);
  const [remaining1, setRemaining1] = React.useState(false);
  const [remaining2, setRemaining2] = React.useState(false);
  const [remaining3, setRemaining3] = React.useState(false);
  const [remaining4, setRemaining4] = React.useState(false);
  const [whitelist, setWhitelist] = React.useState(false);
  var round1start = 1636401600000;
  var round2start = 1636405200000;
  var round3start = 1636408800000;
  var round4start = 1636488000000;
  var price1 = 75000000n;
  var price2 = 100000000n;
  var price3 = 150000000n;
  var saleOver = false;  
  const params = useParams();
  
  const _updates = async () => {
    var stats = await api.canister("bzsui-sqaaa-aaaah-qce2a-cai").salesStats((props.account ? props.account.address : ""));
    console.log(stats);
    setRemaining1(Number(stats[0]));
    setRemaining2(Number(stats[1]));
    setRemaining3(Number(stats[2]));
    setRemaining4(Number(stats[3]));
    setWhitelist(stats[4]);
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
        props.loader(true, "Reserving Bot...");
      } else {
        props.loader(true, "Reserving Bots..");
      }
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister("bzsui-sqaaa-aaaah-qce2a-cai", "sale")
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
          r3 = await api.canister("bzsui-sqaaa-aaaah-qce2a-cai", "sale").retreive(paytoaddress);
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
    [1, 400000000n],
    [3, 1100000000n],
    [5, 1800000000n],
    [10, 3500000000n],
  ]
  return (
    <>
      <div style={styles.main}>
        <div className={classes.banner}>
        <div style={{width: "100%", height: 200, borderRadius:10,backgroundPosition: "top", backgroundSize: "cover",backgroundImage:"url('/collections/poked/banner.jpg')"}}></div>
        <h1>Welcome to the official Poked Bots sale</h1>
        </div>
        <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
          <Grid style={(Date.now() >= round2start || remaining1 === 0 ? {opacity:"0.4"} : {})} className={classes.stat} item md={2} xs={6}>
            <strong>ROUND 1</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining1 !== false ? (remaining1 === 0 ? "SOLD OUT" : (Date.now() >= round2start ? "OVER" : remaining1) ) : "Loading..."}</span><br />
            <strong>0.75 ICP</strong>
          </Grid>
          <Grid style={(Date.now() >= round3start || remaining2 === 0 ? {opacity:"0.4"} : {})}  className={classes.stat} item md={2} xs={6}>
            <strong>ROUND 2</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining2 !== false ? (remaining2 === 0 ? "SOLD OUT" : (Date.now() >= round3start ? "OVER" : remaining2) ) : "Loading..."}</span><br />
            <strong>1 ICP</strong>
          </Grid>
          <Grid style={(Date.now() >= round4start || remaining3 === 0 ? {opacity:"0.4"} : {})}  className={classes.stat} item md={2} xs={6}>
            <strong>ROUND 3</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining3 !== false ? (remaining3 === 0 ? "SOLD OUT" : (Date.now() >= round4start ? "OVER" : remaining3) ) : "Loading..."}</span><br />
            <strong>1.5 ICP</strong>
          </Grid>
          <Grid style={(remaining4 === 0 ? {opacity:"0.4"} : {})}  className={classes.stat} item md={2} xs={6}>
            <strong>PUBLIC SALE</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining4 !== false ? (remaining4 === 0 ? "SOLD OUT" : remaining4 ) : "Loading..."}</span><br />
            <strong>4 ICP</strong>
          </Grid>
        </Grid>
        <br /><br />
        
        {saleOver || remaining4 === 0 ? 
        <p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your Poked Bot from the marketplace soon!</span></strong></p>
        :
        <>
        {whitelist && Date.now() < round4start ?
        <Alert style={{marginBottom:40,width:800,margin:"0 auto"}} severity="success"><strong>You are on the whitelist - you can purchase 1 bot during one of the Presale Rounds!</strong></Alert>
        :""}
        {Date.now() < round1start ?
          <>
            <p><strong><span style={{fontSize:"20px",color:"black"}}>The first presale round starts <Timestamp relative autoUpdate date={round1start/1000} /> for whitelisted users only!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p>
          </>:
          <>
            {Date.now() < round2start ?
              <>
                {remaining1 === false ?  <><p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p></>: 
                <>
                  {remaining1 === 0 ? <><p><strong><span style={{fontSize:"20px",color:"black"}}>The first presale round has sold out. The second presale round starts <Timestamp relative autoUpdate date={round2start/1000} /> for whitelisted users only!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p></>:
                  <>
                  {whitelist ? 
                  <>
                    <Button variant={"contained"} color={"primary"} onClick={() => buyFromSale(1, price1)} style={{ fontWeight: "bold", margin: "0 auto" }}>Buy 1 Bot<br />for {_showListingPrice(price1)} ICP</Button>
                    <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                  </> : 
                  <p><strong><span style={{fontSize:"20px",color:"black"}}>You are not allowed to participate in this round!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p>
                  }
                  </>}
                </>}
              </> :
              <>
                {Date.now() < round3start ?
                  <>
                    {remaining2 === false ?  <><p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p></>: 
                    <>
                      {remaining2 === 0 ? <><p><strong><span style={{fontSize:"20px",color:"black"}}>The second presale round has sold out. The final presale round starts <Timestamp relative autoUpdate date={round3start/1000} /> for whitelisted users only!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p></>:
                      <>
                      {whitelist ? 
                      <>
                        <Button variant={"contained"} color={"primary"} onClick={() => buyFromSale(1, price2)} style={{ fontWeight: "bold", margin: "0 auto" }}>Buy 1 Bot<br />for {_showListingPrice(price2)} ICP</Button>
                        <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                      </> : 
                      <p><strong><span style={{fontSize:"20px",color:"black"}}>You are not allowed to participate in this round!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p>
                      }
                      </>}
                    </>}
                  </> :
                  <>
                    {Date.now() < round4start ?
                      <>
                        {remaining3 === false ?  <><p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p></>: 
                        <>
                          {remaining3 === 0 ? <><p><strong><span style={{fontSize:"20px",color:"black"}}>The final presale round has sold out. The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p></>:
                          <>
                          {whitelist ? 
                          <>
                            <Button variant={"contained"} color={"primary"} onClick={() => buyFromSale(1, price3)} style={{ fontWeight: "bold", margin: "0 auto" }}>Buy 1 Bot<br />for {_showListingPrice(price3)} ICP</Button>
                            <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                          </> : 
                          <p><strong><span style={{fontSize:"20px",color:"black"}}>You are not allowed to participate in this round!<br /><br />The public sale starts <Timestamp relative autoUpdate date={round4start/1000} /></span></strong></p>
                          }
                          </>}
                        </>}
                      </> :
                      <>
                        <Grid justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                        {buyOptions.map(o => {
                          return (<Grid className={classes.stat} item sm={3}>
                            <Button
                              variant={"contained"}
                              color={"primary"}
                              onClick={() => buyFromSale(o[0], o[1])}
                              style={{ fontWeight: "bold", margin: "0 auto" }}
                            >
                              Buy {o[0]} Bot{o[0] === 1 ? "" : "s"}<br />for {_showListingPrice(o[1])} ICP
                            </Button>
                          </Grid>);
                        })}
                        </Grid>
                        <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                      </>
                    }
                  </>
                }
              </>
            }
          </>
        }
        </>}
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
