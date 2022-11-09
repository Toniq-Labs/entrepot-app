import BigNumber from 'bignumber.js';
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CallMadeIcon from '@material-ui/icons/CallMade';
import PostAddIcon from '@material-ui/icons/PostAdd';
import GavelIcon from '@material-ui/icons/Gavel';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import {LoaderAnimated24Icon} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Blockie from '../components/Blockie';
import LockIcon from '@material-ui/icons/Lock';
import PriceICP from '../components/PriceICP';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import CollectionsIcon from '@material-ui/icons/Collections';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';
import extjs from '../ic/extjs.js';
import {clipboardCopy} from '../utils';
import {useNavigate} from 'react-router';
import {loadVoltBalance} from '../volt';
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
const api = extjs.connect('https://ic0.app/');
const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 1,
  },
}));
var loadedAccount = false;
export default function Wallet(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const container = window !== undefined ? () => window.document.body : undefined;
  const [voltAddress, setVoltAddress] = React.useState(false);
  const [voltBalances, setVoltBalances] = React.useState(false);
  const [voltPrincipal, setVoltPrincipal] = React.useState(false);
  const [balance, setBalance] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElAccounts, setAnchorElAccounts] = React.useState(null);
  const logout = () => {
    setLoading(true);
    setBalance(false);
    setVoltAddress(false);
    setVoltPrincipal(false);
    setVoltBalances(false);
    handleClose();
    props.logout();
  };
  const refreshClick = async () => {
    setLoading(true);
    setBalance(false);
    setVoltBalances(false);
    await refresh();
  };
  const selectAccount = t => {
    setBalance(false);
    props.setBalance(false);
    props.changeAccount(t);
    setAnchorElAccounts(null);
    loadedAccount = t;
  };
  const login = t => {
    props.login(t);
    setAnchorElAccounts(null);
  };
  const createVolt = async () => {
    handleClose();
    await props.voltCreate(true);
  };
  const voltTransfer = async () => {
    await props.voltTransfer(props.loader, refreshClick);
  };
  const processPayments = async () => {
    handleClose();
    await props.processPayments();
    await refresh();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const refresh = async refreshVolt => {
    if (props.account) {
      try {
        var b = await api.token().getBalance(props.account.address);
        var thisacc = loadedAccount;
        setBalance(b);
        //Volt
        await loadVoltBalance({
          account: props.account,
          identity: props.identity,
          voltPrincipal,
          refreshVolt,
          setVoltPrincipal,
          setVoltAddress,
          setVoltBalances,
        });
        setLoading(false);
      } catch (e) {
        if (
          e ==
          'Incorrect Principal is logged in, please go to StoicWallet and ensure the correct Principal is active'
        ) {
          props.error(
            'Incorrect Principal is logged in, please go to StoicWallet and ensure the correct Principal is active',
          );
          logout();
        }
      }
    }
  };
  useInterval(refresh, 30 * 1000);
  React.useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    refresh(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account]);
  React.useEffect(() => {
    props.setBalance(balance);
  }, [balance]);
  React.useEffect(() => {
    loadedAccount = props.currentAccount;
  }, [props.currentAccount]);
  const accountsList = (
    <div style={{marginTop: 73, marginBottom: 100}}>
      {props.account !== false ? (
        <List>
          <ListSubheader>Connected Wallet</ListSubheader>
          <ListItem button onClick={e => setAnchorEl(e.currentTarget)}>
            <ListItemAvatar>
              <Avatar>
                <Blockie address={props.account ? props.account.address : ''} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{noWrap: true}}
              secondaryTypographyProps={{noWrap: true}}
              primary={<>{props.account.name}</>}
              secondary={<>{props.account.address.substr(0, 20) + '...'}</>}
            />
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
              marginLeft: 50,
            }}
          >
            <MenuItem
              onClick={() => {
                refreshClick();
                handleClose();
              }}
            >
              <ListItemIcon>
                <CachedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Refresh" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                clipboardCopy(props.account.address);
                handleClose();
              }}
            >
              <ListItemIcon>
                <FileCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Copy Address" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.open(
                  'https://icscan.io/account/' + props.account.address,
                  '_blank',
                  'noopener,noreferrer',
                );
                handleClose();
              }}
            >
              <ListItemIcon>
                <SearchIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View in Explorer" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                processPayments();
                handleClose();
              }}
            >
              <ListItemIcon>
                <LocalAtmIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Check Payments" />
            </MenuItem>

            <Divider light />
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
          <ListItem style={{display: 'flex', justifyContent: 'center'}}>
            <Typography style={{display: 'inline-flex', flexDirection: 'column', gap: '4px'}}>
              <PriceICP
                volume={true}
                text={
                  balance === false || loadedAccount == 0 || voltBalances === false ? (
                    <ToniqIcon
                      className="toniq-icon-fit-icon"
                      style={{height: '14px', width: '14px'}}
                      icon={LoaderAnimated24Icon}
                    />
                  ) : undefined
                }
                price={Number(balance) + voltBalances[0] + voltBalances[2]}
              >
                Total
              </PriceICP>
              <hr style={{width: '100%', borderBottom: '1px solid grey'}} />
              <PriceICP
                bold={false}
                volume={true}
                text={
                  balance === false ? (
                    <ToniqIcon
                      className="toniq-icon-fit-icon"
                      style={{height: '14px', width: '14px'}}
                      icon={LoaderAnimated24Icon}
                    />
                  ) : undefined
                }
                price={balance}
              >
                Default
              </PriceICP>
              <PriceICP
                bold={false}
                volume={true}
                text={
                  loadedAccount != 0 || voltBalances === false ? (
                    <ToniqIcon
                      className="toniq-icon-fit-icon"
                      style={{height: '14px', width: '14px'}}
                      icon={LoaderAnimated24Icon}
                    />
                  ) : undefined
                }
                price={voltBalances[0]}
              >
                Volt
              </PriceICP>
              {voltBalances && voltBalances[2] > 0 ? (
                <PriceICP
                  bold={false}
                  volume={true}
                  text={
                    loadedAccount != 0 || voltBalances === false ? (
                      <ToniqIcon
                        className="toniq-icon-fit-icon"
                        style={{height: '14px', width: '14px'}}
                        icon={LoaderAnimated24Icon}
                      />
                    ) : undefined
                  }
                  price={voltBalances[2]}
                >
                  Locked
                </PriceICP>
              ) : (
                ''
              )}
            </Typography>
          </ListItem>
          <ListItem>
            <Button
              onClick={e => {
                if (voltPrincipal) {
                  voltTransfer();
                } else {
                  createVolt();
                }
              }}
              fullWidth
              variant="outlined"
              color="primary"
              style={{fontWeight: 'bold'}}
            >
              {voltPrincipal ? 'Volt Transfer' : 'Link Volt'}
            </Button>
          </ListItem>
          {props.accounts.length > 1 ? (
            <ListItem>
              <Button
                onClick={e => setAnchorElAccounts(e.currentTarget)}
                fullWidth
                variant="outlined"
                color="primary"
                style={{fontWeight: 'bold'}}
              >
                Change Accounts
              </Button>
              <Menu
                anchorEl={anchorElAccounts}
                keepMounted
                open={Boolean(anchorElAccounts)}
                onClose={() => setAnchorElAccounts(null)}
              >
                {props.accounts.map((account, i) => {
                  if (account.address == props.account.address) return [];
                  return (
                    <MenuItem key={i} onClick={() => selectAccount(i)}>
                      <Avatar style={{width: 20, height: 20, marginRight: 5}}>
                        <Blockie address={account.address} />
                      </Avatar>{' '}
                      <ListItemText primary={account.name} />
                    </MenuItem>
                  );
                })}
              </Menu>
            </ListItem>
          ) : (
            ''
          )}
        </List>
      ) : (
        ''
      )}
      {props.account === false ? (
        <List>
          <ListSubheader>Trade NFTS</ListSubheader>
          <ListItem>
            <ListItemText
              primary={'Connect your wallet to buy and sell NFTs directly from the marketplace.'}
            />
          </ListItem>
          <ListItem>
            <Button
              onClick={e => setAnchorElAccounts(e.currentTarget)}
              fullWidth
              variant="contained"
              color="primary"
              style={{fontWeight: 'bold', color: 'black'}}
            >
              {' '}
              Connect your Wallet
            </Button>
            <Menu
              anchorEl={anchorElAccounts}
              keepMounted
              open={Boolean(anchorElAccounts)}
              onClose={() => setAnchorElAccounts(null)}
            >
              <MenuItem onClick={() => login('stoic')}>
                <ListItemIcon>
                  <img alt="S" src="/stoic.png" style={{height: 26}} />
                </ListItemIcon>
                <ListItemText primary="StoicWallet" />
              </MenuItem>
              <MenuItem onClick={() => login('torus')}>
                <ListItemIcon>
                  <img alt="T" src="/torus.svg" style={{height: 26}} />
                </ListItemIcon>
                <ListItemText primary="Torus" />
              </MenuItem>
              <MenuItem onClick={() => login('plug')}>
                <ListItemIcon>
                  <img alt="P" src="/plug.png" style={{height: 26}} />
                </ListItemIcon>
                <ListItemText primary="Plug" />
              </MenuItem>
              <MenuItem onClick={() => login('infinityWallet')}>
                <ListItemIcon>
                  <img alt="I" src="/infinitywallet.png" style={{height: 26}} />
                </ListItemIcon>
                <ListItemText primary="InfinityWallet" />
              </MenuItem>
            </Menu>
          </ListItem>
        </List>
      ) : (
        ''
      )}
      {props.account !== false ? (
        <>
          <Divider />
          <List>
            <ListSubheader>NFTs</ListSubheader>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/collected');
              }}
            >
              <ListItemIcon>
                <CollectionsIcon />
              </ListItemIcon>
              <ListItemText primary="Collected" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/selling');
              }}
            >
              <ListItemIcon>
                <AddShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Selling" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/offers-received');
              }}
            >
              <ListItemIcon>
                <CallReceivedIcon />
              </ListItemIcon>
              <ListItemText primary="Offers Received" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/offers-made');
              }}
            >
              <ListItemIcon>
                <CallMadeIcon />
              </ListItemIcon>
              <ListItemText primary="Offers Made" />
            </ListItem>
            <ListSubheader>Earn</ListSubheader>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/earn-requests');
              }}
            >
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Earn Requests" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/earn-contracts');
              }}
            >
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText primary="Earn Contracts" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/earn-nfts');
              }}
            >
              <ListItemIcon>
                <LocalAtmIcon />
              </ListItemIcon>
              <ListItemText primary="Earn NFTs" />
            </ListItem>
            <ListSubheader>Profile</ListSubheader>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/favorites');
              }}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.close();
                navigate('/activity');
              }}
            >
              <ListItemIcon>
                <ImportExportIcon />
              </ListItemIcon>
              <ListItemText primary="Activity" />
            </ListItem>
          </List>
        </>
      ) : (
        ''
      )}
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
