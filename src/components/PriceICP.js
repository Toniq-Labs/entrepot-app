const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
export default function PriceICP(props) {
  var p = (props.clean ? numberWithCommas(props.price) : numberWithCommas(_showListingPrice(props.price)));
  var p = (props.volume ? (Number(p.replace(",","")) >= 10000 ? (Number(p.replace(",",""))/1000).toFixed(1)+"k" : p ) : p);
  return (<><img style={{verticalAlign : "top"}} src={"/currencies/icp.png"} height={(props.size ?? 18)} width={props.size ?? 18}/> {p}</>);
};