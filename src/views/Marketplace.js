import React, { useEffect } from "react";
import extjs from "../ic/extjs.js";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import NFTList from "../components/NFTList";
import Listings from "../components/Listings";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Wallet from "../components/Wallet";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Navbar from "../containers/Navbar.js";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import TextField from '@material-ui/core/TextField';
import collections from '../ic/collections.js';
const api = extjs.connect("https://boundary.ic0.app/");
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  heading: {
    textAlign: "center",
  },
  media: {
    cursor: "pointer",
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));
var _stats = [];
export default function Marketplace(props) {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [sort, setSort] = React.useState("recent");
  const [query, setQuery] = React.useState("");
  const [stats, setStats] = React.useState([]);
  const styles = {
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    content: {
      flexGrow: 1,
      marginLeft: 0,
    },
  };
  const _getStats = async () => {
    for(var i = 0; i < collections.length; i++){
      var res;
      if (_stats.findIndex(a => collections[i].canister == a.canister) >= 0) continue;
      if (!collections[i].market) {
        res = {
          canister : collections[i].canister,
          stats : false
        };
        _stats.push(res);
        setStats(a => [..._stats, res]);
      } else {
        (c => {
          api.token(c).stats().then(r => {
            res = {
              canister : c,
              stats : r
            };
            _stats.push(res);
            setStats(a => [...a, res]);
          }).catch(e => {
            res = {
              canister : c,
              stats : false
            };
            _stats.push(res);
            setStats(a => [...a, res]);
          });
        })(collections[i].canister);
      }
    };
  };
  const changeSort = (event) => {
    setSort(event.target.value);
  };
  React.useEffect(() => {
    _stats = [];
    _getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = (a) => {
    history.push(a);
  };
  return (
    <>
      <div style={{ width: "100%", display: "block", position: "relative" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0px auto", 
            minHeight:"calc(100vh - 221px)"
          }}
        >
          <h1 className={classes.heading}>All Collections</h1>
          <div style={{margin:"0 auto", textAlign:"center",maxWidth:500}}>
            <TextField placeholder="Search" style={{width:"100%", marginBottom:50}} value={query} onChange={e => setQuery(e.target.value)} variant="outlined" />
          </div>
          <div style={{textAlign:"right", marginBottom:"30px", marginRight:25}}>
            <FormControl style={{ marginRight: 20 }}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sort} onChange={changeSort}>
                <MenuItem value={"recent"}>Recently Listed</MenuItem>
                <MenuItem value={"listings_asc"}>Listings: Low to High</MenuItem>
                <MenuItem value={"listings_desc"}>Listings: High to Low</MenuItem>
                <MenuItem value={"total_asc"}>Total Volume: Low to High</MenuItem>
                <MenuItem value={"total_desc"}>Total Volume: High to Low</MenuItem>
                <MenuItem value={"floor_asc"}>Floor Price: Low to High</MenuItem>
                <MenuItem value={"floor_desc"}>Floor Price: High to Low</MenuItem>
                <MenuItem value={"alpha_asc"}>Alphabetically: A-Z</MenuItem>
                <MenuItem value={"alpha_desc"}>Alphabetically: Z-A</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Grid
            container
            direction="row"
            justifyContent="left"
            alignItems="center"
            spacing={2}
          >
            {
              collections.filter(a => (query == "" || [a.name, a.brief, a.keywords].join(" ").toLowerCase().indexOf(query.toLowerCase()) >= 0)).sort((a,b) => {
                switch (sort) {
                  case "listings_asc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == a.canister).stats.listings) - Number(stats.find(x => x.canister == b.canister).stats.listings);
                  break;
                  case "listings_desc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == b.canister).stats.listings) - Number(stats.find(x => x.canister == a.canister).stats.listings);
                  break;
                  case "total_asc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == a.canister).stats.total) - Number(stats.find(x => x.canister == b.canister).stats.total);
                  break;
                  case "total_desc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == b.canister).stats.total) - Number(stats.find(x => x.canister == a.canister).stats.total);
                  break;
                  case "floor_asc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == a.canister).stats.floor) - Number(stats.find(x => x.canister == b.canister).stats.floor);
                  break;
                  case "floor_desc":
                    if (stats.findIndex(x => x.canister == a.canister) < 0 && stats.findIndex(x => x.canister == b.canister) < 0) return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false && stats.find(x => x.canister == b.canister).stats === false) return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return Number(stats.find(x => x.canister == b.canister).stats.floor) - Number(stats.find(x => x.canister == a.canister).stats.floor);
                  break;
                  case "alpha_asc":
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                  break;
                  case "alpha_desc":
                    if(a.name < b.name) { return 1; }
                    if(a.name > b.name) { return -1; }
                    return 0;
                  break;
                  default:
                    return 0;
                }
              }).map((collection, i) => {
                return (<Grid key={i} item md={4} style={{ marginBottom: 20 }}>
                  <Card style={{height:375,}} className={classes.root}>
                    <a onClick={() => handleClick("/marketplace/"+collection.route)}><CardMedia
                      className={classes.media}
                      image={"/collections/"+collection.canister+".jpg"}
                      title={collection.name}
                    /></a>
                    <CardContent style={{textAlign:"center"}}>
                      <h2 style={{marginTop:0}}>{collection.name}</h2>
                      <Typography style={{minHeight:48}} variant="body1" color="textSecondary" component="p">{collection.brief ? collection.brief : ""}</Typography>
                      {stats.findIndex(a => a.canister == collection.canister) >= 0 ?
                        <>{stats.find(a => a.canister == collection.canister).stats ?
                          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                            <Grid style={{borderRight:"1px dashed #ddd"}} item md={4}>
                              <span style={{color:"#00d092"}}>Volume</span><br />
                              <strong>{stats.find(a => a.canister == collection.canister).stats.total} ICP</strong>
                            </Grid>
                            <Grid style={{borderRight:"1px dashed #ddd"}} item md={4}>
                              <span style={{color:"#00d092"}}>Listings</span><br />
                              <strong>{stats.find(a => a.canister == collection.canister).stats.listings}</strong>
                            </Grid>
                            <Grid item md={4}>
                              <span style={{color:"#00d092"}}>Floor Price</span><br />
                              <strong>{stats.find(a => a.canister == collection.canister).stats.floor} ICP</strong>
                            </Grid>
                          </Grid> : <span style={{display:"block",fontWeight:"bold",paddingTop:15}}>Not Available</span> }
                        </> 
                      : <span style={{display:"block",fontWeight:"bold",paddingTop:15}}>Loading...</span>}
                    </CardContent>
                  </Card>
                </Grid>);
              })
            }
          </Grid>
        </div>
      </div>
    </>
  );
}
