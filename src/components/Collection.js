/* global BigInt */
import React from 'react';
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
import extjs from '../ic/extjs.js';
import { EntrepotGetAllLiked } from '../utils';
import { useTheme } from '@material-ui/core/styles';
import _c from '../ic/collections.js';
import NFT from './NFT';
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
const api = extjs.connect("https://boundary.ic0.app/");
const perPage = 60;
var collections = _c;
const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
};
var collections = collections.filter(a => _isCanister(a.canister));
const getCollection = c => {
  return collections.find(e => e.canister === c);
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
const loadAllTokens = async (address, principal) => {
  var response = await Promise.all(collections.map(a => api.canister(a.canister).tokens(address).then(r => (r.hasOwnProperty('ok') ? r.ok : []).map(b => extjs.encodeTokenId(a.canister, b)))).map(p => p.catch(e => e)).concat([
    "4nvhy-3qaaa-aaaah-qcnoq-cai",
    "qcg3w-tyaaa-aaaah-qakea-cai",
    //"jzg5e-giaaa-aaaah-qaqda-cai",
    "d3ttm-qaaaa-aaaai-qam4a-cai",
    "xkbqi-2qaaa-aaaah-qbpqq-cai",
  ].map(a => api.canister(a).user_tokens(principal).then(r => r.map(b => extjs.encodeTokenId(a, Number(b))))).map(p => p.catch(e => e))));
  var tokens = response.filter(result => !(result instanceof Error)).flat();
  
  // var wrappedMap = {
    // "bxdf4-baaaa-aaaah-qaruq-cai" : "qcg3w-tyaaa-aaaah-qakea-cai",
    // "y3b7h-siaaa-aaaah-qcnwa-cai" : "4nvhy-3qaaa-aaaah-qcnoq-cai",
    // "3db6u-aiaaa-aaaah-qbjbq-cai" : "d3ttm-qaaaa-aaaai-qam4a-cai",
    // "q6hjz-kyaaa-aaaah-qcama-cai" : "xkbqi-2qaaa-aaaah-qbpqq-cai",
    // "jeghr-iaaaa-aaaah-qco7q-cai" : "fl5nr-xiaaa-aaaai-qbjmq-cai"
  // };
  return tokens;
};
const loadAllListings = async (address, principal) => {
  var response = await Promise.all(collections.map(a => api.canister(a.canister).tokens_ext(address).then(r => (r.hasOwnProperty('ok') ? r.ok : []).map(b => [extjs.encodeTokenId(a.canister, b[0]), b[1]]).filter(c => c[1].length > 0))).map(p => p.catch(e => e)));
  var tokens = response.filter(result => !(result instanceof Error)).flat();
  // var wrappedMap = {
    // "bxdf4-baaaa-aaaah-qaruq-cai" : "qcg3w-tyaaa-aaaah-qakea-cai",
    // "y3b7h-siaaa-aaaah-qcnwa-cai" : "4nvhy-3qaaa-aaaah-qcnoq-cai",
    // "3db6u-aiaaa-aaaah-qbjbq-cai" : "d3ttm-qaaaa-aaaai-qam4a-cai",
    // "q6hjz-kyaaa-aaaah-qcama-cai" : "xkbqi-2qaaa-aaaah-qbpqq-cai",
    // "jeghr-iaaaa-aaaah-qco7q-cai" : "fl5nr-xiaaa-aaaai-qbjmq-cai"
  // };
  return tokens;
};
var canUpdateNfts = true;
export default function Collection(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [nfts, setNfts] = React.useState([]);
  const [tokenCanisters, setTokenCanisters] = React.useState([]);
  const [displayNfts, setDisplayNfts] = React.useState(false);
  const [collectionFilter, setCollectionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState('mint_number');
  const [listingPrices, setListingPrices] = React.useState([]);
  const [toggleFilter, setToggleFilter] = React.useState(true);
  const [hideCollectionFilter, setHideCollectionFilter] = React.useState(true);
  const [gridSize, setGridSize] = React.useState(localStorage.getItem("_gridSizeNFT") ?? "small");
  const changeGrid = (e, a) => {
    localStorage.setItem("_gridSizeNFT", a);
    setGridSize(a)
  }
  const changeSort = (event) => {
    setPage(1);
    setSort(event.target.value);
  };
 const _updates = async () => {
    if (props.account.address){
      await refresh();
    }
  };
  const updateFavorites = () => {
    var r = EntrepotGetAllLiked();
    updateNfts(r.filter((a,i) => r.indexOf(a) == i)); 
  };
  const getPriceOfListing = tokenid => {
    var fnd = listingPrices.find(a => a[0] == tokenid);
    if (fnd) {
      return Number(fnd[1][0].price)
    } else {
      return false;
    };
  };
  const refresh = async (_sort, _collectionFilter) => {
    const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
    switch(props.view){
      case "collected":
        var r = await loadAllTokens(props.account.address, props.identity.getPrincipal().toText());
        updateNfts(r.filter((a,i) => r.indexOf(a) == i),_sort, _collectionFilter); 
        break;
      case "selling":
        var r = await loadAllListings(props.account.address, props.identity.getPrincipal().toText());
        var r2 = r.map(a => a[0]);
        setListingPrices(r);
        updateNfts(r2.filter((a,i) => r2.indexOf(a) == i),_sort, _collectionFilter); 
        break;
      case "favorites":
        var r = await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").liked();
        updateNfts(r.filter((a,i) => r.indexOf(a) == i),_sort, _collectionFilter); 
        break;
      case "offers-made":
        var r = await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offered();
        updateNfts(r.filter((a,i) => r.indexOf(a) == i),_sort, _collectionFilter); 
        break;
      case "offers-received":
        var r = await Promise.all([loadAllTokens(props.account.address, props.identity.getPrincipal().toText()),_api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").allOffers()].map(p => p.catch(e => e)));
        var r2 = r.filter(result => !(result instanceof Error));
        var r3 = r2[0].filter(a => r2[1].indexOf(a) >= 0);
        updateNfts(r3.filter((a,i) => r3.indexOf(a) == i),_sort, _collectionFilter); 
        break;
    }
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
  useInterval(_updates, 10 * 60 *1000);
  
  
  const updateNfts = (l,s,cf) => {
   
    if (canUpdateNfts){
      canUpdateNfts = false;
      var _nfts = l ?? nfts;
      var _sort = s ?? sort;
      var _collectionFilter = cf ?? collectionFilter;
      if (!_nfts) return;
      if (l) setNfts(l);
      var _displayNfts = _nfts;
      _displayNfts = _displayNfts.filter((token,i) => (_collectionFilter == 'all' || extjs.decodeTokenId(token).canister == _collectionFilter));
      _displayNfts = _displayNfts.sort((a,b) => {
        switch(sort) {
          case "price_asc":
            var ap = getPriceOfListing(a);
            var bp = getPriceOfListing(b);
            if (ap === false && bp === false) return 0; 
            if (ap === false) return -1;
            if (bp === false) return 1;
            return ap-bp;
          case "price_desc":
            var ap = getPriceOfListing(a);
            var bp = getPriceOfListing(b);
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
      setTokenCanisters(_nfts.map(tokenid => extjs.decodeTokenId(tokenid).canister));
      canUpdateNfts = true;
    }
  };
  React.useEffect(() => {
    setDisplayNfts(false);
    setPage(1);
    if (props.loggedIn){
      refresh()
    }
  }, [collectionFilter]);
  React.useEffect(() => {
    setDisplayNfts(false);
    setPage(1);
    if (props.loggedIn){
      refresh()
    }
  }, [sort]);
  React.useEffect(() => {
    setCollectionFilter('all');
    setHideCollectionFilter(true)
    setDisplayNfts(false);
    setPage(1);
    //setSort('mint_number');
    if (props.loggedIn){
      refresh(sort, 'all')
      //refresh('mint_number', 'all')
    }
  }, [props.view, props.account.address, props.identity]);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      <div>
        <div style={{maxWidth:1200, margin:"0 auto 0",}}>
          <div style={styles.empty}>
            <h1>My Collection</h1>
          </div>
          <Tabs
            value={props.view}
            indicatorColor="primary"
            textColor="primary"
            centered
            onChange={(e, nv) => {
              navigate(`/`+nv)
            }}
          >
            <Tab style={{fontWeight:"bold"}} value="collected" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Collected</span></span>)} />
            <Tab style={{fontWeight:"bold"}} value="selling" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Selling</span></span>)} />
            <Tab style={{fontWeight:"bold"}} value="offers-received" label={(<span style={{padding:"0 50px"}}><CallReceivedIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Received</span></span>)} />
            <Tab style={{fontWeight:"bold"}} value="offers-made" label={(<span style={{padding:"0 50px"}}><LocalOfferIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Made</span></span>)} />
            <Tab style={{fontWeight:"bold"}} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Favorites</span></span>)} />
          </Tabs>
        </div>
      </div>
      <div id="mainNfts" style={{position:"relative",marginLeft:-24, marginRight:-24, marginBottom:-24,borderTop:"1px solid #aaa",borderBottom:"1px solid #aaa",display:"flex"}}>
        <div style={{position:"sticky",top:72, width:(toggleFilter ? 330 : 60),height:"calc(100vh - 72px)", borderRight:"1px solid #aaa",overflowY:(toggleFilter ? "scroll" : "hidden"),overflowX:"hidden",paddingBottom:50}}>
          <List>
            <ListItem style={{paddingRight:0}} button onClick={() => setToggleFilter(!toggleFilter)}>
              <ListItemIcon style={{minWidth:40}}>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{noWrap:true}} 
                secondaryTypographyProps={{noWrap:true}} 
                primary={(<strong>Collections</strong>)}
              />
                <ListItemIcon>
                {toggleFilter ? <ChevronLeftIcon fontSize={"large"} /> :  <ChevronRightIcon fontSize={"large"} /> }
                </ListItemIcon>
            </ListItem>
            {toggleFilter && (tokenCanisters.length > 0 || hideCollectionFilter) ? <>
              {hideCollectionFilter ?
              <ListItem><ListItemText><strong>Loading...</strong></ListItemText></ListItem>
              :
              <>
              <ListItem selected={collectionFilter === "all"} button onClick={() => {setCollectionFilter("all")}}>
                <ListItemText><strong>View All Collections</strong></ListItemText>
                <ListItemSecondaryAction><Chip label={tokenCanisters.length} variant="outlined" /></ListItemSecondaryAction>
              </ListItem>
              { tokenCanisters.filter((a,i) => tokenCanisters.indexOf(a) == i) //filter unique
                .map(canister => {
                  var _collection = getCollection(canister);
                  return (<ListItem key={canister} selected={collectionFilter === canister} button onClick={() => {setCollectionFilter(canister)}}>
                    <ListItemAvatar>
                      <Avatar>
                        <img alt={_collection.name} src={_collection.avatar ?? "/collections/"+canister+".jpg"} style={{height:64}} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{_collection.name}</ListItemText>
                    <ListItemSecondaryAction><Chip label={tokenCanisters.filter(a => a === canister).length} variant="outlined" /></ListItemSecondaryAction>
                  </ListItem>)
                })
              }</>}
            </> : ""}
          </List>
        </div>
        <div style={{flexGrow:1, padding:"10px 16px 50px 16px"}}>
          <div style={{}}>
            <Grid container style={{height:66}}>
              <Grid item>
                <ToggleButton onChange={async () => {
                  setDisplayNfts(false);
                  await refresh();
                  setTimeout(updateNfts, 300);
                }} size="small" style={{marginTop:5, marginRight:10}}>
                  <CachedIcon />
                </ToggleButton>
              </Grid>
              <Grid item>
                <ToggleButtonGroup style={{marginTop:5, marginRight:20}} size="small" value={gridSize} exclusive onChange={changeGrid}>
                  <ToggleButton value={"small"}>
                    <ViewModuleIcon />
                  </ToggleButton>
                  <ToggleButton value={"large"}>
                    <ViewComfyIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item>
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
              {displayNfts && displayNfts.length > perPage ?
              (<Grid item style={{marginLeft:"auto"}}><Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(displayNfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} /></Grid>) : "" }
            </Grid>
          </div>
          <div style={{minHeight:500}}>
            <div style={{}}>
              {displayNfts === false ?
                <>
                  <Typography paragraph style={{fontWeight:"bold"}} align="left">Loading...</Typography>
                </> 
              :
                <>
                  {displayNfts.length === 0 ?
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">We found no results</Typography> 
                  :
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">{displayNfts.length} items</Typography> 
                  }
                </>
              }
            </div>
            {displayNfts ?
            <div>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="stretch"
                style={{
                  display: "grid",
                  gridTemplateColumns: (gridSize === "small" ? "repeat(auto-fill, 300px)" : "repeat(auto-fill, 200px)"),
                  justifyContent: "space-between",
                }}
              >
                {displayNfts
                .filter((token,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage)))
                .map((tokenid, i) => {
                  return (<NFT 
                    gridSize={gridSize} 
                    faveRefresher={(props.view == 'favorites' ? updateFavorites : false)} 
                    loggedIn={props.loggedIn} 
                    identity={props.identity} 
                    tokenid={tokenid} 
                    key={tokenid} 
                    ownerView={['collected','selling','offers-received'].indexOf(props.view) >= 0}
                    unpackNft={props.unpackNft} 
                    listNft={props.listNft} 
                    cancelNft={props.cancelNft} 
                    wrapAndlistNft={props.wrapAndlistNft} 
                    unwrapNft={props.unwrapNft} 
                    transferNft={props.transferNft} 
                    />)
                })}
              </Grid>
            </div> : "" }
            {(displayNfts && displayNfts.length > perPage ?
              (<Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(displayNfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" )}
          </div>
        </div>
      </div>
    </div>
  )
}
