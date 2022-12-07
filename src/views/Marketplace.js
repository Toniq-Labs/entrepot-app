import React, {useEffect} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Wallet from '../components/Wallet';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import PriceICP from '../components/PriceICP';
import {EntrepotUpdateStats, EntrepotAllStats} from '../utils';
import {isToniqEarnCollection} from '../location/toniq-earn-collections';
import {cssToReactStyleObject, toniqFontStyles} from '@toniq-labs/design-system';
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
const useStyles = makeStyles(theme => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    collectionContainer: {
        marginBottom: 20,
        [theme.breakpoints.up('xs')]: {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: 300,
        },
        [theme.breakpoints.up('md')]: {
            width: 330,
        },
        [theme.breakpoints.up('lg')]: {
            width: 360,
        },
    },
    root: {
        maxWidth: 345,
    },
    heading: {
        textAlign: 'center',
    },
    media: {
        cursor: 'pointer',
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));
var _stats = [];
export default function Marketplace(props) {
    const navigate = useNavigate();
    const classes = useStyles();
    const theme = useTheme();
    const [
        sort,
        setSort,
    ] = React.useState('total_desc');
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const query = searchParams.get('search') || '';
    const [
        stats,
        setStats,
    ] = React.useState([]);

    const styles = {
        root: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        content: {
            flexGrow: 1,
            marginLeft: 0,
        },
    };
    const _updates = () => {
        EntrepotUpdateStats().then(setStats);
    };
    const changeSort = event => {
        setSort(event.target.value);
    };
    React.useEffect(() => {
        if (EntrepotAllStats().length == 0) {
            _updates();
        } else {
            setStats(EntrepotAllStats());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useInterval(_updates, 60 * 1000);
    const handleClick = a => {
        navigate(a);
    };
    return (
        <>
            <div style={{width: '100%', display: 'block', position: 'relative'}}>
                <div
                    style={{
                        margin: '0px auto',
                        minHeight: 'calc(100vh - 221px)',
                    }}
                >
                    <h1 className={classes.heading}>All Collections</h1>
                    <div style={{margin: '0 auto', textAlign: 'center', maxWidth: 500}}>
                        <TextField
                            placeholder="Search"
                            style={{width: '100%', marginBottom: 50}}
                            value={query}
                            onChange={e =>
                                setSearchParams(e.target.value ? {search: e.target.value} : {})
                            }
                            variant="outlined"
                        />
                    </div>
                    <div style={{textAlign: 'right', marginBottom: '30px', marginRight: 25}}>
                        <FormControl style={{marginRight: 20}}>
                            <InputLabel>Sort by</InputLabel>
                            <Select value={sort} onChange={changeSort}>
                                <MenuItem value={'listings_asc'}>Listings: Low to High</MenuItem>
                                <MenuItem value={'listings_desc'}>Listings: High to Low</MenuItem>
                                <MenuItem value={'total_asc'}>Total Volume: Low to High</MenuItem>
                                <MenuItem value={'total_desc'}>Total Volume: High to Low</MenuItem>
                                <MenuItem value={'floor_asc'}>Floor Price: Low to High</MenuItem>
                                <MenuItem value={'floor_desc'}>Floor Price: High to Low</MenuItem>
                                <MenuItem value={'alpha_asc'}>Alphabetically: A-Z</MenuItem>
                                <MenuItem value={'alpha_desc'}>Alphabetically: Z-A</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        {props.collections
                            .filter(collection => {
                                // prevent Toniq Earn related collections from showing up in countries where its blocked
                                const allowed = isToniqEarnCollection(collection)
                                    ? props.isToniqEarnAllowed
                                    : true;
                                const inQuery =
                                    [
                                        collection.name,
                                        collection.brief,
                                        collection.keywords,
                                    ]
                                        .join(' ')
                                        .toLowerCase()
                                        .indexOf(query.toLowerCase()) >= 0;
                                return allowed && (query == '' || inQuery);
                            })
                            .sort((a, b) => {
                                switch (sort) {
                                    case 'featured':
                                        return b.priority - a.priority;
                                        break;
                                    case 'listings_asc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .listings,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .listings,
                                            )
                                        );
                                        break;
                                    case 'listings_desc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .listings,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .listings,
                                            )
                                        );
                                        break;
                                    case 'total_asc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .total,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .total,
                                            )
                                        );
                                        break;
                                    case 'total_desc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .total,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .total,
                                            )
                                        );
                                        break;
                                    case 'floor_asc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .floor,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .floor,
                                            )
                                        );
                                        break;
                                    case 'floor_desc':
                                        if (
                                            stats.findIndex(x => x.canister == a.canister) < 0 &&
                                            stats.findIndex(x => x.canister == b.canister) < 0
                                        )
                                            return 0;
                                        if (stats.findIndex(x => x.canister == a.canister) < 0)
                                            return 1;
                                        if (stats.findIndex(x => x.canister == b.canister) < 0)
                                            return -1;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                                false &&
                                            stats.find(x => x.canister == b.canister).stats ===
                                                false
                                        )
                                            return 0;
                                        if (
                                            stats.find(x => x.canister == a.canister).stats ===
                                            false
                                        )
                                            return 1;
                                        if (
                                            stats.find(x => x.canister == b.canister).stats ===
                                            false
                                        )
                                            return -1;
                                        return (
                                            Number(
                                                stats.find(x => x.canister == b.canister).stats
                                                    .floor,
                                            ) -
                                            Number(
                                                stats.find(x => x.canister == a.canister).stats
                                                    .floor,
                                            )
                                        );
                                        break;
                                    case 'alpha_asc':
                                        if (a.name < b.name) {
                                            return -1;
                                        }
                                        if (a.name > b.name) {
                                            return 1;
                                        }
                                        return 0;
                                        break;
                                    case 'alpha_desc':
                                        if (a.name < b.name) {
                                            return 1;
                                        }
                                        if (a.name > b.name) {
                                            return -1;
                                        }
                                        return 0;
                                        break;
                                    default:
                                        return 0;
                                }
                            })
                            .map((collection, i) => {
                                return (
                                    <Grid key={i} item className={classes.collectionContainer}>
                                        <Link
                                            style={{textDecoration: 'none'}}
                                            to={'/marketplace/' + collection.route}
                                        >
                                            <Card style={{height: 375}} className={classes.root}>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={
                                                        collection.hasOwnProperty('collection') &&
                                                        collection.collection
                                                            ? collection.collection
                                                            : '/collections/' +
                                                              collection.canister +
                                                              '.jpg'
                                                    }
                                                    title={collection.name}
                                                />
                                                <CardContent style={{textAlign: 'center'}}>
                                                    <h2 style={{marginTop: 0, fontSize: '1.4em'}}>
                                                        {collection.name}
                                                    </h2>
                                                    <Typography
                                                        style={{minHeight: 48}}
                                                        variant="body1"
                                                        color="textSecondary"
                                                        component="p"
                                                    >
                                                        {collection.brief ? collection.brief : ''}
                                                    </Typography>
                                                    {stats.findIndex(
                                                        a => a.canister == collection.canister,
                                                    ) >= 0 ? (
                                                        <>
                                                            {
                                                                stats.find(
                                                                    a =>
                                                                        a.canister ==
                                                                        collection.canister,
                                                                ).stats ? (
                                                                    <Grid
                                                                        container
                                                                        direction="row"
                                                                        justifyContent="center"
                                                                        alignItems="center"
                                                                        spacing={2}
                                                                    >
                                                                        <Grid
                                                                            style={{
                                                                                borderRight:
                                                                                    '1px dashed #ddd',
                                                                            }}
                                                                            item
                                                                            md={4}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    color: '#00d092',
                                                                                }}
                                                                            >
                                                                                Volume
                                                                            </span>
                                                                            <br />
                                                                            <strong>
                                                                                <PriceICP
                                                                                    volume={true}
                                                                                    clean={true}
                                                                                    price={
                                                                                        stats.find(
                                                                                            a =>
                                                                                                a.canister ==
                                                                                                collection.canister,
                                                                                        ).stats
                                                                                            .total
                                                                                    }
                                                                                    size={20}
                                                                                />
                                                                            </strong>
                                                                        </Grid>
                                                                        <Grid
                                                                            style={{
                                                                                borderRight:
                                                                                    '1px dashed #ddd',
                                                                            }}
                                                                            item
                                                                            md={4}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    color: '#00d092',
                                                                                }}
                                                                            >
                                                                                Listings
                                                                            </span>
                                                                            <br />
                                                                            <strong
                                                                                style={{
                                                                                    ...cssToReactStyleObject(
                                                                                        toniqFontStyles.boldParagraphFont,
                                                                                    ),
                                                                                    ...cssToReactStyleObject(
                                                                                        toniqFontStyles.monospaceFont,
                                                                                    ),
                                                                                }}
                                                                            >
                                                                                {
                                                                                    stats.find(
                                                                                        a =>
                                                                                            a.canister ==
                                                                                            collection.canister,
                                                                                    ).stats.listings
                                                                                }
                                                                            </strong>
                                                                        </Grid>
                                                                        <Grid item md={4}>
                                                                            <span
                                                                                style={{
                                                                                    color: '#00d092',
                                                                                }}
                                                                            >
                                                                                Floor Price
                                                                            </span>
                                                                            <br />
                                                                            <strong>
                                                                                <PriceICP
                                                                                    volume={true}
                                                                                    clean={true}
                                                                                    price={
                                                                                        stats.find(
                                                                                            a =>
                                                                                                a.canister ==
                                                                                                collection.canister,
                                                                                        ).stats
                                                                                            .floor
                                                                                    }
                                                                                    size={20}
                                                                                />
                                                                            </strong>
                                                                        </Grid>
                                                                    </Grid>
                                                                ) : (
                                                                    ''
                                                                ) /*<span style={{display:"block",fontWeight:"bold",paddingTop:15}}>Not Available</span>*/
                                                            }
                                                        </>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                display: 'block',
                                                                fontWeight: 'bold',
                                                                paddingTop: 15,
                                                            }}
                                                        >
                                                            Loading...
                                                        </span>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </Grid>
                                );
                            })}
                    </Grid>
                </div>
            </div>
        </>
    );
}
