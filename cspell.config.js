const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'public/',
        'src/ic/candid',
        'src/firebase.ts',
    ],
    patterns: [
        {
            name: 'address/token',
            pattern: '/\\w{5}-\\w{5}-\\w{5}-\\w{5}-\\w{3}/',
        },
    ],
    ignoreRegExpList: ['address/token'],
    words: [
        ...baseConfig.words,
        'bignumber',
        'blockie',
        'blockies',
        'btcflower',
        'cachebuster',
        'clickaway',
        'cronic',
        'cronics',
        'ctype',
        'DEFI',
        'detailpage',
        'dexie',
        'dfinity',
        'dinos',
        'distrikt',
        'dscvr',
        'entrepôt',
        'extjs',
        'eyewear',
        'favourite',
        'fontsource',
        'geoip',
        'gifshot',
        'hzld',
        'icapes',
        'icats',
        'icdrip',
        'icelebrity',
        'icpledger',
        'icpunks',
        'icpuppy',
        'icscan',
        'ictuts',
        'idls',
        'iefix',
        'infinitywallet',
        'lazyload',
        'magni',
        'mechs',
        'mintregister',
        'moonwalker',
        'motoko',
        'nftgeek',
        'nftlicense',
        'nftv',
        'nonfungible',
        'openlogin',
        'permyriad',
        'roboto',
        'saletype',
        'Secp256k1',
        'sjcl',
        'starkbank',
        'subaccount',
        'subnetwork',
        'tokenid',
        'Toniq',
        'toruslabs',
        'videos_that_dont_fit_in_frame',
        'localforage',
        'Firestore',
        'firestore',
    ],
};