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
import { useNavigate } from "react-router";
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
export default function V2SaleComponent(props) {
  const getCollectionFromRoute = r => {
    return props.collections.find(e => e.route === r)
  };
  const params = useParams();
  const navigate = useNavigate();
  var collection = getCollectionFromRoute(params?.route);
  if (typeof collection == 'undefined' || typeof collection.sale == 'undefined' || collection.sale == false) {
    navigate(`/marketplace/${collection?.route}`)
  };
  
  const [currentPriceGroup, setCurrentPriceGroup] = React.useState(0);
  const [groups, setGroups] = React.useState([]);
  const [remaining, setRemaining] = React.useState(false);
  const [sold, setSold] = React.useState(false);
  const [startTime, setStartTime] = React.useState(false);
  const [endTime, setEndTime] = React.useState(false);
  const [totalToSell, setTotalToSell] = React.useState(false);
    
  const _updates = async () => {
    var resp = await api.canister(collection.canister, "ext2").ext_saleSettings((props.account ? props.account.address : ""));
		if (!resp.length) return;
		var salesSettings = resp[0];
		console.log(salesSettings);
		setStartTime(Number(salesSettings.start/1000000n))
		setEndTime(Number(salesSettings.end/1000000n))
		setRemaining(Number(salesSettings.remaining))
		setTotalToSell(Number(salesSettings.quantity))
		setSold(Number(salesSettings.quantity-salesSettings.remaining))
		setGroups(salesSettings.groups)
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
        props.loader(true, "Reserving NFT...");
      } else {
        props.loader(true, "Reserving NFTs..");
      }
      const api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await api
        .canister(collection.canister, "sale")
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
          r3 = await api.canister(collection.canister, "sale").retreive(paytoaddress);
        } catch (e) {
          continue;
        }
        if (r3.hasOwnProperty("ok")) break;
        if (r3.hasOwnProperty("err")) throw "Your purchase failed! If ICP was sent and the sale ran out, you will be refunded shortly!";
      }
      props.loader(false);
      props.alert(
        "Transaction complete",
        "Your purchase was made successfully - your NFT will be sent to your address shortly"
      );
    } catch (e) {
      props.loader(false);
      props.alert(
        "There was an error",
        e.Other ?? (typeof e == "string" ? e : "You may need to enable cookies or try a different browser")
      );
    }
    _updates();
  };
  useInterval(_updates, 5 * 1000);
  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div style={styles.main}>
        <div className={classes.banner}>
        <div style={{width: "100%", height: 200, borderRadius:10,backgroundPosition: "top", backgroundSize: "cover",backgroundImage:"url('"+collection.banner+"')"}}></div>
        <h1>Welcome to the official {collection.name} sale</h1>
        </div>
        <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
					{startTime >= Date.now() ?
						<Grid className={classes.stat} item md={3} xs={6}>
							<strong>START DATE</strong><br />
							<span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{startTime !== false ? (<Timestamp relative autoUpdate date={startTime/1000} />) : "Loading..."}</span>
						</Grid>
					: 
						<Grid className={classes.stat} item md={3} xs={6}>
							<strong>END DATE</strong><br />
							<span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{endTime !== false ? (<Timestamp relative autoUpdate date={endTime/1000} />) : "Loading..."}</span>
						</Grid>
					}
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>AVAILABLE</strong><br />
            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining !== false ? remaining : "Loading..."}</span>
          </Grid>
          <Grid className={classes.stat} item md={3} xs={6}>
            <strong>SOLD</strong><br />
            <span style={{fontWeight:"bold",color:"rgb(189 1 1)",fontSize:"2em"}}>{sold !== false ? sold : "Loading..."}</span>
          </Grid>
          <Grid className={classes.stat} item xs={10}>
            <LinearProgress variant="buffer" value={Math.round(remaining/totalToSell*100)} valueBuffer={Math.round((remaining)/totalToSell*100)} />
          </Grid>
        </Grid>
        <br /><br />
        <>{!groups.length ? 
          <>
            <p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p>
          </>
        : 
					<>
						{ sold >= totalToSell ?
						 <>
							<p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your NFT from the marketplace!</span></strong></p>
							<Button
								className={classes.marketBtn}
								variant={"outlined"}
								onClick={() => navigate(`/marketplace/`+collection.route)}
								color={"primary"}
								style={{ fontWeight: "bold", margin: "20px auto" }}
							>Explore the Marketplace</Button>
						</> : 
							<>
								<Tabs
									value={currentPriceGroup}
									indicatorColor="primary"
									textColor="primary"
									centered={(window.innerWidth < 960 ? false : true)}
									scrollButtons={(window.innerWidth < 960 ? "on" : "auto")}
									variant={(window.innerWidth < 960 ? "scrollable" : "standard")}
									onChange={(e, nv) => {
										setCurrentPriceGroup(nv)
									}}
								>
									{groups.map((group, index) => {
										var badge, badgeColor;
										if (!group.available) {
											badge = "UNAVAILABLE";
											badge = "UNAVAILABLE";
										} else {
											
										};
										return (<Tab className={classes.tabsViewTab} value={Number(group.id)} label={(<span style={{padding:"0 50px"}}>{group.name}<Chip style={{"float":"right"}} size="small" label="TEST" /></span>)} />);
									})}
								</Tabs>
							</>
						}
					</>
				}</>

				
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
  tabsViewTab : {
    fontWeight:"bold",
    [theme.breakpoints.down('xs')]: {
      "&>span>span>svg" : {
        display:"none"
      },
      "&>span>span" : {
        padding:"0 5px!important"
      },
    },
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
