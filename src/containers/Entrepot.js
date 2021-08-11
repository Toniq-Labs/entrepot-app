import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Marketplace from '../views/Marketplace';
import About from '../views/About';
import Contact from '../views/Contact';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
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
  button: {
    marginLeft:40, 
    fontSize:"1.2em", 
    borderBottom: '3px solid transparent',
    borderRadius: 0,
    height:73,
    '&:hover': {
      color: '#00d092',
      backgroundColor: '#fff',
      borderBottom: '3px solid #00d092',
    },
    '&.selected': {
      color: '#00d092',
      borderBottom: '3px solid #00d092',
    },
  }

}));


  const routes = {
    'marketplace' : {
      title : "Marketplace",
      view : Marketplace
    },
    'about' : {
      title : "About",
      view : About
    },
    'contact' : {
      title : "Contact",
      view : Contact
    },
  };
//Helpers

export default function Entrepot(props) {
  const classes = useStyles();
  const [route, setRoute] = React.useState('marketplace');

  const renderView = (r) => {
    switch(r){
      default:
      case "marketplace":
        return React.createElement(routes[r].view, {...props, changeRoute : changeRoute})
    }
  }
  const changeRoute = (r) => {
    setRoute(r);
  };
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" style={{ background: 'white' }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <img alt="Entrepot" src="logo.jpg" style={{height:64}} />
          </Typography>
          <div className={classes.grow} />
          <Button onClick={() => setRoute('marketplace')} className={classes.button + (route === 'marketplace' ? " selected" : "")} color="inherit">Marketplace</Button>
          <Button onClick={() => setRoute('about')} className={classes.button + (route === 'about' ? " selected" : "")} color="inherit">About</Button>
          <Button onClick={() => setRoute('contact')} className={classes.button + (route === 'contact' ? " selected" : "")} color="inherit">Support</Button>
        </Toolbar>
      </AppBar>
      {renderView(route)}
    </div>
  );
}
