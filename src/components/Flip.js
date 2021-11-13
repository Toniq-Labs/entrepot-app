import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  box : {
    position: "relative",
    transform: "rotate3d(-1, -1, 0, 0)",
    transition: "all 1000ms ease",
    transitionProperty: "left, top, margin-left, margin-right, transform",
    transformStyle: "preserve-3d",
    width: 250,
    height: 350,
    marginTop:0,
    marginLeft:0,
    zIndex:1,
    [theme.breakpoints.down("lg")]: {
      width: 200,
      height: 280,
    },
    "&.small" : {
      width: 180,
      height: 252,
    },
    "&.flipped" : {
      transform: "rotate3d(-1, -1, 0, 180deg)",
      zIndex:10,
      width:400,
      height:560,
      position:"fixed",
      top:"50%",
      left:"50%",
      marginTop:-280,
      marginLeft:-200,
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
export default function Flip(props) {
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
  <Grid item md={2}>
    <div className={classes.box + (flipped ? " flipped" : "")  + (props.small ? " small" : "") } onClick={flip}>
      <div className={classes.front}>
        <CircularProgress style={{margin:"40% auto 0",display:(imageLoaded ? "none" : "block")}} color="inherit" />
        <img style={{display:(!imageLoaded ? "none" : "block")}} onLoad={() => setImageLoaded(true)}  src={"https://poyn6-dyaaa-aaaah-qcfzq-cai.raw.ic0.app/?asset="+props.card[0]+tmap[props.card[1]]+"&type=thumbnail"} />
      </div>
      <div className={classes.back}>
        <img src={"https://poyn6-dyaaa-aaaah-qcfzq-cai.raw.ic0.app/?asset="+props.card[0]+"B&type=thumbnail"} />
      </div>
    </div>
    {props.showRarity && !flipped ? <p><strong>{tmap2[props.card[1]]}<br />{tmap3[props.card[1]]}</strong></p> : ""}
  </Grid>);
};