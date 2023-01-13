import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {
    cssToReactStyleObject,
    Icp16Icon,
    LoaderAnimated24Icon,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from '../PriceICP';
import {entrepotDataApi} from '../../typescript/api/entrepot-data-api';

const useStyles = makeStyles(() => ({
    hoverCard: {
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        margin: 'auto',
        inset: 0,
    },
    offerChip: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 12px',
        background: '#F1F3F6',
        borderRadius: '8px',
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
    },
}));

export function MinimumOffer(props) {
    const classes = useStyles();
    const [
        offers,
        setOffers,
    ] = useState(false);
    let abortController = new AbortController();
    let aborted = abortController.signal.aborted;

    const getOffers = async () => {
        let offers = await entrepotDataApi
            .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
            .offers(props.tokenid);
        aborted = abortController.signal.aborted;
        if (aborted === false) {
            if (offers.length) {
                setOffers(offers);
            } else {
                setOffers('');
            }
        }
    };

    const getHighestOffer = () => {
        if (!offers) return '';
        let sortedOffers = offers
            .map(offer => {
                return offer[1];
            })
            .sort((a, b) => {
                return Number(a) - Number(b);
            });
        return icpToString(sortedOffers[sortedOffers.length - 1], true, true);
    };

    useEffect(() => {
        getOffers();
        return () => {
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{display: props.gridSize === 'large' ? 'block' : 'none'}}>
            {offers && offers !== '' && (
                <div
                    className={`hoverCard ${classes.hoverCard}`}
                    style={{
                        margin: 0,
                        height: 304,
                    }}
                >
                    <div className={classes.offerChip}>
                        Highest Offer is&nbsp;
                        <ToniqIcon icon={Icp16Icon} />
                        &nbsp;{getHighestOffer()}
                    </div>
                </div>
            )}
            {!offers && offers !== '' && (
                <div
                    className={`hoverCard ${classes.hoverCard}`}
                    style={{
                        margin: 0,
                        height: 304,
                    }}
                >
                    <div className={classes.offerChip}>
                        <ToniqIcon icon={LoaderAnimated24Icon} />
                        &nbsp;Loading Offers
                    </div>
                </div>
            )}
        </div>
    );
}
