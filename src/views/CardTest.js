import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Flip from "../components/Flip";
import HoverVideoPlayer from 'react-hover-video-player';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  heading: {
    textAlign: "center",
    marginTop: "40px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  marketBtn: {
    marginTop: 10,
    display: "block",
    [theme.breakpoints.up("sm")]: {
      width: "350px",
      fontSize: "1.1em",
    },
  },
  banner: {
    position: "relative",
  },
  bannerimg: {
    maxWidth: "100%",
    borderRadius: "30px",
  },
  anchor: {
    position: "absolute",
    bottom: "-15px",
    background: "white",
    borderRadius: "100%",
    padding: "5px",
    width: "40px",
    border: "1px solid black",
    left: "calc(50% - 20px)",
  },
}));
export default function CardTest(props) {
  const classes = useStyles();
  const [playOpen, setPlayOpen] = React.useState(false);
  const [openerOpen, setOpenerOpen] = React.useState(false);
  const [openerCards, setOpenerCards] = React.useState([]);
  const hoverVideoRef = React.useRef();
  
  React.useEffect(() => {
    if (playOpen){
      const videoElement = hoverVideoRef.current;
      videoElement.onended = showPack;
    }
  }, [playOpen]);
  const openPack = async () => {
    setPlayOpen(true);
    setOpenerOpen(true);
    setTimeout(() => setOpenerCards(["1E_Genesis.gif","16L_GreatGecko.gif","22M_TheEmissary.gif","7U_Master-Control.jpg","8L_Stampede.gif"]), 11000);
  };
  const closePack = () => {
    setOpenerCards([]);
    setOpenerOpen(false);
  };
  const showPack = () => {
    setPlayOpen(false);
  };
  const rnum = (min, max) => Math.floor(Math.random() * (max - min +1)) + min;
  return (
    <>
      {playOpen ? <HoverVideoPlayer videoRef={hoverVideoRef} muted={false} volume={0.3} style={{backgroundColor:"black",position:"fixed",left:0,right:0,top:0,bottom:0,zIndex:1700}} focused={playOpen} loop={false} videoSrc="/opening.mp4" /> : ""}
      <div style={{ width: "100%", display: "block", position: "relative",minHeight:"calc(100vh - 221px)"}}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0px auto",
            textAlign:"center"
          }}
        >
          <img src="/test/pack.jpg" style={{width:350,height:350,marginRight:20}} />
          <Button
            className={classes.marketBtn}
            fullWidth
            variant={"outlined"}
            onClick={openPack}
            color={"primary"}
            style={{ fontWeight: "bold", margin: "20px auto" }}
          >
            Open Pack
          </Button>
          
        </div>
        <Backdrop style={{backgroundColor:"rgba(0,0,0,.8)",zIndex:1600,color:"white"}} open={openerOpen}>
          {openerCards.length === 0 ?
            <><CircularProgress color="inherit" />
            <h2 style={{ position: "absolute", marginTop: "120px" }}>Opening pack...</h2></>
          :
          <>
            <div style={{textAlign:"center",width:1600,margin:"0 auto"}}>
            <h2>You've just opened a pack!</h2>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            {openerCards.map(a => {
              return (<Grid key={a} item md={2}><Flip card={[rnum(1,50), rnum(0,5)]} /></Grid>)
            })}
            </Grid>
            <Button variant={"outlined"} onClick={closePack} color={"primary"} style={{ fontWeight: "bold", margin: "20px auto" }}>Continue</Button>
            </div>
          </>}
        </Backdrop>
      </div>
    </>
  );
}
