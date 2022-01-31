/* global BigInt */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import React from 'react';
import {useParams} from 'react-router';
import Timestamp from 'react-timestamp';
import extjs from '../../ic/extjs.js';
import Flip from '../Flip';
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
var subs = [];
export default function BlockchainHeroes(props) {
    const [page, setPage] = React.useState(1);
    const [price, setPrice] = React.useState(150000000n);
    const [remaining, setRemaining] = React.useState(4950);
    const [startTime, setStartTime] = React.useState(1636729200000);
    var saleOver = false;

    const onFlip = async (a) => {
        for (var i = 0; i < subs.length; i++) {
            if (i == a) continue;
            subs[i]();
        }
    };
    const flipSubscriber = async (i, a) => {
        subs[i] = a;
    };
    const params = useParams();

    const _updates = async () => {
        var stats = await api
            .canister('poyn6-dyaaa-aaaah-qcfzq-cai', 'sale')
            .salesStats(props.account ? props.account.address : '');
        setStartTime(Number(stats[0] / 1000000n));
        setPrice(stats[1]);
        setRemaining(Number(stats[2]));
    };
    const theme = useTheme();
    const classes = useStyles();
    const styles = {
        main: {
            maxWidth: 1200,
            margin: '0 auto',
            textAlign: 'center',
            minHeight: 'calc(100vh - 221px)',
        },
    };
    const buyFromSale = async (qty, price) => {
        if (props.balance < price + 10000n) {
            return props.alert(
                'There was an error',
                'Your balance is insufficient to complete this transaction',
            );
        }
        var v = await props.confirm(
            'Please confirm',
            'Are you sure you want to continue with this purchase of ' +
                qty +
                ' NFT' +
                (qty === 1 ? '' : 's') +
                ' for the total price of ' +
                _showListingPrice(price) +
                " ICP. All transactions are final on confirmation and can't be reversed.",
        );
        if (!v) return;
        try {
            if (qty === 1) {
                props.loader(true, 'Reserving Pack...');
            } else {
                props.loader(true, 'Reserving Packs..');
            }
            const api = extjs.connect('https://boundary.ic0.app/', props.identity);
            var r = await api
                .canister('poyn6-dyaaa-aaaah-qcfzq-cai', 'sale')
                .reserve(price, qty, props.account.address, _getRandomBytes());
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
                    r3 = await api
                        .canister('poyn6-dyaaa-aaaah-qcfzq-cai', 'sale')
                        .retreive(paytoaddress);
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
    useInterval(_updates, 5 * 1000);
    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var buyOptions = [
        [1, 150000000n],
        [5, 750000000n],
        [10, 1500000000n],
        [20, 3000000000n],
    ];
    return (
        <>
            <div style={styles.main}>
                <div className={classes.banner}>
                    <div
                        style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 10,
                            backgroundPosition: 'top',
                            backgroundSize: 'cover',
                            backgroundImage: "url('/collections/bh/banner.png')",
                        }}
                    ></div>
                    <h1>Welcome to the official Blockchain Heroes sale</h1>
                    <p>
                        Entrepot is thrilled to welcome the best-selling Blockchain Heroes series to
                        the Internet Computer! Originally presented on the WAX blockchain in Summer
                        of 2020, Blockchain Heroes is a set of 50 super heroes inspired by
                        real-world blockchain and crypto personalities. When the initial set was
                        offered in August 2020, 12500 packs sold out in just 20 minutes! Since that
                        time, the team has released two additional series, with the latter selling
                        out in just 35 seconds.
                    </p>
                    <p>
                        Now we are pleased to issue the original 50 heroes on ICP with all NEW
                        variations. 5000 packs are being made available, with each pack containing
                        five (5) random hero cards from the set. Each of the fifty heroes is
                        available in common, uncommon, rare, epic, legendary and mythic variations,
                        with odds of getting variations decreasing as the rarity increases. Packs
                        will be made available at 12 pm EST on November 12th for just 1.5 ICP! If
                        previous sales of Blockchain Heroes are any indication, we expect this sale
                        to go very fast. So be locked and loaded with your ICP to grab yours.
                    </p>
                    <p>
                        Will you get an epic Captain Crypto, a legendary Lady Lightning or the
                        elusive mythic Genesis? Grab your packs and rip them open to find out!
                    </p>
                    <br />
                    <p>
                        <strong>Click a card to read the character's lore!</strong>
                    </p>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Flip
                            id={0}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[3, 0]}
                        />
                        <Flip
                            id={1}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[40, 1]}
                        />
                        <Flip
                            id={2}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[22, 2]}
                        />
                        <Flip
                            id={3}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[31, 3]}
                        />
                        <Flip
                            id={4}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[1, 4]}
                        />
                        <Flip
                            id={4}
                            showRarity={true}
                            small={true}
                            onFlip={onFlip}
                            flipSubscriber={flipSubscriber}
                            card={[12, 5]}
                        />
                    </Grid>
                </div>
                <br />
                <br />
                <hr />
                {remaining === false ? (
                    <>
                        <br />
                        <br />
                        <Grid container spacing={2} style={{}}>
                            <Grid className={classes.stat} item md={4} xs={6}>
                                <strong>AVAILABLE</strong>
                                <br />
                                <span
                                    style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}
                                >
                                    {remaining ? remaining : 'Loading...'}
                                </span>
                            </Grid>
                            <Grid className={classes.stat} item md={4} xs={6}>
                                <strong>SALE PRICE</strong>
                                <br />
                                <span
                                    style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}
                                >
                                    {_showListingPrice(price)} ICP
                                </span>
                            </Grid>
                            <Grid className={classes.stat} item md={4} xs={6}>
                                <strong>SOLD</strong>
                                <br />
                                <span
                                    style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}
                                >
                                    {remaining ? 4950 - remaining : 'Loading...'}
                                </span>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                    </>
                ) : (
                    ''
                )}
                {remaining === false ? (
                    <>
                        <p>
                            <strong>
                                <span style={{fontSize: '20px', color: 'black'}}>Loading...</span>
                            </strong>
                        </p>
                    </>
                ) : (
                    <>
                        {!saleOver && remaining > 0 ? (
                            <>
                                {Date.now() >= startTime ? (
                                    <>
                                        <Grid container spacing={2} style={{}}>
                                            {buyOptions.map((o) => {
                                                return (
                                                    <Grid className={classes.stat} item sm={3}>
                                                        <Button
                                                            variant={'contained'}
                                                            color={'primary'}
                                                            onClick={() => buyFromSale(o[0], o[1])}
                                                            style={{
                                                                fontWeight: 'bold',
                                                                margin: '0 auto',
                                                            }}
                                                        >
                                                            Buy {o[0]} Pack{o[0] === 1 ? '' : 's'}
                                                            <br />
                                                            for {_showListingPrice(o[1])} ICP
                                                        </Button>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                        <p>
                                            <strong>Please note:</strong> All transactions are
                                            secured via Entrepot's escrow platform. There are no
                                            refunds or returns, once a transaction is made it can
                                            not be reversed. Entrepot provides a transaction service
                                            only. By clicking one of the buttons above you show
                                            acceptance of our{' '}
                                            <a
                                                href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit"
                                                target="_blank"
                                            >
                                                Terms of Service
                                            </a>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            <strong>
                                                <span style={{fontSize: '20px', color: 'black'}}>
                                                    The public sale starts{' '}
                                                    <Timestamp
                                                        relative
                                                        autoUpdate
                                                        date={startTime / 1000}
                                                    />
                                                    !
                                                </span>
                                            </strong>
                                        </p>
                                    </>
                                )}
                            </>
                        ) : (
                            <p>
                                <strong>
                                    <span style={{fontSize: '20px', color: 'red'}}>
                                        Sorry, the sale is now over! You can grab your Hero from the
                                        marketplace soon!
                                    </span>
                                </strong>
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
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
