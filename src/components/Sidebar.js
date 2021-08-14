import React from 'react';
import IconButton from '@material-ui/core/IconButton';
//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import StorefrontIcon from '@material-ui/icons/Storefront';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SnackbarButton from '../components/SnackbarButton';
import Blockie from '../components/Blockie';
import extjs from '../ic/extjs.js';
import { clipboardCopy } from '../utils';

const api = extjs.connect("https://boundary.ic0.app/");
const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 1
  }
}));
const _showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};
var intv = false;
export default function Sidebar(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container = window !== undefined ? () => window().document.body : undefined;
  const [balance, setBalance] = React.useState(false);
  const [myCollections, setMyCollections] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const refreshClick = async () => {
    props.loader(true); 
    await refresh(); 
    props.loader(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const refresh = async () => {
    if (props.address){
      var b = await api.token().getBalance(props.address);
      setBalance(b);
      var collection, mcs = [];
      for(var i = 0; i < props.collections.length; i++) {
        collection = props.collections[i];
        var tokens = await api.token(collection.canister).getTokens(props.address);
        if (tokens.length) {
          mcs.push({
            ...collection,
            count : tokens.length
          });
        }
      };
      setMyCollections(mcs);
    }
  };
  React.useEffect(() => {
    refresh();
    if (intv) clearInterval(intv);
    intv = setInterval(refresh, 5 *1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    refresh();
    if (intv) clearInterval(intv);
    intv = setInterval(refresh, 5 *1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.address]);
  
  const accountsList = (
    <div style={{marginTop:73, marginBottom: 100}}>
      <Divider />
      { props.address !== false ? 
      <List>
        <ListSubheader>
          Connected Wallet
        </ListSubheader>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Blockie address={props.address} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{noWrap:true}} 
            secondaryTypographyProps={{noWrap:true}} 
            primary={<>
              My Wallet
              {/*<IconButton style={{marginTop:"-5px"}} size="small" onClick={(e) => setAnchorEl(e.currentTarget)} edge="end">*/}
              <IconButton style={{marginTop:"-5px"}} size="small" onClick={refreshClick} edge="end">
                <CachedIcon />
              </IconButton>
              {/*<Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>*/}
            </>}
            secondary={<>
              {props.address.substr(0,20)+"..."}
              <SnackbarButton
                message="Address Copied"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClick={() => clipboardCopy(props.address)}
              >
                <IconButton style={{marginTop:"-5px"}} size="small" edge="end">
                  <FileCopyIcon style={{fontSize:"1em"}} />
                </IconButton>
              </SnackbarButton>
            </>} />
        </ListItem>
        <ListItem>
          <Typography style={{width:"100%",textAlign:"center",fontWeight:"bold"}}>
          {(balance !== false ? _showListingPrice(balance)+" ICP" : "Loading...")}
          </Typography>
        </ListItem>
        <ListItem>
          <Button onClick={props.logout} fullWidth variant="contained" color="secondary" style={{fontWeight:"bold",color:"white"}}>Logout</Button>
        </ListItem>
      </List> : ""}
      { props.address === false ? 
      <List>
      <ListSubheader>
        Buy NFTS
      </ListSubheader>
        <ListItem>
          <ListItemText 
            primary={"Connect your wallet to buy and sell NFTs directly from the marketplace."}
            />
        </ListItem>
        <ListItem>
          <Button onClick={props.login} startIcon={<img alt="S" src="stoic.png" style={{height:26}} />} fullWidth variant="contained" color="primary" style={{fontWeight:"bold",color:"black"}}> Login with Stoic</Button>
        </ListItem>
      </List> : ""}
      
      <Divider />
      <List>
      <ListSubheader>
        Sell NFTs
      </ListSubheader>
        <ListItem>
          <ListItemText 
            primary={"You can sell your NFTs directly from your Stoic Wallet."}
            />
        </ListItem>
      </List>
      { props.address !== false && myCollections.length ? 
      <>
      <Divider />
      <List>
        <ListSubheader>
          My Collections
        </ListSubheader>
        {props.view !== false ?
        <ListItem button onClick={() => props.setView(false)}>
          <ListItemIcon><StorefrontIcon /></ListItemIcon>
          <ListItemText primary="Back to Marketplace" />
        </ListItem> : ""}
        {/*<ListItem key={collection.canister + "-" + collection.count} selected={props.view == collection.canister} button onClick={() => props.setView(collection.canister)}>*/}
        {myCollections.map(collection => {
          return (<ListItem key={collection.canister + "-" + collection.count} selected={props.view === collection.canister}>
            <ListItemAvatar>
              <Avatar>
                <img alt={collection.name} src={"collections/"+collection.canister+".jpg"} style={{height:64}} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{collection.name}</ListItemText>
            <ListItemSecondaryAction><Chip label={collection.count} variant="outlined" /></ListItemSecondaryAction>
          </ListItem>)
        })}
      </List> </>: ""}
      
      <div style={{width: drawerWidth-1, zIndex: 10, backgroundColor:'white', position:"fixed", bottom:0, textAlign:'center'}} >
        <span style={{position:'absolute', bottom:'10px', left:'0', right:'0'}}>Developed by ToniqLabs</span>
      </div>
    </div>
  );
  
  return (
    <nav aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.open}
          onClose={props.onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {accountsList}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {accountsList}
        </Drawer>
      </Hidden>
    </nav>
  );
}