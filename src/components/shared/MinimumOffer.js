import { makeStyles } from '@material-ui/core';
import { cssToReactStyleObject, Icp16Icon, toniqFontStyles } from '@toniq-labs/design-system';
import { ToniqIcon } from '@toniq-labs/design-system/dist/esm/elements/react-components';
import React, { useEffect, useState } from 'react';
import extjs from '../../ic/extjs';
import { icpToString } from '../PriceICP';

const api = extjs.connect("https://boundary.ic0.app/");

const useStyles = makeStyles(theme => ({
	offerChipContainer: {
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    margin: "auto",
    inset: 0,
  },
  offerChip: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 12px",
    background: "#F1F3F6",
    borderRadius: "8px",
    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
  },
}));

export function MinimumOffer(props) {
	const classes = useStyles();
	const [offers, setOffers] = useState(false);

	const getOffers = async () => {
		await api.canister("6z5wo-yqaaa-aaaah-qcsfa-cai").offers(props.tokenid).then(offers => {
			const offerData = offers
				.map(offer => {
					return offer[1];
				})
				.sort((a, b) => {
					return Number(b) - Number(a)
				});
			if (offerData.length) {
				setOffers(icpToString(offerData[offerData.length - 1], true, true));
			}
		});
  }

	useEffect(() => {
    getOffers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
		<>
			{
				offers && 
				<div
					className={`offerChipContainer ${classes.offerChipContainer}`}
					style={{ 
						margin: props.gridSize === 'large' ? 0 : 'auto', 
						height: props.gridSize === 'large' ? 272 : "unset" 
					}}>
						{
							props.gridSize === 'small' ? 
							<div className={classes.offerChip}>
								<ToniqIcon icon={Icp16Icon} />&nbsp;{offers}
							</div> : 
							<div className={classes.offerChip}>
								Minimum Offer is&nbsp;<ToniqIcon icon={Icp16Icon} />&nbsp;{offers}
							</div>
						}
				</div>
			}
		</>
	);
}
