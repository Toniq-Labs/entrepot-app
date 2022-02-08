import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import Timestamp from "react-timestamp";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import { Icon } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import extjs from '../ic/extjs.js';
import _c from '../ic/collections.js';
import {EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD} from '../utils.js';
var collections = _c;
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
const getCollection = c => {
  return collections.find(e => e.canister === c);
};
export default function Sold(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const navigate = useNavigate();
  const transaction = props.transaction;
  const index = extjs.decodeTokenId(transaction.token).index;
  const tokenid = transaction.token;
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
  const mintNumber = () => {
    return EntrepotNFTMintNumber(props.collection, index);
  };
  const nftImg = () => {
    return EntrepotNFTImage(props.collection, index, tokenid);
  };
  const nftLink = () => {
    return EntrepotNFTLink(props.collection, index, tokenid);
  };
  const shorten = a => {
    return a.substring(0, 12) + "...";
  };
  const nriLink = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=punks&tokenid=" + index;
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=drips&tokenid=" + index;
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai") return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=bunnies&tokenid=" + index;
    return "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" + tokenid;
  };
  const showNri = () => {
    var collection = getCollection(props.collection);
    if (collection.nftv) {
      return (<Grid item md={6} sm={6} xs={6}>
        <Typography style={{fontSize: 11, textAlign:"right", fontWeight:"bold"}} color={"inherit"} gutterBottom>
          <Tooltip title={"NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific "+collection.unit+" relative to others. It does not include Mint #, Twin Status or Animation within the index."}><a style={{color:"black",textDecoration: 'none' }} href={nriLink()} rel="noreferrer" target="_blank">NRI: {(props.gri*100).toFixed(1)}% <span style={{color:"red"}}>*</span></a></Tooltip>
        </Typography>
      </Grid>);
    } else return "";
  };
  const handleClick = () => {
    navigate(`/marketplace/asset/${tokenid}`);
  };
  var t = ["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  return (
    <TableRow>
      <TableCell><ShoppingCartIcon style={{fontSize:18,verticalAlign:"middle"}} /> <strong>Sale</strong></TableCell>
      <TableCell align="left">
        <a style={{color:"black",textDecoration: 'none', cursor : "pointer" }} onClick={handleClick} rel="noreferrer" target="_blank">
          <div style={{width:50, display:"inline-block", verticalAlign:"middle", paddingRight:10}}>
            <div style={{...styles.avatarSkeletonContainer}}>
              {EntrepotDisplayNFT(props.collection, tokenid, imgLoaded, nftImg(), () => setImgLoaded(true))}
            </div>
          </div>
          <strong>{getCollection(props.collection).name} {"#"+(mintNumber())}</strong>
        </a>
      </TableCell>
      <TableCell align="right"><strong><PriceICP price={transaction.price} /></strong><br />
      {EntrepotGetICPUSD(transaction.price) ? <small><PriceUSD price={EntrepotGetICPUSD(transaction.price)} /></small> : ""}</TableCell>
      <TableCell align="center"><a href={"https://ic.rocks/principal/"+transaction.seller.toText()} target="_blank">{shorten(transaction.seller.toText())}</a></TableCell>
      <TableCell align="center"><a href={"https://ic.rocks/account/"+transaction.buyer} target="_blank">{shorten(transaction.buyer)}</a></TableCell>
      <TableCell align="center"><Timestamp
        relative
        autoUpdate
        date={Number(transaction.time / 1000000000n)}
      /></TableCell>
    </TableRow>
  );
}

