import chunk from 'lodash.chunk';
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import extjs from '../../ic/extjs';
import {EntrepotCollectionStats} from '../../utils';
import DetailBody from './DetailBody';
import OfferForm from '../../components/OfferForm';
import {defaultEntrepotApi} from '../../typescript/api/entrepot-apis/entrepot-data-api';
import {decodeNftId} from '../../typescript/data/nft/nft-id';

const Detail = props => {
    let {tokenid} = useParams();
    let {index, canister} = decodeNftId(tokenid);
    const [
        floor,
        setFloor,
    ] = useState(EntrepotCollectionStats(canister) ? EntrepotCollectionStats(canister).floor : '');
    const [
        offers,
        setOffers,
    ] = useState(false);
    const [
        offerListing,
        setOfferListing,
    ] = useState(false);
    const [
        offerPage,
    ] = useState(0);
    const [
        openOfferForm,
        setOpenOfferForm,
    ] = useState(false);

    const reloadOffers = async () => {
        await defaultEntrepotApi
            .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
            .offers(tokenid)
            .then(r => {
                const offerData = r
                    .map(a => {
                        return {buyer: a[0], amount: a[1], time: a[2]};
                    })
                    .sort((a, b) => Number(b.amount) - Number(a.amount));
                if (offerData.length) {
                    setOffers(chunk(offerData, 9));
                    setOfferListing(offers[offerPage]);
                } else {
                    setOfferListing([]);
                }
            });
    };

    const closeOfferForm = () => {
        reloadOffers();
        setOpenOfferForm(false);
    };

    return (
        <>
            <DetailBody
                index={index}
                canister={canister}
                tokenid={tokenid}
                setOpenOfferForm={setOpenOfferForm}
                offerListing={offerListing}
                floor={floor}
                setFloor={setFloor}
                offers={offers}
                reloadOffers={reloadOffers}
                collections={props.collections}
                {...props}
            />
            <OfferForm
                floor={floor}
                address={props.account.address}
                balance={props.balance}
                complete={reloadOffers}
                identity={props.identity}
                alert={props.alert}
                open={openOfferForm}
                close={closeOfferForm}
                loader={props.loader}
                error={props.error}
                tokenid={tokenid}
            />
        </>
    );
};
export default Detail;
