import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Menu";
import { IconButton, makeStyles } from "@material-ui/core";

export default function Navbar(props) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("");
  const classes = useStyles();

  const handleClick = () => {
    const temp = history.location.pathname.split("/")[1];
    setRoute(temp);
  };

  useEffect(() => {
    handleClick();
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" style={{ background: "white" }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <img
              onClick={() => history.push("/")}
              alt="Entrepot"
              src="/logo.jpg"
              style={{ height: 64, cursor: "pointer" }}
            />
          </Typography>
          <div className={classes.grow} />
          <Button
            onClick={() => {
              history.push("/sale");
              handleClick();
            }}
            className={(route === "sale" ? "selected " : "")+[classes.button, classes.sale].join(' ')}
            color="inherit"
          >
            NFT SALES
          </Button>
          <Button
            onClick={() => {
              history.push("/marketplace/moonwalkers");
              handleClick();
            }}
            className={(route === "marketplace" ? "selected " : "")+[classes.button, classes.marketplace].join(' ')}
            color="inherit"
          >
            Marketplace
          </Button>
          <Button
            onClick={() => {
              history.push("/create");
              handleClick();
            }}
            className={(route === "create" ? "selected " : "")+[classes.button, classes.create].join(' ')}
            color="inherit"
          >
            Create
          </Button>
          <Button
            onClick={() => {
              history.push("/contact");
              handleClick();
            }}
            className={(route === "contact" ? "selected " : "")+[classes.button, classes.contact].join(' ')}
            color="inherit"
          >
            Support
          </Button>

          <IconButton className={classes.hidden}>
            <MenuIcon onClick={() => setOpen(true)} />
          </IconButton>
          {open && (
            <div className={classes.smNav} onClick={() => setOpen(false)}>
              <Button
                onClick={() => {
                  history.push("/sale");
                  handleClick();
                }}
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
                onClick={() => {
                  history.push("/marketplace/moonwalkers");
                  handleClick();
                }}
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
                onClick={() => {
                  history.push("/create");
                  handleClick();
                }}
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
                onClick={() => {
                  history.push("/contact");
                  handleClick();
                }}
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
            </div>
          )}
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
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
    marginLeft: 40,
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
