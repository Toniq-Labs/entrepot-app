import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import _c from '../ic/collections.js';
var collections = _c;
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
const getCollection = c => {
  return collections.find(e => e.canister === c);
};

export default function NFT(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentBtn, setCurrentBtn] = React.useState(null);
  const [currentBtnText, setCurrentBtnText] = React.useState(false);
  const styles = {
    avatarSkeletonContainer: {
      height: 0,
      overflow: "hidden",
      paddingTop: "100%",
      position: "relative"
    },
    avatarLoader: {
      position: "absolute",
      top: "15%",
      left: "15%",
      width: "70%",
      height: "70%",
      margin: "0 auto"
    },
    avatarImg: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      margin: "0 auto",
      objectFit: "contain",
    },
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
  const icpbunnyimg = i => {
    const icbstorage = ['efqhu-yqaaa-aaaaf-qaeda-cai',
    'ecrba-viaaa-aaaaf-qaedq-cai',
    'fp7fo-2aaaa-aaaaf-qaeea-cai',
    'fi6d2-xyaaa-aaaaf-qaeeq-cai',
    'fb5ig-bqaaa-aaaaf-qaefa-cai',
    'fg4os-miaaa-aaaaf-qaefq-cai',
    'ft377-naaaa-aaaaf-qaega-cai',
    'fu2zl-ayaaa-aaaaf-qaegq-cai',
    'f5zsx-wqaaa-aaaaf-qaeha-cai',
    'f2yud-3iaaa-aaaaf-qaehq-cai']

    return "https://" +icbstorage[i % 10]+".raw.ic0.app/Token/"+i;
  };
  const mintNumber = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai") return props.nft.index;
    if (props.collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return props.nft.index;
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return props.nft.index;
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai") return props.nft.index;
    else return props.nft.index+1;
  }
  const nftImg = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + props.nft.index;
    if (props.collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + props.nft.index;
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + props.nft.index;
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(props.nft.index);
    
    return "https://"+props.collection+".raw.ic0.app/?cc=0&type=thumbnail&tokenid=" + props.nft.id;
  };
  const nftLink = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + props.nft.index;
    if (props.collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + props.nft.index;
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + props.nft.index;
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(props.nft.index);
    return "https://"+props.collection+".raw.ic0.app/?tokenid=" + props.nft.id;
  };
  const nriLink = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=punks&tokenid=" + props.nft.index;
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=drips&tokenid=" + props.nft.index;
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=bunnies&tokenid=" + props.nft.index;
    return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" + props.nft.id;
  };
  const wrappedCanisters = ["y3b7h-siaaa-aaaah-qcnwa-cai","q6hjz-kyaaa-aaaah-qcama-cai", "3db6u-aiaaa-aaaah-qbjbq-cai", "bxdf4-baaaa-aaaah-qaruq-cai"];
  const unwrappedCanisters = ["4nvhy-3qaaa-aaaah-qcnoq-cai","xkbqi-2qaaa-aaaah-qbpqq-cai", "qcg3w-tyaaa-aaaah-qakea-cai", "d3ttm-qaaaa-aaaai-qam4a-cai"];
  const showWrapped = () => {
    if (wrappedCanisters.indexOf(props.nft.canister) >= 0)
      return (<span style={{fontSize:".9em",position:"absolute",top: 0,left: 0,fontWeight: "bold",color: "black",backgroundColor: "#00b894",padding: "2px"}}>WRAPPED</span>);
    else return "";
  };
  var t = ["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const showNri = () => {
    if (props.collection == "poyn6-dyaaa-aaaah-qcfzq-cai") {
      return (<Grid item md={6} sm={6} xs={6}>
        <Typography style={{fontSize: 11, textAlign:"right", fontWeight:"bold"}} color={"inherit"} gutterBottom>
          {(props.nft.metadata[0] === 0 ? "Pack" : "#" + props.nft.metadata[0] + " - " + t[props.nft.metadata[1]])}
        </Typography>
      </Grid>);
    };
    var collection = getCollection(props.collection);
    if (collection.nftv) {
      return (<Grid item md={6} sm={6} xs={6}>
        <Typography style={{fontSize: 11, textAlign:"right", fontWeight:"bold"}} color={"inherit"} gutterBottom>
          <Tooltip title={"NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific "+collection.unit+" relative to others. It does not include Mint #, Twin Status or Animation within the index."}><a style={{color:"black",textDecoration: 'none' }} href={nriLink()} rel="noreferrer" target="_blank">NRI: {(props.gri*100).toFixed(1)}% <span style={{color:"red"}}>*</span></a></Tooltip>
        </Typography>
      </Grid>);
    } return "";
  };
  
  return (
    <Grid style={{height:'100%'}} item xl={(props.gridSize === "small" ? 3 : 2)} lg={(props.gridSize === "small" ? 3 : 2)} md={4} sm={6} xs={6}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item md={6} sm={6} xs={6}>
                {props.collection != "poyn6-dyaaa-aaaah-qcfzq-cai" || props.nft.index < 25000 ?
                <Typography style={{fontSize: 11, textAlign:"left", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                  <Tooltip title="View in browser"><a style={{color:"black",textDecoration: 'none' }} href={"https://"+props.collection+".raw.ic0.app/?tokenid=" + props.nft.id} rel="noreferrer" target="_blank">{"#"+(mintNumber())}</a></Tooltip>
                </Typography> : ""}
              </Grid>

              {showNri()}
            </Grid>

            <a href={nftLink()} target="_blank" rel="noreferrer">
              <div style={{...styles.avatarSkeletonContainer}}>
                <img alt={props.nft.id} style={{...styles.avatarImg, display:(imgLoaded ? "block" : "none")}} src={nftImg()} onLoad={() => setImgLoaded(true)} />
                <Skeleton style={{...styles.avatarLoader, display:(imgLoaded ? "none" : "block")}} variant="rect"  />
                {showWrapped()}
              </div>
            </a>
            
              {props.nft.listing ?
              <Typography style={{fontSize: 13, textAlign:"center", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                Listed @ {_showListingPrice(props.nft.listing.price)} ICP
              </Typography> : 
              <Typography style={{fontSize: 13, textAlign:"center", fontWeight:"bold"}} color={"inherit"} gutterBottom>Not Listed</Typography> }
              {props.loggedIn ? 
                <Grid  justifyContent="center" direction="row" alignItems="center" container spacing={1}> 
                  {getButtons().length > 0 ?
                    <>
                      <Grid item lg={6} md={6}><Button onClick={() => buttonPush(0)} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[0][0]}</Button></Grid>
                      {getButtons().length == 2 ?
                        <Grid item lg={6} md={6}><Button onClick={() => buttonPush(1)} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>{getButtons()[1][0]}</Button></Grid>
                      :
                      <Grid item lg={6} md={6}>
                        <Button onClick={(e) => setAnchorEl(e.currentTarget)} size={"small"} fullWidth variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>More</Button>
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
                            return (<MenuItem key={i} onClick={() => {setAnchorEl(null); buttonPush(a[1])}}>{a[0]}</MenuItem>);
                          })}
                        </Menu>
                      </Grid>
                      }
                    </>
                  : "" }
                {/*!props.nft.listing ?
                  <>
                  
                  {wrappedCanisters.concat(unwrappedCanisters).indexOf(props.nft.canister) < 0 ?
                  <>
                    <Button onClick={() => props.listNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white", marginRight:10}}>Sell</Button>
                    <Button onClick={() => props.transferNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>Transfer</Button> 
                  </>: "" }
                  
                  {unwrappedCanisters.indexOf(props.nft.canister) >= 0 ?
                  <>
                    <Button onClick={() => props.wrapAndlistNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white", marginRight:10}}>Sell</Button>
                    <Button onClick={() => props.transferNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>Transfer</Button> 
                  </>: "" }
                  
                  {wrappedCanisters.indexOf(props.nft.canister) >= 0 ?
                  <>
                    <Button onClick={() => props.listNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white", marginRight:10}}>Sell</Button>
                    <Button onClick={(e) => setAnchorEl(e.currentTarget)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>More</Button>
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
                      <MenuItem onClick={() => {setAnchorEl(null); props.transferNft(props.nft)}}>Transfer</MenuItem>
                      <MenuItem onClick={() => {setAnchorEl(null); props.unwrapNft(props.nft)}}>Unwrap</MenuItem>
                    </Menu>
                  </>: ""}
                  </>
                : <>
                <Button onClick={() => props.listNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white", marginRight:10}}>Update</Button>
                <Button onClick={() => props.cancelNft(props.nft)} size={"small"} variant="contained" color="primary" style={{backgroundColor:"#003240", color:"white"}}>Cancel</Button>
                
                </>*/}
              
              </Grid>: ""}
          </CardContent>
        </Card>
    </Grid>
  );
}

