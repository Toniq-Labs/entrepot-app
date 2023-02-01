import React from 'react';
import Timestamp from 'react-timestamp';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import {useNavigate, Link} from 'react-router-dom';
import {EntrepotGetIcpUsd} from '../utils.js';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {decodeNftId} from '../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../typescript/data/nft/user-nft';

export default function Event(props) {
    const getCollection = c => {
        if (typeof props.collections.find(e => e.canister === c) == 'undefined') return {};
        return props.collections.find(e => e.canister === c);
    };
    const [
        imgLoaded,
        setImgLoaded,
    ] = React.useState(false);
    const navigate = useNavigate();
    const event = props.event;
    const index = decodeNftId(event.token).index;
    const tokenid = event.token;
    const styles = {
        avatarSkeletonContainer: {
            height: 0,
            overflow: 'hidden',
            paddingTop: '100%',
            position: 'relative',
        },
        avatarLoader: {
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
            margin: '0 auto',
        },
        avatarImg: {
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            objectFit: 'contain',
        },
    };

    const mintNumber = () => {
        return getNftMintNumber({
            collectionId: props.collection,
            nftIndex: index,
        });
    };
    const shorten = a => {
        return a.substring(0, 12) + '...';
    };
    return (
        <TableRow>
            <TableCell>
                <ShoppingCartIcon style={{fontSize: 18, verticalAlign: 'middle'}} />{' '}
                <strong>{event.type}</strong>
            </TableCell>
            <TableCell align="left">
                <Link
                    to={`/marketplace/asset/${tokenid}`}
                    style={{color: 'black', textDecoration: 'none'}}
                >
                    <div
                        style={{
                            width: 50,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            paddingRight: 10,
                        }}
                    >
                        <EntrepotNftDisplayReact
                            collectionId={props.collection}
                            nftIndex={index}
                            nftId={tokenid}
                        />
                    </div>
                    <strong>
                        {getCollection(props.collection).name} {'#' + mintNumber()}
                    </strong>
                </Link>
            </TableCell>
            <TableCell align="right">
                <strong>
                    <PriceICP price={event.price} />
                </strong>
                <br />
                {EntrepotGetIcpUsd(event.price) ? (
                    <small>
                        <PriceUSD price={EntrepotGetIcpUsd(event.price)} />
                    </small>
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="center">
                <a href={'https://icscan.io/account/' + event.seller} target="_blank">
                    {shorten(event.seller)}
                </a>
            </TableCell>
            <TableCell align="center">
                <a href={'https://icscan.io/account/' + event.buyer} target="_blank">
                    {shorten(event.buyer)}
                </a>
            </TableCell>
            <TableCell align="center">
                <Timestamp relative autoUpdate date={Number(event.time / 1000000000)} />
            </TableCell>
        </TableRow>
    );
}
