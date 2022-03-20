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
export default function DfinityDeckSaleComponent(props) {
    const getCollectionFromRoute = r => {
        return props.collections.find(e => e.route === r)
    };
    const params = useParams();
    const navigate = useNavigate();
    var collection = getCollectionFromRoute("DfinityDeckElements");
    if (typeof collection == 'undefined' || typeof collection.sale == 'undefined' || collection.sale == false) {
        navigate(`/marketplace/${collection?.route}`)
    };

    const [price, setPrice] = React.useState(false);
    const [salePrice, setSalePrice] = React.useState(false);
    const [remaining, setRemaining] = React.useState(false);
    const [sold, setSold] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [startTime, setStartTime] = React.useState(false);
    const [whitelistTime, setWhitelistTime] = React.useState(false);
    const [whitelist, setWhitelist] = React.useState(false);
    const [totalToSell, setTotalToSell] = React.useState(false);
    const [bulkPricing, setBulkPricing] = React.useState([1n]);

    const _updates = async () => {
        var salesSettings = await api.canister(collection.canister, "sale").salesSettings((props.account ? props.account.address : ""));
        console.log(salesSettings);
        setSalePrice(salesSettings.salePrice);
        setStartTime(Number(salesSettings.startTime/1000000n));
        setWhitelistTime(Number(salesSettings.whitelistTime/1000000n));
        setWhitelist(salesSettings.whitelist);
        setTotalToSell(Number(salesSettings.totalToSell));
        setBulkPricing(salesSettings.bulkPricing);
        setRemaining(Number(salesSettings.remaining));
        setSold(Number(salesSettings.sold));
        setPending(Number(salesSettings.totalToSell - salesSettings.remaining - salesSettings.sold));
        setPrice(salesSettings.price);
    };
    const theme = useTheme();
    const classes = useStyles();
    const styles = {
        main: {
            maxWidth: 1200,
            margin: "0 auto",
            textAlign: "center",
            minHeight:"calc(100vh - 221px)",
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
    return (
        <>
            <div style={{}}>
            <div style={styles.main}>
                <div className={classes.banner}>
                    <div style={{width: "100%", height: 200, borderRadius:10,backgroundPosition: "top", backgroundSize: "cover",backgroundImage:"url('"+collection.banner+"')"}}></div>
                    <h1>Welcome to the official {collection.name} sale</h1>
                </div>
                <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                    {whitelist ?
                        <Grid className={classes.stat} item md={3} xs={6}>
                            <strong>WHITELIST PRICE</strong><br />
                            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{_showListingPrice(price)} ICP</span>
                        </Grid>:
                        <Grid className={classes.stat} item md={3} xs={6}>
                            <strong>SALE PRICE</strong><br />
                            <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{salePrice !== false ? _showListingPrice(salePrice) + " ICP" : "Loading..."}</span>
                        </Grid>

                    }
                    <Grid className={classes.stat} item md={3} xs={6}>
                        <strong>AVAILABLE</strong><br />
                        <span style={{fontWeight:"bold",color:"#00b894",fontSize:"2em"}}>{remaining !== false ? remaining : "Loading..."}</span>
                    </Grid>
                    <Grid className={classes.stat} item md={3} xs={6}>
                        <strong>PENDING</strong><br />
                        <span style={{fontWeight:"bold",color:"rgb(225 142 19)",fontSize:"2em"}}>{pending !== false ? pending : "Loading..."}</span>
                    </Grid>
                    <Grid className={classes.stat} item md={3} xs={6}>
                        <strong>SOLD</strong><br />
                        <span style={{fontWeight:"bold",color:"rgb(189 1 1)",fontSize:"2em"}}>{sold !== false ? sold : "Loading..."}</span>
                    </Grid>
                    <Grid className={classes.stat} item xs={10}>
                        <LinearProgress variant="buffer" value={Math.round(remaining/totalToSell*100)} valueBuffer={Math.round((remaining+pending)/totalToSell*100)} />
                    </Grid>
                </Grid>
                <br /><br />
                {price === false ?
                    <>
                        <p><strong><span style={{fontSize:"20px",color:"black"}}>Loading...</span></strong></p>
                    </>
                    :
                    <>{sold < totalToSell ?
                        <>
                            {remaining > 0 ?
                                <>
                                    {whitelist && Date.now() < startTime && startTime < whitelistTime  ?
                                        <>
                                            <p><strong><span style={{fontSize:"20px",color:"black"}}>You are on the whitelist! The private sale starts <Timestamp relative autoUpdate date={startTime/1000} />!</span></strong></p>
                                        </> : ""
                                    }
                                    {whitelist && Date.now() >= startTime && Date.now() < whitelistTime ?
                                        <>
                                            <p><strong><span style={{fontSize:"20px",color:"black"}}>You are on the whitelist!</span></strong></p>

                                            <>
                                                <Grid justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                                                    <Grid justifyContent="center" item md={6} xs={12}>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => buyFromSale(1, price)}
                                                            style={{ fontWeight: "bold", margin: "0 auto", background: "transparent", outline: "none", boxShadow: "none" }}
                                                        >
                                                            <img src="/dfinity_deck/images/wl_mint.png" style={{ width: "100%" }}></img>
                                                        </Button>
                                                    </Grid>
                                                    <Grid justifyContent="center" item md={6} xs={12}>
                                                        <img src="/dfinity_deck/images/parchment.png" style={{ width: "100%" }}></img>
                                                    </Grid>
                                                </Grid>
                                                <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                                            </>

                                        </> : ""
                                    }
                                    {Date.now() >= whitelistTime ?
                                        <>
                                            <Grid justifyContent="center" direction="row" alignItems="center" container spacing={2} style={{}}>
                                                <Grid justifyContent="center" item md={6} xs={12}>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => buyFromSale(1, price)}
                                                        style={{ fontWeight: "bold", margin: "0 auto", background: "transparent", outline: "none", boxShadow: "none" }}
                                                    >
                                                        <img src="/dfinity_deck/images/regular_mint.png" style={{ width: "100%" }}></img>
                                                    </Button>
                                                </Grid>
                                                <Grid justifyContent="center" item md={6} xs={12}>
                                                    <img src="/dfinity_deck/images/parchment.png" style={{ width: "100%" }}></img>
                                                </Grid>
                                            </Grid>
                                            <p><strong>Please note:</strong> All transactions are secured via Entrepot's escrow platform. There are no refunds or returns, once a transaction is made it can not be reversed. Entrepot provides a transaction service only. By clicking one of the buttons above you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></p>
                                        </> :
                                        <>
                                            <p><strong><span style={{fontSize:"20px",color:"black"}}>The public sale starts <Timestamp relative autoUpdate date={whitelistTime/1000} />!</span></strong></p>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <p><strong><span style={{fontSize:"20px",color:"black"}}>There are currently no more NFTs available, but not all sales have settled yet. If these transactions do not settle in time, the NFTs will become available to purchase again.</span></strong></p>
                                </>
                            }
                        </>
                        :
                        <><p><strong><span style={{fontSize:"20px",color:"red"}}>Sorry, the sale is now over! You can grab your NFT from the marketplace!</span></strong></p>
                            <Button
                                className={classes.marketBtn}
                                variant={"outlined"}
                                onClick={() => navigate(`/marketplace/`+collection.route)}
                                color={"primary"}
                                style={{ fontWeight: "bold", margin: "20px auto" }}
                            >Explore the Marketplace</Button></>
                    }</>
                }
            </div>
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
    "& #root" : {
      display:"none",
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
