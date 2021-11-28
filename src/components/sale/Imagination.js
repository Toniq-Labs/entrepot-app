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
import Flip2 from "../Flip2";
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
var subs = [];
export default function Imagination(props) {
  const [page, setPage] = React.useState(1);
  const [price, setPrice] = React.useState(300000000n);
  const [remaining, setRemaining] = React.useState(false);
  const [remaining0, setRemaining0] = React.useState(20);
  const [remaining1, setRemaining1] = React.useState(20);
  const [remaining2, setRemaining2] = React.useState(20);
  const [remaining3, setRemaining3] = React.useState(20);
  const [remaining4, setRemaining4] = React.useState(20);
  const [remaining5, setRemaining5] = React.useState(20);
  const [remaining6, setRemaining6] = React.useState(20);
  const [remaining7, setRemaining7] = React.useState(20);
  const [startTime, setStartTime] = React.useState(1638115200000);
  var saleOver = false;  

  const onFlip = async a => {
    for(var i = 0; i < subs.length; i++){
      if (i == a) continue;
      subs[i]();
    };
  };
  const flipSubscriber = async (i, a) => {
    subs[i] = a;
  };
  const params = useParams();
  
  const _updates = async () => {
    var stats = await api.canister("px5ub-qqaaa-aaaah-qcjxa-cai").salesStats((props.account ? props.account.address : ""));
    setStartTime(Number(stats[0]/1000000n));
    setPrice(stats[1]);
    setRemaining0(Number(stats[2]));
    setRemaining1(Number(stats[3]));
    setRemaining2(Number(stats[4]));
    setRemaining3(Number(stats[5]));
    setRemaining4(Number(stats[6]));
    setRemaining5(Number(stats[7]));
    setRemaining6(Number(stats[8]));
    setRemaining7(Number(stats[9]));
    setRemaining(Number(stats[2])+Number(stats[3])+Number(stats[4])+Number(stats[5])+Number(stats[6])+Number(stats[7])+Number(stats[8])+Number(stats[9]));
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
  const buyFromSale = async (type) => {
    if (props.balance < (price + 10000n)){
      return props.alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    }
    var v = await props.confirm("Please confirm", "Are you sure you want to continue with this purchase of 1 NFT for the total price of " + _showListingPrice(price) + " ICP. All transactions are final on confirmation and can't be reversed.")
    if (!v) return;
    try {
      props.loader(true, "Reserving NFT...");
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister("px5ub-qqaaa-aaaah-qcjxa-cai")
        .reserve(
          price,
          type,
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
          r3 = await api.canister("px5ub-qqaaa-aaaah-qcjxa-cai").retreive(paytoaddress);
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
  const getRemaining = t => {
    switch(t){
      case 0: return remaining0;
      case 1: return remaining1;
      case 2: return remaining2;
      case 3: return remaining3;
      case 4: return remaining4;
      case 5: return remaining5;
      case 6: return remaining6;
      case 7: return remaining7;
    };
  };
  return (
    <>
      <div style={styles.main}>
        <div className={classes.banner}>
        <div style={{width: "100%", height: 200, borderRadius:10,backgroundPosition: "top", backgroundSize: "cover",backgroundImage:"url('/collections/imagination/banner.jpg')"}}></div>
        <h1>Welcome to the official Imagination Project sale</h1>
        <p>A photographer who brings a sense of underlying magic to the meticulous conceptual images he creates.</p><p>Bringing his attentive eye and deep relationship with nature into the built studio environment, Ted's still life images are anything but static, as every photograph is infused with a sense of action or motion.</p><p>A true polymath who works across a number of sectors, Ted is adept at bringing together teams of scientists, model-builders, engineers, doctors, mathematicians, sculptors, set designers and artists to create engaging imagery for his international clientele and personal projects.</p><p>Ted's recent work with The Royal Academy of Engineering has exhibited at The National Science and Media Museum (UK) and Edinburgh Science Festival (UK)</p><p>The Imagination Project, created 50 photographs over the course of a year, celebrating the human imagination in all its wild and vast diversity.  The Projects narrative is formed through the interpretation of 400 years of Patents. A veritable encyclopaedia of human achievement.</p>
        </div>
        <br /><br />
        <hr />
        <br /><br />
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
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining ? 160-remaining : "Loading..."}</span>
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
                "" :
                <>
                  <p><strong><span style={{fontSize:"20px",color:"black"}}>The public sale starts <Timestamp relative autoUpdate date={startTime/1000} />!</span></strong><br /><br /></p>
                </>
              }
              <>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
                  {[0,1,2,4,6,7,3,5].map(a => {
                    return (<Flip2 remaining={getRemaining(a)} saleLive={Date.now() >= startTime} button={<Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => buyFromSale(a)}
                        style={{ fontWeight: "bold", margin: "0 auto" }}
                      >
                        Buy for {_showListingPrice(price)} ICP
                      </Button>} key={a} id={a} onFlip={onFlip} flipSubscriber={flipSubscriber} front={"https://px5ub-qqaaa-aaaah-qcjxa-cai.raw.ic0.app/?asset="+a+".jpg"} back={"https://px5ub-qqaaa-aaaah-qcjxa-cai.raw.ic0.app/?asset="+a+"B.jpg"} />);
                  })}
                </Grid>
                <br />
                <br />
                <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                
              </>
            </>
          : 
            <p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your Hero from the marketplace soon!</span></strong></p>
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
