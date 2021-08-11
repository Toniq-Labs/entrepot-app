import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import extjs from '../ic/extjs.js';
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
export default function Sold(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const transaction = props.transaction;
  const index = extjs.decodeTokenId(transaction.token).index;
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
  return (
 <Grid style={{height:'100%'}} item xl={2} lg={2} md={3} sm={6} xs={6}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item md={6} sm={6} xs={12}>
                <Typography style={{fontSize: 11, textAlign:"left", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                  <Tooltip title="View in browser"><a style={{color:"black",textDecoration: 'none' }} href={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid=" + transaction.token} rel="noreferrer" target="_blank">{"#"+(index+1)}</a></Tooltip>
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography style={{fontSize: 11, textAlign:"right", fontWeight:"bold"}} color={"inherit"} gutterBottom>
                  <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific Cronic relative to others. It does not include Mint #, Twin Status or Animation within the index."><a style={{color:"black",textDecoration: 'none' }} href={"https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" + transaction.token} rel="noreferrer" target="_blank">NRI: {(props.gri*100).toFixed(1)}% <span style={{color:"red"}}>*</span></a></Tooltip>
                </Typography>
              </Grid>
            </Grid>

            <a href={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid=" + transaction.token} target="_blank" rel="noreferrer">
              <div style={{...styles.avatarSkeletonContainer}}>
                <img alt={transaction.token} style={{...styles.avatarImg, display:(imgLoaded ? "block" : "none")}} src={"https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid=" + transaction.token} onLoad={() => setImgLoaded(true)} />
                <Skeleton style={{...styles.avatarLoader, display:(imgLoaded ? "none" : "block")}} variant="circle"  />
              </div>
            </a>
            
            
            <Typography style={{fontSize: 12, textAlign:"left", fontWeight:"bold"}} color={"inherit"} gutterBottom>
              <small>Sale Price</small><br />
              {_showListingPrice(transaction.price)} ICP
            </Typography>
          </CardContent>
        </Card>
    </Grid>
  );
}

