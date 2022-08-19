/* global BigInt */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import extjs from "../ic/extjs.js";
import {cssToReactStyleObject, toniqFontStyles, Icp16Icon, toniqColors} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {EntrepotNFTImage, EntrepotDisplayNFT, EntrepotGetICPUSD, EntrepotEarnDetailsData} from '../utils.js';
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const RESERVECANISTER = "rewn2-gyaaa-aaaam-qamfq-cai";
const api = extjs.connect("https://boundary.ic0.app/").canister(RESERVECANISTER, "reserve");
export default function TopupForm(props) {
  const [amount, setAmount] = React.useState(10);
  const [total, setTotal] = React.useState(false);
  const [rate, setRate] = React.useState(false);
  const [display, setDisplay] = React.useState(0);
  const [quoteTotal, setQuoteTotal] = React.useState(false);
  const [quoteAmount, setQuoteAmount] = React.useState(false);
  const [quoteUrl, setQuoteUrl] = React.useState(false);
  const updateTotal = async (a, r) => {
		var rr = (r ? r : rate);
		if (!rr) {
			refresh();
		} else {
			setTotal((a*rr).toFixed(2));
		};
	};
  const updateAmount = (a) => {
		setAmount(a);
		updateTotal(a);
	};
  const next = async () => {
    props.loader(true, "Getting WYRE quote...");
		try{
			var tx = await api.topup(BigInt(amount*100000000), props.address);
			console.log(tx);
			props.loader(false);
			if (tx.hasOwnProperty("err")) {
				close();
				props.alert("There was an error", tx.err);
				return;
			};
			setDisplay(1);
		}catch(e){
			console.log("Error", e);
			props.loader(false);
		};
	};
  const close = () => {
    setDisplay(0);
    setQuoteTotal(false);
    setQuoteAmount(false);
    setQuoteUrl(false);
    updateTotal(10)
    setAmount(10);
    props.close();
  };
	const refresh = async () => {
		try{
			var r = Number(await api.getRate())/10000;
			setRate(r);
			updateTotal(amount, r);
		} catch(e){};
  };
  useInterval(refresh, 10 *1000);
  React.useEffect(() => {
    updateTotal(amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xs"}
      open={props.open}
      style={{textAlign:"center"}}
    >
      <DialogTitle id="alert-dialog-title"><strong>Buy ICP with card!</strong></DialogTitle>
      <DialogContent>
				{ display === 0 ?
        <DialogContentText>
          <Grid container style={{padding:20}}>
            <Grid item xs={9} >
							<TextField
								style={{width:'100%'}}
								margin="dense"
								label={"I want to buy"}
								value={amount}
								onChange={(e) => updateAmount(e.target.value)}
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
							/>
            </Grid>
            <Grid item xs={3} style={{paddingTop:27}}>
							<span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
								<ToniqIcon icon={Icp16Icon}/>
								<span style={{
									...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
									...cssToReactStyleObject(toniqFontStyles.monospaceFont),
								}}>ICP</span>
							</span>
            </Grid>
					</Grid>
          <Grid container style={{padding:20}}>
            <Grid item xs={6} style={{textAlign:"left"}}>
              <strong>Approx. Cost</strong>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
              <strong><span style={{color:"black"}}>{total !== false ? <>~<PriceUSD size={35} price={total} /> USD</> : "Loading..." }</span></strong>
            </Grid>
          </Grid>
          <small>Rates change every few seconds. After clicking <strong>Continue</strong> you will be guaranteed a set rate for the transaction which expires after 30 minutes.</small>
        </DialogContentText>
				: ""}
				{ display === 1 ?
        <DialogContentText>
          Loaded
        </DialogContentText>
				: ""}
      </DialogContent>
      <DialogActions>
      <Button onClick={close} color="primary">
        Cancel
      </Button>
      <Button onClick={next} color="primary">
        Continue
      </Button>
      </DialogActions>
    </Dialog>
  );
}
