import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import extjs from '../ic/extjs.js';
import {
    EntrepotNFTImage,
    EntrepotDisplayNFT,
    EntrepotGetICPUSD,
    EntrepotEarnDetailsData,
} from '../utils.js';
const TREASURECANISTER = 'yigae-jqaaa-aaaah-qczbq-cai';

export default function BuyForm(props) {
    const [
        imgLoaded,
        setImgLoaded,
    ] = React.useState(false);
    const handleClick = t => {
        setImgLoaded(false);
        if (typeof props.handler != 'undefined') props.handler(t);
    };
    return (
        <Dialog fullWidth={true} maxWidth={'xs'} open={props.open} style={{textAlign: 'center'}}>
            <DialogTitle id="alert-dialog-title">
                <strong>You are about to make a purchase!</strong>
            </DialogTitle>
            <DialogContent>
                <img
                    alt="NFT"
                    src={EntrepotNFTImage(props.canister, props.index, props.tokenid)}
                    style={{
                        maxHeight: '200px',
                        margin: '0px auto 20px',
                        display: imgLoaded ? 'block' : 'none',
                    }}
                    onLoad={() => setImgLoaded(true)}
                />
                <Skeleton
                    style={{
                        width: '200px',
                        height: '200px',
                        margin: '0px auto 20px',
                        display: imgLoaded ? 'none' : 'block',
                    }}
                    variant="rect"
                />
                {props.canister == TREASURECANISTER ? (
                    <Alert severity="warning">
                        <strong>
                            This is a Toniq Earn contract; do not confuse for actual NFTs
                            <Grid container style={{padding: 20}}>
                                <Grid item xs={6} style={{textAlign: 'left'}}>
                                    <strong>NFT Cost</strong>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'right'}}>
                                    <span>
                                        <PriceICP size={20} price={props.price} />
                                    </span>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'left'}}>
                                    <strong>Earn Potential*</strong>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'right'}}>
                                    <span>
                                        <PriceICP
                                            size={20}
                                            price={EntrepotEarnDetailsData(props.tokenid)}
                                        />
                                    </span>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'left'}}>
                                    <strong>Profit/Loss*</strong>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'right'}}>
                                    <span
                                        style={
                                            EntrepotEarnDetailsData(props.tokenid) > props.price
                                                ? {color: 'green'}
                                                : {color: 'red'}
                                        }
                                    >
                                        <PriceICP
                                            size={20}
                                            price={
                                                EntrepotEarnDetailsData(props.tokenid) - props.price
                                            }
                                        />
                                    </span>
                                </Grid>
                            </Grid>
                            <small>*Note - no reward is paid if the contract defaults</small>
                        </strong>
                    </Alert>
                ) : (
                    ''
                )}
                <DialogContentText>
                    You are about to purchase this NFT from your connected wallet.
                    <Grid container style={{padding: 20}}>
                        <Grid item xs={6} style={{paddingTop: 10, textAlign: 'left'}}>
                            <strong>Total</strong>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <strong>
                                <span style={{fontSize: '1.5em', color: 'red'}}>
                                    {props.price ? <PriceICP size={35} price={props.price} /> : ''}
                                </span>
                            </strong>
                            <br />
                            {props.price ? (
                                <>
                                    ~<PriceUSD price={EntrepotGetICPUSD(props.price)} />
                                </>
                            ) : (
                                ''
                            )}
                        </Grid>
                    </Grid>
                    <small>
                        This process may take a minute to process. Transactions can not be reversed.
                        By clicking confirm you show acceptance of our{' '}
                        <a
                            href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit"
                            target="_blank"
                        >
                            Terms of Service
                        </a>
                    </small>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClick(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleClick(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
