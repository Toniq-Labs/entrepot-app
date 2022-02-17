import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SnackbarButton from '../components/SnackbarButton';
import Blockie from '../components/Blockie';
import LockIcon from '@material-ui/icons/Lock';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PriceICP from '../components/PriceICP';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import CollectionsIcon from '@material-ui/icons/Collections';
import FavoriteIcon from '@material-ui/icons/Favorite';
import extjs from '../ic/extjs.js';
import { clipboardCopy } from '../utils';
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container = window !== undefined ? () => window().document.body : undefined;
  const [balance, setBalance] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElAccounts, setAnchorElAccounts] = React.useState(null);
  const refreshClick = async () => {
    setLoading(true);
    setBalance(false);
    await refresh(); 
  };
  const selectAccount = (t) => {
    setBalance(false);
    props.setBalance(false)
    props.changeAccount(t);
    setAnchorElAccounts(null)
    loadedAccount = t;
  };
  const login = (t) => {
   props.login(t); 
   setAnchorElAccounts(null)
  };
  const processPayments = async () => {
    handleClose(); 
    await props.processPayments();
    await refresh();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const refresh = async () => {
    if (props.account){
      var b = await api.token().getBalance(props.account.address);
      var thisacc = loadedAccount;
      setBalance(b);
      setLoading(false);
    }
  };
  useInterval(refresh, 30 *1000);
  React.useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
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
        <ListItem button onClick={(e) => setAnchorEl(e.currentTarget)}>
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
            </>}
            secondary={<>
              {props.account.address.substr(0,20)+"..."}
            </>} />
            <ListItemIcon>
              <ExpandMoreIcon />
            </ListItemIcon>
        </ListItem>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          style={{
            marginLeft:50
          }}
        >
          <MenuItem onClick={() => {refreshClick(); handleClose();}}>
            <ListItemIcon>
              <CachedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Refresh" />
          </MenuItem>
          <MenuItem onClick={() => { clipboardCopy(props.account.address); handleClose(); }}>
            <ListItemIcon>
              <FileCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Copy Address" />
          </MenuItem>
          <MenuItem onClick={() => {processPayments(); handleClose();}}>
            <ListItemIcon>
              <LocalAtmIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Check Payments" />
          </MenuItem>
          
          <Divider light />
          <MenuItem onClick={() => {props.logout(); handleClose();}}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
        <ListItem>
          <Typography style={{width:"100%",textAlign:"center",fontWeight:"bold"}}>
          {(balance !== false ? <PriceICP size={24} price={balance} /> : "Loading...")}
          </Typography>
        </ListItem>
        {props.accounts.length > 1 ?
        <ListItem>
          <Button onClick={(e) => setAnchorElAccounts(e.currentTarget)} fullWidth variant="outlined" color="primary" style={{fontWeight:"bold"}}>Change Accounts</Button>
          <Menu
            anchorEl={anchorElAccounts}
            keepMounted
            open={Boolean(anchorElAccounts)}
            onClose={() => setAnchorElAccounts(null)}
          >
            {props.accounts.map((account, i) => {
            if (account.address == props.account.address) return [];
            return (<MenuItem key={i} onClick ={()=> selectAccount(i)}>
             <Avatar style={{width:20, height: 20, marginRight:5}}><Blockie address={account.address} /></Avatar> <ListItemText primary={account.name} />
            </MenuItem>)
            })}
          </Menu>
        </ListItem> : "" }
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
          <Button onClick={(e) => setAnchorElAccounts(e.currentTarget)} fullWidth variant="contained" color="primary" style={{fontWeight:"bold",color:"black"}}> Connect your Wallet</Button>
          <Menu
            anchorEl={anchorElAccounts}
            keepMounted
            open={Boolean(anchorElAccounts)}
            onClose={() => setAnchorElAccounts(null)}
          >
            <MenuItem onClick ={()=> login('stoic')}>
              <ListItemIcon>
                <img alt="S" src="/stoic.png" style={{height:26}} />
              </ListItemIcon>
              <ListItemText primary="StoicWallet" />
            </MenuItem>
            <MenuItem onClick={() => login('torus')}>
              <ListItemIcon>
                <img alt="T" src="/torus.svg" style={{height:26}} />
              </ListItemIcon>
              <ListItemText primary="Torus" />
            </MenuItem>
            <MenuItem onClick={() => login('plug')}>
              <ListItemIcon>
                <img alt="P" src="/plug.png" style={{height:26}} />
              </ListItemIcon>
              <ListItemText primary="Plug" />
            </MenuItem>
          </Menu>
        </ListItem>
      </List> : ""}
      { props.account !== false ? 
      <>
      <Divider />
      <List>
        <ListSubheader>
          My Collection
        </ListSubheader>
        <ListItem button onClick={() => {props.close(); navigate("/collected");}}>
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText primary="Collected" />
        </ListItem>
        <ListItem button onClick={() => {props.close(); navigate("/selling");}}>
          <ListItemIcon>
            <AddShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Selling" />
        </ListItem>
        <ListItem button onClick={() => {props.close(); navigate("/offers-received");}}>
          <ListItemIcon>
            <CallReceivedIcon />
          </ListItemIcon>
          <ListItemText primary="Offers Received" />
        </ListItem>
        <ListItem button onClick={() => {props.close(); navigate("/offers-made");}}>
          <ListItemIcon>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText primary="Offers Made" />
        </ListItem>
        <ListItem button onClick={() => {props.close(); navigate("/favorites");}}>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button onClick={() => {props.close(); navigate("/activity");}}>
          <ListItemIcon>
            <ImportExportIcon />
          </ListItemIcon>
          <ListItemText primary="Activity" />
        </ListItem>
      </List> 
    </>: ""}
      
    </div>
  );
  
  return (
    <nav aria-label="mailbox folders">
      <Drawer
        container={container}
        variant="temporary"
        anchor={'right'}
        open={props.open}
        onClose={props.close}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {accountsList}
      </Drawer>
    </nav>
  );
}