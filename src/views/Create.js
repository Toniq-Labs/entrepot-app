import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Container } from "@material-ui/core";
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
      title : "Poked bots",
      link : "/marketplace/poked",
      image : "/collections/poked/collection.jpg",
      content : (<>Poked bots by Poked Studio! These 10,000 unique bots designed by Internet Computer legend  — Jon Ball — are making their way into the metaverse </>),
    },
    {
      title : "BTC Flower",
      link : "/marketplace/btcflower",
      image : "/collections/btcflower/collection.jpg",
      content : (<>In early 2018, BTC Flower by street artist ludo made its debut on the streets of Paris. The digital version of the R.I.P Banking System art piece exists as an assortment of 2009 unique variations.</>),
    },
    {
      title : "OG Medals",
      link : "/marketplace/ogmedals",
      image : "/collections/ogmedals/collection.jpg",
      content : (<>1000 OG Medals airdropped by DKLORD89 "Drop King" to to active early believers inside the most popular WEB 3.0 decentralized social media platform: DSCVR!</>),
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <h1 style={{ textAlign: "center" }}>Create, mint, release!</h1>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <p style={{ textAlign: "center", fontSize: "1.3em" }}>
                If you would like to release your own collection of NFTs on
                Entrepot NFT Marketplace please complete the form below to request access to Toniq Mint — our no-code self mint decentralized application
                running on the Internet Computer. You do not need to know how to mint an NFT to launch!
              </p>
              <Grid container xs={12} sm={12} spacing={2} style={{paddingBottom:20, justifyContent: "center"}}>
                <Grid item xs={12} sm={3} style={{textAlign:"center"}}>
                  <Button size="large" variant="outlined" target="_blank" href="https://toniq-labs.gitbook.io/toniq-mint/">User Guide</Button>
                </Grid>
                <Grid item className={classes.marketBtn} xs={12} sm={3} style={{textAlign:"center"}}>
                  <Button size="large" variant="contained" target="_blank" href="https://toniqmint-access-request.paperform.co">Request Access</Button>
                </Grid>
                <Grid item xs={12} sm={3} style={{textAlign:"center"}}>
                  <Button size="large" variant="outlined" target="_blank" href="https://calendar.google.com/calendar/u/0?cid=Y184dG5qZmhhbW91Y281aHRuc2M1aDZmNTNtc0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t">Launch Calendar</Button>
                </Grid>
              </Grid>
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
      </div>
    </>
  );
}
