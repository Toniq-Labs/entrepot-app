/* global BigInt */
import React from 'react';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import Grid from '@material-ui/core/Grid';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import ListIcon from '@material-ui/icons/List';
import Pagination from '@material-ui/lab/Pagination';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import extjs from '../ic/extjs.js';
import { EntrepotGetAllLiked } from '../utils';
import { useTheme } from '@material-ui/core/styles';
import Pawn from './Pawn';
import UserDetail from './UserDetail';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CollectionsIcon from '@material-ui/icons/Collections';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TextField from "@material-ui/core/TextField";
import Alert from '@material-ui/lab/Alert';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import getNri from "../ic/nftv.js";
import FilterListIcon from '@material-ui/icons/FilterList';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CachedIcon from '@material-ui/icons/Cached';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GavelIcon from '@material-ui/icons/Gavel';
import StorefrontIcon from '@material-ui/icons/Storefront';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import CloseIcon from '@material-ui/icons/Close';
const api = extjs.connect("https://boundary.ic0.app/");
const perPage = 60;
const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
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
const loadAllTokens = async (address, principal) => {
  var response = (await Promise.all([axios("https://us-central1-entrepot-api.cloudfunctions.net/api/user/"+address+"/all").then(r => r.data.map(a => ({...a, token : a.id})))].concat([
    "4nvhy-3qaaa-aaaah-qcnoq-cai",
    "qcg3w-tyaaa-aaaah-qakea-cai",
    //"jzg5e-giaaa-aaaah-qaqda-cai",
    "d3ttm-qaaaa-aaaai-qam4a-cai",
    "xkbqi-2qaaa-aaaah-qbpqq-cai",
    "fl5nr-xiaaa-aaaai-qbjmq-cai",
  ].map(a => api.token(a).getTokens(address,principal).then(r => r.map(b => ({canister: toWrappedMap[a], id : b.id, token : b.id, price : 0, time : 0, owner : address}))))).map(p => p.catch(e => e))));
  var tokens = response.filter(result => !(result instanceof Error)).flat()
  return tokens;
};
// const loadAllListings = async (address, principal) => {
  // var response = await Promise.all(props.collections.map(a => api.canister(a.canister).tokens_ext(address).then(r => (r.hasOwnProperty('ok') ? r.ok : []).map(b => [extjs.encodeTokenId(a.canister, b[0]), b[1]]).filter(c => c[1].length > 0))).map(p => p.catch(e => e)));
  // var tokens = response.filter(result => !(result instanceof Error)).flat();
  // // var wrappedMap = {
    // // "bxdf4-baaaa-aaaah-qaruq-cai" : "qcg3w-tyaaa-aaaah-qakea-cai",
    // // "y3b7h-siaaa-aaaah-qcnwa-cai" : "4nvhy-3qaaa-aaaah-qcnoq-cai",
    // // "3db6u-aiaaa-aaaah-qbjbq-cai" : "d3ttm-qaaaa-aaaai-qam4a-cai",
    // // "q6hjz-kyaaa-aaaah-qcama-cai" : "xkbqi-2qaaa-aaaah-qbpqq-cai",
    // // "jeghr-iaaaa-aaaah-qco7q-cai" : "fl5nr-xiaaa-aaaai-qbjmq-cai"
  // // };
  // return tokens;
