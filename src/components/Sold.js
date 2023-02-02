import React from 'react';
import Timestamp from 'react-timestamp';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MuiTooltip from '@material-ui/core/Tooltip';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import {useNavigate, Link} from 'react-router-dom';
import {EntrepotGetIcpUsd} from '../utils.js';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {decodeNftId} from '../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../typescript/data/nft/nft-mint-number';

export default function Sold(props) {
    const [
        imgLoaded,
        setImgLoaded,
    ] = React.useState(false);
    const navigate = useNavigate();
    const transaction = props.transaction;
    const index = decodeNftId(transaction.token).index;
    const tokenid = transaction.token;

    const getCollection = c => {
        if (typeof props.collections.find(e => e.canister === c) == 'undefined') return {};
        return props.collections.find(e => e.canister === c);
    };
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

    const shorten = a => {
        return a.substring(0, 12) + '...';
    };
    const showNri = () => {
        if (typeof props.nri == 'undefined') return '';
        if (props.nri === false) return '';
        var collection = getCollection(props.collection);
        if (collection.nftv) {
            return (
                <MuiTooltip
                    title={
                        'NFT Rarity Index is a 3rd party metric by NFT Village. For this collection, it displays the color and trait rarity of a specific ' +
                        collection.unit +
                        ' relative to others. It does not include Mint #, Twin Status or Animation within the index.'
                    }
                >
                    <span>NRI: {(props.nri * 100).toFixed(1)}%</span>
                </MuiTooltip>
            );
        } else return '';
    };
    var t = [
        'Common',
        'Uncommon',
        'Rare',
        'Epic',
        'Legendary',
        'Mythic',
    ];
    return (
        <TableRow>
            <TableCell>
                <ShoppingCartIcon style={{fontSize: 18, verticalAlign: 'middle'}} />{' '}
                <strong>Sale</strong>
            </TableCell>
            <TableCell align="left">
                <Link
                    style={{color: 'black', textDecoration: 'none'}}
                    to={`/marketplace/asset/${tokenid}`}
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
                        {getCollection(props.collection).name}{' '}
                        {'#' +
                            getNftMintNumber({
                                collectionId: props.collection,
                                nftIndex: index,
                            })}
                    </strong>
                </Link>
            </TableCell>
            <TableCell align="center">
                <strong>{showNri(props.nri)}</strong>
            </TableCell>
            <TableCell align="right">
                <strong>
                    <PriceICP price={transaction.price} />
                </strong>
                <br />
                {EntrepotGetIcpUsd(transaction.price) ? (
                    <small>
                        <PriceUSD price={EntrepotGetIcpUsd(transaction.price)} />
                    </small>
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="center">
                <a href={'https://icscan.io/account/' + transaction.seller} target="_blank">
                    {shorten(transaction.seller)}
                </a>
            </TableCell>
            <TableCell align="center">
                <a href={'https://icscan.io/account/' + transaction.buyer} target="_blank">
                    {shorten(transaction.buyer)}
                </a>
            </TableCell>
            <TableCell align="center">
                <Timestamp relative autoUpdate date={Number(transaction.time / 1000000000)} />
            </TableCell>
        </TableRow>
    );
}
