import React from 'react';
import {makeStyles} from '@material-ui/core';
import {ToniqButton} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {cssToReactStyleObject, toniqFontStyles} from '@toniq-labs/design-system';
import PriceICP from '../../components/PriceICP';

export function ListingInfo(props) {
    const useStyles = makeStyles(theme => ({
        hoverCard: {
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 24,
            right: 0,
            left: 0,
            height: props.gridSize === 'large' ? 272 : 'unset',
        },
    }));

    const {buyNft, listing, _updates} = props;
    const classes = useStyles();

    return (
        <>
            <div className={`hoverCard ${classes.hoverCard}`}>
                <ToniqButton
                    text="Buy Now"
                    onClick={e => {
                        e.preventDefault();
                        buyNft(listing.canister, listing.index, listing, _updates);
                    }}
                    style={{height: '35px'}}
                />
            </div>
        </>
    );
}
