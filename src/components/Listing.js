import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import getGenes from "./CronicStats.js";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Timestamp from "react-timestamp";
import extjs from "../ic/extjs.js";
import { useHistory } from "react-router-dom";
const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export default function Listing(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [cronic, setCronic] = React.useState(props.listing);
  const genes = props.collection !== "e3izy-jiaaa-aaaah-qacbq-cai" ? "" : getGenes(props.listing[2].nonfungible.metadata[0]);

  const history = useHistory();
  const tokenid = extjs.encodeTokenId(props.collection, props.listing[0]);

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };
  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const styles = {
    avatarSkeletonContainer: {
      height: 0,
      overflow: "hidden",
      paddingTop: "100%",
      position: "relative",
    },
    avatarLoader: {
      position: "absolute",
      top: "15%",
      left: "15%",
      width: "70%",
      height: "70%",
      margin: "0 auto",
    },
    avatarImg: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      margin: "0 auto",
    },
    avatarImg2: {
      position: "absolute",
      top: "0%",
      left: "16.66%",
      height: "100%",
      margin: "0 auto",
    },
  };
  const _isLocked = (listing) => {
    if (listing.locked.length === 0) return false;
    if (Date.now() >= Number(listing.locked[0] / 1000000n)) return false;
    return true;
  };

  const buy = async () => {
    return props.buy(props.collection, props.listing);
  };
  const mintNumber = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai")
      return props.listing[0];
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai")
      return props.listing[0];
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai")
      return props.listing[0];
    else return props.listing[0] + 1;
  };
  const icpbunnyimg = i => {
    const icbstorage = ['efqhu-yqaaa-aaaaf-qaeda-cai',
    'ecrba-viaaa-aaaaf-qaedq-cai',
    'fp7fo-2aaaa-aaaaf-qaeea-cai',
    'fi6d2-xyaaa-aaaaf-qaeeq-cai',
    'fb5ig-bqaaa-aaaaf-qaefa-cai',
    'fg4os-miaaa-aaaaf-qaefq-cai',
    'ft377-naaaa-aaaaf-qaega-cai',
    'fu2zl-ayaaa-aaaaf-qaegq-cai',
    'f5zsx-wqaaa-aaaaf-qaeha-cai',
    'f2yud-3iaaa-aaaaf-qaehq-cai']

    return "https://" +icbstorage[i % 10]+".raw.ic0.app/Token/"+i;
  };

  const nftImg = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai")
      return (
        "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" +
        props.listing[0]
      );
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai")
      return (
        "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" +
        props.listing[0]
      );
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai")
      return icpbunnyimg(props.listing[0])
    return (
      "https://" +
      props.collection +
      ".raw.ic0.app/?cc=0&type=thumbnail&tokenid=" +
      tokenid
    );
  };
  const nftLink = () => {
    if (props.collection === "bxdf4-baaaa-aaaah-qaruq-cai")
      return (
        "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" +
        props.listing[0]
      );
    if (props.collection === "3db6u-aiaaa-aaaah-qbjbq-cai")
      return (
        "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" +
        props.listing[0]
      );
    if (props.collection === "q6hjz-kyaaa-aaaah-qcama-cai")
      return icpbunnyimg(props.listing[0])
    return "https://" + props.collection + ".raw.ic0.app/?tokenid=" + tokenid;
  };
  const showNri = () => {
    switch (props.collection) {
      case "e3izy-jiaaa-aaaah-qacbq-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific Cronic relative to others. It does not include Mint #, Twin Status or Animation within the index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" +
                    tokenid
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "nbg4r-saaaa-aaaah-qap7a-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific Star relative to others. It does not include Mint # or Twin Status as factors in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" +
                    tokenid
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "bxdf4-baaaa-aaaah-qaruq-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific ICPunk relative to others. It does not include Mint # or Twin Status as factors in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=punks&tokenid=" +
                    mintNumber()
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "3db6u-aiaaa-aaaah-qbjbq-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the trait rarity of a specific IC Drip relative to others. It does not include Mint # as a factor in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?collection=drips&tokenid=" +
                    mintNumber()
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "njgly-uaaaa-aaaah-qb6pa-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the trait rarity of a specific ICPuppy relative to others. It does not include Mint # as a factor in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" +
                    tokenid
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "ahl3d-xqaaa-aaaaj-qacca-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the trait rarity of a specific ICTuT relative to others. It does not include Mint # as a factor in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" +
                    tokenid
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      case "sr4qi-vaaaa-aaaah-qcaaq-cai":
        return (
          <Grid item md={6} sm={6} xs={6}>
            <Typography
              style={{ fontSize: 11, textAlign: "right", fontWeight: "bold" }}
              color={"inherit"}
              gutterBottom
            >
              <Tooltip title="NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the trait rarity of a specific Astronaut relative to others. It does not include Mint # as a factor in this index.">
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={
                    "https://nntkg-vqaaa-aaaad-qamfa-cai.ic.fleek.co/?tokenid=" +
                    tokenid
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  NRI: {(props.gri * 100).toFixed(1)}%{" "}
                  <span style={{ color: "red" }}>*</span>
                </a>
              </Tooltip>
            </Typography>
          </Grid>
        );
      default:
        return "";
    }
  };

  const handleClick = () => {
    const id = props.listing[0];
    history.push(`/marketplace/token/${tokenid}`);
  };

  return (
    <Grid style={{ height: "100%" }} item xl={2} lg={3} md={4} sm={6} xs={6}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item md={6} sm={6} xs={6}>
              <Typography
                style={{
                  fontSize: 11,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
                color={"inherit"}
                gutterBottom
              >
                <Tooltip title="View in browser">
                  {props.collection === "e3izy-jiaaa-aaaah-qacbq-cai" ? (
                  <a href={nftLink()} style={{ color: "black", textDecoration: "none" }} rel="noreferrer" target="_blank">
                    <span>
                      {"#" + mintNumber()}
                    </span>
                  </a> ) : (
                    <span
                    style={{ color: "black", textDecoration: "none" }}
                    >
                    {"#" + mintNumber()}
                  </span>
                )}
                </Tooltip>
              </Typography>
            </Grid>
            {showNri()}
          </Grid>
          {props.collection !== "e3izy-jiaaa-aaaah-qacbq-cai" ? (
            <a href={nftLink()} rel="noreferrer" target="_blank">
            <div style={{ ...styles.avatarSkeletonContainer }}>
              {props.collection !== "uzhxd-ziaaa-aaaah-qanaq-cai" ? (
                <img
                  alt={tokenid}
                  style={{
                    ...styles.avatarImg,
                    display: imgLoaded ? "block" : "none",
                  }}
                  src={nftImg()}
                  onLoad={() => setImgLoaded(true)}
                />
              ) : (
                <img
                  alt={tokenid}
                  style={{
                    ...styles.avatarImg2,
                    display: imgLoaded ? "block" : "none",
                  }}
                  src={nftImg()}
                  onLoad={() => setImgLoaded(true)}
                />
              )}
              <Skeleton
                style={{
                  ...styles.avatarLoader,
                  display: imgLoaded ? "none" : "block",
                }}
                variant="rect"
              />
            </div>
            </a>
            ) : (
              <div style={{ ...styles.avatarSkeletonContainer }}>
              <div>
                <img
                  alt={tokenid}
                  style={{
                    ...styles.avatarImg,
                    display: imgLoaded ? "block" : "none",
                  }}
                  src={nftImg()}
                  onLoad={() => setImgLoaded(true)}
                  onClick={handlePopupOpen}
                />
              <div>
                <BootstrapDialog
                  onClose={handlePopupClose}
                  open={popupOpen} maxWidth="xl"
                >
                  <BootstrapDialogTitle onClose={handlePopupClose}>
                    {"Cronic #" + mintNumber()}
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                  <div>
                    <Grid style={{fontWeight:"bold"}} container spacing={1}>
                      <img
                        alt={tokenid}
                        style={{
                          ...styles.avatarImg,
                          display: imgLoaded ? "block" : "none",
                          width: "40%", position : "relative"
                        }}
                        src={nftImg()}
                        onLoad={() => setImgLoaded(true)}
                      />
                    </Grid>
                  </div>
                  <Grid style={{textAlign:"center"}} container spacing={1}>
                    <Grid item xs={4}><strong>Attack</strong><br />{genes.battle.attack.dominant} ({genes.battle.attack.recessive})</Grid>
                    <Grid item xs={4}><strong>Magic</strong><br />{genes.battle.magic.dominant} ({genes.battle.magic.recessive})</Grid>
                    <Grid item xs={4}><strong>Range</strong><br />{genes.battle.range.dominant} ({genes.battle.range.recessive})</Grid>
                    <Grid item xs={4}><strong>Health</strong><br />{genes.battle.health.dominant} ({genes.battle.health.recessive})</Grid>
                    <Grid item xs={4}><strong>Defense</strong><br />{genes.battle.defense.dominant} ({genes.battle.defense.recessive})</Grid>
                    <Grid item xs={4}><strong>Resistance</strong><br />{genes.battle.resistance.dominant} ({genes.battle.resistance.recessive})</Grid>
                    <Grid item xs={4}><strong>Base</strong><br />{genes.battle.base.dominant} ({genes.battle.base.recessive})</Grid>
                    <Grid item xs={4}><strong>Speed</strong><br />{genes.battle.speed.dominant} ({genes.battle.speed.recessive})</Grid>
                  </Grid>
                  </DialogContent>
                </BootstrapDialog>
              </div>
            </div>
            <Skeleton
              style={{
                ...styles.avatarLoader,
                display: imgLoaded ? "none" : "block",
              }}
              variant="rect"
            />
          </div>
          )}
          <Typography
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "bold",
            }}
            color={"inherit"}
            gutterBottom
          >
            {_showListingPrice(props.listing[1].price)} ICP
          </Typography>
          {props.loggedIn ? (
            <Typography
              style={{ fontSize: 12, textAlign: "center" }}
              color={"inherit"}
              gutterBottom
            >
              {_isLocked(props.listing[1]) ? (
                <span style={{ display: "block", marginBottom: 22 }}>
                  Unlocks{" "}
                  <Timestamp
                    relative
                    autoUpdate
                    date={Number(props.listing[1].locked[0] / 1000000000n)}
                  />
                </span>
              ) : (
                <Button
                  onClick={buy}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#003240", color: "white" }}
                >
                  Buy Now
                </Button>
              )}
            </Typography>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
