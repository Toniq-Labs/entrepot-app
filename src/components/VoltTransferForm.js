/* global BigInt */
import React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

export default function VoltTransferForm(props) {
  const [amount, setAmount] = React.useState(0);
  const [deposit, setDeposit] = React.useState(true);

  const _submit = () => {
    if (Number(amount).toString() != amount) return props.error('Invalid amount');
    handleClose();
    props.voltTransfer(
      deposit,
      BigInt(Math.floor(amount * 100000000)),
      props.buttonLoader,
      props.refresher,
    );
  };
  const handleClose = () => {
    setTimeout(() => {
      setAmount(0);
      setDeposit(true);
    }, 100);
    props.close();
  };
  return (
    <>
      <Dialog open={props.open} onClose={handleClose} maxWidth={'xs'} fullWidth>
        <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>
          Volt Transfer
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: 'center'}}>
            Please select a transfer option and enter an amount below
            <br />
            <Select
              defaultValue={true}
              onChange={event => {
                const newValue = event.target.value;
                setDeposit(newValue);
              }}
            >
              <MenuItem value={true}>From Default Wallet to Volt</MenuItem>
              <MenuItem value={false}>From Volt to Default Wallet</MenuItem>
            </Select>
          </DialogContentText>
          <TextField
            style={{width: '100%'}}
            margin="dense"
            label={'Amount to transfer'}
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
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
