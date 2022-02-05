import {IconButton, makeStyles} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, {useState} from 'react';
import Contact from '../views/Contact';
import Create from '../views/Create';
import Home from '../views/Home';
import Marketplace from '../views/Marketplace';

const routes = {
    home: {
        title: 'Home',
        view: Home,
    },
    marketplace: {
        title: 'Marketplace',
        view: Marketplace,
    },
    create: {
        title: 'Create',
        view: Create,
    },
    contact: {
        title: 'Contact',
        view: Contact,
    },
};
//Helpers
var current = 'home';
var path = '';
var root = window.location.href.split('#', 2);
if (root.length > 1) {
    var paths = root[1].split('/', 2);
    if (routes.hasOwnProperty(paths[0])) current = paths[0];
    path = paths[1] ?? '';
}
var np = root[0] + (current !== 'home' ? '#' + current : '');
if (window.location.href !== np) window.location.href = np;

export default function Entrepot(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [route, setRoute] = React.useState(current);

    const renderView = (r) => {
        switch (r) {
            default:
            case 'marketplace':
                return React.createElement(routes[r].view, {
                    ...props,
                    changeRoute: changeRoute,
                    collection: path,
                });
        }
    };
    const changeRoute = (r) => {
        var np = root[0] + (r !== 'home' ? '#' + r : '');

        if (window.location.href !== np) window.location.href = np;

        setRoute(r);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" style={{background: 'white'}}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        <img
                            onClick={() => changeRoute('home')}
                            alt="Entrepot"
                            src="/logo.jpg"
                            style={{height: 64, cursor: 'pointer'}}
                        />
                    </Typography>
                    <div className={classes.grow} />
                    <Button
                        startIcon={
                            <img
                                alt="marketplace"
                                style={{width: 20}}
                                src="/icon/marketplace.png"
                            />
                        }
                        onClick={() => changeRoute('marketplace')}
                        className={classes.button + (route === 'marketplace' ? ' selected' : '')}
                        color="inherit"
                    >
                        Marketplace
                    </Button>
                    <Button
                        startIcon={<img alt="create" style={{width: 20}} src="/icon/create.png" />}
                        onClick={() => changeRoute('create')}
                        className={classes.button + (route === 'create' ? ' selected' : '')}
                        color="inherit"
                    >
                        Create
                    </Button>
                    <Button
                        startIcon={
                            <img alt="contact" style={{width: 20}} src="/icon/support.png" />
                        }
                        onClick={() => changeRoute('contact')}
                        className={classes.button + (route === 'contact' ? ' selected' : '')}
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
                                startIcon={
                                    <img
                                        alt="marketplace"
                                        style={{width: 20}}
                                        src="/icon/marketplace.png"
                                    />
                                }
                                onClick={() => changeRoute('marketplace')}
                                className={
                                    classes.button1 + (route === 'marketplace' ? ' selected' : '')
                                }
                                color="inherit"
                            >
                                Marketplace
                            </Button>
                            <Button
                                startIcon={
                                    <img alt="create" style={{width: 20}} src="/icon/create.png" />
                                }
                                onClick={() => changeRoute('create')}
                                className={
                                    classes.button1 + (route === 'create' ? ' selected' : '')
                                }
                                color="inherit"
                            >
                                Create
                            </Button>
                            <Button
                                startIcon={
                                    <img
                                        alt="contact"
                                        style={{width: 20}}
                                        src="/icon/support.png"
                                    />
                                }
                                onClick={() => changeRoute('contact')}
                                className={
                                    classes.button1 + (route === 'contact' ? ' selected' : '')
                                }
                                color="inherit"
                            >
                                Support
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {renderView(route)}
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    hidden: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    smNav: {
        position: 'absolute',
        top: 20,
        width: '250px',
        display: 'flex',
        right: 0,
        backgroundColor: 'white',
        height: '100vh',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
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
        marginLeft: 40,
        fontSize: '1.2em',
        fontWeight: 'bold',
        borderBottom: '3px solid transparent',
        borderRadius: 0,
        height: 73,
        '&:hover': {
            color: '#00d092',
            backgroundColor: '#fff',
            borderBottom: '3px solid #00d092',
        },
        '&.selected': {
            color: '#00d092',
            borderBottom: '3px solid #00d092',
        },
        [theme.breakpoints.down('xs')]: {
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
            color: '#00d092',
            backgroundColor: '#fff',
            borderBottom: '3px solid #00d092',
        },
        '&.selected': {
            color: '#00d092',
            borderBottom: '3px solid #00d092',
        },
    },
}));
