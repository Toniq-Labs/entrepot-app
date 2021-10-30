import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Container } from "@material-ui/core";
import Navbar from "../containers/Navbar";
import Features from "../components/Features";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    maxWidth: 345,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
    width: "100%",
  },
  heading: {
    textAlign: "center",
    marginTop: "40px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  container: {
    padding: "120px 120px",
    [theme.breakpoints.down("md")]: {
      padding: "110px 66px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "90px 45px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "75px 45px",
    },
  },
  footer: {
    textAlign: "center",
    background: "#091216",
    color: "white",
    padding: "30px 0px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));
export default function Create(props) {
  const classes = useStyles();

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
      <Navbar />
      <div style={{ width: "100%", display: "block", position: "relative" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "120px auto 0px",
            paddingBottom: 200,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <h1 style={{ textAlign: "center" }}>Create, mint, release!</h1>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <p style={{ textAlign: "center", fontSize: "1.3em" }}>
                If you would like to release your own collection of NFTs on the
                Entrepot.app marketplace then please complete{" "}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfijChkKNI8SESLIavMspahNeE5Mio84TjDwspmlV7EEd4iCA/viewform"
                  rel="noreferrer"
                  target="_blank"
                >
                  this form
                </a>{" "}
                and we will be in touch!
              </p>
            </Grid>
          </Grid>
          <Features />
          <h1 className={classes.heading}>Our Collections</h1>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {
              cards.map((card, i) => {
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
        </div>

        <div className={classes.footer}>
          <Typography variant="body1">
            Developed by ToniqLabs &copy; All rights reserved 2021
          </Typography>
        </div>
      </div>
    </>
  );
}
