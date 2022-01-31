import {
    Button,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons//Dashboard';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DetailsIcon from '@material-ui/icons/Details';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PeopleIcon from '@material-ui/icons/People';
import RefreshIcon from '@material-ui/icons/Refresh';
import ShareIcon from '@material-ui/icons/Share';
import ShopIcon from '@material-ui/icons/Shop';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import extjs from '../ic/extjs.js';

const Detail = () => {
    let {tokenid} = useParams();
    let {index, canister} = extjs.decodeTokenId(tokenid);

    const classes = useStyles();
    const [openProperties, setOpenProperties] = useState(true);
    const [openDetails, setOpenDetails] = useState(true);
    const [detailsTable, setDetailsTable] = useState(true);
    const [openHistory, setOpenHistory] = useState(true);
    const handleProperties = () => {
        setOpenProperties(!openProperties);
    };
    const handleDetails = () => {
        setOpenDetails(!openDetails);
    };
    const handleTable = () => {
        setDetailsTable(!detailsTable);
    };
    const handleHistory = () => {
        setOpenHistory(!openHistory);
    };
    return (
        <>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={5}>
                        <div
                            style={{
                                border: '1px solid #E9ECEE',
                                marginBottom: '20px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    padding: '10px',
                                }}
                            >
                                <FavoriteBorderIcon style={{color: '#8B9AAA'}} />
                                <Typography variant="h6" style={{color: '#8B9AAA'}}>
                                    463
                                </Typography>
                            </div>

                            <img
                                src={'https://' + canister + '.raw.ic0.app/?tokenid=' + tokenid}
                                alt=""
                                style={{
                                    cursor: 'pointer',
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        <div
                            style={{
                                border: '1px solid #E9ECEE',
                                borderRadius: '4px',
                                margin: '40px 0px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #E9ECEE',
                                    padding: '20px',
                                }}
                            >
                                <FormatAlignLeftIcon />
                                <Typography
                                    variant="h6"
                                    style={{fontWeight: 'bold', marginLeft: '20px'}}
                                >
                                    Description
                                </Typography>
                            </div>
                            <div
                                style={{
                                    borderBottom: '1px solid #E9ECEE',
                                    padding: '30px 20px',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="body1" style={{color: 'gray'}}>
                                        Created by{' '}
                                        <span style={{color: '#2B74DC'}}>PavlovVisuals</span>
                                    </Typography>
                                    <AcUnitIcon style={{color: '#2B74DC', marginLeft: '10px'}} />
                                </div>
                                <Typography
                                    variant="body1"
                                    style={{color: 'gray', marginTop: '5px'}}
                                >
                                    Pavlov Visuals -Where is Your Mind?(2021)
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '20px',
                                    borderBottom: '1px solid #E9ECEE',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <LocalOfferIcon />
                                    <Typography
                                        variant="h6"
                                        style={{fontWeight: 'bold', marginLeft: '20px'}}
                                    >
                                        Properties
                                    </Typography>
                                </div>
                                <IconButton onClick={handleProperties}>
                                    {openProperties ? (
                                        <KeyboardArrowUpIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    ) : (
                                        <KeyboardArrowDownIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    )}
                                </IconButton>
                            </div>

                            {openProperties && (
                                <div className={classes.div}>
                                    <div
                                        style={{
                                            border: '1px solid #00B8E7',
                                            backgroundColor: '#ECF9FF',
                                            padding: '5px 10px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            marginTop: '10px',
                                            width: '200px',
                                        }}
                                    >
                                        <Typography variant="h6" style={{color: '#00B8E7'}}>
                                            {' '}
                                            ABSTRACT
                                        </Typography>
                                        <Typography variant="h6">Illustration</Typography>
                                    </div>
                                    <div
                                        style={{
                                            border: '1px solid #00B8E7',
                                            backgroundColor: '#ECF9FF',
                                            padding: '5px 10px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '10px',
                                            flexDirection: 'column',
                                            width: '200px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant="h6" style={{color: '#00B8E7'}}>
                                            DREAMY
                                        </Typography>
                                        <Typography variant="h6">Whimsical</Typography>
                                    </div>
                                    <div
                                        style={{
                                            border: '1px solid #00B8E7',
                                            backgroundColor: '#ECF9FF',
                                            padding: '5px 10px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '10px',
                                            flexDirection: 'column',
                                            width: '200px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant="h6" style={{color: '#00B8E7'}}>
                                            PavlovVisuals
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                width: '150px',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            Where is Your Mind?(2021){' '}
                                        </Typography>
                                    </div>
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #d5d5d5',
                                    padding: '20px',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <DetailsIcon />
                                    <Typography
                                        variant="h6"
                                        style={{fontWeight: 'bold', marginLeft: '20px'}}
                                    >
                                        Details
                                    </Typography>
                                </div>
                                <IconButton onClick={handleTable}>
                                    {detailsTable ? (
                                        <KeyboardArrowUpIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    ) : (
                                        <KeyboardArrowDownIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    )}
                                </IconButton>
                            </div>
                            {detailsTable && (
                                <div style={{padding: '20px'}}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            Contract Address
                                        </Typography>
                                        <Typography variant="body1" style={{color: '#648DE2'}}>
                                            <span
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    width: '50px',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                076546
                                            </span>
                                            54343278
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '10px',
                                        }}
                                    >
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            Token ID
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                width: '200px',
                                                textOverflow: 'ellipsis',
                                                color: 'gray',
                                            }}
                                        >
                                            0765465434327879832549735
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '10px',
                                        }}
                                    >
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            Token Standard
                                        </Typography>
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            07654654343278
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '10px',
                                        }}
                                    >
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            Blockchain
                                        </Typography>
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            07654654343278
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '10px',
                                        }}
                                    >
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            Metadata
                                        </Typography>
                                        <Typography variant="body1" style={{color: 'gray'}}>
                                            07654654343278
                                        </Typography>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7}>
                        <div className={classes.personal}>
                            <Typography variant="h6" style={{color: '#648DE2'}}>
                                The Personal Work (2021-2020)
                            </Typography>
                            <div className={classes.iconsBorder}>
                                <RefreshIcon
                                    style={{
                                        borderRight: '1px solid #d5d5d5',
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        padding: '5px',
                                        height: '40px',
                                    }}
                                />
                                <ExitToAppIcon
                                    style={{
                                        borderRight: '1px solid #d5d5d5',
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        padding: '5px',
                                        height: '40px',
                                    }}
                                />
                                <ShareIcon
                                    style={{
                                        borderRight: '1px solid #d5d5d5',
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        padding: '5px',
                                        height: '40px',
                                    }}
                                />
                                <MoreVertIcon
                                    style={{
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        padding: '5px',
                                        height: '40px',
                                    }}
                                />
                            </div>
                        </div>
                        <Typography variant="h4" className={classes.typo}>
                            Where is Your Mind?
                        </Typography>
                        <div className={classes.icon}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',

                                    paddingRight: '10px',
                                }}
                            >
                                <PeopleIcon
                                    style={{
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        paddingRight: '7px',
                                        height: '40px',
                                    }}
                                />
                                <Typography variant="body1">10 owners</Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '10px',
                                }}
                            >
                                <DashboardIcon
                                    style={{
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        paddingRight: '7px',
                                        height: '40px',
                                    }}
                                />
                                <Typography variant="body1">10 owners</Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '10px',
                                }}
                            >
                                <VisibilityIcon
                                    style={{
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        paddingRight: '7px',
                                        height: '40px',
                                    }}
                                />
                                <Typography variant="body1">10 owners</Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '10px',
                                }}
                            >
                                <FavoriteIcon
                                    style={{
                                        width: '40px',
                                        color: 'rgb(37 34 34 / 54%)',
                                        paddingRight: '7px',
                                        height: '40px',
                                    }}
                                />
                                <Typography variant="body1">10 owners</Typography>
                            </div>
                        </div>

                        <div
                            style={{
                                border: '1px solid #E9ECEE',
                                padding: '20px 15px',
                                margin: '20px 0px',
                            }}
                        >
                            <Typography variant="h6">Current price</Typography>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 0px',
                                }}
                            >
                                <AttachMoneyIcon />
                                <Typography variant="h5" style={{fontWeight: 'bold'}}>
                                    0.88
                                </Typography>
                                <Typography variant="body2" style={{marginLeft: '10px'}}>
                                    ($213,56)
                                </Typography>
                            </div>
                            <div className={classes.button}>
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#2B74DC',
                                        color: '#ffffff',
                                        textTransform: 'capitalize',
                                        fontWeight: 'bold',
                                        boxShadow: 'none',
                                        outline: 'none',
                                    }}
                                >
                                    <ShopIcon style={{color: '#ffffff', marginRight: '10px'}} />
                                    Buy Now
                                </Button>
                                <Button className={classes.btn} variant="contained">
                                    <LocalOfferIcon
                                        style={{color: '#2B74DC', marginRight: '10px'}}
                                    />
                                    Make Offer
                                </Button>
                            </div>
                        </div>
                        <div
                            style={{
                                border: '1px solid #E9ECEE',

                                margin: '20px 0px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #d5d5d5',
                                    padding: '20px',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <DetailsIcon />
                                    <Typography
                                        variant="h6"
                                        style={{fontWeight: 'bold', marginLeft: '20px'}}
                                    >
                                        Details
                                    </Typography>
                                </div>
                                <IconButton onClick={handleDetails}>
                                    {openDetails ? (
                                        <KeyboardArrowUpIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    ) : (
                                        <KeyboardArrowDownIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    )}
                                </IconButton>
                            </div>

                            {openDetails && (
                                <TableContainer>
                                    <Table sx={{minWidth: 1500}} aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Unit Price</TableCell>
                                                <TableCell align="left">USD Unit Price</TableCell>
                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">floor Difference</TableCell>
                                                <TableCell align="left">Expiration</TableCell>
                                                <TableCell align="left">Form</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.name}>
                                                    <TableCell
                                                        align="left"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        {' '}
                                                        <AttachMoneyIcon style={{color: 'red'}} />
                                                        {row.name}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {row.calories}
                                                    </TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">
                                                        {row.protein}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: '#648DE2'}}
                                                    >
                                                        {row.form}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                        <div
                            style={{
                                border: '1px solid #E9ECEE',

                                margin: '20px 0px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #E9ECEE',
                                    padding: '20px',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <CompareArrowsIcon />
                                    <Typography
                                        variant="h6"
                                        style={{fontWeight: 'bold', marginLeft: '20px'}}
                                    >
                                        Trading History
                                    </Typography>
                                </div>
                                <IconButton onClick={handleHistory}>
                                    {openHistory ? (
                                        <KeyboardArrowUpIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    ) : (
                                        <KeyboardArrowDownIcon
                                            style={{color: 'rgb(37 34 34 / 54%)'}}
                                        />
                                    )}
                                </IconButton>
                            </div>

                            {openHistory && (
                                <TableContainer>
                                    <Table sx={{minWidth: 1500}} aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Event</TableCell>
                                                <TableCell align="left">Unit Price</TableCell>

                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">From</TableCell>
                                                <TableCell align="left">To</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows1.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="left">
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <ShoppingCartIcon />
                                                            {row.event}{' '}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <AttachMoneyIcon />
                                                            {row.price}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {row.quantity}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: '#648DE2'}}
                                                    >
                                                        {row.form}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: '#648DE2'}}
                                                    >
                                                        {row.to}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        style={{color: '#648DE2'}}
                                                    >
                                                        {row.date}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                    </Grid>
                    <Grid item md={3}></Grid>

                    <Grid item md={3}></Grid>
                </Grid>
            </Container>
        </>
    );
};
export default Detail;

const useStyles = makeStyles((theme) => ({
    btn: {
        backgroundColor: '#ffffff',
        marginLeft: '10px',
        color: '#2B74DC',
        fontWeight: 'bold',
        boxShadow: 'none',
        border: '1px solid #2B74DC',
        textTransform: 'capitalize',
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0px',
            marginTop: '10px',
        },
    },
    button: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    typo: {
        fontWeight: 'bold',
        padding: '20px 0px',
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
        },
    },
    personal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    container: {
        padding: '120px 120px',
        [theme.breakpoints.down('md')]: {
            padding: '110px 66px',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '90px 45px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '75px 45px',
        },
    },
    iconsBorder: {
        border: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
    div: {
        display: 'flex',
        padding: '10px',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
}));

function createData(name, calories, fat, carbs, protein, form) {
    return {name, calories, fat, carbs, protein, form};
}

const rows = [
    createData('0.5 WETh', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
    createData('0.5 WETh', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
    createData('0.5 WETh', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
];

function createData1(event, price, quantity, form, to, date) {
    return {event, price, quantity, date, to, form};
}

const rows1 = [
    createData1('Sale', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
    createData1('Sale', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
    createData1('Sale', '$123,98', '1', '150.0%above', 'in 3 days', 'DECG6'),
];
