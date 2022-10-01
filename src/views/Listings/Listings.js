import React, {useState} from 'react';
import {useParams} from 'react-router';
import CollectionDetails from '../../components/CollectionDetails.js';

import {ListingsBody} from './ListingsBody.js';

const _isCanister = c => {
    return c.length === 27 && c.split('-').length === 5;
};

export default function Listings(props) {
    const { buyNft, faveRefresher, identity, loggedIn } = props;
    const params = useParams();
    const getCollectionFromRoute = r => {
        if (_isCanister(r)) {
            return props.collections.find(e => e.canister === r);
        } else {
            return props.collections.find(e => e.route === r);
        }
    };
    const [collection] = useState(getCollectionFromRoute(params?.route));

    return (
        <div style={{minHeight: 'calc(100vh - 221px)'}}>
            <div style={{margin: '0 auto'}}>
                <CollectionDetails collection={collection} />
            </div>
            <ListingsBody collection={collection} getCollectionFromRoute={getCollectionFromRoute} buyNft={buyNft} faveRefresher={faveRefresher} identity={identity} loggedIn={loggedIn} />
        </div>
    );
}
