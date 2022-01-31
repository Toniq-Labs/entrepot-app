import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';
const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 221px)',
        width: '100%',
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
    heading: {
        textAlign: 'center',
    },
    footer: {
        textAlign: 'center',
        background: '#091216',
        color: 'white',
        padding: '30px 0px',
    },
}));
export default function Contact(props) {
    const classes = useStyles();
    return (
        <>
            <div style={{width: '100%', display: 'block', position: 'relative'}}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: '0px auto',
                        minHeight: 'calc(100vh - 213px)',
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <h1 style={{textAlign: 'center'}}>Contact Us</h1>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <p style={{textAlign: 'center', fontSize: '1.3em'}}>
                                Entrepot.app is developed by ToniqLabs. If you need to talk to us
                                about anything, you can email us at{' '}
                                <a href="mailto:support@toniqlabs.com">support@toniqlabs.com</a> or
                                contact us on{' '}
                                <a
                                    href="https://twitter.com/toniqlabs"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Twitter
                                </a>{' '}
                                and{' '}
                                <a
                                    href="https://medium.com/@toniqlabs"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Medium
                                </a>
                                .
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <h1 style={{textAlign: 'center'}}>FAQ</h1>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <h3 className={classes.heading}>Do I need a wallet?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                You will need to connect your ICP wallet to buy through Entrepot.app
                                - currently we only support{' '}
                                <a
                                    href="https://www.stoicwallet.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    StoicWallet
                                </a>
                                , and Plug Wallet.
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>How do I buy?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                Simply find a listing you like, hit the Buy button and follow the
                                prompts. You will need to connect you wallet and ensure it is funded
                                first.
                            </p>
                        </Grid>

                        <Grid item md={3}>
                            <h3 className={classes.heading}>Where is my NFT?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                This is sent directly to your wallet. Within StoicWallet, you can
                                easily import NFTs by clicking the "+" button, then selecting
                                "Search Collections"
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>How do I sell an NFT?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                Currently, all selling has to be done through StoicWallet. We will
                                look to add support for listing NFTs directly on Entrepot soon.
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>How does the transaction work?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                ICP is currently restricted so canisters can't hold ICP - we've
                                developed a method that creates an atomic swap on the Internet
                                Computer
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>I haven't received my ICP?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                Please log in and click "Check Payments" - payments have to be
                                extracted from escrow accounts once a sale is completed.
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>Where can I store my NFTs?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                Entrepot currently only supports NFTs using the EXT standard by
                                ToniqLabs. Currently this is StoicWallet and PlugWallet.
                            </p>
                        </Grid>
                        <Grid item md={3}>
                            <h3 className={classes.heading}>What does a locked listing mean?</h3>
                            <p style={{fontSize: '1.1em', textAlign: 'center'}}>
                                This means someone is currently in the process of purchasing the
                                listing
                            </p>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}
