import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
export default function Sale(props) {
  const classes = useStyles();

  const navigate = useNavigate();
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
              props.collections.filter(a => typeof a.sale != 'undefined' && a.sale == true).map((collection, i) => {
                return (<Grid key={i} item md={4} style={{ marginBottom: 20 }}>
                  <Link style={{textDecoration:"none"}} to={"/sale/"+collection.route}>
                    <Card className={classes.root}>
                      <CardMedia
                        className={classes.media}
                        image={collection.collection}
                        title={collection.name}
                      />
                      <CardContent>
                        <h3>{collection.name}</h3>
                        <Typography style={{display:"block", height:"125px", overflow:"hidden", textOverflow: "ellipsis"}} variant="body1" color="textSecondary" component="p"
                        >{collection.blurb}</Typography>
                      </CardContent>
                    </Card>
                  </Link>
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
