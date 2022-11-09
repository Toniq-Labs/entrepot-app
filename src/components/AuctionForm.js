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

export default function AuctionForm(props) {
  const [
    amount,
    setAmount,
  ] = React.useState((props.auction ? Number(props.auction.bids.length ? props.auction.bids[props.auction.bids.length-1].amount : props.auction.reserve)/100000000 : 0));
  
  const _showDecimal = bal => {
    var bb = bal/100000000;
    var decs = 2;
    if (bb < 0.01) decs = 3;
    if (bb < 0.001) decs = 4;
    if (bb < 0.0001) decs = 5;
    if (bb < 0.00001) decs = 6;
    if (bb < 0.000001) decs = 7;
    if (bb < 0.0000001) decs = 8;
    return bb.toFixed(decs);
  };
  const _submit = async () => {
    if (Number(amount) < 0.01) return props.error('Min bid amount is 0.01 ICP');
    var auctionAmountIcp = BigInt(Math.floor(amount * 10 ** 8));
    if (props.auction.bids.length) {
      if (auctionAmountIcp <= props.auction.bids[props.auction.bids.length-1].amount) return props.error('You need to beat the winning bid!');
    } else {
      if (auctionAmountIcp < props.auction.reserve) return props.error('You need to bid at least the reserve!');
      
    };
    handleClose();
    
    //Submit
    props.loader(true, 'Loading Volt...');
    try{
      var voltFactoryAPI = extjs.connect('https://ic0.app/', props.identity).canister("flvm3-zaaaa-aaaak-qazaq-cai");      
      var volt = await voltFactoryAPI.getOwnerCanister(props.identity.getPrincipal());
      if (!volt.length){
        props.loader(false);
        if(await props.confirm('Please confirm', 'You need to create a Volt to make auction bids. Do you want to proceed?')){
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
        if ((Number(auctionAmountIcp) + 10000) > available) {
          var bal = Math.floor(Number(auctionAmountIcp) + 10000) - available;
          props.loader(false);
          if(await props.confirm('Please confirm', 'You need to deposit ~'+_showDecimal(bal)+'ICP into your Volt. Do you want to proceed?')){
            props.loader(true, 'Topping up Volt...');
            var address = await voltAPI.getAddress();
            await extjs.connect('https://ic0.app/', props.identity).token().transfer(props.identity.getPrincipal(), props.currentAccount, address, BigInt(bal), 10000);
          } else return;
        };
      } else {
        throw resp.err;
      };
      
      props.loader(true, 'Submitting auction bid...');
      var auctionsAPI = await extjs.connect('https://ic0.app/', props.identity).canister('ffxbt-cqaaa-aaaak-qazbq-cai');   
      var memo = await auctionsAPI.createMemo(props.tokenid, props.address);
      var resp1 = await voltAPI.authorize({
        standard : "icpledger",
        canister : "ryjl3-tyaaa-aaaaa-aaaba-cai",
        to : extjs.toAddress('ffxbt-cqaaa-aaaak-qazbq-cai', 0),
        amount : auctionAmountIcp,
        id : [],
        memo : [memo],
        notify : [true],
        other : [],
      }, true, Principal.fromText('ffxbt-cqaaa-aaaak-qazbq-cai'));
      if (resp1.hasOwnProperty('ok')){
        var resp2 = await auctionsAPI.bid(props.tokenid, auctionAmountIcp, props.address, Number(resp1.ok), voltPrincipal);
        if (resp2.hasOwnProperty('ok')){
          await props.complete();
          props.loader(false);
          return props.alert('Auction Bid submitted', 'Your bid was submitted successfully!');      
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
        <DialogTitle style={{textAlign: 'center'}}>Submit Auction Bid</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: 'center', fontWeight: 'bold'}}>
            Please enter the amount in ICP that you would like to bid on this auction.
          </DialogContentText>
          <Alert severity="info">
            Auctions are binding and ICP is locked until you are outbid or have won the auction
          </Alert>
          <TextField
            style={{width: '100%'}}
            margin="dense"
            label={'Amount to bid'}
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
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
