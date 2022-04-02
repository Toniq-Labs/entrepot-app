/* global BigInt */
import React from 'react';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
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
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import getNri from "../ic/nftv.js";
import FilterListIcon from '@material-ui/icons/FilterList';
import CachedIcon from '@material-ui/icons/Cached';
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
var canUpdateNfts = true;
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
}));
var pawnapi = extjs.connect("https://boundary.ic0.app/").canister("yigae-jqaaa-aaaah-qczbq-cai");
export default function UserLoan(props) {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [displayedResults, setDisplayedResults] = React.useState([]);
  const [results, setResults] = React.useState(false);
  const getCollection = c => {
    return props.collections.find(e => e.canister === c);
  };
  
  const [nfts, setNfts] = React.useState([]);
  const [displayNfts, setDisplayNfts] = React.useState(false);
  const [collectionFilter, setCollectionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  var myPage = (params?.address ? false : true);
  const [address, setAddress] = React.useState(params?.address ?? (props.account.address ?? ""));
  const [sort, setSort] = React.useState('mint_number');
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
    var rf = r;
    if (collectionFilter != 'all') rf = rf.filter(a => a.canister == collectionFilter);
    return rf;
  };
  const tabLink = p => {
    return (myPage ? p : "/"+address+p);
  };
  
  const hideNft = async token => {
    hiddenNfts.push(token);
  };
  
  const refresh = async () => {
    if (!address) return;
    var data; 
    console.log("Refreshing", props.view);
    switch(props.view){
      case "loan-requests":
        // var response = await axios("https://us-central1-entrepot-api.cloudfunctions.net/api/user/"+address+"/all");
        // data = response.data;
        // data = data.map(a => ({...a, token : a.id}));
        //Add wrapped
        data = (await pawnapi.tp_requestsByAddress(address)).map(a => a[1]);
        break;
      case "active-loans":
        console.log("fetched");
        hiddenNfts = hiddenNfts.filter(x => data.map(a => a.id).includes(x));
        data = data.filter(a => hiddenNfts.indexOf(a.id) < 0);
        data = filterBefore(data);
        break;
    }
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
  
  
  const updateNfts = (l,s,cf) => {
   
    if (canUpdateNfts){
      canUpdateNfts = false;
      var _nfts = l ?? nfts;
      var _sort = s ?? sort;
      var _collectionFilter = cf ?? collectionFilter;
      if (!_nfts) return;
      if (l) setNfts(l);
      var _displayNfts = _nfts;
      _displayNfts = _displayNfts.filter((token,i) => (_collectionFilter == 'all' || getEXTCanister(extjs.decodeTokenId(token).canister) == _collectionFilter));
      _displayNfts = _displayNfts.sort((a,b) => {
        switch(sort) {
          case "price_asc":
            var ap = (a.price === 0 ? false : a.price);
            var bp = (b.price === 0 ? false : b.price);
            if (ap === false && bp === false) return 0; 
            if (ap === false) return -1;
            if (bp === false) return 1;
            return ap-bp;
          case "price_desc":
            var ap = (a.price === 0 ? false : a.price);
            var bp = (b.price === 0 ? false : b.price);
            if (ap === false && bp === false) return 0; 
            if (ap === false) return 1;
            if (bp === false) return -1;
            return bp-ap;
          case "mint_number":
            return extjs.decodeTokenId(a).index-extjs.decodeTokenId(b).index;
          case "nri":
            var aa = extjs.decodeTokenId(a);
            var bb = extjs.decodeTokenId(b);
            var nria = getNri(aa.canister,aa.index);
            var nrib = getNri(bb.canister,bb.index);
            if (nria === false && nrib === false) return 0; 
            if (nria === false) return 1;
            if (nrib === false) return -1;
            return Number(nrib)-Number(nria);
          default:
            return 0;
        };
      })
      setDisplayNfts(_displayNfts);
      setHideCollectionFilter(false);
      canUpdateNfts = true;
    }
  };
  
  
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
  }, [results]);
  React.useEffect(() => {
    console.log("Hook: start");
    setDisplayedResults(false)
  }, []);

  React.useEffect(() => {
    console.log("Hook: account");
    if (address){
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

  

  return (
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      <UserDetail view={props.view} navigate={v => navigate(tabLink(v))} classes={classes} address={address} title={(myPage ? "My Collection" : address.substr(0,12)+"...")} />    
      <div id="mainNfts" style={{position:"relative",marginLeft:-24, marginRight:-24, marginBottom:-24,borderTop:"1px solid #aaa",borderBottom:"1px solid #aaa",display:"flex"}}>
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
                    <MenuItem value={"mint_number"}>Minting #</MenuItem>
                    <MenuItem value={"nri"}>NFT Rarity Index</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {displayedResults && displayedResults.length > perPage ?
              (<Grid item style={{marginLeft:"auto"}}><Pagination className={classes.pagi} size="small" count={Math.ceil(displayedResults.length/perPage)} page={page} onChange={(e, v) => setPage(v)} /></Grid>) : "" }
            </Grid>
          </div>
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
            {displayedResults && displayedResults.length ?
            <div>
              <TableContainer>
                <Table style={{width:"100%", overflow:"hidden"}}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"><strong>Item</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                      <TableCell align="right"><strong>Rewards</strong></TableCell>
                      <TableCell align="center"><strong>Length (Days)</strong></TableCell>
                      <TableCell align="center"><strong>APR</strong></TableCell>
                      <TableCell align="center"><strong>Expires</strong></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedResults
                    .filter((event,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage)))
                    .map(event => {
                      return (<Pawn 
                          collections={props.collections} 
                          event={event}                
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
