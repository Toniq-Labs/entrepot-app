/* global BigInt */
import React, { useState } from "react";
import {
  makeStyles,
  Container,
  Box,
  Grid,
} from "@material-ui/core";
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import OfferForm from './OfferForm';
import { useNavigate } from "react-router-dom";
import extjs from "../ic/extjs.js";
import { EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotGetICPUSD, EntrepotGetOffers, EntrepotCollectionStats } from '../utils';
import {
  useParams
} from "react-router-dom";
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';
import { ToniqIcon, ToniqChip, ToniqButton } from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { ArrowLeft24Icon, CircleWavyCheck24Icon, cssToReactStyleObject, DotsVertical24Icon, toniqColors, toniqFontStyles } from '@toniq-labs/design-system';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import { DropShadowCard } from "../shared/DropShadowCard";
import { Accordion } from "./Accordion";

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const api = extjs.connect("https://boundary.ic0.app/");

const TREASURECANISTER = "yigae-jqaaa-aaaah-qczbq-cai";
const shorten = a => {
  return a.substring(0, 18) + "...";
};
const emptyListing = {
  pricing: "",
  img: "",
};

const Detail = (props) => {
  let { tokenid } = useParams();
  let { index, canister} = extjs.decodeTokenId(tokenid);
  const navigate = useNavigate();
  const [floor, setFloor] = useState((EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : ""));
  const [listing, setListing] = useState(false);
  const [detailsUrl, setDetailsUrl] = useState(false);
  const [transactions, setTransactions] = useState(false);
  const [owner, setOwner] = useState(false);
  const [offers, setOffers] = useState(false);
  const [openOfferForm, setOpenOfferForm] = useState(false);
  const collection = props.collections.find(e => e.canister === canister)
  
  redirectIfBlockedFromEarnFeatures(navigate, collection, props);
  
  const classes = useStyles();
  const reloadOffers = async () => {
    await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offers(tokenid).then(r => {
      setOffers(r.map(a => {return {buyer : a[0], amount : a[1], time : a[2]}}).sort((a,b) => Number(b.amount)-Number(a.amount)));
    });
  }
  const cancelListing = () => {
    props.list(tokenid, 0, props.loader, _afterList);
  };
  const _refresh = async () => {
    reloadOffers();
    await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/token/"+tokenid).then(r => r.json()).then(r => {
      setListing({
        price : BigInt(r.price),
        time : r.time,
      });
      setOwner(r.owner);
      setTransactions(r.transactions);
    });
  }
  const _afterList = async () => {
    await _refresh();
  };
  const _afterBuy = async () => {
    await reloadOffers();
    await _refresh();
  }
  const closeOfferForm = () => {
    reloadOffers();
    setOpenOfferForm(false);
  };
  const getFloorDelta = amount => {
    if (!floor) return "-";
    var fe = (floor*100000000);
    var ne = Number(amount);
    if (ne > fe){
      return (((ne-fe)/ne)*100).toFixed(2)+"% above";
    } else if (ne < fe) {      
      return ((1-(ne/fe))*100).toFixed(2)+"% below";
    } else return "-"
  };
  const makeOffer = async () => {
    setOpenOfferForm(true);
  };
  
  
  useInterval(_refresh, 2  * 1000);
  useInterval(() => {
    var nf = (EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : "");
    setFloor(nf);
  }, 10 * 1000);
  
  const cancelOffer = async () => {
    props.loader(true, "Cancelling offer...");
    const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
    await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").cancelOffer(tokenid);
    await reloadOffers();
    props.loader(false);
    props.alert(
      "Offer cancelled",
      "Your offer was cancelled successfully!"
    );
  };

  const getDetailsUrl = async (url, regExp) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const text = await blob.text();
    const simplifiedText = text.replace('\n', ' ').replace(/\s{2,}/, ' ');
    setDetailsUrl(simplifiedText.match(regExp)[1]);
  }

  const imageStyles = cssToReactStyleObject(css`
    background-image: url('${unsafeCSS(detailsUrl)}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 16px;
    padding-top: 100%;
    width: 100%;
  `); 

  const extractEmbeddedImage = (svgUrl, classes) => {
    getDetailsUrl(svgUrl, /image href="([^"]+)"/);

    return (
      <div className={classes.nftImage}>
        <div style={imageStyles} />
      </div>
    );
  }
  
  const extractEmbeddedVideo = (iframeUrl, classes) => {
      getDetailsUrl(iframeUrl, /source src="([^"]+)"/);
      if(detailsUrl){
        return (
          <video width="100%" autoPlay muted loop>
            <source src={detailsUrl} type="video/mp4" />
          </video>
        );
      }
    }
  }
  

  const displayImage = tokenid => {
    let { index, canister} = extjs.decodeTokenId(tokenid);
    switch(canister){
      
      // for generative collections where assets are all stored on the same canister
      // case "zvycl-fyaaa-aaaah-qckmq-cai": IC Apes doesn't work
      case "7gvfz-3iaaa-aaaah-qcsbq-cai":
      case "bxdf4-baaaa-aaaah-qaruq-cai":
      case "dylar-wyaaa-aaaah-qcexq-cai":
      case "jxpyk-6iaaa-aaaam-qafma-cai":
      case "e3izy-jiaaa-aaaah-qacbq-cai":
      case "3mttv-dqaaa-aaaah-qcn6q-cai":
      case "yrdz3-2yaaa-aaaah-qcvpa-cai":
      case "3bqt5-gyaaa-aaaah-qcvha-cai":
      case "unssi-hiaaa-aaaah-qcmya-cai":
      case "sr4qi-vaaaa-aaaah-qcaaq-cai":
      case "nbg4r-saaaa-aaaah-qap7a-cai":
      case "gtb2b-tiaaa-aaaah-qcxca-cai":
      case "qbc6i-daaaa-aaaah-qcywq-cai":
      case "qjwjm-eaaaa-aaaah-qctga-cai":
      case "j3dqa-byaaa-aaaah-qcwfa-cai":
      case "2l7rh-eiaaa-aaaah-qcvaa-cai":
      case "73xld-saaaa-aaaah-qbjya-cai":
      case "t2mog-myaaa-aaaal-aas7q-cai":
        return (
          <div className={classes.nftImage}>
            <div style={imageStyles} />
          </div>
        );
        break;
      
      // for interactive NFTs or videos
      //case "xcep7-sqaaa-aaaah-qcukq-cai":
      //case "rqiax-3iaaa-aaaah-qcyta-cai":
      case "dv6u3-vqaaa-aaaah-qcdlq-cai":
      case "eb7r3-myaaa-aaaah-qcdya-cai":
      case "pk6rk-6aaaa-aaaae-qaazq-cai":
      case "dhiaa-ryaaa-aaaae-qabva-cai":
      case "mk3kn-pyaaa-aaaah-qcoda-cai":
      case "jeghr-iaaaa-aaaah-qco7q-cai":
      case "er7d4-6iaaa-aaaaj-qac2q-cai":
      case "poyn6-dyaaa-aaaah-qcfzq-cai":
      case "crt3j-mqaaa-aaaah-qcdnq-cai":
      case "nges7-giaaa-aaaaj-qaiya-cai":
      case "ag2h7-riaaa-aaaah-qce6q-cai":
      case "ri5pt-5iaaa-aaaan-qactq-cai":
      case "sbcwr-3qaaa-aaaam-qamoa-cai":
      case "sbcwr-3qaaa-aaaam-qamoa-cai":
      case "3db6u-aiaaa-aaaah-qbjbq-cai": // drip test
      case "5stux-vyaaa-aaaam-qasoa-cai":
      case "e4ca6-oiaaa-aaaai-acm2a-cai":
      case TREASURECANISTER:
        return (
          <iframe
            frameBorder="0"
            src={EntrepotNFTImage(canister, index, tokenid, true)}
            alt=""
            className={classes.nftImage}
          />
        );
        break;
      
      // for videos that don't fit in the iframe and need a video tag
      case "rqiax-3iaaa-aaaah-qcyta-cai":
      case "xcep7-sqaaa-aaaah-qcukq-cai":
      case "x4oqm-bqaaa-aaaam-qahaq-cai":
      case "tco7x-piaaa-aaaam-qamiq-cai":
        return extractEmbeddedVideo(EntrepotNFTImage(canister, index, tokenid, true), classes);
      
      case "skjpp-haaaa-aaaae-qac7q-cai":
        return <video width="100%" autoPlay muted loop>
            <source src="https://skjpp-haaaa-aaaae-qac7q-cai.raw.ic0.app/?cc=0&tokenid=uthmp-rikor-uwiaa-aaaaa-beaax-4aqca-aaaaa-a" type="video/mp4" />
          </video>;
      
      // for pre-generated images residing on asset canisters
      // case "rw623-hyaaa-aaaah-qctcq-cai": doesn't work for OG medals 
      case "6wih6-siaaa-aaaah-qczva-cai":
      case "6km5p-fiaaa-aaaah-qczxa-cai":
      case "s36wu-5qaaa-aaaah-qcyzq-cai":
      case "bzsui-sqaaa-aaaah-qce2a-cai":
      case "txr2a-fqaaa-aaaah-qcmkq-cai":
      case "ah2fs-fqaaa-aaaak-aalya-cai":
      case "z7mqv-liaaa-aaaah-qcnqa-cai":
      case "erpx2-pyaaa-aaaah-qcqsq-cai":
      case "gikg4-eaaaa-aaaam-qaieq-cai":
      case "bapzn-kiaaa-aaaam-qaiva-cai":
      case "4wiph-kyaaa-aaaam-qannq-cai":
      case "3cjkh-tqaaa-aaaam-qan6a-cai":
      case "lcgbg-kaaaa-aaaam-qaota-cai":
      case "j7n3m-7iaaa-aaaam-qarza-cai":
      case "zydwz-laaaa-aaaam-qasuq-cai":
      case "xgket-maaaa-aaaam-qatwq-cai":
      case "wlea5-diaaa-aaaam-qatra-cai":
      case "vvvht-eyaaa-aaaam-qatya-cai":
        return extractEmbeddedImage(EntrepotNFTImage(canister, index, tokenid, true), classes);
      
      // default case is to just use the thumbnail on the detail page
      default:
        return (
          <div className={classes.nftImage}>
            <div style={imageStyles} />
          </div>
        );
        break;
    }
  };

  const attributes = [
    {
      groupName: 'Group #1',
      data: [
        {
          label: 'Background',
          value: '#5452',
          desc: '5% Have This'
        },
        {
          label: 'Background',
          value: '#5462',
          desc: '17% Have This'
        },
        {
          label: 'Background',
          value: '#6312',
          desc: '3% Have This'
        },
        {
          label: 'Background',
          value: '#1123',
          desc: '76% Have This'
        }
      ]
    },
    {
      groupName: 'Group #2',
      data: [
        {
          label: 'Body Color',
          value: '#5631',
          desc: '4% Have This'
        },
        {
          label: 'Body Color',
          value: '#2123',
          desc: '98% Have This'
        },
        {
          label: 'Body Color',
          value: '#6631',
          desc: '7% Have This'
        },
        {
          label: 'Body Color',
          value: '#5643',
          desc: '21% Have This'
        }
      ]
    }
  ]
  
  React.useEffect(() => {
    props.loader(true);
    _refresh().then(() => props.loader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth="xl" className={classes.container}>
        <button
          variant="text"
          onClick={() => navigate(-1)}
          className={classes.removeNativeButtonStyles}
        >
          <Grid container spacing={1}>
            <Grid item>
              <ToniqIcon icon={ArrowLeft24Icon}>Return to Collection</ToniqIcon>
            </Grid>
            <Grid item>
              <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>Return to Collection</span>
            </Grid>
          </Grid>
        </button>
        <DropShadowCard>
          <Container className={classes.nftDescWrapper} style={{maxWidth: 1312}}>
            <Box className={classes.nftDescHeader}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} className={classes.imageWrapper}>
                  {displayImage(tokenid)}
                </Grid>
                <Grid item xs={12} sm={6} className={classes.nftDesc}>
                  <div className={classes.nftDescContainer1}>
                    <span style={{...cssToReactStyleObject(toniqFontStyles.h2Font), display: "block"}}>{collection.name} #{EntrepotNFTMintNumber(collection.canister, index)}</span>
                    <Box style={{cursor: "pointer"}}>
                      <ToniqChip text="View NFT OnChain" onClick={() => {
                        window.open(EntrepotNFTLink(collection.canister, index, tokenid), '_blank')
                      }}/>
                    </Box>
                    <span style={{...cssToReactStyleObject(toniqFontStyles.labelFont), opacity: "0.64"}}>COLLECTION</span>
                  </div>
                  <div className={classes.nftDescContainer2}>
                    <div style={{ display: "flex", alignItems: "center"}}>
                      <button
                        className={classes.removeNativeButtonStyles}
                        style={{...cssToReactStyleObject(toniqFontStyles.paragraphFont), marginRight: "11px"}}
                        onClick={() => {
                          navigate("/marketplace/"+collection.route)
                        }}
                      >
                        {collection.name}
                      </button>
                      <ToniqIcon icon={CircleWavyCheck24Icon} style={{ color: "#00D093" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center"}}>
                      <div className={classes.nftDescContainer3}>
                        {listing.price ? 
                        <>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <PriceICP large={true} volume={true} clean={false} size={20} price={listing.price} />
                            <span style={{ ...cssToReactStyleObject(toniqFontStyles.paragraphFont), marginLeft: "8px" }}>(<PriceUSD price={EntrepotGetICPUSD(listing.price)} />)</span>
                          </div>
                        </> : <></>
                        }
                        <div style={{ display: "flex", gap: "16px" }}>
                          <ToniqButton text="Buy Now" onClick={() => {
                            props.buyNft(collection.canister, index, listing, _afterBuy);
                          }}/>
                          <ToniqButton text="Make Offer" className="toniq-button-secondary" onClick={() => {
                            makeOffer();
                          }}/>
                          <ToniqButton title="More Options" icon={DotsVertical24Icon} className="toniq-button-secondary" />
                        </div>
                      </div>
                    </div>
                    {owner ?
                    <span className={classes.ownerWrapper}>
                      {`Owned by `}
                      <span className={classes.ownerName}>ChavezOG</span>
                      : &nbsp;
                      <span className={classes.ownerAddress} onClick={() => {
                        window.open(`https://dashboard.internetcomputer.org/account/"${owner}`, '_blank')
                      }}>{shorten(owner)}</span>
                    </span> : <></>
                    }
                  </div>
                </Grid>
              </Grid>
            </Box>
            <Accordion title="Offers" open={true}>
              <span className={classes.offerDesc}>There are currently no offers!</span>
            </Accordion>
            <Accordion title="Attributes" open={true}>
              <Grid container className={classes.attributeWrapper}>
                {attributes.map((attribute) => (
                  <Grid item key={attribute.groupName} xs={12}>
                    <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>{attribute.groupName}</span>
                    <Grid container className={classes.attributeWrapper} spacing={2}>
                      {attribute.data.map((data) => (
                        <Grid item key={data.value} xs={12} md={3}>
                          <DropShadowCard style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0"}}>
                            <span className={classes.attributeHeader}>
                              <span style={cssToReactStyleObject(toniqFontStyles.paragraphFont)}>{data.label}</span>
                            </span>
                            <Grid container style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 8px 16px 8px" }} spacing={2}>
                              <Grid item>
                                <span style={{...cssToReactStyleObject(toniqFontStyles.h2Font), ...cssToReactStyleObject(toniqFontStyles.boldFont)}}>{data.value}</span>
                              </Grid>
                              <Grid item>
                                <ToniqChip className="toniq-chip-secondary" text={data.desc}></ToniqChip>
                              </Grid>
                            </Grid>
                          </DropShadowCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Accordion>
            <Accordion title="History" open={true}>
              History
            </Accordion>
          </Container>
        </DropShadowCard>
      </Container>
      <OfferForm floor={floor} address={props.account.address} balance={props.balance} complete={reloadOffers} identity={props.identity} alert={props.alert} open={openOfferForm} close={closeOfferForm} loader={props.loader} error={props.error} tokenid={tokenid} />
    </>
  );
};
export default Detail;

const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: "#ffffff",
    marginLeft: "10px",
    color: "#2B74DC",
    fontWeight: "bold",
    boxShadow: "none",
    border: "1px solid #2B74DC",
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0px",
      marginTop: "10px",
    },
  },
  button: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  typo: {
    fontWeight: "bold",
    padding: "20px 0px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  personal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  container: {
    padding: "20px 120px 120px",
    [theme.breakpoints.down("md")]: {
      padding: "110px 66px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "5px 5px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "5px 5px",
    },
  },
  nftImage: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    flexShrink: "0",
    maxWidth: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  iconsBorder: {
    border: "1px solid #E9ECEE",
    borderRadius: "5px",
  },
  div: {
    display: "flex",
    padding: "10px",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottom: "1px solid #E9ECEE",
    borderRadius: "5px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: "bold",
    marginLeft : 20
  },
  removeNativeButtonStyles: {
    background: "none",
    padding: 0,
    margin: 0,
    border: "none",
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
    textTransform: "inherit",
    textDecoration: "inherit",
    "-webkit-tap-highlight-color": "transparent",
  },
  nftDescWrapper: {
    [theme.breakpoints.up("sm")]: {
      padding: "32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "16px",
    },
  },
  nftDescHeader: {
    [theme.breakpoints.up("md")]: {
      margin: "16px 0"
    },
  },
  nftDesc: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("lg")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "left",
    },
  },
  nftDescContainer1: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "8px",
    [theme.breakpoints.up("sm")]: {
      gap: "32px",
    },
    [theme.breakpoints.down("xs")]: {
      gap: "16px",
    },
  },
  nftDescContainer2: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "8px",
    [theme.breakpoints.up("sm")]: {
      gap: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      gap: "16px",
    },
  },
  nftDescContainer3: {
    gap: "16px",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
    },
    [theme.breakpoints.down("md")]: {
      display: "grid",
    },
  },
  ownerWrapper: {
    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
  },
  ownerName: {
    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
    color: toniqColors.pageInteraction.foregroundColor,
  },
  ownerAddress: {
    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    cursor: "pointer",
    "&:hover": {
      color: toniqColors.pageInteraction.foregroundColor,      
    },
  },
  hoverText: {
    "&:hover": {
      color: toniqColors.pageInteraction.foregroundColor,      
    },
  },
  imageWrapper: {
    [theme.breakpoints.up("md")]: {
      display: "grid",
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  offerDesc: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      margin: "32px 0"
    },
    [theme.breakpoints.down("md")]: {
      margin: "16px 0"
    },
  },
  attributeWrapper: {
    [theme.breakpoints.up("md")]: {
      marginTop: "16px",
      marginBottom: "16px"
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "8px",
      marginBottom: "8px"
    },
  },
  attributeHeader: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#F1F3F6",
    width: "100%",
    padding: "4px 0",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },
}));