// };
const useStyles = makeStyles((theme) => ({
  tabsViewBig: {
    [theme.breakpoints.down('sm')]: {
      display:"none",
    },
  },
  tabsViewSmall: {
    [theme.breakpoints.up('md')]: {
      display:"none",
    },
  },
  listingsView: {
    [theme.breakpoints.down('xs')]: {
      "& .MuiGrid-container.MuiGrid-spacing-xs-2" : {
        gridTemplateColumns: "repeat(auto-fill, 50%)!important"
      }
    },
  },
  hideDesktop:{
    display:"none",
    [theme.breakpoints.down('xs')]: {
      display:"inline-flex",
    },
  },
  topUi : {
    "& .MuiFormControl-root" : {
      [theme.breakpoints.down('xs')]: {
        width:"100%",
      },
      minWidth:"150px",
    },
    
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
  filtersViewOpen:{
    position:"sticky",
    top:72, 
    width:330,
    height:"calc(100vh - 72px)", 
    borderRight:"1px solid #aaa",
    overflowY:"scroll",
    overflowX:"hidden",
    paddingBottom:50,
    [theme.breakpoints.down('xs')]: {
      //display:"none",
      position:"fixed",
      backgroundColor:"white",
      zIndex:100,
      left:0,
      right:0,
      bottom:0,
      width:"80%",
    },
  },
  filtersViewClosed:{
    position:"sticky",
    top:72, 
    width:60,
    height:"calc(100vh - 72px)", 
    borderRight:"1px solid #aaa",
    overflowY:"hidden",
    overflowX:"hidden",
    paddingBottom:50,
    [theme.breakpoints.down('xs')]: {
      display:"none",
    },
  },
  pagi: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    marginBottom: "20px",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  banner: {
    borderRadius:5,
    marginBottom:70,
    backgroundSize:"cover", 
    height:200,
    [theme.breakpoints.down("xs")]: {
      background:"none!important",
      marginTop:-170,
    },
  },
}));
var pawnapi = extjs.connect("https://boundary.ic0.app/").canister("yigae-jqaaa-aaaah-qczbq-cai");
const getDays = a => Number(a.length / (24n * 60n * 60n * 1000000000n));
const getApr = a => ((Number(a.reward)/100000000)/getDays(a)*365)/(Number(a.amount)/100000000);
export default function UserLoan(props) {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [displayedResults, setDisplayedResults] = React.useState([]);
  const [results, setResults] = React.useState(false);
  const [displayView, setDisplayView] = React.useState("requests");
  const getCollection = c => {
    return props.collections.find(e => e.canister === c);
  };
  
  const [selectedFilters, setSelectedFilters] = React.useState([]);
  const [nfts, setNfts] = React.useState([]);
  const [displayNfts, setDisplayNfts] = React.useState(false);
  const [collectionFilter, setCollectionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  var myPage = (params?.address ? false : true);
  const [address, setAddress] = React.useState(params?.address ?? (props.account.address ?? ""));
  const [sort, setSort] = React.useState('apr');
  const [listingPrices, setListingPrices] = React.useState([]);
  const [toggleFilter, setToggleFilter] = React.useState((window.innerWidth < 600 ? false : JSON.parse(localStorage.getItem("_toggleFilter")) ?? true));
  const [hideCollectionFilter, setHideCollectionFilter] = React.useState(true);
  const [gridSize, setGridSize] = React.useState(localStorage.getItem("_gridSize") ?? "small");
  var hiddenNfts = [];
  const changeGrid = (e, a) => {
    localStorage.setItem("_gridSize", a);
    setGridSize(a)
  }
  const changeToggleFilter = () => {
    localStorage.setItem("_toggleFilter", !toggleFilter);
    setToggleFilter(!toggleFilter)
  }
  const changeSort = (event) => {
    setPage(1);
    setSort(event.target.value);
  };
  
  const filterBefore = r => {
    var rf = r;
    return rf;
  };
  const filterAfter = r => {
    return filterResults(r);
  };
  const tabLink = p => {
    return (myPage ? p : "/"+address+p);
  };
  
  const hideNft = async token => {
    hiddenNfts.push(token);
  };
  
  //Filter stuff
  
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");
  const [minReward, setMinReward] = React.useState("");
  const [maxReward, setMaxReward] = React.useState("");
  const [minApr, setMinApr] = React.useState("");
  const [maxApr, setMaxApr] = React.useState("");
  const [minLength, setMinLength] = React.useState("");
  const [maxLength, setMaxLength] = React.useState("");
  const setToNumer = b => {
    var b = Number(b);
    if (isNaN(b)) return "";
    return b;
  };
  const minAmountChange = ev => {
    setMinAmount(setToNumer(ev.target.value));
  };
  const maxAmountChange = ev => {
    setMaxAmount(setToNumer(ev.target.value));
  };
  const minRewardChange = ev => {
    setMinReward(setToNumer(ev.target.value));
  };
  const maxRewardChange = ev => {
    setMaxReward(setToNumer(ev.target.value));
  };
  const minAprChange = ev => {
    setMinApr(setToNumer(ev.target.value));
  };
  const maxAprChange = ev => {
    setMaxApr(setToNumer(ev.target.value));
  };
  const minLengthChange = ev => {
    setMinLength(setToNumer(ev.target.value));
  };
  const maxLengthChange = ev => {
    setMaxLength(setToNumer(ev.target.value));
  };
  const isFilterValueSelected = (traitId, traitValueId) => {
    return (selectedFilters.find(a => a[0] == traitId && a[1] == traitValueId) ? true : false);
  };
  const refresh = async () => {
    if (!address && props.view != "earn") return;
    var data; 
    console.log("Refreshing", props.view);
    switch(props.view){
      case "earn":
        if (displayView == "requests") {          
          data = (await pawnapi.tp_requests()).map(a => ({...a[1], type : "request"}));
        } else {
          data = (await pawnapi.tp_loansActive()).map(a => ({...a[1], index : a[0], type : "contract"}));
        };
        break;
      case "earn-requests":
        data = (await pawnapi.tp_requestsByAddress(address)).map(a => ({...a[1], type : "request"}));
        break;
      case "earn-contracts":
        data = (await pawnapi.tp_loansByAddress(address)).map(a => ({...a[1], index : a[0], type : "contract"}));
        break;
    }
    data = data.map(a => ({...a, days : getDays(a), apr : getApr(a)}));
    setResults(data);
  }
  
  const theme = useTheme();
  const styles = {
    empty: {
      maxWidth: 1200,
      margin: "0 auto",
      textAlign: "center",
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2)
    },
  };
  useInterval(refresh, 10 * 60 *1000);
  
  
  const filterResults = r => {
    if (!minAmount && !maxAmount && !minApr && !maxApr) return r;
    console.log(minAmount, maxAmount, minApr, maxApr);
    return r.filter(a => {
      console.log(a);
      if (minAmount && (a.amount <= (BigInt(minAmount)*100000000n))) return false;
      if (maxAmount && (a.amount >= (BigInt(maxAmount)*100000000n))) return false;
      if (minApr && (a.apr <= (minApr/100))) return false;
      if (maxApr && (a.apr >= (maxApr/100))) return false;
      return true;
    });
  };
  const sortResults = r => {
    return r.sort((a,b) => {
      switch(sort) {
        case "apr":
          return b.apr-a.apr;
        case "reward":
          var r = Number(b.reward)-Number(a.reward);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "date_desc":
          var r = Number(b.date)-Number(a.date);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "date_asc":
          var r = Number(a.date)-Number(b.date);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "amount_desc":
          var r = Number(b.amount)-Number(a.amount);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "amount_asc":
          var r = Number(a.amount)-Number(b.amount);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "days_desc":
          var r = Number(b.days)-Number(a.days);
          if (r == 0) r = b.apr-a.apr;
          return r;
        case "days_asc":
          var r = Number(a.days)-Number(b.days);
          if (r == 0) r = b.apr-a.apr;
          return r;
        default:
          return 0;
      };
    })
  }

  React.useEffect(() => {
    setPage(1);
    //if (displayedResults) setDisplayedResults(false);
    //else refresh();
  }, [sort]);
  React.useEffect(() => {
    console.log("Hook: collectionFilter");
    setPage(1);
    if (displayedResults) setDisplayedResults(false);
    else refresh();
  }, [collectionFilter]);
  React.useEffect(() => {
    console.log("Hook: displayedResults");
    if (displayedResults === false) refresh();
  }, [displayedResults]);
  React.useEffect(() => {
    console.log("Hook: results");
    setHideCollectionFilter(false)
    if (results.length) setDisplayedResults(filterAfter(results));
    else setDisplayedResults([]);
  }, [results]);
  React.useEffect(() => {
    console.log("Hook: start");
    setDisplayedResults(false)
  }, []);
  React.useEffect(() => {
    setDisplayedResults(filterAfter(results))
  }, [minAmount, maxAmount, minApr, maxApr]);

  React.useEffect(() => {
    console.log("Hook: account");
    if (address || props.view == "earn"){
      setHideCollectionFilter(true);
      if (collectionFilter != "all") setCollectionFilter("all");
      else {
        if (displayedResults) setDisplayedResults(false);
        else refresh();
      }
    }
  }, [address, props.view]);
  React.useEffect(() => {
    if (myPage) setAddress(props.account.address);
  }, [props.account.address]);
  React.useEffect(() => {
    setDisplayedResults(false);
  }, [displayView]);

  

  return (
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      {props.view == "earn" ?
      <>
        <div>
          <div style={{maxWidth:1200, margin:"0 auto 0",}}>
            <div style={{textAlign:"center"}}>
              <div style={styles.empty}>
                <div className={classes.banner} style={{background:"url('/interesting_nft.jpg')"}}>
                </div>
                <div style={{width:"100%", maxWidth:"760px", margin:"-30px auto 40px"}}>
                  <div style={{textAlign: "left", overflow: "hidden", fontSize: "1.2em", marginBottom: "40px", padding:"30px", border:"1px solid silver", borderRadius:"10px", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}>Toniq Earn is powered by Interesting NFT Protocol, <strong>a 100% non-custodial and decentralized interest rate protocol</strong> running on the Internet Computer. Learn more <a href="https://4orvc-saaaa-aaaak-qapjq-cai.raw.ic0.app/">here</a>. Users can (1) create an Earn Contract by locking up valuable NFTs to withdraw short-term liquidity from the protocol, or (2) deposit ICP into the protocol via an Earn Contract to earn interest or receive discounted NFTs.
                  <br />
                  <br />
                  Our unique approach is to tokenize the Earn Contract into a tradeable NFT where the contract NFT owner receives the interest or NFTs when the contract is repaid or not. <strong>This creates a secondary market for Earn Contracts.</strong> 
                  </div>
                  {props.identity ?
                  <>
                    <Button variant="contained" color={"primary"} style={{fontWeight:"bold"}} onClick={() => navigate("/new-request")}>
                      <PostAddIcon /> Create New Request
                    </Button>
                    <Button variant="contained" color={"primary"} style={{marginLeft:20,fontWeight:"bold"}} onClick={() => navigate("/marketplace/toniq-earn")}>
                      <StorefrontIcon /> View on Marketplace
                    </Button>
                  </>: ""}
                </div>
              </div>
              
              <Tabs
                value={displayView}
                indicatorColor="primary"
                textColor="primary"
                centered
                onChange={(e, nv) => {
                  setDisplayView(nv)
                }}
              >
                <Tab style={{fontWeight:"bold"}} value="requests" label={(<span style={{padding:"0 50px"}}><AccountBalanceIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Earn Requests</span></span>)} />
                <Tab style={{fontWeight:"bold"}} value="contracts" label={(<span style={{padding:"0 50px"}}><GavelIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Earn Contracts</span></span>)} />
              </Tabs>
            </div>
          </div>
        </div>
      </>:
      <UserDetail view={props.view} navigate={v => navigate(tabLink(v))} classes={classes} address={address} title={(myPage ? "My Collection" : address.substr(0,12)+"...")} />}
      <div id="mainNfts" style={{position:"relative",marginLeft:-24, marginRight:-24, marginBottom:-24,borderTop:"1px solid #aaa",borderBottom:"1px solid #aaa",display:"flex"}}>
        <div className={(toggleFilter ? classes.filtersViewOpen : classes.filtersViewClosed)}>
          <List>
            <ListItem style={{paddingRight:0}} button onClick={changeToggleFilter}>
              <ListItemIcon style={{minWidth:40}}>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{noWrap:true}} 
                secondaryTypographyProps={{noWrap:true}} 
                primary={(<strong>Filter</strong>)}
              />
                <ListItemIcon>
                {toggleFilter ? <CloseIcon fontSize={"large"} /> :  "" }
                </ListItemIcon>
            </ListItem>
            {toggleFilter  ? <>
              <ListItem style={{paddingRight:0}}>
                <ListItemIcon style={{minWidth:40}}>
                  <AllInclusiveIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={(<strong>Contract Amount</strong>)}
                />
              </ListItem>
              <ListItem>
                <div style={{width:"100%"}}>
                  <TextField value={minAmount} onChange={minAmountChange} style={{width:"100%", marginBottom:20}} label="Min. Amount" />
                  <TextField value={maxAmount} onChange={maxAmountChange} style={{width:"100%", marginBottom:20}} label="Max. Amount" />
                </div>
              </ListItem>
              {/*<ListItem style={{paddingRight:0}}>
                <ListItemIcon style={{minWidth:40}}>
                  <AllInclusiveIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={(<strong>Reward</strong>)}
                />
              </ListItem>
              <ListItem>
                <div style={{width:"100%"}}>
                  <TextField value={minReward} onChange={minRewardChange} style={{width:"100%", marginBottom:20}} label="Min. Reward" />
                  <TextField value={maxReward} onChange={maxRewardChange} style={{width:"100%", marginBottom:20}} label="Max. Reward" />
                </div>
              </ListItem>*/}
              <ListItem style={{paddingRight:0}}>
                <ListItemIcon style={{minWidth:40}}>
                  <LocalAtmIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={(<strong>APR</strong>)}
                />
              </ListItem>
              <ListItem>
                <div style={{width:"100%"}}>
                  <TextField value={minApr} onChange={minAprChange} style={{width:"100%", marginBottom:20}} label="Min. APR%" />
                  <TextField value={maxApr} onChange={maxAprChange} style={{width:"100%", marginBottom:20}} label="Max. APR%" />
                </div>
              </ListItem>
              {/*<ListItem style={{paddingRight:0}}>
                <ListItemIcon style={{minWidth:40}}>
                  <AllInclusiveIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={(<strong>Length</strong>)}
                />
              </ListItem>
              <ListItem>
                <div style={{width:"100%"}}>
                  <TextField value={minLength} onChange={minLengthChange} style={{width:"100%", marginBottom:20}} label="Min. Length" />
                  <TextField value={maxLength} onChange={maxLengthChange} style={{width:"100%", marginBottom:20}} label="Max. Length" />
                </div>
              </ListItem>*/}
            </> : ""}
          </List>
        </div>
        <div className={classes.listingsView} style={{flexGrow:1, padding:"10px 16px 50px 16px"}}>
          <div style={{}}>
            <Grid className={classes.topUi} container style={{minHeight:66}}>
              <Grid item xs={12} sm={"auto"} style={{marginBottom:10}}>
                <ToggleButtonGroup className={classes.hideDesktop} style={{marginTop:5, marginRight:10}} size="small">
                  <ToggleButton onClick={changeToggleFilter}>
                    <FilterListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup style={{marginTop:5, marginRight:10}} size="small">
                  <ToggleButton onClick={() => setDisplayedResults(false)}>
                    <CachedIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} sm={"auto"} >
                <FormControl style={{marginRight:20}}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sort}
                    onChange={changeSort}
                  >
                    <MenuItem value={"apr"}>Highest APR</MenuItem>
                    <MenuItem value={"reward"}>Highest Reward</MenuItem>
                    <MenuItem value={"date_desc"}>Latest</MenuItem>
                    <MenuItem value={"date_asc"}>Oldest</MenuItem>
                    <MenuItem value={"amount_asc"}>Amount: Low to High</MenuItem>
                    <MenuItem value={"amount_desc"}>Amount: High to Low</MenuItem>
                    <MenuItem value={"days_asc"}>Days: Low to High</MenuItem>
                    <MenuItem value={"days_desc"}>Days: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {props.view == "earn-requests" ?
              <Grid item xs={12} sm={"auto"} style={{marginBottom:10}}>
                <Button variant="contained" color={"primary"} style={{fontWeight:"bold", marginTop:7}} onClick={() => navigate("/new-request")}>
                  <PostAddIcon /> Create New Request
                </Button>
              </Grid> : ""}
              {displayedResults && displayedResults.length > perPage ?
              (<Grid item style={{marginLeft:"auto"}}><Pagination className={classes.pagi} size="small" count={Math.ceil(displayedResults.length/perPage)} page={page} onChange={(e, v) => setPage(v)} /></Grid>) : "" }
            </Grid>
          </div>
          {props.view == "earn-contracts" ?
            <>
              <Alert severity="info" style={{marginBottom:20, textAlign:"center"}}>These are your open Earn Contracts. You will need to repay the contract in full (amount and reward) before the end date otherwise you will lose your NFT</Alert>
            </>
          : ""}
          {props.view == "earn-requests" ?
            <>
              <Alert severity="info" style={{marginBottom:20, textAlign:"center"}}>
                You can view your current Earn Contracts here. Once someone accepts your request, it will be moved to the Earn Contracts screen. Earn Requests automatically expire after 24 hours.
              </Alert>
            </>
          : ""}
          <div style={{minHeight:500}}>
            <div style={{}}>
              {displayedResults === false ?
                <>
                  <Typography paragraph style={{fontWeight:"bold"}} align="left">Loading...</Typography>
                </> 
              :
                <>
                  {displayedResults.length === 0 ?
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">We found no results</Typography> 
                  :
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">{displayedResults.length} items</Typography> 
                  }
                </>
              }
            </div>
            {minAmount || maxAmount || minApr || maxApr ?
              <div>
                <Typography
                  paragraph
                  style={{  fontWeight: "bold" }}
                  align="left"
                >
                  {minAmount ? <Chip style={{marginRight:10,marginBottom:10}} label={"Min. Amount: "+minAmount+"ICP"} onDelete={() => setMinAmount("")} color="primary" /> :""}
                  {maxAmount ? <Chip style={{marginRight:10,marginBottom:10}} label={"Max. Amount: "+maxAmount+"ICP"} onDelete={() => setMaxAmount("")} color="primary" /> :""}
                  {minApr ? <Chip style={{marginRight:10,marginBottom:10}} label={"Min. APR: "+minApr+"%"} onDelete={() => setMinApr("")} color="primary" /> :""}
                  {maxApr ? <Chip style={{marginRight:10,marginBottom:10}} label={"Max. APR: "+maxApr+"%"} onDelete={() => setMaxApr("")} color="primary" /> :""}
                  <Chip style={{marginRight:10,marginBottom:10}} label={"Reset"} onClick={() => {
                    setMinAmount("");
                    setMaxAmount("");
                    setMinApr("");
                    setMaxApr("");
                  }} color="default" />
                </Typography>
              </div>:""}
            {displayedResults && displayedResults.length ?
            <div>
              <TableContainer>
                <Table style={{width:"100%", overflow:"hidden"}}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"><strong>Item</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                      <TableCell align="right"><strong>Reward</strong></TableCell>
                      <TableCell align="center"><strong>Contract Length</strong></TableCell>
                      <TableCell align="center"><strong>Floor Rate</strong></TableCell>
                      <TableCell align="center"><strong>APR</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortResults(displayedResults)
                    .filter((event,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage)))
                    .map(event => {
                      return (<Pawn 
                          identity={props.identity}
                          repayContract={props.repayContract}
                          fillRequest={props.fillRequest}
                          cancelRequest={props.cancelRequest}
                          navigate={navigate}
                          currentAccount={props.currentAccount}
                          collections={props.collections} 
                          event={event}                
                          refresh={refresh}                
                          confirm={props.confirm}                
                          loader={props.loader}                
                          error={props.error}                
                          alert={props.alert}                
                          key={event.tokenid}                
                        />)
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div> : "" }
            {(displayedResults && displayedResults.length > perPage ?
              (<Pagination className={classes.pagi} size="small" count={Math.ceil(displayedResults.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" )}
          </div>
        </div>
      </div>
    </div>
  )
}
