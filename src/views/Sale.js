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
      title : "Frog Nation 2.0 - Voxel Assassins!!!",
      link : "/sale/frogvoxel",
      image : "/collections/frog2d/VoxelAvatar.png",
      content : (<>This collection has 3 unique sets. 1000 2D Cool Pepe assassins, 420 3D Voxel Killers and 69 3D High quality Ninjas all created by Liquid ICP DAO for its valuable community.</>),
    },
    {
      title : "Infernal Vampire Colony Gen2",
      link : "/sale/ivc2",
      image : "/collections/ivc2/collection.png",
      content : (<>Gen2 Infernal Vampires are prisoned in the lair by their enemies for a long time. They look more terrible and more scary than Gen1 Infernal Vampires. Because Gen2 Vampires stay in the lair longer, they're closer to death than ever before.</>),
    },
    {
      title : "SwordNFT",
      link : "/sale/sword",
      image : "/collections/sword/collection.jpg",
      content : (<>This collection was designed with the intent of game/metaverse intergration in the future.</>),
    },
    // {
      // title : "FlokiCyberPunk",
      // link : "/sale/floki",
      // image : "/collections/floki/collection.png",
      // content : (<>NFT owners will be able to earn x2, x5, x10 times more tokens in Internet Computer (ICP) game than everyone else!</>),
    // },
    {
      title : "Yolo Octopus",
      link : "/sale/yolo-octopus",
      image : "/collections/yolo/collection.jpg",
      content : (<>'You Only Live Once' - No NFTs will sit idle. Amazing tools where u can create animation, add music & enter DIGITAL STUDIO. 3D collection will also be launched soon.</>),
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
    // {
      // title : "3D MoonWalkers",
      // link : "/sale/moonwalkers",
      // image : "/banner/icgallery2.jpg",
      // content : (<>These Animal Astronauts unlock massive influence in the growing ecosystem of the IC Gallery. The Moonwalker collection combines 3 essential forces of the Metaverse into 1 NFT.</>),
    // },
  
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
