import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import Timestamp from 'react-timestamp';
import extjs from '../ic/extjs.js';
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
export default function Listing(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const tokenid = extjs.encodeTokenId(props.collection, props.listing[0]);
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
      margin: "0 auto"
    }
  };
  const _isLocked = listing => {
    if (listing.locked.length === 0) return false;
    if (Date.now() >= Number(listing.locked[0]/1000000n)) return false;
    return true;
  };

  const buy = async () => {
    return props.buy(props.collection, props.listing);
  };
  
  return (
    <Grid style={{height:'100%'}} item xl={2} lg={2} md={3} sm={4} xs={6}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item md={6} sm={6} xs={12}>
                <Typography style={{fontSize: 11, textAlign:"left", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                  <Tooltip title="View in browser"><a style={{color:"black",textDecoration: 'none' }} href={"https://"+props.collection+".raw.ic0.app/?tokenid=" + tokenid} rel="noreferrer" target="_blank">{"#"+(props.listing[0]+1)}</a></Tooltip>
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography style={{fontSize: 11, textAlign:"right", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                  <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific Cronic relative to others. It does not include Mint #, Twin Status or Animation within the index."><a style={{color:"black",textDecoration: 'none' }} href={"https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" + tokenid} rel="noreferrer" target="_blank">NRI: {(props.gri*100).toFixed(1)}% <span style={{color:"red"}}>*</span></a></Tooltip>
                </Typography>
              </Grid>
            </Grid>

            <a href={"https://"+props.collection+".raw.ic0.app/?tokenid=" + tokenid} target="_blank" rel="noreferrer">
              <div style={{...styles.avatarSkeletonContainer}}>
                <img alt={tokenid} style={{...styles.avatarImg, display:(imgLoaded ? "block" : "none")}} src={"https://"+props.collection+".raw.ic0.app/?tokenid=" + tokenid} onLoad={() => setImgLoaded(true)} />
                <Skeleton style={{...styles.avatarLoader, display:(imgLoaded ? "none" : "block")}} variant="circle"  />
              </div>
            </a>
            
            
            <Grid container>
              <Grid item md={6} sm={12} xs={12}>
              <Typography style={{fontSize: 12, textAlign:"left", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                <small>Price</small><br />
                {_showListingPrice(props.listing[1].price)} ICP
              </Typography>
              </Grid>
              {props.loggedIn ? 
              <Grid item md={6} sm={12} xs={12}>
                <Typography style={{fontSize: 12, textAlign:"right"}} color={"inherit"} gutterBottom>
                  { _isLocked(props.listing[1]) ? 
                    <>Unlocks <Timestamp relative autoUpdate date={Number(props.listing[1].locked[0]/1000000000n)} /></>
                  : 
                    <Button onClick={buy} variant="outlined" color="primary">Buy</Button>
                  }
                </Typography>
              </Grid> : ""}
            </Grid>
          </CardContent>
        </Card>
    </Grid>
  );
}

