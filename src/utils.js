import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://boundary.ic0.app/");
const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
};
function fallbackCopyTextToClipboard(text) {
  
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
var _stats = [], _rate = false, _liked = [], _identity= false, tokenLikes = {}, lastUpdate = false;
const _getStats = async () => {
    var collections = (await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/collections").then(r => r.json())).map(a => ({...a, canister : a.id})).filter(a => _isCanister(a.canister));
    var pxs = [];
    var _ts = [];
    for(var i = 0; i < collections.length; i++){
      if (!collections[i].market) {
        _ts.push({
          canister : collections[i].canister,
          stats : false
        });
      } else {
        pxs.push((c => api.token(c).stats().then(r => {
          return {canister : c, stats : r}
        }))(collections[i].canister));
      }
    };
    const results = await Promise.all(pxs.map(p => p.catch(e => e)));
    const validResults = results.filter(result => !(result instanceof Error));
    _stats = validResults.concat(_ts);
    return _stats;
    // (c => {
      // api.token(c).stats().then(r => {
        // res = {
          // canister : c,
          // stats : r
        // };
        // _stats.push(res);
      // }).catch(e => {
        // res = {
          // canister : c,
          // stats : false
        // };
        // _stats.push(res);
      // });
    // })(collections[i].canister);
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
const 
clipboardCopy = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
},
isHex = (h) => {
  var regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(h);
},
compressAddress = (a) => {
  if (!a) return "";
  if (a.length === 64 && isHex(a)) return a.substr(0, 16) + "...";
  else {
    var pp = a.split("-");
    if (pp.length <= 4) return a;
    else {
      return pp[0] + "-" + pp[1].substr(0, 3) + "..." + pp[pp.length-3].substr(2) + "-" + pp[pp.length-2] + "-" + pp[pp.length-1];
    }
  }
},
displayDate = (d) => {
  return new Date(d).toString();
},
EntrepotNFTImage = (collection, index, id, fullSize, ref) => {
  if (typeof ref == 'undefined') ref = "";
  else ref = "?"+ref;
  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai") return "https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.ic0.app/nft/" + index;
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(index);
  if (collection === "pk6rk-6aaaa-aaaae-qaazq-cai") {
    if (fullSize) {      
      return "https://"+collection+".raw.ic0.app/?tokenid=" + id;
    } else {
      return "https://images.entrepot.app/t/7budn-wqaaa-aaaah-qcsba-cai/" + id;
    };
  }
  if (collection === "dhiaa-ryaaa-aaaae-qabva-cai") {
    if (fullSize) {      
      return "https://"+collection+".raw.ic0.app/?tokenid=" + id;
    } else {
      return "https://images.entrepot.app/tnc/qtejr-pqaaa-aaaah-qcyvq-cai/" + id;
    };
  }
  if (fullSize) {
    return "https://"+collection+".raw.ic0.app/?cc=0&tokenid=" + id;
  } else {
    //add collections with wearables or other dynamic traits here
    //these images will not be cached
    if (collection === "sbcwr-3qaaa-aaaam-qamoa-cai") return "https://images.entrepot.app/tnc/"+collection+"/" + id + ref;
    if (collection === "yrdz3-2yaaa-aaaah-qcvpa-cai") return "https://images.entrepot.app/tnc/"+collection+"/" + id + ref;
    if (collection === "rw7qm-eiaaa-aaaak-aaiqq-cai") return "https://images.entrepot.app/tnc/"+collection+"/" + id + ref;
    if (collection === "5movr-diaaa-aaaak-aaftq-cai") return "https://images.entrepot.app/tnc/"+collection+"/" + id + ref;
    //end of section

    if (collection === "6wih6-siaaa-aaaah-qczva-cai") return "https://"+collection+".raw.ic0.app/?cc"+Date.now()+"&type=thumbnail&tokenid=" + id + ref;
    return "https://images.entrepot.app/t/"+collection+"/" + id;
    //return "https://"+collection+".raw.ic0.app/?cc=0&type=thumbnail&tokenid=" + id;
  }
},
EntrepotNFTLink = (collection, index, id) => {
  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai") return "https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.ic0.app/nft/" + index;
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(index);
  return "https://"+collection+".raw.ic0.app/?tokenid=" + id;
},
EntrepotDisplayNFT = (collection, tokenid, imgLoaded, image, onload) => {
  var avatarImgStyle = {
    position: "absolute",
    top: "0%",
    left: "0%",
    width: "100%",
    height: "100%",
    margin: "0 auto",
    objectFit: "cover",
    borderRadius:"4px",
  }
  var avatarLoaded = {
    position: "absolute",
    top: "15%",
    left: "15%",
    width: "70%",
    height: "70%",
    margin: "0 auto", 
  }
  if (collection == "zhibq-piaaa-aaaah-qcvka-cai") avatarImgStyle.objectFit = "fill";
  if (collection == "jeghr-iaaaa-aaaah-qco7q-cai") return (<embed alt={tokenid} style={{ ...avatarImgStyle, display: "block"}} src={image}/>);
  return (<>
    <img alt={tokenid} style={{ ...avatarImgStyle, display: imgLoaded ? "block" : "none" }} src={image} onLoad={onload} />
    <Skeleton
      style={{
        ...avatarLoaded,
        display: imgLoaded ? "none" : "block",
      }}
      variant="rect"
    />
  </>);
},
EntrepotNFTMintNumber = (collection, index, id) => {
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return index;
  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai") return index;
  return index + 1;
},
EntrepotAllStats = () => {
  return _stats;
},
EntrepotCollectionStats = c => {
  var s = _stats.filter(a => a.canister === c);
  if (s.length) return s[0].stats;
  else return false;
},
EntrepotUpdateStats = async () => {
  await _getStats();
  return _stats;
},
EntrepotUpdateUSD = async () => {
  if (!lastUpdate || ((Date.now()-lastUpdate) > (10*60*1000))) {
    lastUpdate = Date.now();
    var b = await api.canister("rkp4c-7iaaa-aaaaa-aaaca-cai").get_icp_xdr_conversion_rate();
    var b2 = await fetch("https://free.currconv.com/api/v7/convert?q=XDR_USD&compact=ultra&apiKey=df6440fc0578491bb13eb2088c4f60c7").then(r => r.json());
    _rate = Number(b.data.xdr_permyriad_per_icp/10000n)*(b2.hasOwnProperty("XDR_USD") ? b2.XDR_USD : 1.331578);
  }
  return _rate;
},
EntrepotGetICPUSD = n => {
  if (_rate) return (_rate*(Number(n) / 100000000)).toFixed(2);
  else return false;
},
EntrepotClearLiked = async () => {
  _liked = [];
},
EntrepotGetAllLiked = () => {
  return _liked
},
EntrepotUpdateLiked = async identity => {
  if (identity) {
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    _liked = await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").liked();
  } else _liked = [];
},
EntrepotSaveLiked = async identity => {
  if (identity) {
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").saveLiked(_liked)
  };
},
EntrepotIsLiked = tokenid => {
  return (_liked.indexOf(tokenid) >= 0);
},
EntrepotLike = async (tokenid, id) => {
  if (!id) return;
  _liked.push(tokenid);
  if (!tokenLikes.hasOwnProperty(tokenid)) tokenLikes[tokenid] = 0;
  tokenLikes[tokenid]++;
  await EntrepotSaveLiked(id);
},
EntrepotUnike = async (tokenid, id) => {
  if (!id) return;
  _liked = _liked.filter(a => a != tokenid);
  if (!tokenLikes.hasOwnProperty(tokenid)) tokenLikes[tokenid] = 0;
  tokenLikes[tokenid]--;
  await EntrepotSaveLiked(id);
},
EntrepotGetLikes = async (tokenid, skipCache) => {
  if (!tokenLikes.hasOwnProperty(tokenid) || !skipCache) {
    var likes = await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").likes(tokenid);
    tokenLikes[tokenid] = Number(likes);    
  };
  return (tokenLikes[tokenid] < 0 ? 0 : tokenLikes[tokenid]);
},
numf = (n, d) => {
  if (n === "N/A") return n;
  d = (d ?? 2);
  return n.toFixed(d).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
export {
  clipboardCopy, compressAddress, displayDate, numf, EntrepotUpdateStats, EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber, EntrepotDisplayNFT, EntrepotAllStats, EntrepotCollectionStats, EntrepotUpdateUSD, EntrepotGetICPUSD, EntrepotUpdateLiked, 
  EntrepotIsLiked, EntrepotLike, EntrepotUnike, EntrepotGetLikes, EntrepotClearLiked, EntrepotGetAllLiked
};