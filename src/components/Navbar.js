import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Wallet from "../components/Wallet";
import MenuIcon from "@material-ui/icons/Menu";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { IconButton, makeStyles } from "@material-ui/core";

export default function Navbar(props) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("");
  const [walletOpen, setWalletOpen] = React.useState(false);
  const classes = useStyles();

  const handleClick = () => {
    setWalletOpen(false)
    const temp = history.location.pathname.split("/")[1];
    setRoute(temp);
  };
  const goTo = page => {
    history.push(page)
    handleClick();
  };
  const handleDrawerToggle = () => {
    setWalletOpen(!walletOpen);
  };
  React.useEffect(() => {
    const temp = history.location.pathname.split("/")[1];
    setRoute(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" style={{zIndex: 1400, background: "white" }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <a onClick={() => goTo("/")}><img
              alt="Entrepot"
              src="/logo.jpg"
              style={{ height: 64, cursor: "pointer" }}
            /></a>
          </Typography>
          <div className={classes.grow} />
          <Button
            onClick={() => goTo("/sale")}
            className={(route === "sale" ? "selected " : "")+[classes.button, classes.sale].join(' ')}
            color="inherit"
          >
            NFT SALES
          </Button>
          <Button
            onClick={() => {
              history.push("/marketplace");
              handleClick();
            }}
            className={(route === "marketplace" ? "selected " : "")+[classes.button, classes.marketplace].join(' ')}
            color="inherit"
          >
            Marketplace
          </Button>
          <Button
            onClick={() => goTo("/create")}
            className={(route === "create" ? "selected " : "")+[classes.button, classes.create].join(' ')}
            color="inherit"
          >
            Create
          </Button>
          <Button
            onClick={() => goTo("/contact")}
            className={(route === "contact" ? "selected " : "")+[classes.button, classes.contact].join(' ')}
            color="inherit"
          >
            Support
          </Button>
          <Button
            onClick={handleDrawerToggle}
            color="inherit"
            className={[classes.button].join(' ')}
          >
          <AccountBalanceWalletIcon fontSize="large" />
          </Button>

          <IconButton className={classes.hidden}>
            <MenuIcon onClick={() => {setOpen(true); setWalletOpen(false)}} />
          </IconButton>
          {open && (
            <div className={classes.smNav} onClick={() => setOpen(false)}>
              <Button
                startIcon={
                  <img
                    alt="marketplace"
                    style={{ width: 20 }}
                    src="/icon/anchor.png"
                  />
                }
                onClick={() => goTo("/sale")}
                className={classes.button1}
                style={{
                  color: route === "sale" ? "#00d092" : "#000",
                  borderBottom:
                    route === "sale"
                      ? "3px solid #00d092"
                      : "3px solid transparent",
                }}
                color="inherit"
              >
                NFT SALES
              </Button>
              <Button
                startIcon={
                  <img
                    alt="marketplace"
                    style={{ width: 20 }}
                    src="/icon/marketplace.png"
                  />
                }
                onClick={() => goTo("/marketplace")}
                className={classes.button1}
                style={{
                  color: route === "marketplace" ? "#00d092" : "#000",
                  borderBottom:
                    route === "marketplace"
                      ? "3px solid #00d092"
                      : "3px solid transparent",
                }}
                color="inherit"
              >
                Marketplace
              </Button>
              <Button
                startIcon={
                  <img
                    alt="create"
                    style={{ width: 20 }}
                    src="/icon/create.png"
                  />
                }
                onClick={() => goTo("/create")}
                className={classes.button1}
                style={{
                  color: route === "create" ? "#00d092" : "#000",
                  borderBottom:
                    route === "create"
                      ? "3px solid #00d092"
                      : "3px solid transparent",
                }}
                color="inherit"
              >
                Create
              </Button>
              <Button
                startIcon={
                  <img
                    alt="contact"
                    style={{ width: 20 }}
                    src="/icon/support.png"
                  />
                }
                onClick={() => goTo("/contact")}
                className={classes.button1}
                style={{
                  color: route === "contact" ? "#00d092" : "#000",
                  borderBottom:
                    route === "contact"
                      ? "3px solid #00d092"
                      : "3px solid transparent",
                }}
                color="inherit"
              >
                Support
              </Button>
              <Button
                startIcon={
                  <AccountBalanceWalletIcon />
                }
                onClick={handleDrawerToggle}
                className={classes.button1}
                style={{
                  color: "#000",
                  borderBottom:"3px solid transparent",
                }}
                color="inherit"
              >
              Wallet
              </Button>
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
      changeAccount={props.setCurrentAccount}
      accounts={props.accounts}
      close={() => setWalletOpen(false)}
      open={walletOpen}
    />
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  hidden: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  smNav: {
    position: "absolute",
    top: 20,
    width: "250px",
    display: "flex",
    right: 0,
    backgroundColor: "white",
    height: "100vh",
    justifyContent: "flex-start",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
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
    [theme.breakpoints.up("sm")]: {
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
  sale: {
    backgroundImage : "url('/icon/anchor.png')",
    backgroundRepeat : "no-repeat",
    backgroundSize : "20px",
    backgroundPosition: "0 49%",
    paddingLeft : 30,
    "&:hover, &.selected": {
      backgroundImage : "url('/icon/anchor-g.png')",      
    },
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
  button: {
    marginLeft: 30,
    fontSize: "1.2em",
    fontWeight: "bold",
    borderBottom: "3px solid transparent",
    borderRadius: 0,
    height: 73,
    "&:hover, &.selected": {
      color: "#00d092 !important",
      backgroundColor: "#fff",
      borderBottom: "3px solid #00d092 !important",
    },

    [theme.breakpoints.down("xs")]: {
      display: "none",
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
}));
