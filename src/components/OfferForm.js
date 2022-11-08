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
import {Principal} from '@dfinity/principal';

export default function OfferForm(props) {
  const [
    amount,
    setAmount,
  ] = React.useState(props.floor);

  const _submit = async () => {
    // if (props.floor && Number(amount) < Number(props.floor) * 0.8)
      // return props.error(
        // 'Offer must be above 80% of the current floor price (~' +
          // (Number(props.floor) * 0.8).toFixed(2) +
          // ' ICP)',
      // );
    if (Number(amount) < 0.01) return props.error('Min offer amount is 0.01 ICP');
    handleClose();
    
    //Submit
    var offerAmountIcp = BigInt(Math.floor(amount * 10 ** 8));
    props.loader(true, 'Loading Volt...');
    try{
      var voltFactoryAPI = extjs.connect('https://ic0.app/', props.identity).canister("olyit-kaaaa-aaaag-qaz2a-cai");      
      var volt = await voltFactoryAPI.getOwnerCanister(props.identity.getPrincipal());
      if (!volt.length){
        props.loader(false);
        if(await props.confirm('Please confirm', 'You need to create a Volt to make offers. Do you want to proceed?')){
          volt = await props.voltCreate(false);
          if (!volt || !volt.length) throw "Error creating Volt...";
        } else return;
      }
      props.loader(true, 'Checking balances...');
      var voltPrincipal = volt[0];
      var voltAPI = extjs.connect('https://ic0.app/', props.identity).canister(voltPrincipal.toText(), "volt");
      var resp = await voltAPI.getBalances("icpledger", "ryjl3-tyaaa-aaaaa-aaaba-cai", []);
      if (resp.hasOwnProperty("ok")) {
        var available = Number(resp.ok[0]) - Number(resp.ok[2]);
        if ((Number(offerAmountIcp) + 10000) > available) {
          var bal = Math.floor(Number(offerAmountIcp) + 10000) - available;
          props.loader(false);
          if(await props.confirm('Please confirm', 'You need to deposit ~'+(bal/100000000).toFixed(2)+'ICP into your Volt. Do you want to proceed?')){
            props.loader(true, 'Topping up Volt...');
            var address = await voltAPI.getAddress();
            await extjs.connect('https://ic0.app/', props.identity).token().transfer(props.identity.getPrincipal(), props.currentAccount, address, BigInt(bal), 10000);
          } else return;
        };
      } else {
        throw resp.err;
      };
      
      props.loader(true, 'Submitting offer...');
      var offersAPI = await extjs.connect('https://ic0.app/', props.identity).canister('3lidg-pyaaa-aaaag-qa2kq-cai');   
      var memo = await offersAPI.createMemo(props.tokenid, props.address);
      var resp1 = await voltAPI.authorize({
        standard : "icpledger",
        canister : "ryjl3-tyaaa-aaaaa-aaaba-cai",
        to : extjs.toAddress('3lidg-pyaaa-aaaag-qa2kq-cai', 0),
        amount : offerAmountIcp,
        id : [],
        memo : [memo],//await offersAPI.createMemo(props.tokenid, props.address)],
        notify : [true],
        other : [],
      }, false, Principal.fromText('3lidg-pyaaa-aaaag-qa2kq-cai'));
      if (resp1.hasOwnProperty('ok')){
        var resp2 = await offersAPI.offer(props.tokenid, offerAmountIcp, props.address, Number(resp1.ok), voltPrincipal);
        if (resp2.hasOwnProperty('ok')){
          await props.complete();
          props.loader(false);
          return props.alert('Offer submitted', 'Your offer was submitted successfully!');      
        } else {
          throw resp2.err;
        };
      } else {
        throw resp1.err;
      };
    } catch(e){
      props.error(e);
      props.loader(false);
    };
  };
  const handleClose = () => {
    setAmount('');
    props.close();
  };
  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth>
        <DialogTitle style={{textAlign: 'center'}}>Submit Offer</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
            Please enter the amount in ICP that you would like to purchase this NFT for.
          </DialogContentText>
          <Alert severity="info">
            Offers are binding. Sellers can accept your offer, and ICP will be taken from your account to purchase the NFT
          </Alert>
          <TextField
            style={{width: '100%'}}
            margin="dense"
            label={'Amount to offer'}
            value={amount}
            onChange={e => setAmount(e.target.value)}
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
          <Button onClick={_submit} color="primary">
            Offer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
