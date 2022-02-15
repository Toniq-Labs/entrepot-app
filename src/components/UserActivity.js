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
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
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
import { makeStyles } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close';
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

export default function UserActivity(props) {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [transactions, setTransactions] = React.useState(false);
  const [tokenCanisters, setTokenCanisters] = React.useState([]);
  const [collectionFilter, setCollectionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState('mint_number');
  const [toggleFilter, setToggleFilter] = React.useState((window.innerWidth < 600 ? false : JSON.parse(localStorage.getItem("_toggleFilter")) ?? true));
  const [hideCollectionFilter, setHideCollectionFilter] = React.useState(true);
  const changeToggleFilter = () => {
    localStorage.setItem("_toggleFilter", !toggleFilter);
    setToggleFilter(!toggleFilter)
  }
  const changeSort = (event) => {
    setSort(event.target.value);
  };
  const refresh = async (clearcache) => {
    if (!props.loggedIn) return;
    if (clearcache)  setTransactions(false);
    else {
      if (collectionFilter == 'all') {
        var r = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/app/user/"+props.account.address+"/transactions").then(r => r.json);      
      } else {
        var r = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/app/user/"+collectionFilter+"/"+props.account.address+"/transactions").then(r => r.json);
      };
      console.log(r);
      setTransactions(r);
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
  useInterval(refresh, 10 * 60 *1000);
  
  React.useEffect(() => {
    setPage(1);
    setTransactions(false);
  }, [sort]);
  React.useEffect(() => {
    setPage(1);
    setTransactions(false);
  }, [collectionFilter]);
  React.useEffect(() => {
    if (transactions === false){
      refresh()
    } else {
      setHideCollectionFilter(false)
    };
  }, [transactions]);
  React.useEffect(() => {
    setCollectionFilter('all');
    setHideCollectionFilter(true)
    setPage(1);
  }, [props.view, props.account.address, props.identity]);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      <div>
        <div style={{maxWidth:1200, margin:"0 auto 0",}}>
          <div style={styles.empty}>
            <h1>My Collection</h1>
          </div>
          <Tabs
            className={classes.tabsViewBig}
            value={props.view}
            indicatorColor="primary"
            textColor="primary"
            centered
            onChange={(e, nv) => {
              navigate(`/`+nv)
            }}
          >
            <Tab className={classes.tabsViewTab} value="collected" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Collected</span></span>)} />
            <Tab className={classes.tabsViewTab} value="selling" label={(<span style={{padding:"0 50px"}}><AddShoppingCartIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Selling</span></span>)} />
            <Tab className={classes.tabsViewTab} value="offers-received" label={(<span style={{padding:"0 50px"}}><CallReceivedIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Received</span></span>)} />
            <Tab className={classes.tabsViewTab} value="offers-made" label={(<span style={{padding:"0 50px"}}><LocalOfferIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Made</span></span>)} />
            <Tab className={classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Favorites</span></span>)} />
            <Tab className={classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Activity</span></span>)} />
          </Tabs>
          <Tabs
            className={classes.tabsViewSmall}
            value={props.view}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons={"on"}
            onChange={(e, nv) => {
              navigate(`/`+nv)
            }}
          >
            <Tab className={classes.tabsViewTab} value="collected" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Collected</span></span>)} />
            <Tab className={classes.tabsViewTab} value="selling" label={(<span style={{padding:"0 50px"}}><AddShoppingCartIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Selling</span></span>)} />
            <Tab className={classes.tabsViewTab} value="offers-received" label={(<span style={{padding:"0 50px"}}><CallReceivedIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Received</span></span>)} />
            <Tab className={classes.tabsViewTab} value="offers-made" label={(<span style={{padding:"0 50px"}}><LocalOfferIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Made</span></span>)} />
            <Tab className={classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Favorites</span></span>)} />
            <Tab className={classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Activity</span></span>)} />
          </Tabs>
        </div>
      </div>
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
                primary={(<strong>Collections</strong>)}
              />
                <ListItemIcon>
                {toggleFilter ? <CloseIcon fontSize={"large"} /> :  "" }
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
        <div className={classes.listingsView} style={{flexGrow:1, padding:"10px 16px 50px 16px"}}>
          <div style={{}}>
            <Grid container style={{minHeight:66}}>
              <Grid item xs={12} sm={"auto"} style={{marginBottom:10}}>
                <ToggleButtonGroup className={classes.hideDesktop} style={{marginTop:5, marginRight:10}} size="small">
                  <ToggleButton onClick={changeToggleFilter}>
                    <FilterListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup style={{marginTop:5, marginRight:10}} size="small">
                  <ToggleButton onClick={() => refresh(true)}>
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
              {transactions && transactions.length > perPage ?
              (<Grid item style={{marginLeft:"auto"}}><Pagination className={classes.pagi} size="small" count={Math.ceil(transactions.length/perPage)} page={page} onChange={(e, v) => setPage(v)} /></Grid>) : "" }
            </Grid>
          </div>
          <div style={{minHeight:500}}>
            <div style={{}}>
              {transactions === false ?
                <>
                  <Typography paragraph style={{fontWeight:"bold"}} align="left">Loading...</Typography>
                </> 
              :
                <>
                  {transactions.length === 0 ?
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">We found no results</Typography> 
                  :
                    <Typography paragraph style={{fontWeight:"bold"}} align="left">{transactions.length} items</Typography> 
                  }
                </>
              }
            </div>
            {transactions ?
            <div>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="stretch"
                style={{
                  display: "grid",
                  justifyContent: "space-between",
                }}
              >
                {transactions
                .filter((token,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage)))
                .map((tokenid, i) => {
                  return (<NFT 
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
                    loader={props.loader}                    
                    />)
                })}
              </Grid>
            </div> : "" }
            {(transactions && transactions.length > perPage ?
              (<Pagination className={classes.pagi} size="small" count={Math.ceil(transactions.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" )}
          </div>
        </div>
      </div>
    </div>
  )
}
