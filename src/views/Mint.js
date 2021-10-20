import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Container } from "@material-ui/core";
import Navbar from "../containers/Navbar";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { clipboardCopy } from '../utils';

import { StoicIdentity } from "ic-stoic-identity";
import extjs from "../ic/extjs.js";
function generateThumbnail(file, boundBox){
  if (!boundBox || boundBox.length != 2){
    throw "You need to give the boundBox"
  }
  var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height);
  var canvas = document.createElement("canvas")
  var tt = file.type.split("/");
  const ctx = canvas.getContext("2d");
  if (tt[0] == "image") {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
              var scaleRatio = Math.min(...boundBox) / Math.max(img.width, img.height)
              let w = img.width*scaleRatio
              let h = img.height*scaleRatio
              canvas.width = boundBox[0];
              canvas.height = boundBox[1];
              ctx.drawImage(img, (boundBox[0]-w)/2, (boundBox[1]-h)/2, w, h);
              ctx.canvas.toBlob(
                blob => {
                  resolve(blob);
                },
                "image/png",
                1 /* quality */
              );
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(file);
    })
  } 
  // else if (tt[0] == "video") {
    // return new Promise((resolve, reject) => {
      // gifshot.createGIF({
        // 'gifWidth': boundBox[0],
        // 'gifHeight': boundBox[1],
        // 'video': [URL.createObjectURL(file)]
      // },function(obj) {
        // if(!obj.error) {
          // resolve(dataURItoBlob(obj.image))
        // }
      // });
      // if (false){
        // const videoPlayer = document.createElement('video');
        // videoPlayer.setAttribute('src', URL.createObjectURL(file));
        // videoPlayer.load();
        // videoPlayer.addEventListener('error', (ex) => {
          // reject("error when loading video file", ex);
        // });
        // videoPlayer.addEventListener('loadedmetadata', () => {
          // setTimeout(() => {
            // videoPlayer.currentTime = 0.5;
          // }, 200);
          // videoPlayer.addEventListener('seeked', () => {
            // var scaleRatio = Math.min(...boundBox) / Math.max(videoPlayer.videoWidth, videoPlayer.videoWidth)
            // let w = videoPlayer.videoWidth*scaleRatio
            // let h = videoPlayer.videoWidth*scaleRatio
            // canvas.width = w;
            // canvas.height = h;
            // ctx.drawImage(videoPlayer, 0, 0, w, h);
            // ctx.canvas.toBlob(
              // blob => {
                // resolve(blob);
              // },
              // "image/png",
              // 1 /* quality */
            // );
          // });
        // });
      // };
    // });
  // }
}
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}
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
export default function Mint(props) {
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [accounts, setAccounts] = React.useState(false);
  const [canisters, setCanisters] = React.useState([]);
  const [canister, setCanister] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [currentAccount, setCurrentAccount] = React.useState(0);
  const classes = useStyles();
  const chunkSize = 1048576;
  const _updates = async () => {
    const api = extjs.connect("https://boundary.ic0.app/", identity);
    var cs = await api.canister("33uhc-liaaa-aaaah-qcbra-cai").getCanisters();
    var newcans = cs.map(p => p.toText());
    setCanisters(newcans);
    if (!canister && newcans.length) {
      setCanister(newcans[0]);
    }
  };
  const selectFiles = (e) => {
    setSelectedFiles(e.target.files);
  };
  const mintaction = async () => {
    if (!selectedFiles.length) return props.error("Please select a file first");
    if (!canister) return props.error("Please select a canister first");
    var API = extjs.connect("https://boundary.ic0.app/", identity);
    var _api = API.canister(canister, 'nft');
    for(var i = 0; i < selectedFiles.length; i++) {
      props.loader(true, "Working on "+selectedFiles[i].name);
      var payload = new Uint8Array(await selectedFiles[i].arrayBuffer());
      var thumb = await generateThumbnail(selectedFiles[i], [300,300]);
      var tpayload = new Uint8Array(await thumb.arrayBuffer());
      var tb = [{
        ctype : thumb.type,
        data : [[...tpayload]]
      }]
      var pl = [...payload];
      var args = {
        name : selectedFiles[i].name.toLowerCase(),
        thumbnail : tb,
      };
      if (pl.length <= chunkSize) {
        props.loader(true, "Uploading "+selectedFiles[i].name+" as one chunk");
        args.payload = {
          ctype : selectedFiles[i].type,
          data : [pl]
        }
        var assetId = await _api.addAsset(args);
      } else {
        var n = Math.ceil(pl.length/chunkSize);
        props.loader(true, "Uploading "+selectedFiles[i].name+" as "+n+" Chunks");
        args.payload = {
          ctype : selectedFiles[i].type,
          data : [pl.splice(0, chunkSize)]
        }
        props.loader(true, "Sending Chunk 1/" + n);
        var assetId = await _api.addAsset(args);
        var c = 1;
        while (pl.length > chunkSize) {
          c++;
          props.loader(true, "Sending Chunk " + c + "/" + n);
          await _api.streamAsset(assetId, false, pl.splice(0, chunkSize));          
        }
        props.loader(true, "Sending final Chunk");
        await _api.streamAsset(assetId, false, pl);          
      }
      props.loader(true, "Asset loaded, minting NFT...");
      var r = await _api.mintNFT({
        to : address,
        asset : assetId
      });
      console.log(r);
    }
    props.loader(false);
    props.alert(
      "Minting complete",
      "Your NFTs have been minted and sent to you"
    );
  };
  const changeCanister = async (event) => {
    setCanister(event.target.value);
  };
  useInterval(_updates, 30 * 1000);
  React.useEffect(() => {
    _updates();
    var t = localStorage.getItem("_loginType");
    if (t) {
      switch (t) {
        case "stoic":
          StoicIdentity.load().then(async (identity) => {
            if (identity !== false) {
              //ID is a already connected wallet!
              setIdentity(identity);
              identity.accounts().then((accs) => {
                setAccounts(JSON.parse(accs));
              });
            }
          });
          break;
        case "plug":
          (async () => {
            const connected = await window.ic.plug.isConnected();
            if (connected) {
              if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({
                  whitelist: ["33uhc-liaaa-aaaah-qcbra-cai"],
                });
              }
              var id = await window.ic.plug.agent._identity;
              setIdentity(id);
              setAccounts([
                {
                  name: "PlugWallet",
                  address: extjs.toAddress(id.getPrincipal().toText(), 0),
                },
              ]);
            }
          })();
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    _updates();
    if (identity) {
      setLoggedIn(true);
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
    } else {
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  
  return (
    <>
      <Navbar />
      <div className={classes.main}>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2}>
            <Grid style={{ textAlign: "center" }} item xs={12} sm={12} md={12}>
              <div>
                <h1>
                {canisters.length ?
                <>
                  Select Canister:
                  <FormControl>
                    <Select
                      style={{
                        marginLeft: 10,
                        fontSize: "0.95em",
                        fontWeight: "bold",
                        paddingBottom: 0,
                        color: "#00d092",
                      }}
                      value={canister}
                      onChange={changeCanister}
                    >
                      {canisters.map((c) => {
                        return (
                          <MenuItem
                            key={c}
                            value={c}
                          >{c}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </> : "You have no loaded Canisters" }
                </h1>
                {canister ?
                <>
                <input type="file" onChange={selectFiles} multiple /><br /><br />
                <Button onClick={mintaction} variant="contained" color="primary" style={{ backgroundColor: "#003240", color: "white", marginRight:10 }}>Mint as NFTs</Button>
                <Button href={"https://"+canister+".raw.ic0.app"} target="_blank" variant="contained" color="primary" style={{ backgroundColor: "#003240", color: "white", marginRight:10 }}>View Canister</Button>
                <Button onClick={() => clipboardCopy(canister)} target="_blank" variant="contained" color="primary" style={{ backgroundColor: "#003240", color: "white" }}>Copy Canister ID</Button>
                </>
                : ""}
              </div>
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
