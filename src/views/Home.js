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
export default function Home(props) {
  const classes = useStyles();

  const history = useHistory();
  var items = [
      {
          link: "/sale/poked",
          img: "/banner/poked.jpg"
      },
      {
          link: false,
          img: "/banner/bh.png"
      },
      {
          link: "/marketplace/p2j",
          img: "/banner/canistore.png"
      },
      {
          link: "/sale/dfinitybulls",
          img: "/banner/bulls.jpg"
      },
      {
          link: "/marketplace/wildwest",
          img: "/banner/ww.png"
      },
      {
          link: "/sale/moonwalkers",
          img: "/banner/icgallery2.jpg"
      },
      {
          link: false,
          img: "/banner/rotm.png"
      },
  ];
  var cards = [
    {
      title : "Cronic Wearables",
      link : "/marketplace/wearables",
      image : "/collections/cronic-wearables.jpg",
      content : (<>We will be releasing the next set of Cronic NFTs - Cronic Wearables! These are a seperate collection of NFTs that you can send to your Cronic, and it will wear it!</>),
    },
    {
      title : "ICmojis",
      link : "/marketplace/icmojis",
      image : "/collections/icmojis.jpg",
      content : (<>Make your friends smile with these unique NFTs or collect them all! Plans are being developed to make ICmojis even more fun to use so stay tuned for future updates!</>),
    },
    {
      title : "Rise of the Magni",
      link : "/",
      image : "/collections/rotm.jpg",
      content : (<>Another blockchain game by ToniqLabs, the first set of Magni NFTs will be available for sale exclusively on <strong>Entrepot.app</strong>. Coming November 2021!</>),
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
          <div className={classes.banner}>
            <Carousel interval={5000} animation={"slide"} reverseEdgeAnimationDirection={false} indicators={false} navButtonsAlwaysVisible={true}>
              {
                items.map( (item, i) => {
                  if (item.link) {
                    return (<a key={i} href={item.link}><img className={classes.bannerimg} src={item.img} /></a>)
                  } else {
                    return (<img key={i} className={classes.bannerimg} src={item.img} />)
                  };
                })
              }
            </Carousel>
          </div>
          <h1 className={classes.heading}>Welcome to Entrepot</h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.3em",
              padding: "0 30px",
            }}
          >
            By definition, an entrepôt is a port, city, or trading post where
            merchandise may be imported, stored or traded. Such centers played a
            critical role in trade during the days of wind-powered shipping. We
            developed <strong>Entrepot.app</strong> to provide a similar role in
            the digital world - a trading post where users can store and trade
            digital assets in a decentralized, non-custodial way.
            <Button
              className={classes.marketBtn}
              fullWidth
              variant={"outlined"}
              onClick={() => history.push(`/marketplace`)}
              color={"primary"}
              style={{ fontWeight: "bold", margin: "20px auto" }}
            >
              Explore the Marketplace
            </Button>
          </p>
          <h1 className={classes.heading}>Latest Collections</h1>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {
              cards.slice(0,3).map((card, i) => {
                return (<Grid key={i} item md={4} style={{ marginBottom: 20 }}>
                  <Card className={classes.root}>
                    <a href={card.link}><CardMedia
                      className={classes.media}
                      image={card.image}
                      title={card.title}
                    /></a>
                    <CardContent>
                      <h3>{card.title}</h3>
                      <Typography variant="body1" color="textSecondary" component="p"
                      >{card.content}</Typography>
                    </CardContent>
                  </Card>
                </Grid>);
              })
            }
          </Grid>

          <Features />
        </div>
      </div>
    </>
  );
}
