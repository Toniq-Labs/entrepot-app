import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import {EntrepotGetIcpUsd, EntrepotEarnDetailsData} from '../utils.js';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {treasureCanisterId} from '../typescript/data/canisters/treasure-canister';

export default function BuyForm(props) {
    const handleClick = t => {
        if (typeof props.handler != 'undefined') props.handler(t);
    };

    return (
        <Dialog fullWidth={true} maxWidth={'xs'} open={props.open} style={{textAlign: 'center'}}>
            <DialogTitle id="alert-dialog-title">
                <strong>You are about to make a purchase!</strong>
            </DialogTitle>
            <DialogContent>
                <EntrepotNftDisplayReact
                    collectionId={props.canister}
                    nftIndex={props.index}
                    nftId={props.tokenid}
                />
                {props.canister == treasureCanisterId ? (
                    <Alert severity="warning">
                        <strong>
                            This is a Toniq Earn contract; do not confuse for actual NFTs
                            <Grid container style={{padding: 20}}>
                                <Grid item xs={6} style={{textAlign: 'left'}}>
                                    <strong>NFT Cost</strong>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'right'}}>
                                    <span>
                                        <PriceICP price={props.price} />
                                    </span>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'left'}}>
                                    <strong>Earn Potential*</strong>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'right'}}>
                                    <span>
                                        <PriceICP price={EntrepotEarnDetailsData(props.tokenid)} />
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
                                    {props.price ? <PriceICP price={props.price} /> : ''}
                                </span>
                            </strong>
                            <br />
                            {props.price ? (
                                <>
                                    ~<PriceUSD price={EntrepotGetIcpUsd(props.price)} />
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
