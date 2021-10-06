import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Container } from "@material-ui/core";
import Navbar from "../containers/Navbar";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
    width: "100%",
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

  return (
    <>
      <Navbar />
      <div className={classes.main}>
        <Container maxWidth="xl" className={classes.container}>
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
            <Grid item xs={12} sm={12} md={3}>
              <div className={classes.center}>
                <img
                  style={{ width: 100 }}
                  alt="Low Fees"
                  src="/icon/fee.png"
                />
                <h2>Low Fees</h2>
                <p style={{ fontSize: "1.1em", textAlign: "center" }}>
                  We charge a <strong>0.5%</strong> Marketplace fee, and
                  collection creators can charge a Royalty fee of up to{" "}
                  <strong>2.5%</strong>
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <div className={classes.center}>
                <img
                  style={{ width: 100 }}
                  alt="Low Fees"
                  src="/icon/wallet.png"
                />
                <h2>Non-custodial</h2>
                <p style={{ fontSize: "1.1em", textAlign: "center" }}>
                  All assets remain in your full control - we never take custody
                  any of your digital assets
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <div className={classes.center}>
                <img
                  style={{ width: 100 }}
                  alt="Low Fees"
                  src="/icon/artist.png"
                />
                <h2>Custom Collections</h2>
                <p style={{ fontSize: "1.1em", textAlign: "center" }}>
                  We plan to work with a wide range of talented curators,
                  artists and developers
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <div className={classes.center}>
                <img
                  style={{ width: 100 }}
                  alt="Low Fees"
                  src="/icon/infinity.png"
                />
                <h2>First on the IC</h2>
                <p style={{ fontSize: "1.1em", textAlign: "center" }}>
                  Entrepot.app is the first NFT marketplace and DEFI solution on
                  the Internet Computer
                </p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <h1 style={{ textAlign: "center" }}>Upcoming Collections</h1>
            </Grid>
            <Grid item md={4}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image="/collections/starverse.jpg"
                  title="Starverse"
                />
                <CardContent>
                  <h3>Starverse</h3>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    Starverse is the result of collaborative efforts between Mac
                    and Mir, the ToniqLabs team, and theam team from DSCVR.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image="/collections/rotm.jpg"
                  title="Rise of the Magni"
                />
                <CardContent>
                  <h3>Rise of the Magni</h3>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    Another blockchain game by ToniqLabs, the first set of Magni
                    NFTs will be available for sale exclusively on{" "}
                    <strong>Entrepot.app</strong>. Coming September 2021!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image="/collections/icpnews.jpg"
                  title="Digital Artists"
                />
                <CardContent>
                  <h3>Curated Artwork</h3>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                  >
                    We are working with a number of digital artists and
                    developers to curate an collections of digital media,
                    including some amazing work by ICP News.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <div className={classes.footer}>
          <Typography variant="body1">
            Developed by ToniqLabs &copy; All rights reserved 2021
          </Typography>
        </div>
      </div>
    </>
  );
}
