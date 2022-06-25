import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Wallet from "../components/Wallet";
import MenuIcon from "@material-ui/icons/Menu";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { IconButton, makeStyles } from "@material-ui/core";
import { ToniqToggleButton } from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { Rocket24Icon, BuildingStore24Icon, Geometry24Icon, Lifebuoy24Icon, Infinity24Icon } from '@toniq-labs/design-system';

export default function Navbar(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [walletOpen, setWalletOpen] = React.useState(false);
  const classes = useStyles();

  const handleClick = () => {
    setWalletOpen(false)
  };
  const goTo = page => {
    navigate(page)
    handleClick();
  };
  const handleDrawerToggle = () => {
    setWalletOpen(!walletOpen);
  };
  
  const navBarButtons = (<>
    <ToniqToggleButton
      className="toniq-toggle-button-text-only"
      active={props.view === "sale"}
      onClick={() => goTo("/sale")}
      text="LaunchPad"
      icon={Rocket24Icon}
    />
    <ToniqToggleButton
      className="toniq-toggle-button-text-only"
      active={props.view === "marketplace"}
      onClick={() => goTo("/marketplace")}
      text="Marketplace"
      icon={BuildingStore24Icon}
    />
    <ToniqToggleButton
      className="toniq-toggle-button-text-only"
      active={props.view === "earn"}
      onClick={() => goTo("/earn")}
      text="Earn"
      icon={Infinity24Icon}
    />
    <ToniqToggleButton
      className="toniq-toggle-button-text-only"
      active={props.view === "create"}
      onClick={() => goTo("/create")}
      text="Create"
      icon={Geometry24Icon}
    />
    <ToniqToggleButton
      className="toniq-toggle-button-text-only"
      active={props.view === "contact"}
      onClick={() => goTo("/contact")}
      text="Support"
      icon={Lifebuoy24Icon}
    />
  </>)
  
  return (
    <>
    <style dangerouslySetInnerHTML={{__html: `
      /* temporary! Remove this once the design system styles have been fully embraced */
      .${classes.root} ${ToniqToggleButton.tagName} {
        font: inherit;
        font-weight: bold;
        font-size: 1.2em;
        text-transform: uppercase;
      }
      .${classes.smallScreenNav} ${ToniqToggleButton.tagName} {
        margin: 8px 16px;
      }
    `}} />
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" style={{zIndex: 1400, background: "white" }}>
        <Toolbar style={{gap: '4px', alignItems: 'stretch'}}>
          <Typography variant="h6" noWrap>
            <a onClick={() => goTo("/")}><img
              alt="Entrepot"
              src="/logo.jpg"
              style={{ height: 64, cursor: "pointer" }}
            /></a>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.bigScreenNavButtons}>
            {navBarButtons}
            <Button
              onClick={handleDrawerToggle}
              color="inherit"
              className={[classes.button].join(' ')}
              >
              <AccountBalanceWalletIcon fontSize="large" />
            </Button>
          </div>

          <IconButton className={classes.smallScreenButton}>
            <AccountBalanceWalletIcon onClick={() => {setOpen(false); setWalletOpen(!walletOpen)}} />
          </IconButton>
          <IconButton className={classes.smallScreenButton}>
            <MenuIcon onClick={() => {setOpen(!open); setWalletOpen(false)}} />
          </IconButton>
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
      view={props.view}
      setBalance={props.setBalance}
      identity={props.identity}
      account={props.account}
      loader={props.loader}
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

const useStyles = makeStyles((theme) => {
  console.log({breakpoints: theme.breakpoints, sm: theme.breakpoints.up("sm")});
  
  // ideally this value would get calculated at run time based on how wide the nav
  // bar buttons are
  const hamburgerBreakPixel = '900px';
  const minHamburgerMenuBreakpoint = `@media (min-width:${hamburgerBreakPixel})`;
  const maxHamburgerMenuBreakpoint = `@media (max-width:${hamburgerBreakPixel})`;
  
  return ({
    smallScreenButton: {
      alignSelf: 'center',
      [minHamburgerMenuBreakpoint]: {
        display: "none",
      },
    },
    smallScreenNav: {
      position: "absolute",
      top: 72,
      width: "250px",
      display: "flex",
      right: 0,
      backgroundColor: "white",
      height: "100vh",
      justifyContent: "flex-start",
      flexDirection: "column",
      [minHamburgerMenuBreakpoint]: {
        display: "none",
      },
    },
    root: {
      display: "flex",
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [minHamburgerMenuBreakpoint]: {
        display: "none",
      },
    },
    toolbar: theme.mixins.toolbar,
    toolbarButtons: {
      marginLeft: "auto",
    },
    content: {
      flexGrow: 1,
    },
    marketplace: {
      backgroundImage : "url('/icon/marketplace.png')",
      backgroundRepeat : "no-repeat",
      backgroundSize : "20px",
      backgroundPosition: "0 49%",
      paddingLeft : 30,
      "&:hover, &.selected": {
        backgroundImage : "url('/icon/marketplace-g.png')",      
      },
    },
    create: {
      backgroundImage : "url('/icon/create.png')",
      backgroundRepeat : "no-repeat",
      backgroundSize : "20px",
      backgroundPosition: "0 49%",
      paddingLeft : 30,
      "&:hover, &.selected": {
        backgroundImage : "url('/icon/create-g.png')",      
      },
    },
    contact: {
      backgroundImage : "url('/icon/support.png')",
      backgroundRepeat : "no-repeat",
      backgroundSize : "20px",
      backgroundPosition: "0 49%",
      paddingLeft : 30,
      "&:hover, &.selected": {
        backgroundImage : "url('/icon/support-g.png')",      
      },
    },
    watchlist: {
      backgroundImage : "url('/icon/watchlist.png')",
      backgroundRepeat : "no-repeat",
      backgroundSize : "20px",
      backgroundPosition: "0 49%",
      paddingLeft : 30,
      "&:hover, &.selected": {
        backgroundImage : "url('/icon/watchlist-g.png')",      
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
      fontSize: "1.2em",
      fontWeight: "bold",
      borderBottom: "3px solid transparent",
      borderRadius: 0,
      textAlign: "left",
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: "30px",
      paddingTop: "40px",
      height: 73,
      "&:hover": {
        color: "#00d092 !important",
        backgroundColor: "#fff",
        borderBottom: "3px solid #00d092 !important",
      },
    },
  });
});
