import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SnackbarButton from '../components/SnackbarButton';
import Blockie from '../components/Blockie';
import extjs from '../ic/extjs.js';
import { clipboardCopy } from '../utils';
import { useHistory } from "react-router";
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
var loadedAccount = false;
export default function Wallet(props) {
  const history = useHistory();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container = window !== undefined ? () => window().document.body : undefined;
  const [balance, setBalance] = React.useState(false);
  const [myCollections, setMyCollections] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElLogin, setAnchorElLogin] = React.useState(null);
  const refreshClick = async () => {
    props.loader(true); 
    await refresh(); 
    props.loader(false);
  };
  const selectAccount = (t) => {
    setBalance(false);
    setMyCollections(false);
    props.setBalance(false)
    props.changeAccount(t);
    setAnchorElLogin(null)
    loadedAccount = t;
  };
  const login = (t) => {
   props.login(t); 
   setAnchorElLogin(null)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const _isCanister = c => {
    return c.length == 27 && c.split("-").length == 5;
  };
  const refresh = async () => {
    if (props.account){
      var b = await api.token().getBalance(props.account.address);
      var thisacc = loadedAccount;
      setBalance(b);
      var collection, mcs = [];
      var firstrun = false;
      if (myCollections === false || myCollections.length === 0) firstrun = true;
      for(var i = 0; i < props.collections.length; i++) {
        collection = props.collections[i];
        if (!_isCanister(collection.canister)) continue
        try{
          var tokens = await api.token(collection.canister).getTokens(props.account.address);
          if (collection.canister === "bxdf4-baaaa-aaaah-qaruq-cai") {
            tokens = tokens.map(a => {a.wrapped = true; return a});
            tokens = tokens.concat(await api.token("qcg3w-tyaaa-aaaah-qakea-cai").getTokens(props.account.address, props.identity.getPrincipal().toText()));
          } else 
          if (collection.canister === "y3b7h-siaaa-aaaah-qcnwa-cai") {
            tokens = tokens.map(a => {a.wrapped = true; return a});
            tokens = tokens.concat(await api.token("4nvhy-3qaaa-aaaah-qcnoq-cai").getTokens(props.account.address, props.identity.getPrincipal().toText()));
          } else 
          if (collection.canister === "3db6u-aiaaa-aaaah-qbjbq-cai") {
            tokens = tokens.map(a => {a.wrapped = true; return a});
            tokens = tokens.concat(await api.token("d3ttm-qaaaa-aaaai-qam4a-cai").getTokens(props.account.address, props.identity.getPrincipal().toText()));
          } else 
          if (collection.canister === "q6hjz-kyaaa-aaaah-qcama-cai") {
            tokens = tokens.map(a => {a.wrapped = true; return a});
            tokens = tokens.concat(await api.token("xkbqi-2qaaa-aaaah-qbpqq-cai").getTokens(props.account.address, props.identity.getPrincipal().toText()));
          } else 
          if (collection.canister === "jeghr-iaaaa-aaaah-qco7q-cai") {
            tokens = tokens.map(a => {a.wrapped = true; return a});
            tokens = tokens.concat(await api.token("fl5nr-xiaaa-aaaai-qbjmq-cai").getTokens(props.account.address, props.identity.getPrincipal().toText()));
          }
        } catch(e) {continue};
        if (tokens.length) {
          mcs.push({
            ...collection,
            count : tokens.length
          });
          if (firstrun) {
            if (thisacc == loadedAccount) setMyCollections(mcs);
            else setMyCollections(false);
          }
        }
        
      };
      if (thisacc == loadedAccount) setMyCollections(mcs);
      else setMyCollections(false);
    }
  };
  useInterval(refresh, 30 *1000);
  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    setMyCollections(false);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account]);
  React.useEffect(() => {
    props.setBalance(balance);
  }, [balance]);
  React.useEffect(() => {
    loadedAccount = props.currentAccount;
  }, [props.currentAccount]);
  const accountsList = (
    <div style={{marginTop:73, marginBottom: 100}}>
      { props.account !== false ? 
      <List>
        <ListSubheader>
          Connected Wallet
        </ListSubheader>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Blockie address={props.account ? props.account.address : ""} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{noWrap:true}} 
            secondaryTypographyProps={{noWrap:true}} 
            primary={<>
              {props.account.name}
              <IconButton style={{marginTop:"-5px"}} size="small" onClick={refreshClick} edge="end">
                <CachedIcon />
              </IconButton>
            </>}
            secondary={<>
              {props.account.address.substr(0,20)+"..."}
              <SnackbarButton
                message="Address Copied"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClick={() => clipboardCopy(props.account.address)}
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
        {props.accounts.length > 1 ?
        <ListItem>
          <Button onClick={(e) => setAnchorElLogin(e.currentTarget)} fullWidth variant="outlined" color="primary" style={{fontWeight:"bold"}}>Change Accounts</Button>
          <Menu
            anchorEl={anchorElLogin}
            keepMounted
            open={Boolean(anchorElLogin)}
            onClose={() => setAnchorElLogin(null)}
          >
            {props.accounts.map((account, i) => {
            if (account.address == props.account.address) return [];
            return (<MenuItem key={i} onClick ={()=> selectAccount(i)}>
             <Avatar style={{width:20, height: 20, marginRight:5}}><Blockie address={account.address} /></Avatar> <ListItemText primary={account.name} />
            </MenuItem>)
            })}
          </Menu>
        </ListItem> : "" }
        <ListItem>
          <Button onClick={props.logout} fullWidth variant="contained" color="secondary" style={{fontWeight:"bold",color:"white"}}>Logout</Button>
        </ListItem>
      </List> : ""}
      { props.account === false ? 
      <List>
      <ListSubheader>
        Trade NFTS
      </ListSubheader>
        <ListItem>
          <ListItemText 
            primary={"Connect your wallet to buy and sell NFTs directly from the marketplace."}
            />
        </ListItem>
        <ListItem>
          <Button onClick={(e) => setAnchorElLogin(e.currentTarget)} fullWidth variant="contained" color="primary" style={{fontWeight:"bold",color:"black"}}> Connect your Wallet</Button>
          <Menu
            anchorEl={anchorElLogin}
            keepMounted
            open={Boolean(anchorElLogin)}
            onClose={() => setAnchorElLogin(null)}
          >
            <MenuItem onClick ={()=> login('stoic')}>
              <ListItemIcon>
                <img alt="S" src="/stoic.png" style={{height:26}} />
              </ListItemIcon>
              <ListItemText primary="StoicWallet" />
            </MenuItem>
            <MenuItem onClick={() => login('plug')}>
              <ListItemIcon>
                <img alt="S" src="/plug.png" style={{height:26}} />
              </ListItemIcon>
              <ListItemText primary="Plug Wallet" />
            </MenuItem>
          </Menu>
        </ListItem>
      </List> : ""}
      { props.account !== false ? 
      <>
      <Divider />
      <List>
        <ListSubheader>
          My Collections
          {props.view === "wallet" ?
          <ListItemSecondaryAction>
            <ListItemIcon>
              <Button color={"primary"} variant={"contained"} onClick={() => history.push("/marketplace/"+props.collection.route)} style={{marginTop:"3px", marginLeft:"30px"}} size="small" edge="end">
                Back
              </Button>
            </ListItemIcon>
          </ListItemSecondaryAction> : ""}
        </ListSubheader>
        {myCollections === false ?
          <ListItem>Loading collections...</ListItem>
        :
          <>
          {myCollections.length === 0 ?
            <ListItem>No collections owned</ListItem>
          :
            <>
              {myCollections.map(_collection => {
                return (<ListItem key={_collection.canister + "-" + _collection.count} selected={props.view === "wallet" && _collection.route == props.collection?.route} button onClick={() => history.push("/wallet/"+_collection.route)}>
                  <ListItemAvatar>
                    <Avatar>
                      <img alt={_collection.name} src={"/collections/"+_collection.canister+".jpg"} style={{height:64}} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{_collection.name}</ListItemText>
                  <ListItemSecondaryAction><Chip label={_collection.count} variant="outlined" /></ListItemSecondaryAction>
                </ListItem>)
              })}
            </>
          }
          </>
        }
      </List> </>: ""}
      
      <div style={{width: drawerWidth-1, zIndex: 10, height: 60, backgroundColor:'white', position:"fixed", bottom:0, textAlign:'center'}} >
        <span style={{position:'absolute', bottom:'10px', left:'0', right:'0'}}>Developed by ToniqLabs<br /><a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></span>
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