import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import PriceICP from './PriceICP';
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Tooltip from '@material-ui/core/Tooltip';
import extjs from "../ic/extjs.js";
import { makeStyles } from "@material-ui/core";
import { cssToReactStyleObject, toniqFontStyles, toniqShadows, BrandInstagram32Icon, BrandTwitch32Icon, BrandTiktok32Icon, BrandTwitter32Icon, CircleWavyCheck24Icon } from "@toniq-labs/design-system";
import { ToniqChip, ToniqIcon } from '@toniq-labs/design-system/dist/esm/elements/react-components';
const api = extjs.connect("https://boundary.ic0.app/");
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

const useStyles = makeStyles((theme) => ({
  banner: {
    borderRadius: 5,
    marginBottom: 70,
    backgroundSize: "cover", 
    height: 200,
    [theme.breakpoints.down("xs")]: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      paddingTop: "100%",
      width: "100%",
    },
  },
  stats: {
    marginTop: -70,
    minHeight: 81,
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
    },
  },
  socials: {
    padding: 0,
    listStyle: "none",
    "& li" : {
      display: "inline-block",
      margin: "0 10px",
    },
  },
  avatar: {
    top: 150,
    margin: "0 auto",
    border: "8px solid #FFF",
    borderRadius: "8px",
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
      marginBlockStart: "32px",
      marginBlockEnd: "32px",
    },
    [theme.breakpoints.down("xs")]: {
      ...cssToReactStyleObject(toniqFontStyles.h2Font),
      fontWeight: "900",
      marginBlockStart: "16px",
      marginBlockEnd: "16px",
    },
  },
  detailsWrapper: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
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
  }
}));
export default function CollectionDetails(props) {
  const classes = useStyles();
  const [blurbElement, setBlurbElement] = useState(false);
  const [collapseBlurb, setCollapseBlurb] = useState(false);
  const [isBlurbOpen, setIsBlurbOpen] = useState(false);
  const [size, setSize] = useState(false);
  
  var stats = props.stats;
  var collection = props.collection;
  console.log(collection)
  React.useEffect(() => {
    if (blurbElement.clientHeight > 110) {
      setCollapseBlurb(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blurbElement]);
  React.useEffect(() => {
    api.token(collection.canister).size().then(s => {
      setSize(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<>
    <div className={classes.banner} style={{backgroundImage: (typeof collection.banner != 'undefined' && collection.banner ? "url('" + collection.banner + "')" : "#aaa")}}>
      <Avatar variant="square" className={classes.avatar} src={(typeof collection.avatar != 'undefined' && collection.avatar ? collection.avatar : "/collections/" + collection.canister + ".jpg")} />
    </div>
    {/* <Grid className={classes.stats} container direction="row" alignItems="center" spacing={2}>
      <Grid item md={4} xs={12} style={{textAlign:"center"}}>
        {stats === false ? <strong>Loading Statistics...</strong> :
        <>{stats === null ? "" :
          <Grid container direction="row"  style={{textAlign:"center"}} justifyContent="center" alignItems="center" spacing={2}>
            <Grid style={{borderRight:"1px dashed #ddd"}} item md={4}>
              <span style={{color:"#00d092"}}>Volume</span><br />
              <strong><PriceICP size={20} volume={true} clean={true} price={stats.total} /></strong>
            </Grid>
            <Grid style={{borderRight:"1px dashed #ddd"}} item md={4}>
              <span style={{color:"#00d092"}}>Listings</span><br />
              <strong>{stats.listings}</strong>
            </Grid>
            <Grid item md={4}>
              <span style={{color:"#00d092"}}>Avg Price</span><br />
              <strong>{stats.average == "-" ? "-" : <PriceICP size={20} volume={true} clean={true} price={stats.average} />}</strong>
            </Grid>
          </Grid>}
        </>}
      </Grid>
      <Grid item md={4} xs={12}>
      </Grid>
      <Grid item md={4} xs={12} style={{textAlign:"center"}}>
        <ul className={classes.socials}>
          <li><a href={"https://icscan.io/nft/collection/"+collection.canister} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/icscan.png"} /></a></li>
          {['telegram', 'twitter', 'medium', 'discord', 'dscvr', 'distrikt'].filter(a => collection.hasOwnProperty(a) && collection[a]).map(a => {
            return (<li key={a}><a href={collection[a]} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/"+a+".png"} /></a></li>);
          })}
        </ul>
      </Grid>
    </Grid> */}
    <div className={classes.detailsWrapper}>
      <h1 className={classes.nftName}>{collection.name}</h1>
      <div className={classes.detailsContainer}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm="auto">
            {size ? <ToniqChip text={`Minted: ${numberWithCommas(size)}`} /> : ""}
          </Grid>
          <Grid item xs={12} sm="auto" spacing={2}>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px"}}>
              <Avatar variant="square" style={{ height: "24px", width: "24px", borderRadius: "8px", justifyContent: "center" }} src={(typeof collection.avatar != 'undefined' && collection.avatar ? collection.avatar : "/collections/" + collection.canister + ".jpg")} />
              <span style={cssToReactStyleObject(toniqFontStyles.paragraphFont)}>Worldwide-webb</span>
              {['kyc'].filter(a => collection.hasOwnProperty(a) && collection[a]).map(a => {
                return (<ToniqIcon icon={CircleWavyCheck24Icon} style={{ color: "#00D093" }} />);
              })}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <ToniqIcon icon={BrandInstagram32Icon} className={classes.link} onClick={() => {
              if (collection.instagram) window.open(`${collection.instagram}`, '_blank');
            }} />
          </Grid>
          <Grid item>
            <ToniqIcon icon={BrandTwitch32Icon} className={classes.link} onClick={() => {
              if (collection.twitch)  window.open(`${collection.twitch}`, '_blank')
            }} />
          </Grid>
          <Grid item>
            <ToniqIcon icon={BrandTiktok32Icon} className={classes.link} onClick={() => {
              if (collection.tiktok)  window.open(`${collection.tiktok}`, '_blank')
            }} />
          </Grid>
          <Grid item>
            <ToniqIcon icon={BrandTwitter32Icon} className={classes.link} onClick={() => {
              if (collection.twitter)  window.open(`${collection.twitter}`, '_blank')
            }} />
          </Grid>
        </Grid>
        {/*collection?.canister == "oeee4-qaaaa-aaaak-qaaeq-cai" ? <Alert severity="error"><strong>There seems to be an issue with the <a href="https://dashboard.internetcomputer.org/subnet/opn46-zyspe-hhmyp-4zu6u-7sbrh-dok77-m7dch-im62f-vyimr-a3n2c-4ae" target="_blank">oopn46-zyspe... subnet</a> which is causing issues with this collection.</strong></Alert> : ""*/}
        <div ref={e => { setBlurbElement(e); }} style={{...(collapseBlurb && !isBlurbOpen ? {maxHeight:110, wordBreak: "break-word", WebkitMask : "linear-gradient(rgb(255, 255, 255) 45%, transparent)"} : {}), overflow:"hidden",fontSize: "1.2em" }} dangerouslySetInnerHTML={{ __html : collection?.blurb }}></div>
        {collapseBlurb ? (
        <Button fullWidth endIcon={(!isBlurbOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />)} onClick={() => setIsBlurbOpen(!isBlurbOpen)}></Button>
        ) : ""}
      </div>
    </div>
  </>);
};
