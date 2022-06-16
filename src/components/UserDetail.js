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
import CallMadeIcon from '@material-ui/icons/CallMade';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import GavelIcon from '@material-ui/icons/Gavel';
export default function UserDetail(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuType, setMenuType] = React.useState("");
  const getView = v => {
    if (["offers-received", "offers-made"].indexOf(v) >= 0) return "offers";
    if (["new-request","earn-requests","earn-contracts","earn-nfts"].indexOf(v) >= 0) return "earning";
    return v;
  };
  const pageTitle = {
    "collected" : "Collection",
    "selling" : "Selling",
  };
  const goTo = nv => {
    props.navigate(`/`+nv)
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
  return (
  <div>
    <div style={{maxWidth:1200, margin:"0 auto 0",}}>
      <div style={styles.empty}>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item md={4} xs={12} style={{textAlign:"center"}}>
          </Grid>
          <Grid item md={4} xs={12}>
            {props.address?<Avatar style={{border:"solid 5px #00d092",margin:"0 auto",height:120, width:120}}>
              <Blockie address={props.address ? props.address : " "} />
            </Avatar>:""}
          </Grid>
          <Grid item md={4} xs={12} style={{textAlign:"right"}}>
            <ul style={styles.socials}>
              <li><a href={"https://ic.rocks/account/"+props.address} target="_blank"><img alt="create" style={{ width: 32 }} src={"/icon/icrocks.png"} /></a></li>
            </ul>
          </Grid>
        </Grid>
        {props.address?<h3><span style={{display:"inline-block", border:"1px solid #aaa",borderRadius:10, padding:5}}><img src="/currencies/icp.png" height="18" width="18" style={{verticalAlign:"top",marginTop:2,marginRight:2}} />{props.address?.substr(0,15)+"..."}</span></h3>:""}
      </div>
      <Tabs
        value={getView(props.view)}
        indicatorColor="primary"
        textColor="primary"
        centered={(window.innerWidth < 960 ? false : true)}
        scrollButtons={(window.innerWidth < 960 ? "on" : "auto")}
        variant={(window.innerWidth < 960 ? "scrollable" : "standard")}
        onChange={(e, nv) => {
          if (nv == "offers"){
            setMenuType(nv);
            setAnchorEl(e.currentTarget);
          } else if (nv == "earning"){
            setMenuType(nv);
            setAnchorEl(e.currentTarget);
          } else {
            props.navigate(`/`+nv)
          }
        }}
      >
        <Tab className={props.classes.tabsViewTab} value="collected" label={(<span style={{padding:"0 50px"}}><CollectionsIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Collected</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="selling" label={(<span style={{padding:"0 50px"}}><AddShoppingCartIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Selling</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="offers" label={(<span style={{padding:"0 50px"}}><LocalOfferIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Offers</span><ExpandMoreIcon style={{position:"absolute",marginLeft:"30px"}} /></span>)} />
        <Tab className={props.classes.tabsViewTab} value="earning" label={(<span style={{padding:"0 50px"}}><AccountBalanceIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Earning</span><ExpandMoreIcon style={{position:"absolute",marginLeft:"30px"}} /></span>)} />
        <Tab className={props.classes.tabsViewTab} value="favorites" label={(<span style={{padding:"0 50px"}}><FavoriteIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Favorites</span></span>)} />
        <Tab className={props.classes.tabsViewTab} value="activity" label={(<span style={{padding:"0 50px"}}><ImportExportIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Activity</span></span>)} />
      </Tabs>
      <Menu
        elevation={1}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuType == "offers" ?
        <>
          <MenuItem onClick={() => goTo("offers-received")}>
            <ListItemIcon style={{minWidth:30}}>
              <CallReceivedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText><span style={{fontSize:"0.9rem",fontWeight:"bold",textTransform:"uppercase"}}>Offers Received</span></ListItemText>
          </MenuItem>
          <MenuItem onClick={() => goTo("offers-made")}>
            <ListItemIcon style={{minWidth:30}}>
              <CallMadeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText><span style={{fontSize:"0.9rem",fontWeight:"bold",textTransform:"uppercase"}}>Offers Made</span></ListItemText>
          </MenuItem>
        </> : ""}
        {menuType == "earning" ?
        <>
          <MenuItem onClick={() => goTo("earn-requests")}>
            <ListItemIcon style={{minWidth:30}}>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText><span style={{fontSize:"0.9rem",fontWeight:"bold",textTransform:"uppercase"}}>Earn Requests</span></ListItemText>
          </MenuItem>
          <MenuItem onClick={() => goTo("earn-contracts")}>
            <ListItemIcon style={{minWidth:30}}>
              <GavelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText><span style={{fontSize:"0.9rem",fontWeight:"bold",textTransform:"uppercase"}}>Earn Contracts</span></ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => goTo("earn-nfts")}>
            <ListItemIcon style={{minWidth:30}}>
              <LocalAtmIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText><span style={{fontSize:"0.9rem",fontWeight:"bold",textTransform:"uppercase"}}>Earn NFTs</span></ListItemText>
          </MenuItem>
        </> : ""}
      </Menu>
    </div>
  </div>
  )
}
