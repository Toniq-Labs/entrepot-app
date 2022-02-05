/* global BigInt */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

export default function ListingForm(props) {
    const [price, setPrice] = React.useState(props.nft.price);
    const error = (e) => {
        props.error(e);
    };
    const cancel = () => {
        _submit(0);
    };
    const save = () => {
        if (price < 0.01) return error('Min sale amount is 0.01 ICP');
        _submit(BigInt(Math.floor(price * 10 ** 8)));
    };
    const _submit = (p) => {
        //Submit to blockchain here
        handleClose();
        console.log(props.buttonLoader, 't3');
        props.list(props.nft.id, p, props.buttonLoader);
    };
    const handleClose = () => {
        setPrice(0);
        props.close();
    };
    React.useEffect(() => {
        setPrice(props.nft.listing ? Number(props.nft.listing.price) / 100000000 : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.nft]);

    return (
        <>
            <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth>
                <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>
                    Marketplace Listing
                </DialogTitle>
                <DialogContent>
                    {!props.nft.price ? (
                        <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
                            Please enter a price below to create a new marketplace listing. Once you
                            save the listing, it becomes available to the public.
                        </DialogContentText>
                    ) : (
                        ''
                    )}
                    {props.nft.price > 0 ? (
                        <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
                            Use the form to update the price of your listing, or Cancel the listing
                            below
                        </DialogContentText>
                    ) : (
                        ''
                    )}
                    <Alert severity="warning">
                        <strong>{(props.collection?.commission * 100).toFixed(1)}%</strong> of the
                        sale price will be deducted <strong>once sold</strong>. This is made of up a{' '}
                        <strong>
                            {(props.collection?.commission * 100 - 1).toFixed(1)}% Royalty fee
                        </strong>{' '}
                        for the Creators, and a <strong>1% Marketplace fee</strong>
                    </Alert>
                    <TextField
                        style={{width: '100%'}}
                        margin="dense"
                        label={'Listing price in ICP'}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="text"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
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
