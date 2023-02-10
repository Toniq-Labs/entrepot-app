/* global BigInt */
import React from 'react';
import Blockie from './Blockie';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import GavelIcon from '@material-ui/icons/Gavel';
import CollectionsIcon from '@material-ui/icons/Collections';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CallMadeIcon from '@material-ui/icons/CallMade';

export default function UserDetail(props) {
    const [
        anchorEl,
        setAnchorEl,
    ] = React.useState(null);
    const [
        menuType,
        setMenuType,
    ] = React.useState('');
    const getView = v => {
        if (
            [
                'offers-received',
                'offers-made',
            ].indexOf(v) >= 0
        )
            return 'offers';
        if (
            [
                'new-request',
                'earn-requests',
                'earn-contracts',
                'earn-nfts',
            ].indexOf(v) >= 0
        )
            return 'earning';
        return v;
    };
    const goTo = nv => {
        props.navigate(`/` + nv);
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const styles = {
        empty: {
            maxWidth: 1200,
            margin: '0 auto',
            textAlign: 'center',
        },
        socials: {
            padding: 0,
            listStyle: 'none',
            '& li': {
                display: 'inline-block',
                margin: '0 10px',
            },
        },
    };

    return (
        <div>
            <div style={{maxWidth: 1200, margin: '0 auto 0'}}>
                <div style={styles.empty}>
                    <Grid container direction="row" alignItems="center" spacing={2}>
                        <Grid item md={4} xs={12} style={{textAlign: 'center'}}></Grid>
                        <Grid item md={4} xs={12}>
                            {props.address ? (
                                <Avatar
                                    style={{
                                        border: 'solid 5px #00d092',
                                        margin: '0 auto',
                                        height: 120,
                                        width: 120,
                                    }}
                                >
                                    <Blockie address={props.address ? props.address : ' '} />
                                </Avatar>
                            ) : (
                                ''
                            )}
                        </Grid>
                        <Grid item md={4} xs={12} style={{textAlign: 'right'}}>
                            <ul style={styles.socials}>
                                <li>
                                    <a
                                        href={'https://icscan.io/account/' + props.address}
                                        target="_blank"
                                    >
                                        <img
                                            alt="create"
                                            style={{width: 32}}
                                            src={'/icon/icscan.png'}
                                        />
                                    </a>
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                    {props.address ? (
                        <h3>
                            <span
                                style={{
                                    display: 'inline-block',
                                    border: '1px solid #aaa',
                                    borderRadius: 10,
                                    padding: 5,
                                }}
                            >
                                <img
                                    src="/currencies/icp.png"
                                    height="18"
                                    width="18"
                                    style={{verticalAlign: 'top', marginTop: 2, marginRight: 2}}
                                />
                                {props.address?.substr(0, 15) + '...'}
                            </span>
                        </h3>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
}
