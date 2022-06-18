import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import HoverVideoPlayer from 'react-hover-video-player';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Flip from "./Flip";
import extjs from '../ic/extjs.js';
import { EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD } from '../utils';
var settings = {
  "6wih6-siaaa-aaaah-qczva-cai" : {
    video : false,
    congrats:"You've just burned a wallet!",
    loading:"Burning wallet...",
  },
  "poyn6-dyaaa-aaaah-qcfzq-cai" : {
    video : "/opening.mp4",
    congrats:"You've just opened a pack!",
    loading:"Opening pack...",
  },
  "yrdz3-2yaaa-aaaah-qcvpa-cai" : {
    video : "/opening-dino.mp4",
    congrats:"Here is your new IC Dino!!",
    loading:"Hatching your egg...",
  },
};
var subs = [];
export default function Opener(props) {
  const { index, canister} = (props.nft?.id ? extjs.decodeTokenId(props.nft.id) : {index:0, canister:""});
  const [playOpen, setPlayOpen] = React.useState(false);
  const [openerOpen, setOpenerOpen] = React.useState(false);
  const [openerCards, setOpenerCards] = React.useState([]);
  const [toggleFlip, setToggleFlip] = React.useState(0);
  const hoverVideoRef = React.useRef();
  const rnum = (min, max) => Math.floor(Math.random() * (max - min +1)) + min;
  React.useEffect(() => {
    if (props.open) openPack();
  }, [props.open]);
  React.useEffect(() => {
    if (playOpen && settings[props.nft.canister]?.video){      
      const videoElement = hoverVideoRef.current;
      videoElement.onended = showPack;
    };
  }, [playOpen]);
  const onFlip = async a => {
    for(var i = 0; i < subs.length; i++){
      if (i == a) continue;
      subs[i]();
    };
  };
  const flipSubscriber = async (i, a) => {
    subs[i] = a;
  };
  const openPack = async () => {
    setPlayOpen(true);
    setOpenerOpen(true);
    //hot api, will sign as identity - BE CAREFUL
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", props.identity).canister(props.nft.canister, "ext").unpack(props.nft.id, [extjs.toSubaccount(props.currentAccount ?? 0)]);
      if (r.hasOwnProperty("err")) throw r.err;
      setOpenerCards(r.ok.map(a => [a[0], a[1].nonfungible.metadata[0]]));
    } catch(e) {
      setPlayOpen(false);
      closePack();
      console.log(e)
      props.alert("Error", "Sorry, something went wrong!");
    };
  };
  const closePack = () => {
    setOpenerCards([]);
    setOpenerOpen(false);
    props.onEnd();    
  };
  const showPack = () => {
    setPlayOpen(false);
  };
  return (<>
    {playOpen && settings[props.nft.canister]?.video ? 
    <>
      <HoverVideoPlayer videoRef={hoverVideoRef} muted={false} volume={0.3} style={{backgroundColor:"black",position:"fixed",left:0,right:0,top:0,bottom:0,zIndex:1700}} focused={playOpen} loop={false} videoSrc={settings[props.nft.canister]?.video} /> <Button variant={"outlined"} onClick={showPack} color={"primary"} style={{position:"fixed", right:50,bottom:100,color:"white",borderColor:"white",zIndex:1800,fontWeight: "bold", margin: "20px auto" }}>Skip</Button>
    </>
    : ""}
    <Backdrop style={{backgroundColor:"rgba(0,0,0,.8)",zIndex:1600,color:"white"}} open={openerOpen}>
      {openerCards.length === 0 ?
        <><CircularProgress color="inherit" />
        <h2 style={{ position: "absolute", marginTop: "120px" }}>{settings[props.nft.canister]?.loading}</h2></>
      :
      <>
        <div style={{textAlign:"center",width:1600,margin:"0 auto"}}>
        <h2>{settings[props.nft.canister]?.congrats}</h2>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
        {openerCards.map((a, i) => {
          if (props.nft.canister == "poyn6-dyaaa-aaaah-qcfzq-cai") return (<Flip  key={i} id={i} onFlip={onFlip} flipSubscriber={flipSubscriber} card={a[1]} />)
          else return (<><img style={{borderRadius:10,width:300}} src={EntrepotNFTImage(props.nft.canister, index, props.nft.id, false, 1)} /></>);
        })}
        </Grid>
        <Button variant={"outlined"} onClick={closePack} color={"primary"} style={{ fontWeight: "bold", margin: "20px auto" }}>Continue</Button>
        </div>
      </>}
    </Backdrop>
  </>);
};