/* global BigInt */
import React from 'react';
import Timestamp from 'react-timestamp';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import PriceICP from './PriceICP';
import PriceUSD from './PriceUSD';
import {Link} from 'react-router-dom';
import {EntrepotGetIcpUsd} from '../utils.js';
import {treasureCanisterId} from '../typescript/data/canisters/treasure-canister';
import {EntrepotNftDisplay} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';
import {encodeNftId, decodeNftId} from '../typescript/data/nft/nft-id';
import {getNftMintNumber} from '../typescript/data/nft/user-nft';

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
export default function Pawn(props) {
    const getCollection = c => {
        return props.collections.find(e => e.canister === c);
    };
    const [
        imgLoaded,
        setImgLoaded,
    ] = React.useState(false);
    let {canister, index} = decodeNftId(props.event.tokenid);
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
    const refresh = () => {};
    const viewNft = () => {
        var tokenid = encodeNftId(treasureCanisterId, props.event.index);
        window.open('/marketplace/asset/' + tokenid);
    };
    const repayContract = async () => {
        console.log(props.event);
        props.repayContract(
            props.event.index,
            props.event.repayment[0],
            props.event.amount,
            props.event.reward,
            props.refresh,
        );
    };
    const fillRequest = async () => {
        props.fillRequest(props.event.tokenid, props.event.amount, props.refresh);
    };
    const cancelRequest = async () => {
        props.cancelRequest(props.event.tokenid, props.refresh);
    };
    const aprCol = () => {
        if (props.event.apr < 0.2) return '#FFFFFF';
        if (props.event.apr < 0.4) return '#E6FAF4';
        if (props.event.apr < 0.6) return '#CCF6E9';
        if (props.event.apr < 0.8) return '#B2F1DE';
        if (props.event.apr < 1) return '#99ECD3';
        if (props.event.apr < 1.5) return '#80E8C8';
        if (props.event.apr < 2) return '#66E3BE';
        if (props.event.apr < 2.5) return '#4CDEB3';
        if (props.event.apr < 3) return '#33D9A8';
        if (props.event.apr < 5) return '#1AD59D';
        return '#00D092';
    };

    const toRate = r => (r * 100).toFixed(2);
    const frCol = () => {
        var fr = Number(props.event.amount) / Number(props.event.floor);
        if (fr > 0.83) return '#FFCAC8';
        if (fr > 0.5) return '#FFE1B5';
        if (fr > 0.33) return '#FFF8BC';
        return '#CEFFDC';
    };
    useInterval(refresh, 60 * 1000);
    React.useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <TableRow className="pawn-table-row">
            <TableCell align="left">
                <Link
                    to={`/marketplace/asset/${props.event.tokenid}`}
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
                        <EntrepotNftDisplay
                            collectionId={canister}
                            nftIndex={index}
                            nftId={props.event.tokenid}
                            max={{width: 40, height: 40}}
                            min={{width: 40, height: 40}}
                        />
                    </div>
                    <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <strong>
                            {getCollection(canister).name}{' '}
                            {'#' +
                                getNftMintNumber({
                                    collectionId: canister,
                                    nftIndex: index,
                                })}
                        </strong>
                        {props.event.floor ? (
                            <>
                                <br />
                                <small>
                                    Floor: <PriceICP price={props.event.floor} />
                                </small>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </Link>
            </TableCell>
            <TableCell align="right">
                <strong>
                    <PriceICP price={props.event.amount} />
                </strong>
                <br />
                {EntrepotGetIcpUsd(props.event.amount) ? (
                    <small>
                        <PriceUSD price={EntrepotGetIcpUsd(props.event.amount)} />
                    </small>
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="right">
                <strong>
                    <PriceICP price={props.event.reward} />
                </strong>
                <br />
                {EntrepotGetIcpUsd(props.event.reward) ? (
                    <small>
                        <PriceUSD price={EntrepotGetIcpUsd(props.event.reward)} />
                    </small>
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="center">
                {props.event.days} Day{props.event.days !== 1 ? 's' : ''}
            </TableCell>
            <TableCell align="center">
                {props.event.floorRate ? (
                    <div
                        style={{
                            backgroundColor: frCol(),
                            padding: '3px',
                            border: '1px solid black',
                            borderRadius: '4px',
                        }}
                    >
                        <span style={{fontWeight: 'bold'}}>{toRate(props.event.floorRate)}%</span>
                    </div>
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="center">
                <div
                    style={{
                        backgroundColor: aprCol(),
                        padding: '3px',
                        border: '1px solid black',
                        borderRadius: '4px',
                    }}
                >
                    <span style={{fontWeight: 'bold'}}>{toRate(props.event.apr)}%</span>
                </div>
            </TableCell>
            {props.event.type == 'request' ? (
                <TableCell align="center">
                    Expires
                    <br />
                    <Timestamp
                        relative
                        autoUpdate
                        date={Number(props.event.date / 1000000000n) + 24 * 60 * 60 * 1}
                    />
                </TableCell>
            ) : (
                ''
            )}
            {props.event.type == 'request' ? (
                <TableCell align="center">
                    {props.identity ? (
                        props.identity.getPrincipal().toText() == props.event.user.toText() ? (
                            <Button
                                style={{fontWeight: 'bold'}}
                                size={'small'}
                                variant="contained"
                                color="#F0F3F6"
                                onClick={cancelRequest}
                            >
                                Cancel
                            </Button>
                        ) : (
                            <Button
                                style={{fontWeight: 'bold'}}
                                size={'small'}
                                variant="contained"
                                color={'primary'}
                                onClick={fillRequest}
                            >
                                Accept
                            </Button>
                        )
                    ) : (
                        ''
                    )}
                </TableCell>
            ) : (
                ''
            )}

            {props.event.type == 'contract' && props.event.defaulted ? (
                <TableCell align="center">
                    <span style={{fontWeight: 'bold', color: 'red'}}>NOT PAID</span>
                </TableCell>
            ) : (
                ''
            )}
            {props.event.type == 'contract' && props.event.repaid ? (
                <TableCell align="center">
                    <span style={{fontWeight: 'bold', color: 'green'}}>PAID</span>
                </TableCell>
            ) : (
                ''
            )}
            {props.event.type == 'contract' && !props.event.defaulted && !props.event.repaid ? (
                <TableCell align="center">
                    Ends
                    <br />
                    <Timestamp
                        relative
                        autoUpdate
                        date={
                            Number((props.event.filled[0] + props.event.length) / 1000000000n) +
                            24 * 60 * 60 * 1
                        }
                    />
                </TableCell>
            ) : (
                ''
            )}
            {props.event.type == 'contract' ? (
                <TableCell align="center">
                    {props.identity ? (
                        props.identity.getPrincipal().toText() == props.event.user.toText() &&
                        !props.event.defaulted &&
                        !props.event.repaid ? (
                            <Button
                                style={{fontWeight: 'bold'}}
                                size={'small'}
                                variant="contained"
                                color={'primary'}
                                onClick={repayContract}
                            >
                                Repay Now
                            </Button>
                        ) : (
                            <Button
                                style={{fontWeight: 'bold'}}
                                size={'small'}
                                variant="contained"
                                color={'primary'}
                                onClick={viewNft}
                            >
                                View NFT
                            </Button>
                        )
                    ) : (
                        ''
                    )}
                </TableCell>
            ) : (
                ''
            )}
        </TableRow>
    );
}
