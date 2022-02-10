import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import PriceICP from './PriceICP';
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import extjs from "../ic/extjs.js";
const api = extjs.connect("https://boundary.ic0.app/");
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
export default function CollectionDetails(props) {
  const [blurbElement, setBlurbElement] = useState(false);
  const [collapseBlurb, setCollapseBlurb] = useState(false);
  const [isBlurbOpen, setIsBlurbOpen] = useState(false);
  const [size, setSize] = useState(false);
  
  var stats = props.stats;
  var classes = props.classes;
  var collection = props.collection;
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
    <div style={{borderRadius:5,marginBottom:70,background:(typeof collection.banner != 'undefined' && collection.banner ? "url('"+collection.banner+"') no-repeat center center" : "#aaa"), backgroundSize:"cover", height:200}}>
      <Avatar style={{top:150,margin:"0 auto",border:"10px solid white",height:120, width:120}} src={(typeof collection.avatar != 'undefiend' && collection.avatar ? collection.avatar : "/collections/"+collection.canister+".jpg")} />
    </div>
    <Grid className={classes.stats} container direction="row" alignItems="center" spacing={2}>
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
          <li><a href={"https://ic.rocks/principal/"+collection.canister} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/icrocks.png"} /></a></li>
          {['telegram', 'twitter', 'medium', 'discord'].filter(a => collection.hasOwnProperty(a) && collection[a]).map(a => {
            return (<li key={a}><a href={collection[a]} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/"+a+".png"} /></a></li>);
          })}
        </ul>
      </Grid>
    </Grid>
    <div style={{width:"100%", maxWidth:"760px", margin:"0 auto"}}>
      <h1>{collection.name}</h1>
        {size ? <h4 style={{marginTop:-20}}>Collection of {numberWithCommas(size)}</h4> : ""}
      {/*collection?.canister == "oeee4-qaaaa-aaaak-qaaeq-cai" ? <Alert severity="error"><strong>There seems to be an issue with the <a href="https://dashboard.internetcomputer.org/subnet/opn46-zyspe-hhmyp-4zu6u-7sbrh-dok77-m7dch-im62f-vyimr-a3n2c-4ae" target="_blank">oopn46-zyspe... subnet</a> which is causing issues with this collection.</strong></Alert> : ""*/}
      <div ref={e => { setBlurbElement(e); }} style={{...(collapseBlurb && !isBlurbOpen ? {maxHeight:110, wordBreak: "break-word", WebkitMask : "linear-gradient(rgb(255, 255, 255) 45%, transparent)"} : {}), overflow:"hidden",fontSize: "1.2em" }}>
        {collection?.blurb}
      </div>
      {collapseBlurb ? (
      <Button fullWidth endIcon={(!isBlurbOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />)} onClick={() => setIsBlurbOpen(!isBlurbOpen)}></Button>
      ) : ""}
    </div>
  </>);
};