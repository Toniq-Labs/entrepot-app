import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  box : {
    position: "relative",
    transform: "rotate3d(0, 0, 0, 0)",
    transition: "all 1000ms ease",
    transitionProperty: "left, top, margin-left, margin-right, transform",
    transformStyle: "preserve-3d",
    "&.hor" : {
      width: 400,
      height: 300,
    },
    "&.ver" : {
      width: 300,
      height: 400,
    },
    margin:"0 auto",
    zIndex:1,
    "&.ver.flipped" : {
      transform: "rotate3d(0, 1, 0, 180deg)",
      zIndex:10000,
      width:750,
      height:1000,
      position:"fixed",
      top:"50%",
      left:"50%",
      marginTop:-500,
      marginLeft:-375,
    },
    "&.hor.flipped" : {
      transform: "rotate3d(0, 1, 0, 180deg)",
      zIndex:10000,
      width:1000,
      height:750,
      position:"fixed",
      top:"50%",
      left:"50%",
      marginTop:-375,
      marginLeft:-500,
    },
    "& img" : {
      borderRadius: 15,
      width:"100%",
      height:"100%",
      boxShadow:"rgb(100 100 100) 0px 0px 8px",
    },
  },
  front : {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    zIndex: 2,
  },
  back : {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  },
}));
var tmap = ["C","U","R","E","L","M"];
var tmap2 = ["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
var tmap3 = ["52%","25%","12.6%","6.4%","3.2%","0.8%"];
export default function Flip2(props) {
  const classes = useStyles();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [flipped, setFlipped] = React.useState(false);
  React.useEffect(() => {
    props.flipSubscriber(props.id, () => {
      setFlipped(false);
    });
  }, []);
  const flip = () => {
    if (!flipped) props.onFlip(props.id);
    setFlipped(a => !a);
  }
  return (
  <Grid item md={4} style={{textAlign:"center"}}>
    <div className={classes.box + (flipped ? " flipped" : "")   + ((props.id == 3 || props.id == 5) ? " hor" : " ver")  + (props.small ? " small" : "") } onClick={flip}>
      <div className={classes.front}>
        <CircularProgress style={{margin:"40% auto 0",display:(imageLoaded ? "none" : "block")}} color="inherit" />
        <img style={{display:(!imageLoaded ? "none" : "block")}} onLoad={() => setImageLoaded(true)}  src={props.front} />
      </div>
      <div className={classes.back}>
        <img src={props.back} />
      </div>
    </div>
    {props.saleLive ? <>
    <br />
    <strong>{props.remaining > 0 ? props.remaining + " Remaining" : "SOLD OUT"}</strong><br />
    {props.remaining > 0 ? props.button : ""}</> : ""}
  </Grid>);
};