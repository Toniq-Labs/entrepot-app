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
import MuiTooltip from "@material-ui/core/Tooltip";
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import { Icon } from "@material-ui/core";
import { useNavigate, Link } from "react-router-dom";
import extjs from '../ic/extjs.js';
import {EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD} from '../utils.js';
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
export default function Pawn(props) {
  const getCollection = c => {
    return props.collections.find(e => e.canister === c);
  };
  const [imgLoaded, setImgLoaded] = React.useState(false);
  let { canister, index} = extjs.decodeTokenId(props.event.tokenid);
  const nftImg = () => {
    return EntrepotNFTImage(canister, index, props.event.tokenid);
  };
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
  return (
    <TableRow>
      <TableCell align="left">
        <Link to={`/marketplace/asset/${props.event.tokenid}`} style={{color:"black",textDecoration: 'none'}}>
          <div style={{width:50, display:"inline-block", verticalAlign:"middle", paddingRight:10}}>
            <div style={{...styles.avatarSkeletonContainer}}>
              {EntrepotDisplayNFT(canister, props.event.tokenid, imgLoaded, nftImg(), () => setImgLoaded(true))}
            </div>
          </div>
          <strong>{getCollection(canister).name} {"#"+(EntrepotNFTMintNumber(canister, index))}</strong>
        </Link>
      </TableCell>
      <TableCell align="right"><strong><PriceICP price={props.event.amount} /></strong><br />
      {EntrepotGetICPUSD(props.event.amount) ? <small><PriceUSD price={EntrepotGetICPUSD(props.event.amount)} /></small> : ""}</TableCell>
      <TableCell align="right"><strong><PriceICP price={props.event.reward} /></strong><br />
      {EntrepotGetICPUSD(props.event.reward) ? <small><PriceUSD price={EntrepotGetICPUSD(props.event.reward)} /></small> : ""}</TableCell>
      <TableCell align="center"><Timestamp
        relative
        autoUpdate
        date={Number(props.event.length / 1000000000n)}
      /></TableCell>
    </TableRow>
  );
}

