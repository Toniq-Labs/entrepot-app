import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Timestamp from 'react-timestamp';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {createEntrepotApiWithIdentity} from '../../typescript/api/entrepot-apis/entrepot-data-api';

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
const _showListingPrice = n => {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
};
export default function V2SaleComponent(props) {
    const getCollectionFromRoute = r => {
        return props.collections.find(e => e.route === r);
    };
    const params = useParams();
    const navigate = useNavigate();
    var collection = getCollectionFromRoute(params?.route);
    if (
        typeof collection == 'undefined' ||
        typeof collection.sale == 'undefined' ||
        collection.sale == false
    ) {
        navigate(`/marketplace/${collection?.route}`);
    }

    const [
        currentPriceGroup,
        setCurrentPriceGroup,
    ] = React.useState(false);
    const [
        groups,
        setGroups,
    ] = React.useState([]);
    const [
        remaining,
        setRemaining,
    ] = React.useState(false);
    const [
        sold,
        setSold,
    ] = React.useState(false);
    const [
        startTime,
        setStartTime,
    ] = React.useState(false);
    const [
        endTime,
        setEndTime,
    ] = React.useState(false);
    const [
        totalToSell,
        setTotalToSell,
    ] = React.useState(false);
    const [
        blurbElement,
        setBlurbElement,
    ] = useState(false);
    const [
        collapseBlurb,
        setCollapseBlurb,
    ] = useState(false);
    const [
        isBlurbOpen,
        setIsBlurbOpen,
    ] = useState(false);

    React.useEffect(() => {
        if (blurbElement.clientHeight > 110) {
            setCollapseBlurb(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blurbElement]);

    const _updates = async () => {
        const entrepotApi = createEntrepotApiWithIdentity(props.identity);
        var resp = await entrepotApi
            .canister(collection.canister, 'ext2')
            .ext_saleSettings(props.account ? props.account.address : '');
        if (!resp.length) return;
        var salesSettings = resp[0];
        setStartTime(Number(salesSettings.start / 1000000n));
        setEndTime(Number(salesSettings.end / 1000000n));
        setRemaining(Number(salesSettings.remaining));
        setTotalToSell(Number(salesSettings.quantity));
        setSold(Number(salesSettings.quantity - salesSettings.remaining));
        var ended = [];
        var unavailable = [];
        var live = [];
        var soon = [];
        for (var i = 0; i < salesSettings.groups.length; i++) {
            var g = salesSettings.groups[i];
            if (Number(g.end / 1000000n) < Date.now()) {
                ended.push(g);
            } else if (!g.available) {
                unavailable.push(g);
            } else if (Number(g.start / 1000000n) > Date.now()) {
                soon.push(g);
            } else {
                live.push(g);
            }
        }
        //Sort ended, available and soon by start date
        ended = ended.sort((a, b) => {
            if (Number(a.start / 1000000n) < Number(b.start / 1000000n)) return -1;
            if (Number(a.start / 1000000n) > Number(b.start / 1000000n)) return 1;
            return 0;
        });
        unavailable = unavailable.sort((a, b) => {
            if (Number(a.start / 1000000n) < Number(b.start / 1000000n)) return -1;
            if (Number(a.start / 1000000n) > Number(b.start / 1000000n)) return 1;
            return 0;
        });
        soon = soon.sort((a, b) => {
            if (Number(a.start / 1000000n) < Number(b.start / 1000000n)) return -1;
            if (Number(a.start / 1000000n) > Number(b.start / 1000000n)) return 1;
            return 0;
        });
        //Sort live by price
        if (live.length) {
            live = live.sort((a, b) => {
                if (Number(a.pricing[0][1]) < Number(b.pricing[0][1])) return -1;
                if (Number(a.pricing[0][1]) > Number(b.pricing[0][1])) return 1;
                return 0;
            });
            if (currentPriceGroup === false) setCurrentPriceGroup(Number(live[0].id));
            var g = ended.concat(unavailable).concat(live).concat(soon);
            setGroups(g);
        } else {
            var g = ended.concat(unavailable).concat(live).concat(soon);
            setGroups(g);
            if (g.length && currentPriceGroup === false) setCurrentPriceGroup(Number(g[0].id));
        }
    };
    const classes = useStyles();
    const styles = {
        main: {
            maxWidth: 1200,
            margin: '0 auto',
            textAlign: 'center',
            minHeight: 'calc(100vh - 221px)',
        },
    };
    const buyFromSale = async (id, qty, price) => {
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
                props.loader(true, 'Reserving NFT...');
            } else {
                props.loader(true, 'Reserving NFTs..');
            }
            const entrepotApi = createEntrepotApiWithIdentity(props.identity);
            var r = await entrepotApi
                .canister(collection.canister, 'ext2')
                .ext_salePurchase(id, price, qty, props.account.address);
            if (r.hasOwnProperty('err')) {
                throw r.err;
            }
            var payToAddress = r.ok[0];
            var priceToPay = r.ok[1];
            props.loader(true, 'Transferring ICP...');
            await entrepotApi
                .token()
                .transfer(
                    props.identity.getPrincipal(),
                    props.currentAccount,
                    payToAddress,
                    priceToPay,
                    10000,
                );
            var r3;
            while (true) {
                try {
                    props.loader(true, 'Completing purchase...');
                    r3 = await entrepotApi
                        .canister(collection.canister, 'ext2')
                        .ext_saleSettle(payToAddress);
                } catch (e) {
                    continue;
                }
                if (r3.hasOwnProperty('ok')) break;
                if (r3.hasOwnProperty('err'))
                    throw 'Your purchase failed! If ICP was sent and the sale ran out, you will be refunded shortly!';
            }
            props.loader(false);
            props.alert(
                'Transaction complete',
                'Your purchase was made successfully - your NFT will be sent to your address shortly',
            );
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
        _updates();
    };
    const getCurrentGroup = () => groups.find(a => Number(a.id) == currentPriceGroup);
    useInterval(_updates, 10 * 1000);
    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                            backgroundImage: "url('" + collection.banner + "')",
                        }}
                    ></div>
                    <h1>Welcome to the official {collection.name} sale</h1>
                </div>
                <div>
                    <a
                        href={'https://icscan.io/nft/collection/' + collection.canister}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img alt="create" style={{width: 32}} src={'/icon/icscan.png'} />
                    </a>
                    {[
                        'telegram',
                        'twitter',
                        'medium',
                        'discord',
                        'dscvr',
                        'distrikt',
                    ]
                        .filter(a => collection.hasOwnProperty(a) && collection[a])
                        .map((a, index) => {
                            return (
                                <a
                                    key={index}
                                    href={collection[a]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        alt="create"
                                        style={{width: 32}}
                                        src={'/icon/' + a + '.png'}
                                    />
                                </a>
                            );
                        })}
                </div>
                <div
                    ref={e => {
                        setBlurbElement(e);
                    }}
                    style={{
                        ...(collapseBlurb && !isBlurbOpen
                            ? {
                                  maxHeight: 110,
                                  wordBreak: 'break-word',
                                  WebkitMask:
                                      'linear-gradient(rgb(255, 255, 255) 45%, transparent)',
                              }
                            : {}),
                        overflow: 'hidden',
                        fontSize: '1.2em',
                    }}
                    dangerouslySetInnerHTML={{__html: collection?.blurb}}
                ></div>
                {collapseBlurb ? (
                    <Button
                        fullWidth
                        endIcon={!isBlurbOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                    ></Button>
                ) : (
                    ''
                )}
                <br />
                <br />
                <Grid
                    justifyContent="center"
                    direction="row"
                    alignItems="center"
                    container
                    spacing={2}
                    style={{}}
                >
                    {startTime >= Date.now() ? (
                        <Grid className={classes.stat} item md={3} xs={6}>
                            <strong>START DATE</strong>
                            <br />
                            <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                                {startTime !== false ? (
                                    <Timestamp relative autoUpdate date={startTime / 1000} />
                                ) : (
                                    'Loading...'
                                )}
                            </span>
                        </Grid>
                    ) : (
                        <Grid className={classes.stat} item md={3} xs={6}>
                            <strong>END DATE</strong>
                            <br />
                            <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                                {endTime !== false ? (
                                    <Timestamp relative autoUpdate date={endTime / 1000} />
                                ) : (
                                    'Loading...'
                                )}
                            </span>
                        </Grid>
                    )}
                    <Grid className={classes.stat} item md={3} xs={6}>
                        <strong>AVAILABLE</strong>
                        <br />
                        <span style={{fontWeight: 'bold', color: '#00b894', fontSize: '2em'}}>
                            {remaining !== false ? remaining : 'Loading...'}
                        </span>
                    </Grid>
                    <Grid className={classes.stat} item md={3} xs={6}>
                        <strong>SOLD</strong>
                        <br />
                        <span style={{fontWeight: 'bold', color: 'rgb(189 1 1)', fontSize: '2em'}}>
                            {sold !== false
                                ? collection.canister === '7i54s-nyaaa-aaaal-abomq-cai'
                                    ? sold + 362
                                    : collection.canister === 'tfpyv-wyaaa-aaaal-qbonq-cai'
                                    ? sold + 68
                                    : sold
                                : 'Loading...'}
                        </span>
                    </Grid>
                    <Grid className={classes.stat} item xs={10}>
                        <LinearProgress
                            variant="buffer"
                            value={Math.round((remaining / totalToSell) * 100)}
                            valueBuffer={Math.round((remaining / totalToSell) * 100)}
                        />
                    </Grid>
                </Grid>
                <br />
                <br />
                <>
                    {!groups.length ? (
                        <>
                            {startTime ? (
                                <p>
                                    <strong>
                                        <span style={{fontSize: '20px', color: 'red'}}>
                                            Sorry, your address is not eligible for this sale!
                                        </span>
                                    </strong>
                                </p>
                            ) : (
                                <p>
                                    <strong>
                                        <span style={{fontSize: '20px', color: 'black'}}>
                                            Loading...
                                        </span>
                                    </strong>
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            {sold >= totalToSell ? (
                                <>
                                    <p>
                                        <strong>
                                            <span style={{fontSize: '20px', color: 'red'}}>
                                                Sorry, the sale is now over! You can grab your NFT
                                                from the marketplace!
                                            </span>
                                        </strong>
                                    </p>
                                    <Button
                                        className={classes.marketBtn}
                                        variant={'outlined'}
                                        onClick={() => navigate(`/marketplace/` + collection.route)}
                                        color={'primary'}
                                        style={{fontWeight: 'bold', margin: '20px auto'}}
                                    >
                                        Explore the Marketplace
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Tabs
                                        value={currentPriceGroup}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        centered={false}
                                        scrollButtons="on"
                                        variant="scrollable"
                                        onChange={(e, nv) => {
                                            setCurrentPriceGroup(nv);
                                        }}
                                    >
                                        {groups.map((group, index) => {
                                            var badge, badgeColor;
                                            if (Number(group.end / 1000000n) < Date.now()) {
                                                badge = 'ENDED';
                                                badgeColor = '#CC3232';
                                            } else if (!group.available) {
                                                badge = 'N/A';
                                                badgeColor = '#CC3232';
                                            } else if (
                                                Number(group.start / 1000000n) > Date.now()
                                            ) {
                                                badge = 'SOON';
                                                badgeColor = '#DB7B2B';
                                            } else {
                                                badge = 'LIVE';
                                                badgeColor = '#99C140';
                                            }
                                            if (badge) {
                                                return (
                                                    <Tab
                                                        key={index}
                                                        className={classes.tabsViewTab}
                                                        value={Number(group.id)}
                                                        label={
                                                            <span style={{padding: '0 0px'}}>
                                                                {group.name}
                                                                <Chip
                                                                    color="primary"
                                                                    style={{
                                                                        color: 'white',
                                                                        fontSize: '10px',
                                                                        backgroundColor: badgeColor,
                                                                        marginLeft: 20,
                                                                    }}
                                                                    size="small"
                                                                    label={badge}
                                                                />
                                                            </span>
                                                        }
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <Tab
                                                        className={classes.tabsViewTab}
                                                        value={Number(group.id)}
                                                        label={
                                                            <span style={{padding: '0 0px'}}>
                                                                {group.name}
                                                            </span>
                                                        }
                                                    />
                                                );
                                            }
                                        })}
                                    </Tabs>
                                </>
                            )}
                        </>
                    )}
                </>
                <br />
                <br />
                <>
                    {getCurrentGroup() ? (
                        <>
                            {Number(getCurrentGroup().end / 1000000n) < Date.now() ? (
                                <p>
                                    <strong>
                                        <span style={{fontSize: '20px', color: 'black'}}>
                                            This pricing group has ended!
                                        </span>
                                    </strong>
                                </p>
                            ) : (
                                <>
                                    {!getCurrentGroup().available ? (
                                        <p>
                                            <strong>
                                                <span style={{fontSize: '20px', color: 'black'}}>
                                                    This pricing group is no longer available due to
                                                    purchase limits!
                                                </span>
                                            </strong>
                                        </p>
                                    ) : (
                                        <>
                                            {Number(getCurrentGroup().start / 1000000n) >
                                            Date.now() ? (
                                                <>
                                                    <p>
                                                        <strong>
                                                            <span
                                                                style={{
                                                                    fontSize: '20px',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                This pricing group opens{' '}
                                                                <Timestamp
                                                                    relative
                                                                    autoUpdate
                                                                    date={
                                                                        Number(
                                                                            getCurrentGroup()
                                                                                .start / 1000000n,
                                                                        ) / 1000
                                                                    }
                                                                />
                                                                !
                                                            </span>
                                                        </strong>
                                                    </p>
                                                    <br />
                                                    <Grid
                                                        justifyContent="center"
                                                        direction="row"
                                                        alignItems="center"
                                                        container
                                                        spacing={2}
                                                        style={{}}
                                                    >
                                                        {getCurrentGroup().pricing.map(
                                                            (o, index) => {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        className={classes.stat}
                                                                        item
                                                                        sm={3}
                                                                    >
                                                                        <Button
                                                                            variant={'contained'}
                                                                            disabled
                                                                            color={'primary'}
                                                                            style={{
                                                                                fontWeight: 'bold',
                                                                                margin: '0 auto',
                                                                            }}
                                                                        >
                                                                            Buy {Number(o[0])} NFT
                                                                            {o[0] === 1 ? '' : 's'}
                                                                            <br />
                                                                            for{' '}
                                                                            {_showListingPrice(
                                                                                o[0] * o[1],
                                                                            )}{' '}
                                                                            ICP
                                                                        </Button>
                                                                    </Grid>
                                                                );
                                                            },
                                                        )}
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>
                                                    <Grid
                                                        justifyContent="center"
                                                        direction="row"
                                                        alignItems="center"
                                                        container
                                                        spacing={2}
                                                        style={{}}
                                                    >
                                                        {getCurrentGroup().pricing.map(
                                                            (o, index) => {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        className={classes.stat}
                                                                        item
                                                                        sm={3}
                                                                    >
                                                                        <Button
                                                                            variant={'contained'}
                                                                            color={'primary'}
                                                                            onClick={() =>
                                                                                buyFromSale(
                                                                                    Number(
                                                                                        groups.find(
                                                                                            a =>
                                                                                                Number(
                                                                                                    a.id,
                                                                                                ) ==
                                                                                                currentPriceGroup,
                                                                                        ).id,
                                                                                    ),
                                                                                    Number(o[0]),
                                                                                    o[0] * o[1],
                                                                                )
                                                                            }
                                                                            style={{
                                                                                fontWeight: 'bold',
                                                                                margin: '0 auto',
                                                                            }}
                                                                        >
                                                                            Buy {Number(o[0])} NFT
                                                                            {o[0] === 1 ? '' : 's'}
                                                                            <br />
                                                                            for{' '}
                                                                            {_showListingPrice(
                                                                                o[0] * o[1],
                                                                            )}{' '}
                                                                            ICP
                                                                        </Button>
                                                                    </Grid>
                                                                );
                                                            },
                                                        )}
                                                    </Grid>
                                                    <p>
                                                        <strong>Please note:</strong> All
                                                        transactions are secured via Toniq's escrow
                                                        platform. There are no refunds or returns,
                                                        once a transaction is made it can not be
                                                        reversed. Toniq provides a transaction
                                                        service only. By clicking one of the buttons
                                                        above you show acceptance of our{' '}
                                                        <a
                                                            href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Terms of Service
                                                        </a>
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </>
            </div>
        </>
    );
}

const useStyles = makeStyles(theme => ({
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
    tabsViewTab: {
        fontWeight: 'bold',
        [theme.breakpoints.down('xs')]: {
            '&>span>span>svg': {
                display: 'none',
            },
            '&>span>span': {
                padding: '0 5px!important',
            },
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
