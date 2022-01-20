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
EntrepotNFTImage = (collection, index, id) => {
  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai") return "https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.ic0.app/nft/" + index;
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(index);
  return "https://"+collection+".raw.ic0.app/?cc=0&type=thumbnail&tokenid=" + id;
},
EntrepotNFTLink = (collection, index, id) => {
  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai") return "https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.ic0.app/nft/" + index;
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" + index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.ic0.app/Token/" + index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=" + index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(index);
  return "https://"+collection+".raw.ic0.app/?tokenid=" + id;
},
EntrepotNFTMintNumber = (collection, index, id) => {
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai") return index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai") return index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai") return index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return index;
  return index + 1;
},
numf = (n, d) => {
  if (n === "N/A") return n;
  d = (d ?? 2);
  return n.toFixed(d).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
export {
  clipboardCopy, compressAddress, displayDate, numf, EntrepotNFTImage, EntrepotNFTLink, EntrepotNFTMintNumber
};