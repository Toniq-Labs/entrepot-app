/* global BigInt */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import extjs from '../ic/extjs.js';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {decodeNftId} from '../typescript/data/nft/nft-id';

export default function ListingForm(props) {
    const [
        price,
        setPrice,
    ] = React.useState(props.nft.listing?.price ? Number(props.nft.listing.price) / 100000000 : 0);

    const [
        pricePercentBelowFloor,
        setPricePercentBelowFloor,
    ] = React.useState(1);
    const [
        currentCollectionFloorPrice,
        setCurrentCollectionFloorPrice,
    ] = React.useState(undefined);
    const [
        decodedToken,
        setDecodedToken,
    ] = React.useState(undefined);
    const [
        collection,
        setCollection,
    ] = React.useState(undefined);

    React.useEffect(() => {
        if (props.nft?.id) {
            setDecodedToken(decodeNftId(props.nft.id));
        } else {
            setDecodedToken(undefined);
        }
    }, [props.nft]);

    React.useEffect(() => {
        setCollection(
            decodedToken
                ? props.collections.find(
                      collection => collection.canister === decodedToken.canister,
                  )
                : undefined,
        );
    }, [
        props.collections,
        decodedToken,
    ]);

    React.useEffect(() => {
        const collection = decodedToken
            ? props.collections.find(collection => collection.canister === decodedToken.canister)
            : undefined;
        if (props.stats && props.nft && collection) {
            setCurrentCollectionFloorPrice(
                Number(
                    props.stats.find(collection => collection.canister === props.nft.collection?.id)
                        ?.stats?.floor,
                ),
            );
        } else {
            setCurrentCollectionFloorPrice(undefined);
        }
    }, [
        props.stats,
        props.nft,
        collection,
        decodedToken,
    ]);

    React.useEffect(() => {
        if (!currentCollectionFloorPrice) {
            return;
        }
        const priceNumber = Number(price);
        const currentPercentOfFloorPrice = priceNumber
            ? priceNumber / currentCollectionFloorPrice
            : 1;
        setPricePercentBelowFloor(Math.round(100 - Math.trunc(currentPercentOfFloorPrice * 100)));
    }, [
        price,
        currentCollectionFloorPrice,
    ]);

    const error = e => {
        props.error(e);
    };
    const cancel = () => {
        _submit(0);
    };
    const save = () => {
        if (price < 0.01) return error('Min sale amount is 0.01 ICP');
        _submit(BigInt(Math.floor(price * 10 ** 8)));
    };
    const _submit = async p => {
        //Submit to blockchain here
        handleClose();
        if (
            p > 0 &&
            !(await props.confirm(
                'Please confirm!',
                'The price for this listing is ' + price + ' ICP.',
            ))
        )
            return;
        props.list(props.nft.id, p, props.buttonLoader, props.refresher);
    };

    const handleClose = () => {
        setPrice(0);
        props.close();
    };
    React.useEffect(() => {
        setPrice(props.nft.listing?.price ? Number(props.nft.listing.price) / 100000000 : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.nft]);

    return (
        <>
            <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>
                    Marketplace Listing
                </DialogTitle>
                <DialogContent>
                    {!props.nft.listing ? (
                        <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
                            Please enter a price below to create a new marketplace listing. Once you
                            save the listing, it becomes available to the public.
                        </DialogContentText>
                    ) : (
                        ''
                    )}
                    {(props.nft.listing?.price ? Number(props.nft.listing.price) / 100000000 : 0) >
                    0 ? (
                        <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
                            Use the form to update the price of your listing, or Cancel the listing
                            below
                        </DialogContentText>
                    ) : (
                        ''
                    )}
                    <Alert severity="warning">
                        <strong>{(collection?.commission * 100).toFixed(1)}%</strong> of the sale
                        price will be deducted <strong>once sold</strong>. This is made of up a{' '}
                        <strong>
                            {(collection?.commission * 100 - 1).toFixed(1)}% Royalty fee
                        </strong>{' '}
                        for the Creators, and a <strong>1% Marketplace fee</strong>
                    </Alert>
                    {currentCollectionFloorPrice ? (
                        <div style={{marginTop: '8px'}}>
                            Current collection floor price: {currentCollectionFloorPrice}
                        </div>
                    ) : (
                        ''
                    )}
                    <div style={{display: 'flex', gap: '16px', marginTop: '16px'}}>
                        <EntrepotNftDisplayReact
                            style={{flexShrink: 0}}
                            collectionId={props.nft?.collection?.id}
                            nftIndex={decodedToken?.index}
                            nftId={props.nft?.id}
                            min={{width: 75, height: 75}}
                            max={{width: 75, height: 75}}
                        />
                        <TextField
                            style={{width: '100%'}}
                            margin="dense"
                            label={'Listing price in ICP'}
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    {pricePercentBelowFloor > 10 ? (
                        <p style={{color: 'red'}}>
                            Warning: this price is <b>{pricePercentBelowFloor}% below</b> the
                            collection's current floor price.
                        </p>
                    ) : (
                        ''
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Back
                    </Button>
                    {props.nft.listing ? (
                        <Button onClick={cancel} color="primary">
                            Cancel Listing
                        </Button>
                    ) : (
                        ''
                    )}
                    <Button onClick={save} color="primary">
                        Save Listing
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
