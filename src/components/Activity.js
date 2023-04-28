import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableContainer from '@material-ui/core/TableContainer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import InputLabel from '@material-ui/core/InputLabel';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import {Grid, makeStyles} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import extjs from '../ic/extjs.js';
import getNri from '../ic/nftv.js';
import {useTheme} from '@material-ui/core/styles';
import Sold from './Sold';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import CollectionDetails from './CollectionDetails';
import {redirectIfBlockedFromEarnFeatures} from '../location/redirect-from-marketplace';

const api = extjs.connect('https://icp0.io/');
const perPage = 10;
const drawerWidth = 0; //300;
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

const _getRandomBytes = () => {
    var bs = [];
    for (var i = 0; i < 32; i++) {
        bs.push(Math.floor(Math.random() * 256));
    }
    return bs;
};

const _isCanister = c => {
    return c.length == 27 && c.split('-').length == 5;
};
const _showListingPrice = n => {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
};

const emptyListing = {
    pricing: '',
    img: '',
};

export default function Activity(props) {
    const getCollectionFromRoute = r => {
        if (_isCanister(r)) {
            return props.collections.find(e => e.canister === r);
        } else {
            return props.collections.find(e => e.route === r);
        }
    };
    const params = useParams();
    const classes = useStyles();
    const [
        collection,
        setCollection,
    ] = useState(getCollectionFromRoute(params?.route, props.collections));

    React.useEffect(() => {
        setCollection(getCollectionFromRoute(params?.route, props.collections));
    }, [
        params,
        props.collections,
    ]);
    const [
        stats,
        setStats,
    ] = React.useState(false);

    React.useEffect(() => {
        if (collection?.canister && props.stats) {
            const currentStats = props.stats.filter(
                statWrapper => statWrapper.canister === collection?.canister,
            )[0];
            if (currentStats) {
                setStats(currentStats);
            }
        }
    }, [
        props.stats,
        collection,
    ]);

    const [
        transactions,
        setTransactions,
    ] = useState(false);
    const [
        page,
        setPage,
    ] = useState(1);
    const [
        sort,
        setSort,
    ] = useState('recent');

    const navigate = useNavigate();

    redirectIfBlockedFromEarnFeatures(navigate, collection, props);

    const changeSort = event => {
        setPage(1);
        setSort(event.target.value);
    };

    const _updates = async () => {
        await refresh();
    };
    const refresh = async c => {
        c = c ?? collection?.canister;
        var txs = await fetch(
            'https://us-central1-entrepot-api.cloudfunctions.net/api/canister/' +
                c +
                '/transactions',
        ).then(r => r.json());
        txs = txs.filter((a, i) => txs.findIndex(b => b.id == a.id) == i);
        txs = txs.filter(e => e.token != '');
        setTransactions(txs);
    };
    const theme = useTheme();
    const styles = {
        empty: {
            maxWidth: 1200,
            margin: '0 auto',
            textAlign: 'center',
        },
        details: {
            textAlign: 'center',
            paddingBottom: 50,
            marginBottom: 50,
        },
        grid: {
            flexGrow: 1,
            padding: theme.spacing(2),
        },
    };

    useInterval(_updates, 60 * 1000);
    React.useEffect(() => {
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{minHeight: 'calc(100vh - 221px)'}}>
            <div style={{marginLeft: drawerWidth, paddingBottom: 100}}>
                <div style={{maxWidth: 1200, margin: '0 auto 0'}}>
                    <div style={{textAlign: 'center'}}>
                        <CollectionDetails
                            classes={classes}
                            stats={stats}
                            collection={collection}
                        />
                        <Tabs
                            value={'sold'}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                            onChange={(e, nv) => {
                                if (nv === 'all') navigate(`/marketplace/${collection?.route}`);
                            }}
                        >
                            <Tab
                                style={{fontWeight: 'bold'}}
                                value="all"
                                label={
                                    <span style={{padding: '0 50px'}}>
                                        <ArtTrackIcon
                                            style={{position: 'absolute', marginLeft: '-30px'}}
                                        />
                                        <span style={{}}>Items</span>
                                    </span>
                                }
                            />
                            <Tab
                                style={{fontWeight: 'bold'}}
                                value="sold"
                                label={
                                    <span style={{padding: '0 50px'}}>
                                        <ShowChartIcon
                                            style={{position: 'absolute', marginLeft: '-30px'}}
                                        />
                                        <span style={{}}>Activity</span>
                                    </span>
                                }
                            />
                        </Tabs>
                    </div>
                </div>

                {_isCanister(collection.canister) && collection.market ? (
                    <div
                        id="mainListings"
                        style={{
                            width: 'calc(100% + 48px)',
                            position: 'relative',
                            marginLeft: -24,
                            marginRight: -24,
                            marginBottom: -24,
                            borderTop: '1px solid #aaa',
                            borderBottom: '1px solid #aaa',
                            display: 'flex',
                        }}
                    >
                        <div
                            style={{
                                flexGrow: 1,
                                marginLeft: '20px',
                                marginTop: '10px',
                                minHeight: 500,
                            }}
                        >
                            <div
                                className={classes.filters}
                                style={{marginLeft: '20px', marginTop: '10px'}}
                            >
                                <Grid container style={{minHeight: 66}}>
                                    <Grid item xs={12} sm={'auto'} style={{marginBottom: 10}}>
                                        <FormControl style={{marginRight: 20}}>
                                            <InputLabel>Sort by</InputLabel>
                                            <Select value={sort} onChange={changeSort}>
                                                <MenuItem value={'recent'}>Recently Sold</MenuItem>
                                                <MenuItem value={'price_asc'}>
                                                    Price: Low to High
                                                </MenuItem>
                                                <MenuItem value={'price_desc'}>
                                                    Price: High to Low
                                                </MenuItem>
                                                <MenuItem value={'mint_number'}>Minting #</MenuItem>
                                                <MenuItem value={'oldest'}>Oldest</MenuItem>
                                                <MenuItem value={'gri'}>NFT Rarity Index</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {transactions.length > perPage ? (
                                        <Grid xs={12} md={'auto'} item style={{marginLeft: 'auto'}}>
                                            <Pagination
                                                className={classes.pagi}
                                                size="small"
                                                count={Math.ceil(transactions.length / perPage)}
                                                page={page}
                                                onChange={(e, v) => setPage(v)}
                                            />
                                        </Grid>
                                    ) : (
                                        ''
                                    )}
                                </Grid>
                            </div>
                            <>
                                {transactions === false ? (
                                    <div style={styles.empty}>
                                        <Typography
                                            paragraph
                                            style={{paddingTop: 20, fontWeight: 'bold'}}
                                            align="center"
                                        >
                                            Loading...
                                        </Typography>
                                        <CircularProgress color="inherit" />
                                    </div>
                                ) : (
                                    <>
                                        {transactions.length === 0 ? (
                                            <div style={styles.empty}>
                                                <Typography
                                                    paragraph
                                                    style={{paddingTop: 20, fontWeight: 'bold'}}
                                                    align="center"
                                                >
                                                    There are currently no activity for this
                                                    collection
                                                </Typography>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={styles.grid}>
                                                    <TableContainer>
                                                        <Table
                                                            style={{
                                                                width: '100%',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell></TableCell>
                                                                    <TableCell align="left">
                                                                        <strong>Item</strong>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <strong>NRI</strong>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <strong>Price</strong>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <strong>From</strong>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <strong>To</strong>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <strong>Time</strong>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {transactions
                                                                    .slice()
                                                                    .sort((a, b) => {
                                                                        switch (sort) {
                                                                            case 'recent':
                                                                                return (
                                                                                    Number(b.time) -
                                                                                    Number(a.time)
                                                                                );
                                                                            case 'oldest':
                                                                                return (
                                                                                    Number(a.time) -
                                                                                    Number(b.time)
                                                                                );
                                                                            case 'price_asc':
                                                                                return (
                                                                                    Number(
                                                                                        a.price,
                                                                                    ) -
                                                                                    Number(b.price)
                                                                                );
                                                                            case 'price_desc':
                                                                                return (
                                                                                    Number(
                                                                                        b.price,
                                                                                    ) -
                                                                                    Number(a.price)
                                                                                );
                                                                            case 'gri':
                                                                                return (
                                                                                    Number(
                                                                                        getNri(
                                                                                            collection?.canister,
                                                                                            extjs.decodeTokenId(
                                                                                                b.token,
                                                                                            ).index,
                                                                                        ),
                                                                                    ) *
                                                                                        100 -
                                                                                    Number(
                                                                                        getNri(
                                                                                            collection?.canister,
                                                                                            extjs.decodeTokenId(
                                                                                                a.token,
                                                                                            ).index,
                                                                                        ),
                                                                                    ) *
                                                                                        100
                                                                                );
                                                                            case 'mint_number':
                                                                                return (
                                                                                    extjs.decodeTokenId(
                                                                                        a.token,
                                                                                    ).index -
                                                                                    extjs.decodeTokenId(
                                                                                        b.token,
                                                                                    ).index
                                                                                );
                                                                            default:
                                                                                return 0;
                                                                        }
                                                                    })
                                                                    .filter(
                                                                        (token, i) =>
                                                                            i >=
                                                                                (page - 1) *
                                                                                    perPage &&
                                                                            i < page * perPage,
                                                                    )
                                                                    .map((transaction, i) => {
                                                                        return (
                                                                            <Sold
                                                                                collections={
                                                                                    props.collections
                                                                                }
                                                                                nri={getNri(
                                                                                    collection?.canister,
                                                                                    extjs.decodeTokenId(
                                                                                        transaction.token,
                                                                                    ).index,
                                                                                )}
                                                                                key={transaction.id}
                                                                                collection={
                                                                                    collection?.canister
                                                                                }
                                                                                transaction={
                                                                                    transaction
                                                                                }
                                                                            />
                                                                        );
                                                                    })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </>

                            {transactions.length > perPage ? (
                                <Pagination
                                    className={classes.pagi}
                                    size="small"
                                    count={Math.ceil(transactions.length / perPage)}
                                    page={page}
                                    onChange={(e, v) => setPage(v)}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    socials: {
        padding: 0,
        listStyle: 'none',
        '& li': {
            display: 'inline-block',
            margin: '0 10px',
        },
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        zIndex: 1,
    },
    filters: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    stats: {
        marginTop: -70,
        minHeight: 81,
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
        },
    },
    pagi: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
        marginBottom: '20px',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center',
        },
    },
}));
