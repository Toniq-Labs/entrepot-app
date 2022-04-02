import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import extjs from "../ic/extjs.js";
import {EntrepotNFTImage} from '../utils.js';

export default function PawnForm(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [reward, setReward] = React.useState(0);
  const [apr, setApr] = React.useState(0);
  const [length, setLength] = React.useState(30);
  var index, canister;
  const _submit = () => {
    //Validate address
    handleClose();
    props.pawn(props.nft.id, amount, reward, length, props.buttonLoader, props.refresher);
  };
  const handleClose = () => {
    setAmount(0);
    setReward(0);
    setApr(0);
    setLength(30);
    props.close()
  };
  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth >
        <DialogTitle id="form-dialog-title" style={{textAlign:'center'}}>Pawn NFT</DialogTitle>
        <DialogContent>
        <img alt="NFT" src={(props.nft.id ? EntrepotNFTImage(extjs.decodeTokenId(props.nft.id).canister, extjs.decodeTokenId(props.nft.id).index, props.nft.id) : "")} style={{maxHeight:"200px", margin:"0px auto 20px", display:(imgLoaded ? "block" : "none")}} onLoad={() => setImgLoaded(true)}/>
        <Alert severity="info">Please enter the amount of ICP, the rewards, and the length of the loan below.</Alert>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                style={{width:'100%'}}
                margin="dense"
                label={"Loan amount in ICP"}
                value={amount}
                onChange={(e) => {
                  var a = e.target.value;
                  setApr(((reward/length)*365)/a);
                  setAmount(a)
                }}
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{width:"100%",marginLeft:5,marginTop:5,marginBottom:4}}>
                <InputLabel>Length of Loan</InputLabel>
                <Select
                  style={{width:"100%"}}
                  value={length}
                  onChange={(e) => {
                    var l = e.target.value;
                    setApr(((reward/l)*365)/amount);
                    setLength(l);
                  }}
                >
                  <MenuItem value={7}>7 Days</MenuItem>
                  <MenuItem value={14}>14 Days</MenuItem>
                  <MenuItem value={30}>30 Days</MenuItem>
                  <MenuItem value={60}>60 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                style={{width:'100%'}}
                margin="dense"
                label={"Reward amount in ICP"}
                value={reward}
                onChange={(e) => {
                  var r = e.target.value;
                  setApr(((r/length)*365)/amount);
                  setReward(r)
                }}
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {apr > 0 ?
              <div style={{paddingTop:20,paddingLeft:20}}><strong>APR {(Math.round(apr*1000)/10).toFixed(1)}%</strong></div>
              : ""}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button onClick={_submit} color="primary">Request Loan</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
