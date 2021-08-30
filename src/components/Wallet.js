import React from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import extjs from '../ic/extjs.js';
import getNri from '../ic/nftv.js';
import { useTheme } from '@material-ui/core/styles';
import NFT from './NFT';
import ListingForm from './ListingForm';
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



export default function Wallet(props) {
  const [nfts, setListings] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState('mint_number');
  const [wearableFilter, setWearableFilter] = React.useState('all');
  const [openListingForm, setOpenListingForm] = React.useState(false);
  const [tokenNFT, setTokenNFT] = React.useState('');

  const changeWearableFilter = async (event) => {
    setPage(1);
    setWearableFilter(event.target.value);
  };
  const closeListingForm = () => {
    setOpenListingForm(false);
    setTimeout(() => setTokenNFT(''), 300);
  };
  const listNft = (id) => {
    setTokenNFT(id);
    setOpenListingForm(true);
  }

  const changeSort = (event) => {
    setPage(1);
    setSort(event.target.value);
  };
  const list = async (id, price) => {
    //Submit to blockchain here
    props.loader(true);
    const api = extjs.connect("https://boundary.ic0.app/", props.identity);
    api.token(id).list(0, price).then(r => {
      if (r) {
        refresh();
        return props.alert("Transaction complete", "Your listing has been updated");
      } else {        
        return props.error("Something went wrong with this transfer");
      }
    }).catch(e => {
      return props.error("There was an error: " + e);
    }).finally(() => {
      props.loader(false);
    });
  };
  const applyFilters = a => {
    if (props.collection.canister === "tde7l-3qaaa-aaaah-qansa-cai" && wearableFilter !== "all") {
      var map = ["accessories","hats","eyewear","pets"];
      a = a.filter(_a => map[_a[2].nonfungible.metadata[0][0]] === wearableFilter);
    };
    return a;
  };
  const _updates = async () => {
    await refresh();
  };

  
  const refresh = async (c) => {
    c = c ?? props.collection.canister;
    var nfts = await api.token(c).getTokens(props.address)
    setListings(applyFilters(nfts)); 
  }
  
  const theme = useTheme();
  const styles = {
    empty : {
      maxWidth:800,
      margin : "0 auto",
      textAlign:"center"
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2)
    },
  };
  
  useInterval(_updates, 10 *1000);
  React.useEffect(() => {
    setListings([]);
    props.loader(true);        
    _updates().then(() => {
      props.loader(false);        
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.collection]);
  
  React.useEffect(() => {
    props.loader(true);
    refresh().finally(() => props.loader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wearableFilter]);
  return (
    <>
      <div style={styles.empty}>
        <h1>My NFTs: <span style={{color: "#00d092"}}>{props.collection.name}</span></h1>
      </div>
      <>
        <div style={{marginLeft:"20px",marginTop:"10px"}}>
          
          <FormControl style={{marginRight:20}}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={changeSort}
            >
              <MenuItem value={"mint_number"}>Minting #</MenuItem>
              {["e3izy-jiaaa-aaaah-qacbq-cai", "nbg4r-saaaa-aaaah-qap7a-cai"].indexOf(props.collection.canister) >= 0 ? <MenuItem value={"type"}>Rare Type</MenuItem> : ""}
              { ["e3izy-jiaaa-aaaah-qacbq-cai", "nbg4r-saaaa-aaaah-qap7a-cai"].indexOf(props.collection.canister) >= 0 ? <MenuItem value={"gri"}>NFT Rarity Index</MenuItem> : "" }
            </Select>
          </FormControl>
          
          {["tde7l-3qaaa-aaaah-qansa-cai"].indexOf(props.collection.canister) >= 0 ? 
          <FormControl style={{minWidth:120}}>
            <InputLabel>Wearable Type</InputLabel>
            <Select
              value={wearableFilter}
              onChange={changeWearableFilter}
            >
              <MenuItem value={"all"}>All Wearables</MenuItem>
              <MenuItem value={"pets"}>Pets</MenuItem>
              <MenuItem value={"accessories"}>Accessories/Flags</MenuItem>
              <MenuItem value={"hats"}>Hats/Hair</MenuItem>
              <MenuItem value={"eyewear"}>Eyewear</MenuItem>
            </Select>
          </FormControl> : "" }
          
          {nfts.length > perPage ?
          (<Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(nfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" }
        </div>
          <>{nfts === false ?
            <div style={styles.empty}>
              <Typography paragraph style={{paddingTop:20,fontWeight:"bold"}} align="center">Loading...</Typography>
            </div> :
            <>{nfts.length === 0 ?
              <div style={styles.empty}>
                <Typography paragraph style={{paddingTop:20,fontWeight:"bold"}} align="center">There are currently no nfts right now</Typography>
              </div> :
              <>
                <div style={styles.grid}>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    {nfts.slice().sort((a,b) => {
                      switch(sort) {
                        case "gri":
                          return (Number(getNri(props.collection.canister, b.index))*100)-(Number(getNri(props.collection.canister, a.index))*100);
                        case "recent":
                          return 1;
                        case "oldest":
                          return -1;
                        case "mint_number":
                          return a.index-b.index;
                        case "type":
                          var _a, _b, d;
                          if (props.collection.canister === "nbg4r-saaaa-aaaah-qap7a-cai") {
                            _a = a[2].nonfungible.metadata[0][0];
                            _b = b[2].nonfungible.metadata[0][0];
                            d = _b-_a;
                            if (d === 0) {
                              if (Number(a[1].price)>Number(b[1].price)) return 1;
                              if (Number(a[1].price)<Number(b[1].price)) return -1;
                            };
                            return d;
                          } else {
                            _a = a[2].nonfungible.metadata[0][30]%41;
                            _b = b[2].nonfungible.metadata[0][30]%41;
                            if (_a === 2) _a = 1;
                            if (_a > 1) _a = 2;
                            if (_b === 2) _b = 1;
                            if (_b > 1) _b = 2;
                            d = _a-_b;
                            if (d === 0) {
                              if (Number(a[1].price)>Number(b[1].price)) return 1;
                              if (Number(a[1].price)<Number(b[1].price)) return -1;
                            };
                            return d;
                          }
                        default:
                          return 0;
                      };
                    }).filter((token,i) => (i >= ((page-1)*perPage) && i < ((page)*perPage))).map((nft, i) => {
                      return (<NFT gri={getNri(props.collection.canister, nft.index)} loggedIn={props.loggedIn} listNft={listNft} collection={props.collection.canister} key={nft.id+"-"+i} nft={nft} />)
                    })}
                  </Grid>
                </div>
              </>
            }</>
          }</>
        {(nfts.length > perPage ?
        (<Pagination style={{float:"right",marginTop:"5px",marginBottom:"20px"}} size="small" count={Math.ceil(nfts.length/perPage)} page={page} onChange={(e, v) => setPage(v)} />) : "" )}
      </>
      <ListingForm list={list} alert={props.alert} open={openListingForm} close={closeListingForm} loader={props.loader} error={props.error} nft={tokenNFT} />
    </>
  )
}
