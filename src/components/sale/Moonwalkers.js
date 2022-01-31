/* global BigInt */
import Grid from '@material-ui/core/Grid';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';
import {useParams} from 'react-router';
import extjs from '../../ic/extjs.js';
import SaleListing from '../SaleListing';
const api = extjs.connect('https://boundary.ic0.app/');
const perPage = 60;
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
const _showListingPrice = (n) => {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
};
const _getRandomBytes = () => {
    var bs = [];
    for (var i = 0; i < 32; i++) {
        bs.push(Math.floor(Math.random() * 256));
    }
    return bs;
};
export default function Moonwalkers(props) {
    const [page, setPage] = React.useState(1);
    const [loaded, setLoaded] = React.useState(false);
    const [assets, setAssets] = React.useState(false);
    const [price, setPrice] = React.useState(630000000n);
    const [quantity, setQuantity] = React.useState('Loading...');
    const [time, setTime] = React.useState(1635260400000);

    const params = useParams();

    const _updates = async () => {
        var stats = await api
            .token('er7d4-6iaaa-aaaaj-qac2q-cai')
            .call.salesStats(props.account ? props.account.address : '');
        setPrice(stats[0]);
        if (stats[1].length) {
            setQuantity(stats[1][0]);
        } else {
            setQuantity('No limit');
        }
        setTime(stats[2]);
        setAssets(stats[3]);
        console.log(stats);
    };
    const theme = useTheme();
    const classes = useStyles();
    const styles = {
        root: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },

        empty: {
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
        },
        grid: {
            flexGrow: 1,
            padding: theme.spacing(2),
        },

        largeIcon: {
            width: 60,
            height: 60,
        },
    };
    const buyFromSale = async (handle) => {
        if (props.balance < price + 10000n) {
            return props.alert(
                'There was an error',
                'Your balance is insufficient to complete this transaction',
            );
        }
        var v = await props.confirm(
            'Please confirm',
            "Are you sure you want to continue with this purchase? All transactions are final on confirmation and can't be reversed.",
        );
        if (!v) return;
        try {
            props.loader(true, 'Reserving Moonwalker...');
            const api = extjs.connect('https://boundary.ic0.app/', props.identity);
            var r = await api
                .canister('er7d4-6iaaa-aaaaj-qac2q-cai')
                .reserve(price, handle, props.account.address, _getRandomBytes());
            if (r.hasOwnProperty('err')) {
                throw r.err;
            }
            var paytoaddress = r.ok[0];
            var pricetopay = r.ok[1];
            props.loader(true, 'Transferring ICP...');
            await api
                .token()
                .transfer(
                    props.identity.getPrincipal(),
                    props.currentAccount,
                    paytoaddress,
                    pricetopay,
                    10000,
                );
            var r3;
            while (true) {
                try {
                    props.loader(true, 'Completing purchase...');
                    r3 = await api.canister('er7d4-6iaaa-aaaaj-qac2q-cai').retreive(paytoaddress);
                    if (r3.hasOwnProperty('ok')) break;
                } catch (e) {}
            }
            props.loader(false);
            props.alert(
                'Transaction complete',
                'Your purchase was made successfully - your NFT will be sent to your address shortly',
            );
            _updates();
        } catch (e) {
            props.loader(false);
            props.alert(
                'There was an error',
                e.Other ??
                    (typeof e == 'string'
                        ? e
                        : 'You may need to enable cookies or try a different browser'),
            );
        }
    };
    const getNextIncreaseTime = () => {
        var next = 1635260400000;
        var now = Date.now();
        while (now > next) {
            next += 86400000;
        }
        return next / 1000;
    };
    useInterval(_updates, 60 * 1000);
    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.account]);

    return (
        <div style={{minHeight: 'calc(100vh - 221px)'}}>
            <div style={styles.empty}>
                <h1>MoonWalkers</h1>
                <Grid container spacing={2} style={{}}>
                    <Grid className={classes.stat} item md={4} xs={6}>
                        <strong>AVAILABLE</strong>
                        <br />
                        <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                            {assets ? assets.length : 'Loading...'}
                        </span>
                    </Grid>
                    <Grid className={classes.stat} item md={4} xs={6}>
                        <strong>CURRENT PRICE</strong>
                        <br />
                        <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                            {_showListingPrice(price)} ICP
                        </span>
                    </Grid>
                    <Grid className={classes.stat} item md={4} xs={6}>
                        <strong>SOLD</strong>
                        <br />
                        <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                            {assets ? 9000 - assets.length : 'Loading...'}
                        </span>
                    </Grid>
                </Grid>
            </div>
            <>
                <div style={{marginLeft: '20px', marginTop: '10px'}}>
                    {assets.length > perPage ? (
                        <Pagination
                            className={classes.pagi}
                            size="small"
                            count={Math.ceil(assets.length / perPage)}
                            page={page}
                            onChange={(e, v) => setPage(v)}
                        />
                    ) : (
                        ''
                    )}
                </div>

                <>
                    {assets === false ? (
                        <div style={styles.empty}>
                            <Typography
                                paragraph
                                style={{paddingTop: 20, fontWeight: 'bold'}}
                                align="center"
                            >
                                Loading...
                            </Typography>
                        </div>
                    ) : (
                        <>
                            {assets.length === 0 ? (
                                <div style={styles.empty}>
                                    <Typography
                                        paragraph
                                        style={{paddingTop: 20, fontWeight: 'bold'}}
                                        align="center"
                                    >
                                        There are currently no MoonWalkers left for sale!
                                    </Typography>
                                </div>
                            ) : (
                                <>
                                    <div style={styles.grid}>
                                        <Grid
                                            container
                                            spacing={2}
                                            direction="row"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                        >
                                            {assets
                                                .slice()
                                                .filter(
                                                    (token, i) =>
                                                        i >= (page - 1) * perPage &&
                                                        i < page * perPage,
                                                )
                                                .map((asset, i) => {
                                                    return (
                                                        <SaleListing
                                                            key={asset}
                                                            price={price}
                                                            time={time}
                                                            asset={asset}
                                                            buy={buyFromSale}
                                                        />
                                                    );
                                                })}
                                        </Grid>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>

                {assets.length > perPage ? (
                    <Pagination
                        className={classes.pagi}
                        size="small"
                        count={Math.ceil(assets.length / perPage)}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                    />
                ) : (
                    ''
                )}
            </>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    walletBtn: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    stat: {
        span: {
            fontSize: '2em',
        },
    },
    content: {
        flexGrow: 1,
        marginTop: 73,
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: 300,
        },
    },
}));
