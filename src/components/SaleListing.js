import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Tooltip from "@material-ui/core/Tooltip";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import ReactPlayer from 'react-player'
import Timestamp from "react-timestamp";
import {handleToAsset} from './SaleListingGigantoDataSet'

const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
export default function SaleListing(props) {
  const [loadVideo, setLoadVideo] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const styles = {
    avatarSkeletonContainer: {
      height: 0,
      overflow: "hidden",
      paddingTop: "100%",
      position: "relative",
    },
    avatarLoader: {
      position: "absolute",
      top: "15%",
      left: "15%",
      width: "70%",
      height: "70%",
      margin: "0 auto",
    },
    avatarImg: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      margin: "0 auto",
    },
    avatarVideo: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      margin: "0 auto",
    },
    avatarImg2: {
      position: "absolute",
      top: "0%",
      left: "16.66%",
      height: "100%",
      margin: "0 auto",
    },
  };
  
  const _isLocked = () => {
    if (Date.now() >= Number(props.time/1000000n)) return false;
    return true;
  };

  const _ah = handleToAsset.find(a => a[0] == props.asset);
  const buy = async () => {
    return props.buy(props.asset);
  };
  const nftImg = () => {
    return "https://"+_ah[1]+".raw.ic0.app/?index="+_ah[2];
  };
  const nftVideo = () => {
    return "https://"+_ah[1]+".raw.ic0.app/?index="+_ah[3];
  };
  const nftLink = () => {
    return "https://er7d4-6iaaa-aaaaj-qac2q-cai.raw.ic0.app/?asset="+props.asset;
  };

  return (
    <Grid style={{ height: "100%" }} item xl={2} lg={3} md={4} sm={6} xs={6}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item md={6} sm={6} xs={6}>
              <Typography
                style={{
                  fontSize: 11,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
                color={"inherit"}
                gutterBottom
              >
                <Tooltip title="View in browser">
                  <span
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <a href={nftLink()} rel="noreferrer" target="_blank">View Files</a>
                  </span>
                </Tooltip>
              </Typography>
            </Grid>
          </Grid>
        
          <div style={{ ...styles.avatarSkeletonContainer }}>
            {loadVideo ? 
              <ReactPlayer
              width={"100%"}
              height={"100%"}
              style={{
                ...styles.avatarVideo,
              }} 
              playing={true} 
              loop={true} 
              onReady={() => {
                setVideoLoaded(true)
              }}
              url={nftVideo()} /> : ""}
            <img
              alt={props.asset}
              style={{
                ...styles.avatarImg,
                display: (imgLoaded && !videoLoaded) ? "block" : "none",
              }}
              src={nftImg()}
              onLoad={() => {
                setImgLoaded(true)
              }}
            />
            {!loadVideo && imgLoaded ? <PlayCircleOutlineIcon onClick={() => setLoadVideo(true)} style={{cursor:"pointer",fontSize: "3em",position: "relative", color: "white", top:"-50px",left:10}} /> : ""}
            {loadVideo && !videoLoaded ? <CircularProgress style={{position: "relative", color: "white", top:"-50px",left:10}} /> : ""}
            <Skeleton
              style={{
                ...styles.avatarLoader,
                display: imgLoaded ? "none" : "block",
              }}
              variant="rect"
            />
          </div>
          <Typography
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
            }}
            color={"inherit"}
            gutterBottom
          >
            {_showListingPrice(props.price)} ICP
          </Typography>
          <Typography
            style={{ fontSize: 12, textAlign: "center" }}
            color={"inherit"}
            gutterBottom
          >
            {_isLocked() ? (
              <span style={{ display: "block", marginBottom: 22 }}>
                Unlocks{" "}
                <Timestamp
                  relative
                  autoUpdate
                  date={Number(props.time/1000000000n)}
                />
              </span>
            ) : (
              <Button
                onClick={buy}
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#003240", color: "white" }}
              >
                Buy Now
              </Button>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
