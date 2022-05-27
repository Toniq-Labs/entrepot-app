/* global BigInt */
import React from 'react';
import Blockie from './Blockie';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import CollectionsIcon from '@material-ui/icons/Collections';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { EntrepotAllStats } from '../utils';
export default function UserDetail(props) {
  const getTokens = async () => {
    var stats = EntrepotAllStats();
    var tokens = (await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/user/"+props.address+"/all").then(r => r.json())).map(a => Number(stats.find(b => b.canister == a.canister).stats.floor)).reduce((a,c) => a+c, 0);
    console.log(tokens);
  };
  const styles = {
    empty: {
      maxWidth: 1200,
      margin: "0 auto",
      textAlign: "center",
    },
    socials: {
      padding:0,
      listStyle: "none",
      "& li" : {
        display:"inline-block",
        margin:"0 10px",
      },
    },
  };
  React.useEffect(() => {
    getTokens();
  }, [props.address]);
  return (
  <div>
    <div style={{maxWidth:1200, margin:"0 auto 0",}}>
      <div style={styles.empty}>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item md={4} xs={12} style={{textAlign:"center"}}>
          </Grid>
          <Grid item md={4} xs={12}>
            <Avatar style={{margin:"0 auto",height:120, width:120}}>
              <Blockie address={props.address ? props.address : " "} />
            </Avatar>
          </Grid>
          <Grid item md={4} xs={12} style={{textAlign:"right"}}>
            <ul style={styles.socials}>
              <li><a href={"https://icscan.io/account/"+props.address} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/icscan.png"} /></a></li>
            </ul>
          </Grid>
        </Grid>
        <h1>{props.title}</h1>
      </div>
      <Tabs
        value={props.view}
        indicatorColor="primary"
        textColor="primary"
        centered={(window.innerWidth < 960 ? false : true)}
        scrollButtons={(window.innerWidth < 960 ? "on" : "auto")}
        variant={(window.innerWidth < 960 ? "scrollable" : "standard")}
        onChange={(e, nv) => {
          props.navigate(`/`+nv)
        }}
      >
        <Tab className={props.classes.tabsViewTab} value="collected" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Collected</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="selling" label={(<span style={{padding:"0 50px"}}><AddShoppingCartIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Selling</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="offers-received" label={(<span style={{padding:"0 50px"}}><CallReceivedIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Received</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="offers-made" label={(<span style={{padding:"0 50px"}}><LocalOfferIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers Made</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Favorites</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="activity" label={(<span style={{padding:"0 50px"}}><ImportExportIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Activity</span></span>)} />
      </Tabs>
    </div>
  </div>
  )
}
