import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import {createSearchParams} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Wallet from '../components/Wallet';
import {makeStyles} from '@material-ui/core';
import {
  ToniqToggleButton,
  ToniqIcon,
  ToniqButton,
  ToniqInput,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {
  Rocket24Icon,
  BuildingStore24Icon,
  Geometry24Icon,
  Lifebuoy24Icon,
  EntrepotLogo144Icon,
  toniqColors,
  cssToReactStyleObject,
  Wallet24Icon,
  toniqFontStyles,
  Menu24Icon,
  Icp24Icon,
  LoaderAnimated24Icon,
  Infinity24Icon,
  Search24Icon,
} from '@toniq-labs/design-system';
import extjs from '../ic/extjs.js';
import {icpToString} from './PriceICP';
import {useSearchParams} from 'react-router-dom';
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

export default function Navbar(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [walletOpen, setWalletOpen] = React.useState(false);
  const [balance, setBalance] = React.useState(undefined);
  const [voltAddress, setVoltAddress] = React.useState(undefined);
  const [voltBalances, setVoltBalances] = React.useState(undefined);
  const [voltPrincipal, setVoltPrincipal] = React.useState(undefined);
  const classes = useStyles();
  const [searchParams] = useSearchParams();
  const [totalBalance, setTotalBalance] = React.useState(undefined);

  React.useEffect(() => {
    if (voltBalances != undefined && balance != undefined) {
      setTotalBalance(Number(balance) + voltBalances[0] + voltBalances[2]);
    }
  }, [props.account, props.identity, balance, voltBalances]);

  const query = searchParams.get('search') || '';

  const refresh = async () => {
    console.log('refreshing nav bar');
    if (props.account) {
      var b = await api.token().getBalance(props.account.address);
      setBalance(b);
      await loadVoltBalance({
        account: props.account,
        identity: props.identity,
        voltPrincipal,
        refreshVolt: true,
        setVoltPrincipal,
        setVoltAddress,
        setVoltBalances,
      });
    } else {
      setBalance(undefined);
    }
  };
  useInterval(refresh, 30 * 1000);

  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    refresh();
  }, [props.account]);

  const handleClick = () => {
    setWalletOpen(false);
  };
  const goTo = page => {
    navigate(page);
    handleClick();
  };
  const handleDrawerToggle = () => {
    setWalletOpen(!walletOpen);
  };

  const navBarButtons = (
    <>
      <ToniqToggleButton
        className="toniq-toggle-button-text-only"
        active={props.view === 'sale'}
        onClick={() => goTo('/sale')}
        text="Launchpad"
        icon={Rocket24Icon}
      />
      <ToniqToggleButton
        className="toniq-toggle-button-text-only"
        active={props.view === 'marketplace'}
        onClick={() => goTo('/marketplace')}
        text="Marketplace"
        icon={BuildingStore24Icon}
      />
      <ToniqToggleButton
        className="toniq-toggle-button-text-only"
        active={props.view === 'earn'}
        onClick={() => goTo('/earn')}
        text="Earn"
        icon={Infinity24Icon}
      />
      <ToniqToggleButton
        className="toniq-toggle-button-text-only"
        active={props.view === 'create'}
        onClick={() => goTo('/create')}
        text="Create"
        icon={Geometry24Icon}
      />
      <ToniqToggleButton
        className="toniq-toggle-button-text-only"
        active={props.view === 'contact'}
        onClick={() => goTo('/contact')}
        text="Support"
        icon={Lifebuoy24Icon}
      />
    </>
  );

  const entrepotTitleStyles = {
    ...cssToReactStyleObject(toniqFontStyles.h2Font),
    ...cssToReactStyleObject(toniqFontStyles.extraBoldFont),
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .${classes.smallScreenNav} ${ToniqToggleButton.tagName} {
        margin: 8px 16px;
      }
    `,
        }}
      />
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" style={{zIndex: 1400, background: 'white'}}>
          <Toolbar style={{gap: '4px', alignItems: 'stretch', minHeight: '70px'}}>
            <Typography style={{display: 'flex', alignItems: 'center'}} variant="h6" noWrap>
              <a
                style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                onClick={() => goTo('/')}
              >
                <ToniqIcon
                  className={`toniq-icon-fit-icon ${classes.icpButton}`}
                  style={{
                    height: '54px',
                    width: '54px',
                    flexShrink: '0',
                    margin: '8px',
                    color: toniqColors.brandPrimary.foregroundColor,
                  }}
                  icon={EntrepotLogo144Icon}
                />
                <span style={entrepotTitleStyles}>Entrepot</span>
              </a>
            </Typography>
            <ToniqInput
              className={classes.bigScreenInput}
              style={{alignSelf: 'center', marginLeft: '16px'}}
              icon={Search24Icon}
              placeholder="Search for NFTs..."
              value={query}
              onValueChange={event => {
                const newParam = event.detail;

                navigate({
                  pathname: 'marketplace',
                  search: `?${createSearchParams(newParam ? {search: newParam} : {})}`,
                });
              }}
            />
            <div className={classes.grow} />
            <div className={classes.bigScreenNavButtons}>{navBarButtons}</div>

            <ToniqToggleButton
              className={`toniq-toggle-button-text-only ${classes.smallScreenMenuButton}`}
              active={open}
              onClick={() => {
                setWalletOpen(false);
                setOpen(!open);
              }}
              icon={Menu24Icon}
            />
            <ToniqToggleButton
              className={`toniq-toggle-button-text-only ${classes.superSmallScreenWalletButton}`}
              active={walletOpen}
              onClick={() => {
                setWalletOpen(!walletOpen);
                setOpen(false);
              }}
              icon={Wallet24Icon}
            />
            <ToniqButton
              className={`toniq-button-outline ${classes.icpButton}`}
              style={{
                width: '120px',
                marginLeft: '8px',
                alignSelf: 'center',
                ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
                fontSize: '19px',
              }}
              onClick={handleDrawerToggle}
              icon={
                totalBalance === undefined
                  ? props.account
                    ? LoaderAnimated24Icon
                    : Wallet24Icon
                  : Icp24Icon
              }
              text={totalBalance === undefined ? '' : icpToString(totalBalance, true, true)}
            ></ToniqButton>
            {open && (
              <div className={classes.smallScreenNav} onClick={() => setOpen(false)}>
                {navBarButtons}
              </div>
            )}
          </Toolbar>
        </AppBar>
        {props.children}
      </div>

      <Wallet
        processPayments={props.processPayments}
        voltCreate={props.voltCreate}
        voltTransfer={props.voltTransfer}
        view={props.view}
        setBalance={props.setBalance}
        identity={props.identity}
        account={props.account}
        loader={props.loader}
        alert={props.alert}
        error={props.error}
        confirm={props.confirm}
        logout={props.logout}
        login={props.login}
        collection={props.collection}
        collections={props.collections}
        currentAccount={props.currentAccount}
        changeAccount={props.changeAccount}
        accounts={props.accounts}
        close={() => setWalletOpen(false)}
        open={walletOpen}
      />
    </>
  );
}

const useStyles = makeStyles(theme => {
  console.log({breakpoints: theme.breakpoints, sm: theme.breakpoints.up('sm')});

  // ideally this value would get calculated at run time based on how wide the nav
  // bar buttons are
  const hamburgerBreakPixel = '1300px';
  const displayIcpBreakPixel = '450px';
  const searchHiddenBreakPixel = '750px';
  const minHamburgerMenuBreakpoint = `@media (min-width:${hamburgerBreakPixel})`;
  const hideIcpBreakpoint = `@media (min-width:${displayIcpBreakPixel})`;
  const displayIcpBreakpoint = `@media (max-width:${displayIcpBreakPixel})`;
  const maxHamburgerMenuBreakpoint = `@media (max-width:${hamburgerBreakPixel})`;

  return {
    smallScreenMenuButton: {
      alignSelf: 'center',
      [minHamburgerMenuBreakpoint]: {
        display: 'none',
      },
    },
    superSmallScreenWalletButton: {
      alignSelf: 'center',
      [hideIcpBreakpoint]: {
        display: 'none',
      },
    },
    icpButton: {
      alignSelf: 'center',
      [displayIcpBreakpoint]: {
        display: 'none',
      },
    },
    smallScreenNav: {
      position: 'absolute',
      top: 72,
      width: '250px',
      display: 'flex',
      right: 0,
      backgroundColor: 'white',
      height: '100vh',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      [minHamburgerMenuBreakpoint]: {
        display: 'none',
      },
    },
    bigScreenInput: {
      [`@media (max-width:${searchHiddenBreakPixel})`]: {
        display: 'none',
      },
    },
    root: {
      display: 'flex',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [minHamburgerMenuBreakpoint]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    toolbarButtons: {
      marginLeft: 'auto',
    },
    content: {
      flexGrow: 1,
    },
    marketplace: {
      backgroundImage: "url('/icon/marketplace.png')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20px',
      backgroundPosition: '0 49%',
      paddingLeft: 30,
      '&:hover, &.selected': {
        backgroundImage: "url('/icon/marketplace-g.png')",
      },
    },
    create: {
      backgroundImage: "url('/icon/create.png')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20px',
      backgroundPosition: '0 49%',
      paddingLeft: 30,
      '&:hover, &.selected': {
        backgroundImage: "url('/icon/create-g.png')",
      },
    },
    contact: {
      backgroundImage: "url('/icon/support.png')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20px',
      backgroundPosition: '0 49%',
      paddingLeft: 30,
      '&:hover, &.selected': {
        backgroundImage: "url('/icon/support-g.png')",
      },
    },
    watchlist: {
      backgroundImage: "url('/icon/watchlist.png')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20px',
      backgroundPosition: '0 49%',
      paddingLeft: 30,
      '&:hover, &.selected': {
        backgroundImage: "url('/icon/watchlist-g.png')",
      },
    },
    bigScreenNavButtons: {
      display: 'flex',
      alignItems: 'center',
      [maxHamburgerMenuBreakpoint]: {
        display: 'none',
      },
    },
    button1: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      borderBottom: '3px solid transparent',
      borderRadius: 0,
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: '30px',
      paddingTop: '40px',
      height: 73,
      '&:hover': {
        color: '#00d092 !important',
        backgroundColor: '#fff',
        borderBottom: '3px solid #00d092 !important',
      },
    },
  };
});
