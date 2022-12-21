import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import {createSearchParams, useSearchParams} from 'react-router-dom';
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
import {subscribe, unsubscribe} from '../events/events';
import {loadVolt, loadVoltBalance} from '../volt';

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
    const location = useLocation();
    const [
        open,
        setOpen,
    ] = useState(false);
    const [
        walletOpen,
        setWalletOpen,
    ] = React.useState(false);
    const [
        balance,
        setBalance,
    ] = React.useState(undefined);
    const classes = useStyles();
    const [searchParams] = useSearchParams();
    const newParam = useRef('');
    let query = useRef(
        location.pathname !== '/marketplace' ? searchParams.get('search') || '' : '',
    );

    const [
        voltBalances,
        setVoltBalances,
    ] = React.useState(undefined);
    const [
        totalBalance,
        setTotalBalance,
    ] = React.useState(undefined);

    React.useEffect(() => {
        var totalBalance = 0;
        if (balance) totalBalance += Number(balance);
        if (voltBalances && props.currentAccount === 0) totalBalance += voltBalances[0];
        if (totalBalance > 0) setTotalBalance(totalBalance);
    }, [
        props.account,
        props.identity,
        balance,
        voltBalances,
    ]);

    const refresh = async () => {
        if (props.account) {
            var b = await api.token().getBalance(props.account.address);
            setBalance(b);
            if (props.currentAccount === 0) setVoltBalances(await loadVoltBalance(props.identity));
        } else {
            setBalance(undefined);
        }
    };

    useEffect(() => {
        refresh();
        subscribe('toggleDrawer', () => handleDrawerToggle());

        return () => {
            unsubscribe('toggleDrawer');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useInterval(refresh, 5 * 1000);

    useEffect(() => {
        setTotalBalance(undefined);
        refresh();
    }, [props.account]);

    const logout = () => {
        setTotalBalance(undefined);
        props.logout();
    };
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
                toggled={props.view === 'sale'}
                onClick={() => goTo('/sale')}
                text="Launchpad"
                icon={Rocket24Icon}
            />
            <ToniqToggleButton
                className="toniq-toggle-button-text-only"
                toggled={props.view === 'marketplace'}
                onClick={() => goTo('/marketplace')}
                text="Marketplace"
                icon={BuildingStore24Icon}
            />
            <ToniqToggleButton
                className="toniq-toggle-button-text-only"
                toggled={props.view === 'earn'}
                onClick={() => goTo('/earn')}
                text="Earn"
                icon={Infinity24Icon}
            />
            <ToniqToggleButton
                className="toniq-toggle-button-text-only"
                toggled={props.view === 'create'}
                onClick={() => goTo('/create')}
                text="Create"
                icon={Geometry24Icon}
            />
            <ToniqToggleButton
                className="toniq-toggle-button-text-only"
                toggled={props.view === 'contact'}
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
                <AppBar
                    position="fixed"
                    style={{
                        zIndex: 1400,
                        background: 'white',
                        ...(props.showHeaderShadow
                            ? {}
                            : {
                                  boxShadow: 'none',
                              }),
                    }}
                >
                    <Toolbar style={{gap: '4px', alignItems: 'stretch', minHeight: '70px'}}>
                        <Typography
                            style={{display: 'flex', alignItems: 'center'}}
                            variant="h6"
                            noWrap
                        >
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
                            style={{
                                alignSelf: 'center',
                                marginLeft: '16px',
                                flexGrow: 1,
                            }}
                            icon={Search24Icon}
                            placeholder="Search for NFTs..."
                            value={query.current}
                            onValueChange={event => {
                                newParam.current = event.detail;
                            }}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    const searchInput =
                                        event.target.shadowRoot.querySelector('input');
                                    if (searchInput) {
                                        searchInput.value = '';
                                        searchInput.blur();
                                    }
                                    navigate({
                                        pathname: 'marketplace',
                                        search: `?${createSearchParams(
                                            newParam.current ? {search: newParam.current} : {},
                                        )}`,
                                    });
                                }
                            }}
                        />
                        <div className={classes.bigScreenNavButtons}>{navBarButtons}</div>

                        <ToniqToggleButton
                            className={`toniq-toggle-button-text-only ${classes.smallScreenMenuButton}`}
                            toggled={open}
                            onClick={() => {
                                setWalletOpen(false);
                                setOpen(!open);
                            }}
                            icon={Menu24Icon}
                        />
                        <ToniqToggleButton
                            className={`toniq-toggle-button-text-only ${classes.superSmallScreenWalletButton}`}
                            toggled={walletOpen}
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
                            text={
                                totalBalance === undefined
                                    ? ''
                                    : icpToString(totalBalance, true, true)
                            }
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
                logout={logout}
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
            alignItems: 'stretch',
            padding: '16px 0',
            gap: '8px',
            paddingLeft: '16px',
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
