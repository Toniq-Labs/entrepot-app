import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import extjs from "../ic/extjs.js";
import { makeStyles } from "@material-ui/core";
import { cssToReactStyleObject, toniqFontStyles, toniqShadows, BrandInstagram32Icon, BrandTwitch32Icon, BrandTiktok32Icon, BrandTwitter32Icon, CircleWavyCheck24Icon, Icp16Icon } from "@toniq-labs/design-system";
import { ToniqChip, ToniqIcon } from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { icpToString } from "./PriceICP.js";

const api = extjs.connect("https://boundary.ic0.app/");

const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

const useStyles = makeStyles((theme) => ({
  banner: {
    borderRadius: 16,
    marginBottom: 80,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: 200,
    [theme.breakpoints.down("xs")]: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      paddingTop: "100%",
      width: "100%",
    },
  },
  avatar: {
    top: 150,
    margin: "0 auto",
    border: "8px solid #FFF",
    borderRadius: "16px",
    height: "112px",
    width: "112px",
    background: "#FFF",
    ...cssToReactStyleObject(toniqShadows.popupShadow),
    "& > img": {
      borderRadius: "8px",
    },
    [theme.breakpoints.down("xs")]: {
      top: -50,
    }
  },
  nftName: {
    [theme.breakpoints.up("xs")]: {
      ...cssToReactStyleObject(toniqFontStyles.h1Font),
    },
    [theme.breakpoints.down("xs")]: {
      ...cssToReactStyleObject(toniqFontStyles.h2Font),
      fontWeight: "900",
    },
  },
  detailsWrapper: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: "32px",
    marginBottom: "32px",
    [theme.breakpoints.down("sm")]: {
      gap: "16px",
      marginBottom: "16px",
    },
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    flexFlow: "column",
    [theme.breakpoints.down("sm")]: {
      flexFlow: "column-reverse",
      gap: "16px",
    },
  },
  link: {
    cursor: "pointer",
  },
  blurbWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  blurb: {
    textAlign: "center",
    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
  },
  blurbCollapsed: {
    "-webkit-line-clamp": 3,
    overflow: "hidden",
  },
  statsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  stats: {
    minWidth: 80,
    [theme.breakpoints.down("sm")]: {
      minWidth: 103,
    },
  }
}));

export default function CollectionDetails(props) {
  const classes = useStyles();
  const [isBlurbOpen, setIsBlurbOpen] = useState(false);
  const [size, setSize] = useState(false);
  var collection = props.collection;
  var stats = props.stats;

  React.useEffect(() => {
    api.token(collection.canister).size().then(s => {
      setSize(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div
        className={classes.banner}
        style={{
          backgroundImage:
            typeof collection.banner != "undefined" && collection.banner
              ? "url('" + collection.banner + "')"
              : "#aaa",
        }}
      >
        <Avatar
          variant="square"
          className={classes.avatar}
          src={
            typeof collection.avatar != "undefined" && collection.avatar
              ? collection.avatar
              : "/collections/" + collection.canister + ".jpg"
          }
        />
      </div>
      <div className={classes.detailsWrapper}>
        <span className={classes.nftName}>{collection.name}</span>
        <div className={classes.detailsContainer}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm="auto">
              {size ? (
                <ToniqChip text={`Minted: ${numberWithCommas(size)}`} />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} sm="auto">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <Avatar
                  variant="square"
                  style={{
                    height: "24px",
                    width: "24px",
                    borderRadius: "8px",
                    justifyContent: "center",
                  }}
                  src={
                    typeof collection.avatar != "undefined" && collection.avatar
                      ? collection.avatar
                      : "/collections/" + collection.canister + ".jpg"
                  }
                />
                <span
                  style={cssToReactStyleObject(toniqFontStyles.paragraphFont)}
                >
                  Worldwide-webb
                </span>
                {collection.kyc ? (
                  <ToniqIcon
                    icon={CircleWavyCheck24Icon}
                    style={{ color: "#00D093" }}
                  />
                ) : (
                  ""
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <a href={collection.instagram} target="_blank" rel="noreferrer">
                <ToniqIcon icon={BrandInstagram32Icon} />
              </a>
            </Grid>
            <Grid item>
              <a href={collection.twitch} target="_blank" rel="noreferrer">
                <ToniqIcon icon={BrandTwitch32Icon} />
              </a>
            </Grid>
            <Grid item>
              <a href={collection.tiktok} target="_blank" rel="noreferrer">
                <ToniqIcon icon={BrandTiktok32Icon} />
              </a>
            </Grid>
            <Grid item>
              <a href={collection.twitter} target="_blank" rel="noreferrer">
                <ToniqIcon icon={BrandTwitter32Icon} />
              </a>
            </Grid>
          </Grid>
        </div>
        {/*collection?.canister == "oeee4-qaaaa-aaaak-qaaeq-cai" ? <Alert severity="error"><strong>There seems to be an issue with the <a href="https://dashboard.internetcomputer.org/subnet/opn46-zyspe-hhmyp-4zu6u-7sbrh-dok77-m7dch-im62f-vyimr-a3n2c-4ae" target="_blank">oopn46-zyspe... subnet</a> which is causing issues with this collection.</strong></Alert> : ""*/}
        {
          collection.blurb ?
          <div className={classes.blurbWrapper}>
            <div className={`${classes.blurb} ${!isBlurbOpen ? classes.blurbCollapsed : ''}`} dangerouslySetInnerHTML={{ __html: collection.blurb }} />
            <button
              style={{...cssToReactStyleObject(toniqFontStyles.boldParagraphFont), border: "none", background: "none", cursor: "pointer"}}
              onClick={() => setIsBlurbOpen(!isBlurbOpen)}
            >
              {!isBlurbOpen ? 'Read More' : 'Read Less'}
            </button>
          </div> : ""
        }
        {
          stats ? (
            <Grid container spacing={2} justifyContent="center">
              <Grid item className={classes.statsWrapper} style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                <span style={{ textTransform: "uppercase", opacity: "0.64" }}>Volume</span>
                <ToniqChip
                  className={`toniq-chip-secondary ${classes.stats}`}
                  style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                  icon={Icp16Icon}
                  text={icpToString(stats.total, false, true)}
                ></ToniqChip>
              </Grid>
              <Grid item className={classes.statsWrapper} style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                <span style={{ textTransform: "uppercase", opacity: "0.64" }}>Listings</span>
                <ToniqChip
                  className={`toniq-chip-secondary ${classes.stats}`}
                  style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                  text={numberWithCommas(stats.listings)}
                ></ToniqChip>
              </Grid>
              <Grid item className={classes.statsWrapper} style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                <span style={{ textTransform: "uppercase", opacity: "0.64" }}>Avg. Price</span>
                <ToniqChip
                  className={`toniq-chip-secondary ${classes.stats}`}
                  style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                  icon={Icp16Icon}
                  text={icpToString(stats.average, false, true)}
                ></ToniqChip>
              </Grid>
            </Grid>
          ) : ""
        }
      </div>
    </>
  );
};
