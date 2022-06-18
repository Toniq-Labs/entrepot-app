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
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import ListIcon from '@material-ui/icons/List';
import Pagination from '@material-ui/lab/Pagination';
import extjs from '../ic/extjs.js';
import { EntrepotGetAllLiked } from '../utils';
import { useTheme } from '@material-ui/core/styles';
import Event from './Event';
import UserDetail from './UserDetail';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import getNri from "../ic/nftv.js";
import FilterListIcon from '@material-ui/icons/FilterList';
import CachedIcon from '@material-ui/icons/Cached';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';


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
  topUi : {
    "& .MuiFormControl-root" : {
      [theme.breakpoints.down('xs')]: {
        width:"100%",
      },
      minWidth:"150px",
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
  const theme = useTheme();
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [results, setResults] = React.useState([]);
  const [displayedResults, setDisplayedResults] = React.useState(false);
  const [tokenCanisters, setTokenCanisters] = React.useState([]);
  const [collectionFilter, setCollectionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  var myPage = (params?.address ? false : true);
  const [address, setAddress] = React.useState(params?.address ?? (props.account.address ?? false));
  const [sort, setSort] = React.useState('mint_number');
  const [showing, setShowing] = React.useState('all');
  const [toggleFilter, setToggleFilter] = React.useState((window.innerWidth < 600 ? false : JSON.parse(localStorage.getItem("_toggleFilter")) ?? true));
  const [hideCollectionFilter, setHideCollectionFilter] = React.useState(true);
  

  const getCollection = c => {
    if (typeof props.collections.find(e => e.canister === c) == 'undefined') return {};
    return props.collections.find(e => e.canister === c);
  };
  const changeToggleFilter = () => {
    localStorage.setItem("_toggleFilter", !toggleFilter);
    setToggleFilter(!toggleFilter)
  }
  const changeShowing = (event) => {
    setShowing(event.target.value);
  };
  const changeSort = (event) => {
    setSort(event.target.value);
  };
  
  const filterBefore = r => {
    var rf = r;
    if (showing == 'sales') rf = rf.filter(a => a.type == "Sale");
    if (showing == 'purchases') rf = rf.filter(a => a.type == "Purchase");
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
  const refresh = async (clearcache) => {
    if (!address) return;
    console.log("refreshing");
    var data = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/user/"+address+"/transactions").then(r => r.json());
    data = data.filter((a,i) => data.findIndex(b => b.id == a.id) == i);
    data = data.filter(e => e.token != "");
    data = data.map(a => ({...a, type:(a.buyer == address ? "Purchase" : "Sale" )}));
    
    data = filterBefore(data);
    setTokenCanisters(data.map(event => event.canister).filter(c => typeof getCollection(c) != 'undefined'));
    setResults(data);
  }
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
    if (displayedResults) setDisplayedResults(false);
    else refresh();
  }, [sort]);
  React.useEffect(() => {
    console.log("Hook: collectionFilter");
    setPage(1);
    if (displayedResults) setDisplayedResults(false);
    else refresh();
  }, [collectionFilter]);
  React.useEffect(() => {
    console.log("Hook: showing");
    setPage(1);
    setHideCollectionFilter(true)
    if (displayedResults) setDisplayedResults(false);
    else refresh();
  }, [showing]);
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
      if (collectionFilter != 'all') setCollectionFilter('all');
      else {
        if (displayedResults) setDisplayedResults(false);
        else refresh();
      }
    }
  }, [address]);
  React.useEffect(() => {
    if (myPage) setAddress(props.account.address);
  }, [props.account.address]);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      <UserDetail view={props.view} navigate={v => navigate(tabLink(v))} classes={classes} address={address} title={(myPage ? "My Collection" : address.substr(0,12)+"...")} />    
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
                  <InputLabel>Showing</InputLabel>
                  <Select
                    value={showing}
                    onChange={changeShowing}
                  >
                    <MenuItem value={"all"}>All Events</MenuItem>
                    <MenuItem value={"purchases"}>Purchases</MenuItem>
                    <MenuItem value={"sales"}>Sales</MenuItem>
                  </Select>
                </FormControl>
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
                      <TableCell></TableCell>
                      <TableCell align="left"><strong>Item</strong></TableCell>
                      <TableCell align="center"><strong>Price</strong></TableCell>
                      <TableCell align="center"><strong>From</strong></TableCell>
                      <TableCell align="center"><strong>To</strong></TableCell>
                      <TableCell align="center"><strong>Time</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedResults
                    .filter((event,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage)))
                    .map(event => {
                      return (<Event 
                          collections={props.collections} 
                          key={event.id}
                          collection={event.canister}
                          event={event}                
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
