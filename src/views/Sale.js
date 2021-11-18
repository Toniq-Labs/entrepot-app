import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Navbar from "../containers/Navbar";
import Features from "../components/Features";
import Carousel from 'react-material-ui-carousel'
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  heading: {
    textAlign: "center",
    marginTop: "40px",
  },
  footer: {
    textAlign: "center",
    position: "absolute",
    bottom: 0,
    width: "100% !important",
    height: "100px !important",
    background: "#091216",
    color: "white",
    paddingTop: 30,
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
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
export default function Iconic(props) {
  const classes = useStyles();

  const history = useHistory();
  var cards = [
    {
      title : "Blockchain Heroes",
      link : "/sale/blockchain-heroes",
      image : "/collections/bh/collection.jpg",
      content : (<>Be a part of blockchain history as the first ICP launch featuring packs of cards comes your way in the form of the best-selling Blockchain Heroes! Collect all 50 heroes!</>),
    },
    // {
      // title : "Poked Bots",
      // link : "/sale/poked",
      // image : "/banner/poked.jpg",
      // content : (<>500 years from now humans have left earth and only the Robots remain. Robots have managed to create new identities based on relics they have found from earths past</>),
    // },
    // {
      // title : "Dfinity Bulls",
      // link : "/sale/dfinitybulls",
      // image : "/banner/bulls.jpg",
      // content : (<>Get one of 8888 minted Dfinity Bulls by the owners of the Dfinity Bulls Telegram Community!</>),
    // },
    // {
      // title : "Infernal Vampire Colony",
      // link : "/sale/ivc",
      // image : "/banner/vamp1.jpg",
      // content : (<>Infernal Vampire Colony is an initial collection of 666 Vampires, with another 6000 to be released in future!</>),
    // },
    // {
      // title : "Haunted Hamsters",
      // link : "/sale/hauntedhamsters",
      // image : "/banner/hauntedhamsters.jpg",
      // content : (<>Haunted Hamsters are 6666 hamsters, who have been haunted on the hill of Hamsterville. They come with various traits, and are now living on the blockchain ready to spook!</>),
    // },
    // {
      // title : "IC3D",
      // link : "/sale/ic3d",
      // image : "/banner/ic3d.jpg",
      // content : (<>IC3D NFT is in the business of creating and selling 3D NFTs to collectors, gamers, and traders in the Internet Computer ecosystem.</>),
    // },
    {
      title : "3D MoonWalkers",
      link : "/sale/moonwalkers",
      image : "/banner/icgallery2.jpg",
      content : (<>These Animal Astronauts unlock massive influence in the growing ecosystem of the IC Gallery. The Moonwalker collection combines 3 essential forces of the Metaverse into 1 NFT.</>),
    },
  
  ];
  return (
    <>
      <div style={{ width: "100%", display: "block", position: "relative" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0px auto",
          }}
        >
          <h1 className={classes.heading}>The latest NFT launches on the Internet Computer!</h1>

          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
          >
            {
              cards.map((card, i) => {
                return (<Grid key={i} item md={4} style={{ marginBottom: 20 }}>
                  <Card className={classes.root}>
                    {card.link ?
                    <a href={card.link}><CardMedia
                      className={classes.media}
                      image={card.image}
                      title={card.title}
                    /></a> :
                    <CardMedia
                      className={classes.media}
                      image={card.image}
                      title={card.title}
                    />
                    }
                    <CardContent>
                      <h3>{card.title}</h3>
                      <Typography style={{display:"block", height:"125px", overflow:"hidden", textOverflow: "ellipsis"}} variant="body1" color="textSecondary" component="p"
                      >{card.content}</Typography>
                      <strong>{card.link ? <a href={card.link} style={{color:"black"}}>View Sale</a> : "Sale coming soon" }</strong>
                    </CardContent>
                  </Card>
                </Grid>);
              })
            }
          </Grid>
          <h1 className={classes.heading}>Launch your NFT with Entrepot</h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.3em",
              padding: "0 30px",
            }}
          >
            Get in touch with our team to list your NFT to launch on the Internet Computer with Entrepot!
          </p>
          <Features />
        </div>
      </div>
    </>
  );
}
