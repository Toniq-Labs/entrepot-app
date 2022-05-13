import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { styled, withStyles } from '@material-ui/styles';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import MuiTooltip from "@material-ui/core/Tooltip";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import getGenes from "./CronicStats.js";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Timestamp from "react-timestamp";
import extjs from "../ic/extjs.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrowForwardIosSharpIcon from '@material-ui/icons/ArrowForwardIosSharp';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MuiTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'
import Favourite from './Favourite';
import PriceICP from './PriceICP';
import getNri from "../ic/nftv.js";
import { makeStyles } from "@material-ui/core";
import { EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD } from '../utils';
const api = extjs.connect("https://boundary.ic0.app/");
const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
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
const _showDate = (t) => {
  return new Date(Number(t/1000000n)).toLocaleDateString();
};
var doRefresh = false;
const useStyles = makeStyles((theme) => ({
  smallGrid : {
    width: "300px", 
    [theme.breakpoints.down("sm")]: {
      width:"100%"
    },
  },
  bigGrid : {
    width: "200px", 
    [theme.breakpoints.down("sm")]: {
      width:"100%"
    },
  },
}));
var fromWrappedMap = {
  "bxdf4-baaaa-aaaah-qaruq-cai" : "qcg3w-tyaaa-aaaah-qakea-cai",
  "y3b7h-siaaa-aaaah-qcnwa-cai" : "4nvhy-3qaaa-aaaah-qcnoq-cai",
  "3db6u-aiaaa-aaaah-qbjbq-cai" : "d3ttm-qaaaa-aaaai-qam4a-cai",
  "q6hjz-kyaaa-aaaah-qcama-cai" : "xkbqi-2qaaa-aaaah-qbpqq-cai",
  "jeghr-iaaaa-aaaah-qco7q-cai" : "fl5nr-xiaaa-aaaai-qbjmq-cai"
};
var toWrappedMap = {
  "qcg3w-tyaaa-aaaah-qakea-cai" : "bxdf4-baaaa-aaaah-qaruq-cai",
  "4nvhy-3qaaa-aaaah-qcnoq-cai" : "y3b7h-siaaa-aaaah-qcnwa-cai",
  "d3ttm-qaaaa-aaaai-qam4a-cai" : "3db6u-aiaaa-aaaah-qbjbq-cai",
  "xkbqi-2qaaa-aaaah-qbpqq-cai" : "q6hjz-kyaaa-aaaah-qcama-cai",
  "fl5nr-xiaaa-aaaai-qbjmq-cai" : "jeghr-iaaaa-aaaah-qco7q-cai"
};
const getEXTCanister = c => {
  if (toWrappedMap.hasOwnProperty(c)) return toWrappedMap[c];
  else return c;
};
const getEXTID = tokenid => {
  const { index, canister} = extjs.decodeTokenId(tokenid);
  return extjs.encodeTokenId(getEXTCanister(canister), index);
};
export default function NFT(props) {
  const classes = useStyles();
  const tokenid = props.tokenid;
  const { index, canister} = extjs.decodeTokenId(tokenid);
  const nri = getNri(canister, index);
  const [metadata, setMetadata] = React.useState(false);
  const [ref, setRef] = React.useState(0);
  const [isNotEXT, setIsNotEXT] = React.useState(toWrappedMap.hasOwnProperty(canister));
  const [listing, setListing] = React.useState(props.listing);
  const [offerCount, setOfferCount] = React.useState(0);
  const [offer, setOffer] = React.useState(false);
  const [showOfferCount, setShowOfferCount] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentBtn, setCurrentBtn] = React.useState(null);
  const [currentBtnText, setCurrentBtnText] = React.useState(false);

  const getCollection = c => {
    if (typeof props.collections.find(e => e.canister === c) == 'undefined') return {};
    return props.collections.find(e => e.canister === c);
  };
  const navigate = useNavigate();
  const getListing = () => {
    if (isNotEXT) return setListing(false);
    api.token(canister).listings().then(r => {
      var f = r.find(a => a[0] == index);
      if (f[1]) setListing(f[1]);
      else setListing(false);
    });
  };
  const getMetadata = async () => {
    var md = await api.token(tokenid).getMetadata();
    if (typeof md != 'undefined' && md.type == "nonfungible"){
      setMetadata(md.metadata[0]);
    };
  };
  const getOffer = async () => {
    await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offers(getEXTID(tokenid)).then(r => {
      setOfferCount(r.length);
      setOffer(r.map(a => {return {buyer : a[0], amount : a[1], time : a[2]}}).sort((a,b) => Number(b.amount)-Number(a.amount))[0]);
    });
  }
  useInterval(() => {
    refresh()
  }, 60 * 1000);
  
  React.useEffect(() => {
    if (typeof props.listing == 'undefined') {
      getListing();
      doRefresh = true;
    };
    getOffer();
    getMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (props.listing) setListing(props.listing);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.listing]);
  const styles = {
    avatarSkeletonContainer: {
      height: 0,
      overflow: "hidden",
      paddingTop: "100%",
      position: "relative",
    },
    avatarLoader: {
      position: "absolute",
      top: "15%",
      left: "15%",
      width: "70%",
      height: "70%",
      margin: "0 auto",
    },
    avatarImg: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      margin: "0 auto",
      objectFit: "contain",
      borderRadius:"50px",
    },
  };
  const _isLocked = () => {
    if (typeof listing == 'undefined') return false;
    if (!listing) return false;
    if (typeof listing.locked == 'undefined') return false;
    if (listing.locked.length === 0) return false;
    if (Date.now() >= Number(listing.locked[0] / 1000000n)) return false;
    return true;
  };

  const refresh = async () => {
    if (doRefresh) {
      await getListing();
    };
    await getOffer();
    await getMetadata();
    if (canister == 'yrdz3-2yaaa-aaaah-qcvpa-cai') {
      console.log('updated');
      setRef(ref+1);
    };
    
  };
  const buy = async () => {
    return props.buy(canister, index, listing, props.afterBuy);
  };
  const buttonLoader = (enabled) => {
    if (enabled) setCurrentBtnText(true);
    else setCurrentBtnText(false);
  };
  const buttonPush = btn => {
    var clickev = btn;
    if (typeof btn == 'number') {
      setCurrentBtn(btn)
      clickev = getButtons()[btn][1];
    }
    //buttonLoader("test", false);
    clickev();
    //setCurrentBtn(null)
  };
  var buttonLoadingText = (<CircularProgress size={20.77} style={{color:"white",margin:1}} />);
  const getButtons = () => {
    var buttons = [];
    if(listing) {
      buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Update"), () => props.listNft({id : tokenid, listing:listing}, buttonLoader, refresh)]);
      buttons.push([(currentBtn == 1 && currentBtnText ? buttonLoadingText : "Transfer"), () => props.transferNft({id : tokenid, listing:listing}, buttonLoader, props.refresh)]);
    } else {
      if (wrappedCanisters.concat(unwrappedCanisters).indexOf(canister) < 0) {
        buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.listNft({id : tokenid, listing:listing}, buttonLoader, refresh)]);
        buttons.push([(currentBtn == 1 && currentBtnText ? buttonLoadingText : "Transfer"), () => props.transferNft({id : tokenid, listing:listing}, buttonLoader, props.refresh)]);
      } else {
        if (unwrappedCanisters.indexOf(canister) >= 0) {
          buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.wrapAndlistNft({id : tokenid, listing:listing}, props.loader, props.refresh)]);
          buttons.push([(currentBtn == 1 && currentBtnText ? buttonLoadingText : "Transfer"), () => props.transferNft({id : tokenid, listing:listing}, buttonLoader, props.refresh)]);
        } else {
          buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.listNft({id : tokenid, listing:listing}, buttonLoader, refresh)]);
          buttons.push(["Transfer", () => props.transferNft({id : tokenid, listing:listing}, props.loader, props.refresh)]);
          buttons.push(["Unwrap", () => props.unwrapNft({id : tokenid, listing:listing}, props.loader, props.refresh)]);
        };
      }
      if (canister == 'poyn6-dyaaa-aaaah-qcfzq-cai' && index >= 25000 && index < 30000) {
        buttons.push(["Open", () => props.unpackNft({id : tokenid, listing:listing, canister : canister}, buttonLoader, refresh)]);
      };
      if (canister == 'yrdz3-2yaaa-aaaah-qcvpa-cai' && metadata && metadata.length == 4 && Date.now() >= 1647788400000) {
        buttons.push(["Hatch", () => props.unpackNft({id : tokenid, listing:listing, canister : canister}, buttonLoader, refresh)]);
      };
      if (canister == '6wih6-siaaa-aaaah-qczva-cai' && !metadata && Date.now() >= 1650034800000) {
        buttons.push(["Cash Out", () => props.unpackNft({id : tokenid, listing:listing, canister : canister}, buttonLoader, refresh)]);
      };
    }
    return buttons;
  };
  const mintNumber = () => {
    return EntrepotNFTMintNumber(canister, index);
  };
  const nftImg = () => {
    return EntrepotNFTImage(getEXTCanister(canister), index, tokenid, false, ref);
  };
  const nftLink = () => {
    return EntrepotNFTLink(getEXTCanister(canister), index, tokenid);
  };
  
  const nriLink = () => {
    if (canister === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=punks&tokenid=" + index;
    if (canister === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=drips&tokenid=" + index;
    if (canister === "q6hjz-kyaaa-aaaah-qcama-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=bunnies&tokenid=" + index;
    return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" + tokenid;
  };
  const wrappedCanisters = ["jeghr-iaaaa-aaaah-qco7q-cai","y3b7h-siaaa-aaaah-qcnwa-cai","q6hjz-kyaaa-aaaah-qcama-cai", "3db6u-aiaaa-aaaah-qbjbq-cai", "bxdf4-baaaa-aaaah-qaruq-cai"];
  const unwrappedCanisters = ["fl5nr-xiaaa-aaaai-qbjmq-cai","4nvhy-3qaaa-aaaah-qcnoq-cai","xkbqi-2qaaa-aaaah-qbpqq-cai", "qcg3w-tyaaa-aaaah-qakea-cai", "d3ttm-qaaaa-aaaai-qam4a-cai"];
  const showWrapped = () => {
    if (isNotEXT) return (<span style={{fontSize:".9em",position:"absolute",top: 0,left: 0,fontWeight: "bold",color: "black",backgroundColor: "#00b894",padding: "2px"}}>UNWRAPPED</span>);
    else return "";
  };
  var t = ["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const showNri = () => {
    if (typeof nri == 'undefined') return "";
    if (nri === false) return "";
    if (canister == "poyn6-dyaaa-aaaah-qcfzq-cai") {
      if (!metadata) return "";
      return (metadata.nonfungible.metadata[0][0] === 0 ? "Pack" : "#" + metadata.nonfungible.metadata[0][0] + " - " + t[metadata.nonfungible.metadata[0][1]]);
    };
    var collection = getCollection(canister);
    if (collection.nftv) {
      return (
        <MuiTooltip title={"NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific "+collection.unit+" relative to others. It does not include Mint #, Twin Status or Animation within the index."}>
          <span>NRI: {(nri * 100).toFixed(1)}%</span>
        </MuiTooltip>      );
    } else return "";
  };

  return (
    <Grid className={(props.gridSize === "small" ? classes.smallGrid : classes.bigGrid)} style={{ display:"flex"}} item>
      <Card onMouseOver={() => setShowOfferCount(true)} onMouseOut={() => setShowOfferCount(false)} style={{display: 'flex', width: "100%", justifyContent: 'space-between', flexDirection: 'column', position:"relative"}}>
        <Link style={{textDecoration:"none", color:"inherit"}} to={`/marketplace/asset/`+getEXTID(tokenid)}>
        <div style={{ ...styles.avatarSkeletonContainer }}>
          {EntrepotDisplayNFT(getEXTCanister(canister), tokenid, imgLoaded, nftImg(), () => setImgLoaded(true))}
        </div>
        { offerCount > 0 ?
        <Chip style={{cursor:"pointer",display:(showOfferCount?"block":"none"), fontSize:"13px", paddingTop:2,marginTop:"-30px", position:"absolute", left:"5px", color:"white"}} size="small" color="primary" label={offerCount + " Offer" + (offerCount > 1 ? "s" : "")} /> : "" }
        <CardContent style={{height:110,padding:"10px 16px"}}>
          {showWrapped()}
          <Grid container>
            <Grid item xs={12}>
              <div className="nft-rarity-hook" data-token={index} data-canister={canister} style={{padding:"5px 0",fontSize:11, fontWeight:"bold", textAlign:"left", borderBottom:"1px solid #ddd"}}>{showNri()}</div>
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Typography
                style={{
                  fontSize: 11,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
                color={"inherit"}
                gutterBottom
              >
                <MuiTooltip title="View in browser">
                  <span>
                      {"#" + mintNumber()}
                  </span>
                </MuiTooltip>
              </Typography>
            </Grid>
            {listing ?
            <>
              <Grid item md={6} sm={6} xs={6}>
                <Typography
                  style={{
                  fontSize: 13,
                  textAlign: "right",
                  fontWeight: "bold",
                  }}
                  color={"inherit"}
                  gutterBottom
                >
                  Price
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  style={{
                    fontSize: 13,
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                  color={"inherit"}
                  gutterBottom
                >
                  <PriceICP price={listing.price} />
                </Typography>
              </Grid>
              {offer ? <div style={{width:"100%",fontSize:".8em", textAlign:"right", color:"#"}}>Best <PriceICP size={13} price={offer.amount} /></div> : "" }
            </>:
              <>
                {offer?
                  <>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography
                        style={{
                        fontSize: 13,
                        textAlign: "right",
                        fontWeight: "bold",
                        }}
                        color={"inherit"}
                        gutterBottom
                      >
                        Best Offer
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        style={{
                          fontSize: 13,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                        color={"inherit"}
                        gutterBottom
                      ><PriceICP price={offer.amount} /></Typography>
                    </Grid>
                  </>:
                  <>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography
                        style={{
                        fontSize: 13,
                        textAlign: "right",
                        fontWeight: "bold",
                        }}
                        color={"inherit"}
                        gutterBottom
                      >
                        Unlisted
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        style={{
                          fontSize: 13,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                        color={"inherit"}
                        gutterBottom
                      >-</Typography>
                    </Grid>
                  </>
                }
              </>
            }
            
          </Grid>
        </CardContent>
        </Link>
        {typeof props.ownerView !== 'undefined' && props.ownerView ?
        <CardActions style={{display: "flex",justifyContent: "flex-end"}}>
          {props.loggedIn ? 
            <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={1}> 
              {getButtons().length > 0 ?
                <>
                  <Grid style={{width:"100%"}} item lg={6} md={6}><Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); buttonPush(0)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[0][0]}</Button></Grid>
                  {getButtons().length == 2 ?
                    <Grid style={{width:"100%"}}  item lg={6} md={6}><Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); buttonPush(1)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[1][0]}</Button></Grid>
                  :
                  <Grid style={{width:"100%"}} item lg={6} md={6}>
                    <Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); setAnchorEl(e.currentTarget)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>More</Button>
                    <Menu
                      anchorEl={anchorEl}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      {getButtons().slice(1).map((a, i) => {
                        return (<MenuItem key={i} onClick={(e) => {e.stopPropagation(); setAnchorEl(null); buttonPush(a[1])}}>{a[0]}</MenuItem>);
                      })}
                    </Menu>
                  </Grid>
                  }
                </>
              : "" }
          </Grid>: ""}
        </CardActions>
        :
        <CardActions style={{display: "flex",justifyContent: "flex-end"}}>
          {listing && props.loggedIn ?
            <>
              {_isLocked() ? (
                <span style={{ display: "block" }}>
                  Unlocks{" "}
                  <Timestamp
                    relative
                    autoUpdate
                    date={Number(listing.locked[0] / 1000000000n)}
                  />
                </span>
              ) : (
                <Button
                  onClick={ev => {
                    ev.stopPropagation();
                    buy();
                  }}
                  onMouseDown={ev => ev.stopPropagation()}
                  variant="contained"
                  size="small"
                  color="primary"
                  style={{ marginRight: "auto", backgroundColor: "#003240", color: "white" }}
                >Buy Now</Button>
              )}
            </> : ""
          }
          <Favourite refresher={props.faveRefresher} identity={props.identity} loggedIn={props.loggedIn} tokenid={tokenid} />
        </CardActions>}
      </Card>
      
    </Grid>
  );
}
