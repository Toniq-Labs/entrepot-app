/* global BigInt */
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
  return new Promise((resolve, reject) => {
    var tt = file.type.split("/");
    if (tt[0] == "image") {
      if (!boundBox || boundBox.length != 2){
        throw "You need to give the boundBox"
      }
      var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height);
      var canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d");
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
    } 
    else if (tt[0] == "video") {
      if (!boundBox || boundBox.length != 2){
        throw "You need to give the boundBox"
      }
      var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height);
      var canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d");

      window.gifshot.createGIF({
        'gifWidth': boundBox[0],
        'gifHeight': boundBox[1],
        'video': [URL.createObjectURL(file)]
      },function(obj) {
        if(!obj.error) {
          resolve(dataURItoBlob(obj.image))
        }
      });
      if (false){
        const videoPlayer = document.createElement('video');
        videoPlayer.setAttribute('src', URL.createObjectURL(file));
        videoPlayer.load();
        videoPlayer.addEventListener('error', (ex) => {
          reject("error when loading video file", ex);
        });
        videoPlayer.addEventListener('loadedmetadata', () => {
          setTimeout(() => {
            videoPlayer.currentTime = 0.5;
          }, 200);
          videoPlayer.addEventListener('seeked', () => {
            var scaleRatio = Math.min(...boundBox) / Math.max(videoPlayer.videoWidth, videoPlayer.videoWidth)
            let w = videoPlayer.videoWidth*scaleRatio
            let h = videoPlayer.videoWidth*scaleRatio
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(videoPlayer, 0, 0, w, h);
            ctx.canvas.toBlob(
              blob => {
                resolve(blob);
              },
              "image/png",
              1 /* quality */
            );
          });
        });
      };
    }
    else {
      resolve(dataURItoBlob("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBODNCRDVFM0I2NzExRUNBRDFERUNGRTBFMTMxMDAzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNBODNCRDVGM0I2NzExRUNBRDFERUNGRTBFMTMxMDAzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E4M0JENUMzQjY3MTFFQ0FEMURFQ0ZFMEUxMzEwMDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E4M0JENUQzQjY3MTFFQ0FEMURFQ0ZFMEUxMzEwMDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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"))
    };
  });
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
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
export default function Mint(props) {
  const [canisters, setCanisters] = React.useState([]);
  const [canister, setCanister] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [selectedFiles2, setSelectedFiles2] = React.useState([]);
  const classes = useStyles();
  const chunkSize = 1900000;
  const _updates = async () => {
    const api = extjs.connect("https://boundary.ic0.app/", props.identity);
    var cs = await api.canister("33uhc-liaaa-aaaah-qcbra-cai").getCanisters();
    var newcans = cs.map(p => p.toText());
    setCanisters(newcans);
    if (!canister && newcans.length) {
      setCanister(newcans[0]);
    }
  };
  const selectFiles2 = (e) => {
    setSelectedFiles2(e.target.files);
  };
  const selectFiles = (e) => {
    setSelectedFiles(e.target.files);
  };
  const transferaction = async () => {
    if (!selectedFiles2.length) return props.error("Please select a file first");
    if (!canister) return props.error("Please select a canister first");
    var v = await props.confirm("Are you sure?", "Please ensure your have selected the right file and you clicked the right advanced action - Bulk Transfer");
    if (!v) return;
    props.loader(true, "Attempting Bulk transfer...");
    var API = extjs.connect("https://boundary.ic0.app/", props.identity);
    var _api = API.canister(canister, 'nft');
    var reader = new FileReader();
    reader.onload = function(){
      var data = CSVToArray(reader.result).map(a => [Number(a[0]), a[1]]);
      _api.transfer_bulk(data).then(r => {
        console.log(r);
        props.loader(false);
        if (r.length == 0) {
          props.allert("Success", "Bulk transfer successful");
        } else {          
          props.error(r.length + " transfers failed...");
        };
      }).catch(e => {
        props.loader(false);
        console.log(e);
        props.error("There was an error");
      });
    };
    reader.readAsText(selectedFiles2[0]);
  };
  const listaction = async () => {
    if (!selectedFiles2.length) return props.error("Please select a file first");
    if (!canister) return props.error("Please select a canister first");
    var v = await props.confirm("Are you sure?", "Please ensure your have selected the right file and you clicked the right advanced action - Bulk List");
    if (!v) return;
    props.loader(true, "Attempting Bulk list...");
    var API = extjs.connect("https://boundary.ic0.app/", props.identity);
    var _api = API.canister(canister, 'nft');
    var reader = new FileReader();
    reader.onload = function(){
      var data = CSVToArray(reader.result).map(a => [Number(a[0]), BigInt(a[1])]);
      _api.list_bulk(data).then(r => {
        console.log(r);
        props.loader(false);
        if (r.length == 0) {
          props.alert("Success", "Bulk list successful");
        } else {          
          props.error(r.length + " listings failed...");
        };
      }).catch(e => {
        props.loader(false);
        console.log(e);
        props.error("There was an error");
      });
    };
    reader.readAsText(selectedFiles2[0]);
  };
  const mintaction = async () => {
    if (!selectedFiles.length) return props.error("Please select a file first");
    if (!canister) return props.error("Please select a canister first");
    var API = extjs.connect("https://boundary.ic0.app/", props.identity);
    var _api = API.canister(canister, 'nft');
    for(var i = 0; i < selectedFiles.length; i++) {
      props.loader(true, "Working on "+selectedFiles[i].name);
      var payload = new Uint8Array(await selectedFiles[i].arrayBuffer());
      //var thumb = await generateThumbnail(selectedFiles[i], [300,300]);
      //var tpayload = new Uint8Array(await thumb.arrayBuffer());
      var tb = [{
        ctype : "",//thumb.type,
        //data : [[...tpayload]]
        data : []
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
        to : props.address,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.identity]);
  
  return (
    <>
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
                  <br /><br />
                  <hr />
                  <h2>Advanced Options</h2>
                  <input type="file" onChange={selectFiles2} /><br /><br />
                  <Button onClick={transferaction} variant="contained" color="primary" style={{ backgroundColor: "#003240", color: "white", marginRight:10 }}>Bulk Transfer</Button>
                  <Button onClick={listaction} variant="contained" color="primary" style={{ backgroundColor: "#003240", color: "white", marginRight:10 }}>Bulk List</Button>
                </>
                : ""}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
