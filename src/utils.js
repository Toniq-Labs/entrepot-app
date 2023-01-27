import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import PriceICP from './components/PriceICP';
import Timestamp from 'react-timestamp';
import extjs from './ic/extjs.js';
import {treasureCanisterId} from './typescript/data/canisters/treasure-canister';
import {
    defaultEntrepotApi,
    createEntrepotApiWithIdentity,
} from './typescript/api/entrepot-data-api';

const _isCanister = c => {
    return c.length == 27 && c.split('-').length == 5;
};
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
var _stats = [],
    _rate = false,
    _liked = [],
    _identity = false,
    tokenLikes = {},
    lastUpdate = false,
    earnData = {};
const _getStats = async () => {
    var collections = (
        await fetch('https://us-central1-entrepot-api.cloudfunctions.net/api/collections').then(r =>
            r.json(),
        )
    )
        .map(a => ({...a, canister: a.id}))
        .filter(a => _isCanister(a.canister));
    var pxs = [];
    var _ts = [];
    for (var i = 0; i < collections.length; i++) {
        if (!collections[i].market) {
            _ts.push({
                canister: collections[i].canister,
                stats: false,
            });
        } else {
            pxs.push(
                (c =>
                    defaultEntrepotApi
                        .token(c)
                        .stats()
                        .then(r => {
                            return {canister: c, stats: r};
                        }))(collections[i].canister),
            );
        }
    }
    const results = await Promise.all(pxs.map(p => p.catch(e => e)));
    const validResults = results.filter(result => !(result instanceof Error));
    _stats = validResults.concat(_ts);
    return _stats;
};
const clipboardCopy = text => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy text: ', err);
            },
        );
    },
    isHex = h => {
        var regexp = /^[0-9a-fA-F]+$/;
        return regexp.test(h);
    },
    compressAddress = a => {
        if (!a) return '';
        if (a.length === 64 && isHex(a)) return a.substr(0, 16) + '...';
        else {
            var pp = a.split('-');
            if (pp.length <= 4) return a;
            else {
                return (
                    pp[0] +
                    '-' +
                    pp[1].substr(0, 3) +
                    '...' +
                    pp[pp.length - 3].substr(2) +
                    '-' +
                    pp[pp.length - 2] +
                    '-' +
                    pp[pp.length - 1]
                );
            }
        }
    },
    displayDate = d => {
        return new Date(d).toString();
    },
    EntrepotEarnDetailsData = id => {
        if (!earnData.hasOwnProperty(id)) {
            defaultEntrepotApi
                .canister(treasureCanisterId)
                .tp_loanDetails(id)
                .then(r => {
                    if (!earnData.hasOwnProperty(id)) earnData[id] = r[0];
                });
        }
        if (earnData.hasOwnProperty(id)) {
            return earnData[id].reward + earnData[id].amount;
        }
        return 0n;
    },
    EntrepotEarnDetails = (id, nft_price) => {
        if (!earnData.hasOwnProperty(id)) {
            defaultEntrepotApi
                .canister(treasureCanisterId)
                .tp_loanDetails(id)
                .then(r => {
                    if (!earnData.hasOwnProperty(id)) earnData[id] = r[0];
                });
        }
        if (earnData.hasOwnProperty(id)) {
            if (earnData[id].repaid || earnData[id].defaulted) return '';
            return (
                <div
                    style={{
                        padding: '5px 0',
                        fontSize: 11,
                        fontWeight: 'bold',
                        textAlign: 'left',
                        borderTop: '1px solid #ddd',
                    }}
                >
                    Receive NFT or Profit{' '}
                    <span
                        style={
                            EntrepotEarnDetailsData(id) > nft_price
                                ? {color: 'green'}
                                : {color: 'red'}
                        }
                    >
                        <PriceICP price={EntrepotEarnDetailsData(id) - nft_price} />
                    </span>
                    <br />
                    <Timestamp
                        relative
                        autoUpdate
                        date={Number((earnData[id].filled[0] + earnData[id].length) / 1000000000n)}
                    />
                </div>
            );
        }
        return '';
    },
    EntrepotNFTMintNumber = (collection, index, id) => {
        if (collection === 'bxdf4-baaaa-aaaah-qaruq-cai') return index;
        if (collection === 'y3b7h-siaaa-aaaah-qcnwa-cai') return index;
        if (collection === '3db6u-aiaaa-aaaah-qbjbq-cai') return index;
        if (collection === 'q6hjz-kyaaa-aaaah-qcama-cai') return index;
        if (collection === 'jeghr-iaaaa-aaaah-qco7q-cai') return index;
        return index + 1;
    },
    EntrepotAllStats = () => {
        return _stats;
    },
    EntrepotCollectionStats = c => {
        var s = _stats.filter(a => a.canister === c);
        if (s.length) return s[0].stats;
        else return false;
    },
    EntrepotUpdateStats = async () => {
        await _getStats();
        return _stats;
    },
    EntrepotUpdateUSD = async () => {
        if (!lastUpdate || Date.now() - lastUpdate > 10 * 60 * 1000) {
            lastUpdate = Date.now();
            var b = await defaultEntrepotApi
                .canister('rkp4c-7iaaa-aaaaa-aaaca-cai')
                .get_icp_xdr_conversion_rate();
            var b2 = await fetch(
                'https://free.currconv.com/api/v7/convert?q=XDR_USD&compact=ultra&apiKey=df6440fc0578491bb13eb2088c4f60c7',
            ).then(r => r.json());
            _rate =
                Number(b.data.xdr_permyriad_per_icp / 10000n) *
                (b2.hasOwnProperty('XDR_USD') ? b2.XDR_USD : 1.331578);
        }
        return _rate;
    },
    EntrepotGetIcpUsd = n => {
        if (_rate) return (_rate * (Number(n) / 100000000)).toFixed(2);
        else return false;
    },
    EntrepotClearLiked = async () => {
        _liked = [];
    },
    EntrepotGetAllLiked = () => {
        return _liked;
    },
    EntrepotUpdateLiked = async identity => {
        if (identity) {
            const entrepotApi = createEntrepotApiWithIdentity(identity);
            _liked = await entrepotApi.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').liked();
        } else _liked = [];
    },
    EntrepotSaveLiked = async identity => {
        if (identity) {
            const entrepotApi = createEntrepotApiWithIdentity(identity);
            await entrepotApi.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').saveLiked(_liked);
        }
    },
    EntrepotIsLiked = tokenid => {
        return _liked.indexOf(tokenid) >= 0;
    },
    EntrepotLike = async (tokenid, id) => {
        if (!id) return;
        _liked.push(tokenid);
        if (!tokenLikes.hasOwnProperty(tokenid)) tokenLikes[tokenid] = 0;
        tokenLikes[tokenid]++;
        await EntrepotSaveLiked(id);
    },
    EntrepotUnlike = async (tokenid, id) => {
        if (!id) return;
        _liked = _liked.filter(a => a != tokenid);
        if (!tokenLikes.hasOwnProperty(tokenid)) tokenLikes[tokenid] = 0;
        tokenLikes[tokenid]--;
        await EntrepotSaveLiked(id);
    },
    EntrepotGetLikes = async (tokenid, skipCache) => {
        if (!tokenLikes.hasOwnProperty(tokenid) || !skipCache) {
            var likes = await defaultEntrepotApi
                .canister('6z5wo-yqaaa-aaaah-qcsfa-cai')
                .likes(tokenid);
            tokenLikes[tokenid] = Number(likes);
        }
        return tokenLikes[tokenid] < 0 ? 0 : tokenLikes[tokenid];
    };
export {
    clipboardCopy,
    compressAddress,
    displayDate,
    EntrepotUpdateStats,
    EntrepotNFTMintNumber,
    EntrepotAllStats,
    EntrepotCollectionStats,
    EntrepotUpdateUSD,
    EntrepotGetIcpUsd,
    EntrepotUpdateLiked,
    EntrepotIsLiked,
    EntrepotLike,
    EntrepotUnlike,
    EntrepotGetLikes,
    EntrepotClearLiked,
    EntrepotGetAllLiked,
    EntrepotEarnDetails,
    EntrepotEarnDetailsData,
};
