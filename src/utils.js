import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import PriceICP from './components/PriceICP';
import Timestamp from 'react-timestamp';
import extjs from './ic/extjs.js';
const api = extjs.connect('https://icp0.io/');
const TREASURECANISTER = 'yigae-jqaaa-aaaah-qczbq-cai';
const _isCanister = c => {
    return c.length == 27 && c.split('-').length == 5;
};

export const toWrappedMap = {
    'qcg3w-tyaaa-aaaah-qakea-cai': 'bxdf4-baaaa-aaaah-qaruq-cai',
    '4nvhy-3qaaa-aaaah-qcnoq-cai': 'y3b7h-siaaa-aaaah-qcnwa-cai',
    'd3ttm-qaaaa-aaaai-qam4a-cai': '3db6u-aiaaa-aaaah-qbjbq-cai',
    'xkbqi-2qaaa-aaaah-qbpqq-cai': 'q6hjz-kyaaa-aaaah-qcama-cai',
    'fl5nr-xiaaa-aaaai-qbjmq-cai': 'jeghr-iaaaa-aaaah-qco7q-cai',
};
export const getEXTCanister = c => {
    if (toWrappedMap.hasOwnProperty(c)) return toWrappedMap[c];
    else return c;
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
    const collections = (
        await fetch('https://us-central1-entrepot-api.cloudfunctions.net/api/collections')
            .then(r => r.json())
    )
        .map(a => ({ ...a, canister: a.id }))
        .filter(a => _isCanister(a.canister));

    let pxs = [];
    let _ts = [];

    for (let i = 0; i < collections.length; i++) {
        if (!collections[i].market) {
            _ts.push({
                canister: collections[i].canister,
                stats: false,
            });
        } else {
            pxs.push((c =>
                api
                    .token(c)
                    .stats()
                    .then(r => ({ canister: c, stats: r }))
            )(collections[i].canister));
        }
    }

    // Helper function to fetch stats in batches
    const fetchInBatches = async (batchSize = 20, delay = 5000) => {
        let _stats = [];
        for (let i = 0; i < pxs.length; i += batchSize) {
            // Get the current batch of promises
            const batch = pxs.slice(i, i + batchSize);

            // Wait for the batch to resolve
            const results = await Promise.all(batch.map(p => p.catch(() => null)));

            // Filter out any null (failed) results
            const validResults = results.filter(result => result !== null);

            // Add valid results to the stats array
            _stats = _stats.concat(validResults);

            // Wait 5 seconds before fetching the next batch
            if (i + batchSize < pxs.length) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        return _stats;
    };

    // Fetch stats in batches
    const batchStats = await fetchInBatches(80, 2000);

    // Combine the batch stats with the pre-existing stats (_ts)
    _stats = batchStats.concat(_ts);
    
    return _stats;
};

const icpbunnyimg = i => {
    const icbstorage = [
        'efqhu-yqaaa-aaaaf-qaeda-cai',
        'h3ba2-7aaaa-aaaaf-qaeka-cai',
        'h4ago-syaaa-aaaaf-qaekq-cai',
        'fi6d2-xyaaa-aaaaf-qaeeq-cai',
        'fb5ig-bqaaa-aaaaf-qaefa-cai',
        'fg4os-miaaa-aaaaf-qaefq-cai',
        'gynj4-lyaaa-aaaaf-qaemq-cai',
        'groca-5qaaa-aaaaf-qaena-cai',
        'gwpeu-qiaaa-aaaaf-qaenq-cai',
        'f2yud-3iaaa-aaaaf-qaehq-cai',
    ];

    return 'https://' + icbstorage[i % 10] + '.raw.icp0.io/Token/' + i;
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
            api.canister(TREASURECANISTER)
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
            api.canister(TREASURECANISTER)
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
    EntrepotNFTImage = (collection, index, id, fullSize, ref, cachePriority) => {
        if (typeof ref == 'undefined') ref = '';
        else ref = '?' + ref;

        if (typeof cachePriority == 'undefined') cachePriority = '10';

        if (collection === '4ggk4-mqaaa-aaaae-qad6q-cai' && fullSize == false) {
            return 'https://rvu75-2qaaa-aaaam-qc6ua-cai.raw.icp0.io/?asset=' + index;
        }

        if (collection === 'jeghr-iaaaa-aaaah-qco7q-cai')
            return 'https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.icp0.io/nft/' + index;
        if (collection === 'bxdf4-baaaa-aaaah-qaruq-cai')
            return 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.icp0.io/Token/' + index;
        if (collection === 'y3b7h-siaaa-aaaah-qcnwa-cai')
            return 'https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.icp0.io/Token/' + index;
        if (collection === '3db6u-aiaaa-aaaah-qbjbq-cai')
            return 'https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.icp0.io?tokenId=' + index;
        if (collection === 'q6hjz-kyaaa-aaaah-qcama-cai') return icpbunnyimg(index);
        if (collection === 'pk6rk-6aaaa-aaaae-qaazq-cai') {
            if (fullSize) {
                return 'https://' + collection + '.raw.icp0.io/?tokenid=' + id;
            } else {
                return 'https://images.entrepot.app/t/7budn-wqaaa-aaaah-qcsba-cai/' + id;
            }
        }
        if (collection === 'dhiaa-ryaaa-aaaae-qabva-cai') {
            if (fullSize) {
                return 'https://' + collection + '.raw.icp0.io/?tokenid=' + id;
            } else {
                return 'https://images.entrepot.app/tnc/qtejr-pqaaa-aaaah-qcyvq-cai/' + id;
            }
        }
        if (collection === 'skjpp-haaaa-aaaae-qac7q-cai') {
            if (fullSize) {
                return 'https://' + collection + '.raw.icp0.io/?tokenid=' + id;
            } else {
                return 'https://images.entrepot.app/tnc/wtwf2-biaaa-aaaam-qauoq-cai/' + id;
            }
        }
        if (collection === TREASURECANISTER) {
            if (!fullSize) {
                return '/earn/loading.png';
            }
        }
        if (fullSize) {
            return 'https://' + collection + '.raw.icp0.io/?cc=0&tokenid=' + id;
        } else {
            //add collections with wearables or other dynamic traits here
            //these images will not be cached
            if (collection === '7i54s-nyaaa-aaaal-abomq-cai ') {
                let cacheParam = (Math.random() + 1).toString(36).substring(7);
                return (
                    'https://images.entrepot.app/t/7i54s-nyaaa-aaaal-abomq-cai /' +
                    id +
                    '?cache=' +
                    cachePriority +
                    '&cachebuster=' +
                    cacheParam
                );
            }
            //       if (collection === 'rxrsz-5aaaa-aaaam-qaysa-cai')
            //         return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            //       if (collection === 'sbcwr-3qaaa-aaaam-qamoa-cai')
            //         return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            if (collection === 'yrdz3-2yaaa-aaaah-qcvpa-cai')
                return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            if (collection === 'rw7qm-eiaaa-aaaak-aaiqq-cai')
                return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            if (collection === '5movr-diaaa-aaaak-aaftq-cai')
                return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            //       if (collection === 'dhyds-jaaaa-aaaao-aaiia-cai')
            //         return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            //       if (collection === '46sy3-aiaaa-aaaah-qczza-cai')
            //         return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            if (collection === 'e3izy-jiaaa-aaaah-qacbq-cai')
                return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;
            if (collection === 'xjjax-uqaaa-aaaal-qbfgq-cai')
                return 'https://images.entrepot.app/tnc/' + collection + '/' + id + ref;

            //end of section

            if (collection === '6wih6-siaaa-aaaah-qczva-cai')
                return (
                    'https://' +
                    collection +
                    '.raw.icp0.io/?cc' +
                    Date.now() +
                    '&type=thumbnail&tokenid=' +
                    id +
                    ref
                );
            if (collection === 'kss7i-hqaaa-aaaah-qbvmq-cai')
                return 'https://' + collection + '.raw.icp0.io/?type=thumbnail&tokenid=' + id;
            return (
                'https://images.entrepot.app/t/' + collection + '/' + id + '?cache=' + cachePriority
            );
            //return "https://"+collection+".raw.icp0.io/?cc=0&type=thumbnail&tokenid=" + id;
        }
    },
    EntrepotNFTLink = (collection, index, id) => {
        if (collection === 'jeghr-iaaaa-aaaah-qco7q-cai')
            return 'https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.icp0.io/nft/' + index;
        if (collection === 'bxdf4-baaaa-aaaah-qaruq-cai')
            return 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.icp0.io/Token/' + index;
        if (collection === 'y3b7h-siaaa-aaaah-qcnwa-cai')
            return 'https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.icp0.io/Token/' + index;
        if (collection === '3db6u-aiaaa-aaaah-qbjbq-cai')
            return 'https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.icp0.io?tokenId=' + index;
        if (collection === 'q6hjz-kyaaa-aaaah-qcama-cai') return icpbunnyimg(index);
        return 'https://' + collection + '.raw.icp0.io/?tokenid=' + id;
    },
    EntrepotDisplayNFT = (collection, tokenid, imgLoaded, image, onload) => {
        var avatarImgStyle = {
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            objectFit: 'cover',
            borderRadius: '4px',
        };
        var avatarLoaded = {
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
            margin: '0 auto',
        };

        if (
            collection == 'ugdkf-taaaa-aaaak-acoia-cai' ||
            collection == 'bzsui-sqaaa-aaaah-qce2a-cai' ||
            collection == '4ggk4-mqaaa-aaaae-qad6q-cai' ||
            collection == 'jv55j-riaaa-aaaal-abvnq-cai'
        )
            avatarImgStyle.objectFit = 'contain';
        if (collection == 'zhibq-piaaa-aaaah-qcvka-cai') avatarImgStyle.objectFit = 'fill';
        if (
            collection == 'jeghr-iaaaa-aaaah-qco7q-cai' ||
            collection == '2v5zm-uaaaa-aaaae-qaewa-cai'
        )
            return (
                <embed alt={tokenid} style={{...avatarImgStyle, display: 'block'}} src={image} />
            );
        //         // Cubetopia Pets collection
        //         if (collection == 'umqto-nyaaa-aaaah-abwoa-cai')
        //             return (
        //                 <embed
        //                     alt={tokenid}
        //                     style={{
        //                         ...avatarImgStyle,
        //                         display: 'block',
        //                         height: '350px',
        //                         width: '350px',
        //                         transform: 'scale(0.811)',
        //                         top: '-33px',
        //                         left: '-33px',
        //                         pointerEvents: 'none',
        //                     }}
        //                     src={image}
        //                 />
        //             );
        if (collection === TREASURECANISTER) {
            var nftimg = false;
            if (!earnData.hasOwnProperty(tokenid)) {
                api.canister(TREASURECANISTER)
                    .tp_loanDetails(tokenid)
                    .then(r => {
                        if (!earnData.hasOwnProperty(tokenid)) earnData[tokenid] = r[0];
                    });
            } else {
                let {index, canister} = extjs.decodeTokenId(earnData[tokenid].tokenid);
                nftimg = EntrepotNFTImage(canister, index, earnData[tokenid].tokenid, false);
            }
            return (
                <>
                    <img
                        alt={tokenid}
                        style={{...avatarImgStyle, display: imgLoaded ? 'block' : 'none'}}
                        src={image}
                        onLoad={onload}
                    />
                    {earnData.hasOwnProperty(tokenid) ? (
                        <img
                            alt={tokenid}
                            style={{
                                width: '25%',
                                height: '25%',
                                borderRadius: '100%',
                                position: 'absolute',
                                right: '5%',
                                bottom: '5%',
                                display: imgLoaded ? 'block' : 'none',
                            }}
                            src={nftimg}
                        />
                    ) : (
                        ''
                    )}
                    {earnData.hasOwnProperty(tokenid) && earnData[tokenid].repaid ? (
                        <img
                            alt={tokenid}
                            style={{...avatarImgStyle, display: imgLoaded ? 'block' : 'none'}}
                            src={'/earn/repaid.png'}
                        />
                    ) : (
                        ''
                    )}
                    {earnData.hasOwnProperty(tokenid) && earnData[tokenid].defaulted ? (
                        <img
                            alt={tokenid}
                            style={{...avatarImgStyle, display: imgLoaded ? 'block' : 'none'}}
                            src={'/earn/defaulted.png'}
                        />
                    ) : (
                        ''
                    )}
                    <Skeleton
                        style={{
                            ...avatarLoaded,
                            display: imgLoaded ? 'none' : 'block',
                        }}
                        variant="rect"
                    />
                </>
            );
        }
        return (
            <>
                <img
                    alt={tokenid}
                    style={{...avatarImgStyle, display: imgLoaded ? 'block' : 'none'}}
                    src={image}
                    onLoad={onload}
                />
                <Skeleton
                    style={{
                        ...avatarLoaded,
                        display: imgLoaded ? 'none' : 'block',
                    }}
                    variant="rect"
                />
            </>
        );
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
            var b = await api.canister('rkp4c-7iaaa-aaaaa-aaaca-cai').get_icp_xdr_conversion_rate();
            /*var b2 = await fetch(
                'https://free.currconv.com/api/v7/convert?q=XDR_USD&compact=ultra&apiKey=df6440fc0578491bb13eb2088c4f60c7',
            ).then(r => r.json());*/
            _rate =
                Number(b.data.xdr_permyriad_per_icp / 10000n) *
                1.3491865;
        }
        return _rate;
    },
    EntrepotGetICPUSD = n => {
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
        // if (identity) {
            // const _api = extjs.connect('https://icp0.io/', identity);
            // _liked = await _api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').liked();
        // } else _liked = [];
        _liked = [];
    },
    EntrepotSaveLiked = async identity => {
        if (identity) {
            const _api = extjs.connect('https://icp0.io/', identity);
            await _api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').saveLiked(_liked);
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
    EntrepotUnike = async (tokenid, id) => {
        if (!id) return;
        _liked = _liked.filter(a => a != tokenid);
        if (!tokenLikes.hasOwnProperty(tokenid)) tokenLikes[tokenid] = 0;
        tokenLikes[tokenid]--;
        await EntrepotSaveLiked(id);
    },
    EntrepotGetLikes = async (tokenid, skipCache) => {
        if (!tokenLikes.hasOwnProperty(tokenid) || !skipCache) {
            var likes = await api.canister('6z5wo-yqaaa-aaaah-qcsfa-cai').likes(tokenid);
            tokenLikes[tokenid] = Number(likes);
        }
        return tokenLikes[tokenid] < 0 ? 0 : tokenLikes[tokenid];
    },
    numf = (n, d) => {
        if (n === 'N/A') return n;
        d = d ?? 2;
        return n.toFixed(d).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
export {
    clipboardCopy,
    compressAddress,
    displayDate,
    numf,
    EntrepotUpdateStats,
    EntrepotNFTImage,
    EntrepotNFTLink,
    EntrepotNFTMintNumber,
    EntrepotDisplayNFT,
    EntrepotAllStats,
    EntrepotCollectionStats,
    EntrepotUpdateUSD,
    EntrepotGetICPUSD,
    EntrepotUpdateLiked,
    EntrepotIsLiked,
    EntrepotLike,
    EntrepotUnike,
    EntrepotGetLikes,
    EntrepotClearLiked,
    EntrepotGetAllLiked,
    EntrepotEarnDetails,
    EntrepotEarnDetailsData,
};
