import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Skeleton from '@material-ui/lab/Skeleton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import extjs from "../ic/extjs.js";
import {EntrepotNFTImage} from '../utils.js';
import { EntrepotUpdateStats, EntrepotCollectionStats } from '../utils';

export default function PawnForm(props) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [reward, setReward] = React.useState(0);
  const [apr, setApr] = React.useState(0);
  const [length, setLength] = React.useState(30);
  const [floor, setFloor] = React.useState(false);
  const [canister, setCanister] = React.useState("");
  const [index, setIndex] = React.useState("");
  
  
  React.useEffect(() => {
    if (props.nft.id){
      let { canister, index } = extjs.decodeTokenId(props.nft.id);
      setIndex(index);
      setCanister(canister)
      var s = EntrepotCollectionStats(canister);
      if (!isNaN(Number(s.floor))) {
        setFloor(Number(s.floor));
      } else {
        EntrepotUpdateStats().then(r => {
          var s = EntrepotCollectionStats(canister);
          if (!isNaN(Number(s.floor))) {
            setFloor(Number(s.floor));
          };
        });
      };
    };
  }, [props.nft.id]);
    
  const _submit = () => {
    if (!floor) return props.error("Trying to retreive floor, please try again shortly.");
    if (amount > floor)  return props.error("The amount requested can not be more than the current floor for this collection ("+floor+" ICP)");
    if (reward > (amount/2)) return props.error("The reward can not be more than 50% of the amount requested");
    if (reward < 0.01) return props.error("The reward must be at least 0.01ICP");
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
        <DialogTitle id="form-dialog-title" style={{textAlign:'center'}}>Lock NFT in protocol</DialogTitle>
        <DialogContent>
        <img alt="NFT" src={(props.nft.id ? EntrepotNFTImage(canister, index, props.nft.id) : "")} style={{maxHeight:"200px", margin:"0px auto 20px", display:(imgLoaded ? "block" : "none")}} onLoad={() => setImgLoaded(true)}/>
        <Skeleton style={{width: "200px", height:"200px", margin:"0px auto 20px", display:(imgLoaded ? "none" : "block")}} variant="rect"  />
        <Alert severity="info">Please enter the amount of ICP, the rewards, and the length of the contract below. Once you submit, your NFT will be sent to escrow. If the request has not been accepted <strong>after 24 hours</strong> it will be automatically cancelled.</Alert>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                style={{width:'100%'}}
                margin="dense"
                label={"Amount in ICP you want"}
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
                <InputLabel>Contract duration</InputLabel>
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
              {floor ?
              <div style={{paddingTop:10,paddingLeft:20}}><strong>Floor {floor} ICP</strong></div>
              : ""}
              {apr > 0 ?
              <div style={{paddingTop:0,paddingLeft:20}}><strong>APR {(Math.round(apr*1000)/10).toFixed(1)}%</strong></div>
              : ""}
            </Grid>
          </Grid>
          <div style={{textAlign:"center"}}><small>This process may take a minute to process. By clicking confirm you show acceptance of our <a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a></small></div>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button onClick={_submit} color="primary">Submit Request</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
