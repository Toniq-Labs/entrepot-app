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
import extjs from "../ic/extjs.js";

export default function OfferForm(props) {
  const [amount, setAmount] = React.useState(props.floor);
        
  const _submit = async () => {
    
    if (props.floor && Number(amount) < (Number(props.floor)*.8)) return props.error("Offer must be above 80% of the current floor price (~" + (Number(props.floor)*.8).toFixed(2) + " ICP)"); 
    if (Number(amount) < 0.01) return props.error("Min offer amount is 0.01 ICP"); 
    var icp = BigInt(Math.floor(amount*(10**8)));
    if (props.balance < icp + 10000n) return props.error("Your balance is insufficient to make this offer");
    handleClose();
    props.loader(true, "Submitting offer...");
    const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
    await _api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offer(props.tokenid, icp, props.address);
    await props.complete();
    props.loader(false);
    props.alert(
      "Offer submitted",
      "Your offer was submitted successfully!"
    );
  };
  const handleClose = () => {
    setAmount("");
    props.close()
  };
  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth >
        <DialogTitle style={{textAlign:'center'}}>Submit Offer</DialogTitle>
        <DialogContent>
        <DialogContentText style={{textAlign:'center',fontWeight:'bold'}}>Please enter the amount in ICP that you would like to purchase this NFT for.</DialogContentText>
        <Alert severity="info">Offers are non-binding and indicative only. If the seller lists the NFT at or below the price of your offer, it will not automatically buy it for you. Limit 1 offer per NFT per principal.</Alert>        
          <TextField
            style={{width:'100%'}}
            margin="dense"
            label={"Amount to offer"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <Button onClick={_submit} color="primary">Offer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
