import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Container } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    maxWidth: 345,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));
export default function Features(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={3}>
        <div className={classes.center}>
          <img
            style={{ width: 100 }}
            alt="Low Fees"
            src="/icon/fee.png"
          />
          <h2>Low Fees</h2>
          <p style={{ fontSize: "1.1em", textAlign: "center" }}>
            We charge a <strong>1.0%</strong> Marketplace fee, and
            collection creators can charge a Royalty fee of up to{" "}
            <strong>2.5%</strong>
          </p>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <div className={classes.center}>
          <img
            style={{ width: 100 }}
            alt="Non-custodial"
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
            alt="Custom Collections"
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
            alt="First on the IC"
            src="/icon/infinity.png"
          />
          <h2>First on the IC</h2>
          <p style={{ fontSize: "1.1em", textAlign: "center" }}>
            Entrepot.app is the first NFT marketplace and DEFI solution on
            the Internet Computer
          </p>
        </div>
      </Grid>
    </Grid>
  );
}
