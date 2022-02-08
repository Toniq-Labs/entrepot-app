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
import Pagination from '@material-ui/lab/Pagination';
import extjs from '../ic/extjs.js';
import { EntrepotGetAllLiked } from '../utils';
import { useTheme } from '@material-ui/core/styles';
import NFT from './NFT';
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

export default function Watchlist(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [nfts, setNfts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState('mint_number');
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

  const refresh = async (c) => {
    const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
    var r = await Promise.all([_api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").liked(), _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offered()]);
    setNfts(r[1].concat(r[0])); 
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
  useInterval(_updates, 10 *1000);
  React.useEffect(() => {
    props.loader(true);
    refresh().then(() => props.loader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account.address, props.identity]);
  React.useEffect(() => {
    props.loader(true);
    refresh().then(() => props.loader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight:"calc(100vh - 221px)"}}>
      <div style={styles.empty}>
        <h1>Watchlist</h1>
      </div>
      <div style={{overflow:"hidden", marginTop:50,fontSize: "1.2em", textAlign: "center" }}>
        You can view all NFTs that you have liked or placed an offer on below!
      </div>
      <div style={{marginLeft: "20px", marginTop: "10px"}}>
        <div style={{marginLeft:"20px",marginTop:"10px"}}>
          {nfts.length >0 ?
          <>
          <ToggleButtonGroup style={{marginTop:5, marginRight:20}} size="small" value={gridSize} exclusive onChange={changeGrid}>
            <ToggleButton value={"small"}>
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value={"large"}>
              <ViewComfyIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <FormControl style={{marginRight:20}}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={changeSort}
            >
              <MenuItem value={"mint_number"}>Minting #</MenuItem>
              <MenuItem value={"listing"}>Listing Price</MenuItem>
            </Select>
          </FormControl>
          </> : ""}
          {nfts.length > perPage ?
          (<Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(nfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" }
          
        </div>
          <>{nfts === false ?
            <div style={styles.empty}>
              <Typography paragraph style={{paddingTop:20,fontWeight:"bold"}} align="center">Loading...</Typography>
            </div> :
            <>{nfts.length === 0 ?
              <div style={styles.empty}>
                <Typography paragraph style={{paddingTop:20,fontWeight:"bold"}} align="center">You are now following any NFTs right now.</Typography>
              </div> :
              <>
                <div style={styles.grid}>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="stretch"
                  >
                    {nfts.slice().sort((a,b) => {
                      switch(sort) {
                        case "listing":
                          if (!a.listing && !b.listing) return 0;
                          if (!a.listing) return 1;
                          if (!b.listing) return -1;
                          return Number(b.listing.price)-Number(a.listing.price);
                        case "recent":
                          return 1;
                        case "oldest":
                          return -1;
                        case "mint_number":
                          return a.index-b.index;
                        default:
                          return 0;
                      };
                    }).filter((token,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage))).map((tokenid, i) => {
                      return (<NFT 
                        gridSize={gridSize} 
                        loggedIn={props.loggedIn} 
                        tokenid={tokenid} 
                        key={tokenid} 
                        />)
                    })}
                  </Grid>
                </div>
              </>
            }</>
          }</>
        {(nfts.length > perPage ?
        (<Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(nfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" )}
      </div>
    </div>
  )
}
