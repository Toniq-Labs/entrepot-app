import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { styled, withStyles } from '@material-ui/styles';
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
import _c from '../ic/collections.js';
import { EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD } from '../utils';
var collections = _c;
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
const getCollection = c => {
  return collections.find(e => e.canister === c);
};
export default function Listing(props) {
  const tokenid = props.tokenid;
  const { index, canister} = extjs.decodeTokenId(tokenid);
  const [metadata, setMetadata] = React.useState(props.metadata);
  const [listing, setListing] = React.useState(props.listing);
  const [offer, setOffer] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentBtn, setCurrentBtn] = React.useState(null);
  const [currentBtnText, setCurrentBtnText] = React.useState(false);
  
  var doRefresh = false;
  const navigate = useNavigate();
  const getListing = () => {
    api.token(canister).listings().then(r => {
      var f = r.find(a => a[0] == index);
      if (f[1]) setListing(f[1]);
      else setListing({});
    });
  };
  const getOffer = async () => {
    await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offers(tokenid).then(r => {
      setOffer(r.map(a => {return {buyer : a[0], amount : a[1], time : a[2]}}).sort((a,b) => Number(b.amount)-Number(a.amount))[0]);
    });
  }
  useInterval(() => {
    if (doRefresh) {
      getListing();
    };
    getOffer();
  }, 10 * 1000);
  
  React.useEffect(() => {
    if (typeof props.listing == 'undefined') {
      getListing();
      doRefresh = true;
    };
    getOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (props.listing) setListing(props.listing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.listing]);
  React.useEffect(() => {
    if (props.metadata) setMetadata(props.metadata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.metadata]);
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
    if (!listing) return false;
    if (listing.locked.length === 0) return false;
    if (Date.now() >= Number(listing.locked[0] / 1000000n)) return false;
    return true;
  };

  const buy = async () => {
    return props.buy(canister, index, listing, props.afterBuy);
  };
  const buttonLoader = (enabled) => {
    if (enabled) setCurrentBtnText("Loading...");
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
    if(props.nft.listing) {      
      buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Update"), () => props.listNft(props.nft, buttonLoader)]);
      buttons.push(["Transfer", () => props.transferNft(props.nft, buttonLoader)]);
    } else {
      if (wrappedCanisters.concat(unwrappedCanisters).indexOf(props.nft.canister) < 0) {
        buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.listNft(props.nft, buttonLoader)]);
        buttons.push(["Transfer", () => props.transferNft(props.nft, buttonLoader)]);
      } else {
        if (unwrappedCanisters.indexOf(props.nft.canister) >= 0) {
          buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.wrapAndlistNft(props.nft, buttonLoader)]);
          buttons.push(["Transfer", () => props.transferNft(props.nft, buttonLoader)]);
        } else {
          buttons.push([(currentBtn == 0 && currentBtnText ? buttonLoadingText : "Sell"), () => props.listNft(props.nft, buttonLoader)]);
          buttons.push(["Transfer", () => props.transferNft(props.nft, buttonLoader)]);
          buttons.push(["Unwrap", () => props.unwrapNft(props.nft, buttonLoader)]);
        };
      }
      if (props.nft.canister == 'poyn6-dyaaa-aaaah-qcfzq-cai' && props.nft.index >= 25000) {
        buttons.push(["Open", () => props.unpackNft(props.nft, buttonLoader)]);
      };
    }
    return buttons;
  };
  const mintNumber = () => {
    return EntrepotNFTMintNumber(canister, index);
  };
  const nftImg = () => {
    return EntrepotNFTImage(canister, index, tokenid);
  };
  const nftLink = () => {
    return EntrepotNFTLink(canister, index, tokenid);
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
    if (wrappedCanisters.indexOf(props.nft.canister) >= 0)
      return (<span style={{fontSize:".9em",position:"absolute",top: 0,left: 0,fontWeight: "bold",color: "black",backgroundColor: "#00b894",padding: "2px"}}>WRAPPED</span>);
    else return "";
  };
  var t = ["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const showNri = () => {
    if (!props.nri) return "";
    if (canister == "poyn6-dyaaa-aaaah-qcfzq-cai") {
      if (!metadata) return "";
      return (metadata.nonfungible.metadata[0][0] === 0 ? "Pack" : "#" + metadata.nonfungible.metadata[0][0] + " - " + t[metadata.nonfungible.metadata[0][1]]);
    };
    var collection = getCollection(canister);
    if (collection.nftv) {
      return (
        <MuiTooltip title={"NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific "+collection.unit+" relative to others. It does not include Mint #, Twin Status or Animation within the index."}>
          <span>NRI: {(props.nri * 100).toFixed(1)}%</span>
        </MuiTooltip>      );
    } else return "";
  };

  const handleClick = () => {
    const id = index;
    navigate(`/marketplace/asset/${tokenid}`);
  };

  return (
    <Grid style={{ display:"flex", width: (props.gridSize === "small" ? "300px" : "200px") }} item>
      <Card style={{display: 'flex', width: "100%", justifyContent: 'space-between', flexDirection: 'column'}}>
      <CardActionArea onClick={handleClick}>
        <div style={{ ...styles.avatarSkeletonContainer }}>
          {EntrepotDisplayNFT(canister, tokenid, imgLoaded, nftImg(), () => setImgLoaded(true))}
        </div>
        <CardContent style={{padding:"10px 16px"}}>
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
                  fontSize: 11,
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
                    fontSize: 12,
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                  color={"inherit"}
                  gutterBottom
                >
                  <PriceICP price={listing.price} />
                </Typography>
              </Grid>
            </>:
              <>
                {offer?
                  <>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography
                        style={{
                        fontSize: 11,
                        textAlign: "right",
                        fontWeight: "bold",
                        }}
                        color={"inherit"}
                        gutterBottom
                      >
                        Highest Offer
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        style={{
                          fontSize: 12,
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
                        fontSize: 11,
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
                          fontSize: 12,
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
        {typeof props.nft !== 'undefined' ?
        <CardActions style={{display: "flex",justifyContent: "flex-end"}}>
          {props.loggedIn ? 
            <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={1}> 
              {getButtons().length > 0 ?
                <>
                  <Grid item lg={6} md={6}><Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); buttonPush(0)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[0][0]}</Button></Grid>
                  {getButtons().length == 2 ?
                    <Grid item lg={6} md={6}><Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); buttonPush(1)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[1][0]}</Button></Grid>
                  :
                  <Grid item lg={6} md={6}>
                    <Button onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {e.stopPropagation(); setAnchorEl(e.currentTarget)}} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>More</Button>
                    <Menu
                      anchorEl={anchorEl}
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
          <Favourite loggedIn={props.loggedIn} tokenid={tokenid} />
        </CardActions>}
      </CardActionArea>
      </Card>
    </Grid>
  );
}
