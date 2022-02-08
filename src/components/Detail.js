import React, { useState } from "react";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons//Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShopIcon from "@material-ui/icons/Shop";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import CategoryIcon from '@material-ui/icons/Category';
import AcUnitIcon from "@material-ui/icons/AcUnit";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import DetailsIcon from "@material-ui/icons/Details";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Timestamp from "react-timestamp";
import Favourite from './Favourite';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import Alert from '@material-ui/lab/Alert';
import OfferForm from './OfferForm';
import { useNavigate } from "react-router-dom";
import extjs from "../ic/extjs.js";
import { EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD, EntrepotGetOffers, EntrepotCollectionStats } from '../utils';
import {
  useParams
} from "react-router-dom";
import _c from '../ic/collections.js';
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
const api = extjs.connect("https://boundary.ic0.app/");

const shorten = a => {
  return a.substring(0, 12) + "...";
};
var collections = _c;
const emptyListing = {
  pricing: "",
  img: "",
};

const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
const Detail = (props) => {
  let { tokenid } = useParams();
  let { index, canister} = extjs.decodeTokenId(tokenid);
  const navigate = useNavigate();
  const [floor, setFloor] = React.useState((EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : ""));
  const [listing, setListing] = React.useState(false);
  const [transactions, setTransactions] = React.useState(false);
  const [owner, setOwner] = React.useState(false);
  const [offers, setOffers] = React.useState(false);
  const [openOfferForm, setOpenOfferForm] = React.useState(false);
  const collection = collections.find(e => e.canister === canister)
  const classes = useStyles();
  const reloadOffers = async () => {
    await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offers(tokenid).then(r => {
      setOffers(r.map(a => {return {buyer : a[0], amount : a[1], time : a[2]}}).sort((a,b) => Number(b.amount)-Number(a.amount)));
    });
  }
  const _refresh = async () => {
    reloadOffers();
    api.canister(canister).bearer(tokenid).then(r => {
      setOwner(r.ok);
    });
    await api.token(canister).listings().then(r => {
      var f = r.find(a => a[0] == index);
      if (f[1]) setListing(f[1]);
      else setListing({});
    });
    await api.canister(canister).transactions().then(r => {
      var txs = r.filter(a => extjs.decodeTokenId(a.token).index === index).sort((a,b) => Number(b.time) - Number(a.time));
      setTransactions(txs);
    });
  }
  const _afterBuy = async () => {
    await reloadOffers();
    await api.canister(canister).bearer(tokenid).then(r => {
      setOwner(r.ok);
    });
    await api.token(canister).listings().then(r => {
      var f = r.find(a => a[0] == index);
      if (f[1]) setListing(f[1]);
      else setListing({});
    });
    await api.canister(canister).transactions().then(r => {
      var txs = r.filter(a => extjs.decodeTokenId(a.token).index === index).sort((a,b) => Number(b.time) - Number(a.time));
      setTransactions(txs);
    });
  }
  const closeOfferForm = () => {
    reloadOffers();
    setOpenOfferForm(false);
  };
  const getFloorDelta = amount => {
    if (!floor) return "-";
    var fe = (floor*100000000);
    var ne = Number(amount);
    if (ne > fe){
      return (((ne-fe)/ne)*100).toFixed(2)+"% above";
    } else if (ne < fe) {      
      return ((1-(ne/fe))*100).toFixed(2)+"% below";
    } else return "-"
  };
  const makeOffer = async () => {
    setOpenOfferForm(true);
  };
  
  
  useInterval(_refresh, 10 * 60 * 1000);
  useInterval(() => {
    var nf = (EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : "");
    console.log(nf);
    setFloor(nf);
  }, 10 * 1000);
  
  const cancelOffer = async () => {
    props.loader(true, "Cancelling offer...");
    const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
    await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").cancelOffer(tokenid);
    await reloadOffers();
    props.loader(false);
    props.alert(
      "Offer cancelled",
      "Your offer was cancelled successfully!"
    );
  };
  
  
  
  
  React.useEffect(() => {
    _refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={5}>
            <div
              style={{
                border: "1px solid #E9ECEE",
                marginBottom: "20px",
                borderRadius: 4
              }}
            >
              <iframe
                frameborder="0"
                src={EntrepotNFTImage(collection.canister, index, tokenid, true)}
                alt=""
                style={{
                  border:"none",
                  maxWidth:500,
                  maxHeight:"100%",
                  minHeight:"600px",
                  cursor: "pointer",
                  height: "100%",
                  width: "100%",
                  marginLeft:"auto",
                  marginRight:"auto",
                  display: "block",
                }}
              />
            </div>
            
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{fontSize:35}} />}
              >
                <FormatAlignLeftIcon style={{marginTop:3}} />
                <Typography className={classes.heading}>Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.div}>
                  <p>{collection.description ? collection.description : collection.blurb}</p>
                </div>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{fontSize:35}} />}
              >
                <CategoryIcon style={{marginTop:3}} />
                <Typography className={classes.heading}>Properties</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <div style={{textAlign:"center"}}>
                    <Typography
                      paragraph
                      style={{ paddingTop: 20, fontWeight: "bold" }}
                      align="center"
                    >
                      Coming Soon!{/*Loading...*/}
                    </Typography>
                  </div>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            
            
          </Grid>
          <Grid item xs={12} sm={12} md={7}>
            <div className={classes.personal}>
              <Typography variant="h6" style={{ color: "#648DE2" }}>
                <a onClick={() => navigate("/marketplace/"+collection.route)} style={{color:"#648DE2", textDecoration:"none", cursor:"pointer"}}>{collection.name}</a>
              </Typography>
              <div style={{zIndex: 100}} className="sharethis-inline-share-buttons"></div>
              
            </div>
            <div className={classes.personal}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => navigate(-1)}
                style={{fontWeight:"bold", color:"black", borderColor:"black"}}
              >
                Back
              </Button>
              <div style={{zIndex: 100}} className="sharethis-inline-share-buttons"></div>
              
            </div>
            <Typography variant="h4" className={classes.typo}>
              {collection.name} #{EntrepotNFTMintNumber(collection.canister, index)}
            </Typography>
            <Grid container>
              <Grid item style={{marginRight:20}}>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{fontWeight:"bold"}}
                    component="a"
                    target="_blank"
                    href={EntrepotNFTLink(collection.canister, index, tokenid)}
                  >
                    View NFT onchain
                  </Button>
              </Grid>
              <Grid item>
                <div className={classes.icon}>
                  <Favourite loggedIn={props.loggedIn} showcount={true} size={"large"} tokenid={tokenid} />
                </div>
              </Grid>
            </Grid>

            <div
              style={{
                border: "1px solid #E9ECEE",
                padding: "20px 15px",
                margin: "20px 0px",
              }}
            >
              { listing === false ?
              <div style={{textAlign:"center"}}>
                <Typography
                  paragraph
                  style={{ paddingTop: 20, fontWeight: "bold" }}
                  align="center"
                >
                  Loading...
                </Typography>
              </div> : 
                <>{ listing.hasOwnProperty("locked") ?
                <>
                  <Typography variant="h6"><strong>Price</strong></Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      <PriceICP size={30} price={listing.price} />
                    </Typography>
                    <Typography variant="body2" style={{ marginLeft: "10px" }}>
                      (<PriceUSD price={EntrepotGetICPUSD(listing.price)} />)
                    </Typography>
                  </div>
                </> : 
                  <>{offers && offers.length > 0 ?
                      <>
                        <Typography variant="h6"><strong>Highest Offer Price</strong></Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 0px",
                          }}
                        >
                          <Typography variant="h5" style={{ fontWeight: "bold" }}>
                            <PriceICP size={30} price={offers[0].amount} />
                          </Typography>
                          <Typography variant="body2" style={{ marginLeft: "10px" }}>
                            (<PriceUSD price={EntrepotGetICPUSD(offers[0].amount)} />)
                          </Typography>
                        </div>
                      </> : 
                      <>{ transactions && transactions.length > 0 ?
                        <>
                          <Typography variant="h6"><strong>Last Price</strong></Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px 0px",
                            }}
                          >
                            <Typography variant="h5" style={{ fontWeight: "bold" }}>
                              <PriceICP size={30} price={transactions[0].price} />
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: "10px" }}>
                              (<PriceUSD price={EntrepotGetICPUSD(transactions[0].price)} />)
                            </Typography>
                          </div>
                        </> : 
                        <>
                          <Typography variant="h6"><strong>Unlisted</strong></Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px 0px",
                            }}
                          >
                          </div>
                        </>
                      }</>
                    }</>
                  }
                </>
              }
              { listing !== false && props.loggedIn ?
                <div className={classes.button}>
                  {listing && listing.hasOwnProperty("locked") ?
                  <Button
                    onClick={ev => {
                      props.buyNft(collection.canister, index, listing, _afterBuy);
                    }}
                    variant="contained"
                    color="primary"
                    style={{ fontWeight: "bold", marginRight: "10px", backgroundColor: "#003240", color: "white" }}
                  >Buy Now</Button> : "" }
                  <Button
                    onClick={ev => {
                      makeOffer();
                    }}
                    variant="outlined"
                    color="primary"
                    style={{ fontWeight: "bold", marginRight: "auto" }}
                  >Submit Offer</Button>
                </div> : "" }
              {owner?
              <div style={{marginTop:20}}><strong>Owner:</strong> <a href={"https://ic.rocks/account/"+owner} target="_blank">{shorten(owner)}</a></div> : "" }
            </div>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{fontSize:35}} />}
              >
                <LocalOfferIcon style={{marginTop:3}} />
                <Typography className={classes.heading}>Offers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  { offers === false ?
                    <div style={{textAlign:"center"}}>
                      <Typography
                        paragraph
                        style={{ paddingTop: 20, fontWeight: "bold" }}
                        align="center"
                      >
                        Loading...
                      </Typography>
                    </div>
                  :
                    <>
                      { offers.length === 0 ?
                      <>
                        <div style={{textAlign:"center"}}>
                          <Typography
                            paragraph
                            style={{ paddingTop: 20, fontWeight: "bold" }}
                            align="center"
                          >
                            There are currently no offers!
                          </Typography>
                        </div>
                      </>:
                      <>
                        <Alert severity="info">Offers are non-binding and indicative only.</Alert>
                        <Table sx={{ minWidth: 1500, fontWeight: "bold" }} aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left"></TableCell>
                              <TableCell align="right"><strong>Price</strong></TableCell>
                              <TableCell align="center"><strong>Floor Delta</strong></TableCell>
                              <TableCell align="center"><strong>Time</strong></TableCell>
                              <TableCell align="center"><strong>Buyer</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {offers
                              .slice()
                              .map((offer, i) => {
                                return (
                                  <TableRow key={i}>
                                    <TableCell><LocalOfferIcon style={{fontSize:18,verticalAlign:"middle"}} /> <strong>Offer</strong></TableCell>
                                    <TableCell align="right"><strong><PriceICP price={offer.amount} /></strong><br />
                                    {EntrepotGetICPUSD(offer.amount) ? <small><PriceUSD price={EntrepotGetICPUSD(offer.amount)} /></small> : ""}</TableCell>
                                    <TableCell align="center">{floor ? getFloorDelta(offer.amount) : "-"}</TableCell>
                                    <TableCell align="center"><Timestamp
                                      relative
                                      autoUpdate
                                      date={Number(offer.time / 1000000000n)}
                                    /></TableCell>
                                    <TableCell align="center">
                                      {props.identity && props.identity.getPrincipal().toText() == offer.buyer.toText() ? <Button onClick={cancelOffer} size={"small"} style={{color:"white", backgroundColor:"#c32626"}} variant={"contained"}>Cancel</Button> : <a href={"https://ic.rocks/principal/"+offer.buyer.toText()} target="_blank">{shorten(offer.buyer.toText())}</a>}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            }
                          </TableBody>
                        </Table>
                      </>}
                    </>
                  }
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{fontSize:35}} />}
              >
                <ShowChartIcon style={{marginTop:3}} />
                <Typography className={classes.heading}>Activity</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  { transactions === false ?
                    <div style={{textAlign:"center"}}>
                      <Typography
                        paragraph
                        style={{ paddingTop: 20, fontWeight: "bold" }}
                        align="center"
                      >
                        Loading...
                      </Typography>
                    </div>
                  :
                    <>
                    {transactions.length == 0 ?                    
                      <div style={{textAlign:"center"}}>
                        <Typography
                          paragraph
                          style={{ paddingTop: 20, fontWeight: "bold" }}
                          align="center"
                        >
                          No activity
                        </Typography>
                      </div>
                    :<>
                    <Table sx={{ minWidth: 1500, fontWeight: "bold" }} aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left"></TableCell>
                          <TableCell align="right"><strong>Price</strong></TableCell>
                          <TableCell align="center"><strong>From</strong></TableCell>
                          <TableCell align="center"><strong>To</strong></TableCell>
                          <TableCell align="center"><strong>Time</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions
                          .slice()
                          .map((transaction, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell><ShoppingCartIcon style={{fontSize:18,verticalAlign:"middle"}} /> <strong>Sale</strong></TableCell>
                                <TableCell align="right"><strong><PriceICP price={transaction.price} /></strong><br />
                                {EntrepotGetICPUSD(transaction.price) ? <small><PriceUSD price={EntrepotGetICPUSD(transaction.price)} /></small> : ""}</TableCell>
                                <TableCell align="center"><a href={"https://ic.rocks/principal/"+transaction.seller.toText()} target="_blank">{shorten(transaction.seller.toText())}</a></TableCell>
                                <TableCell align="center"><a href={"https://ic.rocks/account/"+transaction.buyer} target="_blank">{shorten(transaction.buyer)}</a></TableCell>
                                <TableCell align="center"><Timestamp
                                  relative
                                  autoUpdate
                                  date={Number(transaction.time / 1000000000n)}
                                /></TableCell>
                              </TableRow>
                            );
                          })
                        }
                      </TableBody>
                    </Table>
                    </>}
                    </>
                  }
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>
      <OfferForm address={props.account.address} balance={props.balance} complete={reloadOffers} floor={floor} identity={props.identity} alert={props.alert} open={openOfferForm} close={closeOfferForm} loader={props.loader} error={props.error} tokenid={tokenid} />
    </>
  );
};
export default Detail;

const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: "#ffffff",
    marginLeft: "10px",
    color: "#2B74DC",
    fontWeight: "bold",
    boxShadow: "none",
    border: "1px solid #2B74DC",
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0px",
      marginTop: "10px",
    },
  },
  button: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  typo: {
    fontWeight: "bold",
    padding: "20px 0px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  personal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  container: {
    padding: "20px 120px 120px",
    [theme.breakpoints.down("md")]: {
      padding: "110px 66px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "90px 45px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "75px 45px",
    },
  },
  iconsBorder: {
    border: "1px solid #E9ECEE",
    borderRadius: "5px",
  },
  div: {
    display: "flex",
    padding: "10px",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottom: "1px solid #E9ECEE",
    borderRadius: "5px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: "bold",
    marginLeft : 20
  },
}));

