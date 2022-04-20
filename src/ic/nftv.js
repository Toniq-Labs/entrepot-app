export default function getNri(canister, index) {
  if (typeof index == 'undefined'){
    return loadNri(canister);
    //Easy load without extra import
  } else {
    if (gridata.hasOwnProperty(canister)) return gridata[canister][index];
    else return false;
  }
};
async function loadNri(canister) {
  if (gridata.hasOwnProperty(canister)) return true;
  try{
    var fd = await fetch('/nri/'+canister+'.json').then((response) => response.json());
    if (fd) gridata[canister] = fd;
  } catch(error){
    console.error(canister, error);
    return false;
  }
  return true;
};
var gridata = {};
