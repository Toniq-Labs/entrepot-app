import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {
    cssToReactStyleObject,
    Icp16Icon,
    LoaderAnimated24Icon,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import extjs from '../../ic/extjs';
import {icpToString} from '../PriceICP';

const api = extjs.connect('https://boundary.ic0.app/');

const useStyles = makeStyles(theme => ({
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
        let offers = await api
            .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
            .offers(props.tokenid)
            .then(offers => {
                const offerData = offers
                    .map(offer => {
                        return offer[1];
                    })
                    .sort((a, b) => {
                        return Number(b) - Number(a);
                    });
                return offerData;
            });
        aborted = abortController.signal.aborted;
        if (aborted === false) {
            if (offers.length) {
                setOffers(icpToString(offers[offers.length - 1], true, true));
            } else {
                setOffers('');
            }
        }
    };

    useEffect(() => {
        getOffers();
        return () => {
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {offers && offers !== '' && (
                <div
                    className={`hoverCard ${classes.hoverCard}`}
                    style={{
                        margin: props.gridSize === 'large' ? 0 : 'auto',
                        height: props.gridSize === 'large' ? 272 : 'unset',
                    }}
                >
                    {props.gridSize === 'small' ? (
                        <div className={classes.offerChip}>
                            <ToniqIcon icon={Icp16Icon} />
                            &nbsp;{offers}
                        </div>
                    ) : (
                        <div className={classes.offerChip}>
                            Minimum Offer is&nbsp;
                            <ToniqIcon icon={Icp16Icon} />
                            &nbsp;{offers}
                        </div>
                    )}
                </div>
            )}
            {!offers && offers !== '' && (
                <div
                    className={`hoverCard ${classes.hoverCard}`}
                    style={{
                        margin: props.gridSize === 'large' ? 0 : 'auto',
                        height: props.gridSize === 'large' ? 272 : 'unset',
                    }}
                >
                    {props.gridSize === 'small' ? (
                        <div className={classes.offerChip}>
                            <ToniqIcon icon={LoaderAnimated24Icon} />
                        </div>
                    ) : (
                        <div className={classes.offerChip}>
                            <ToniqIcon icon={LoaderAnimated24Icon} />
                            &nbsp;Loading Offers
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
