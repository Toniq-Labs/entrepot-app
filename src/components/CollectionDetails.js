import React, {createRef, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import extjs from '../ic/extjs.js';
import {makeStyles} from '@material-ui/core';
import {EntrepotUpdateStats, EntrepotAllStats, EntrepotCollectionStats} from '../utils';
import {
    cssToReactStyleObject,
    toniqFontStyles,
    toniqShadows,
    CircleWavyCheck24Icon,
    Icp16Icon,
    toniqColors,
} from '@toniq-labs/design-system';
import {ToniqChip, ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from './PriceICP.js';
import {isEllipsisActive} from '../utilities/element-utils.js';
import {formatNumber} from '../utilities/number-utils.js';

const api = extjs.connect('https://boundary.ic0.app/');

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

const useStyles = makeStyles(theme => ({
    banner: {
        borderRadius: 16,
        marginBottom: 80,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            paddingTop: '100%',
            width: '100%',
        },
    },
    avatar: {
        top: 150,
        margin: '0 auto',
        border: '8px solid #FFF',
        borderRadius: '16px',
        height: '112px',
        width: '112px',
        background: '#FFF',
        ...cssToReactStyleObject(toniqShadows.popupShadow),
        '& > img': {
            borderRadius: '8px',
        },
        [theme.breakpoints.down('xs')]: {
            top: -50,
        },
    },
    nftName: {
        [theme.breakpoints.up('xs')]: {
            ...cssToReactStyleObject(toniqFontStyles.h1Font),
        },
        [theme.breakpoints.down('xs')]: {
            ...cssToReactStyleObject(toniqFontStyles.h2Font),
            fontWeight: '900',
        },
    },
    royalty: {
        ...cssToReactStyleObject(toniqFontStyles.boldLabelFont),
    },
    detailsWrapper: {
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        gap: '32px',
        marginBottom: '32px',
        [theme.breakpoints.down('sm')]: {
            gap: '16px',
            marginBottom: '16px',
        },
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        flexFlow: 'column',
        [theme.breakpoints.down('sm')]: {
            flexFlow: 'column-reverse',
            gap: '16px',
        },
    },
    blurbWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    blurb: {
        textAlign: 'center',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '& > a': {
            color: `${toniqColors.pagePrimary.foregroundColor}`,
            '&:hover': {
                color: toniqColors.pageInteractionHover.foregroundColor,
            },
        },
    },
    blurbCollapsed: {
        '-webkit-line-clamp': 3,
        overflow: 'hidden',
    },
    statsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    stats: {
        minWidth: 80,
        [theme.breakpoints.down('sm')]: {
            minWidth: 103,
        },
    },
}));

export default function CollectionDetails(props) {
    const classes = useStyles();
    const [
        isBlurbOpen,
        setIsBlurbOpen,
    ] = useState(false);
    const [
        size,
        setSize,
    ] = useState(false);
    const [
        showReadMore,
        setShowReadMore,
    ] = useState(false);
    const [
        stats,
        setStats,
    ] = useState(false);
    const blurbRef = createRef();
    var collection = props.collection;

    React.useEffect(() => {
        if (EntrepotAllStats().length) setStats(EntrepotCollectionStats(collection.canister));

        api.token(collection.canister)
            .size()
            .then(s => {
                setSize(s);
            });

        setShowReadMore(isEllipsisActive(blurbRef.current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _updates = async (s, canister) => {
        EntrepotUpdateStats().then(() => {
            setStats(EntrepotCollectionStats(collection.canister));
        });
    };

    useInterval(_updates, 10 * 1000);
    return (
        <>
            <div
                className={classes.banner}
                style={{
                    backgroundImage:
                        typeof collection.banner != 'undefined' && collection.banner
                            ? "url('" + collection.banner + "')"
                            : '#aaa',
                }}
            >
                <Avatar
                    variant="square"
                    className={classes.avatar}
                    src={
                        typeof collection.avatar != 'undefined' && collection.avatar
                            ? collection.avatar
                            : '/collections/' + collection.canister + '.jpg'
                    }
                />
            </div>
            <div className={classes.detailsWrapper}>
                <Grid container direction="column">
                    <Grid
                        container
                        item
                        style={{justifyContent: 'center', alignItems: 'center', gap: 16}}
                    >
                        <Grid item>
                            <span className={classes.nftName}>{collection.name}</span>
                        </Grid>
                        {collection.kyc && (
                            <Grid item>
                                <ToniqIcon
                                    icon={CircleWavyCheck24Icon}
                                    style={{color: toniqColors.pageInteraction.foregroundColor}}
                                />
                            </Grid>
                        )}
                    </Grid>
                    {collection.commission && (
                        <Grid item>
                            <span className={classes.royalty}>
                                Creator Royalty:{' '}
                                {formatNumber((collection.commission - 0.01) * 100, true)}%
                            </span>
                        </Grid>
                    )}
                </Grid>
                <div className={classes.detailsContainer}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <a
                                href={'https://icscan.io/nft/collection/' + collection.canister}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    alt={collection.name}
                                    src="/icon/svg/icscan.svg"
                                    style={{width: 32}}
                                />
                            </a>
                        </Grid>
                        {[
                            'telegram',
                            'twitter',
                            'medium',
                            'discord',
                            'dscvr',
                            'distrikt',
                        ]
                            .filter(
                                social => collection.hasOwnProperty(social) && collection[social],
                            )
                            .map(social => {
                                return (
                                    <Grid key={social} item>
                                        <a
                                            href={collection[social]}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                alt="create"
                                                style={{width: 32}}
                                                src={'/icon/svg/' + social + '.svg'}
                                            />
                                        </a>
                                    </Grid>
                                );
                            })}
                        {collection.web && (
                            <Grid item>
                                <a href={collection.web} target="_blank" rel="noreferrer">
                                    <img
                                        alt={collection.name}
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAB1ElEQVRYhe3Xy2oUQRQG4K+TMCqIN9BoVrpRMEgixix0o4LgM7jxIdQHEN14eQsvexGCkkV2IknUBEUkDxBEYdAENY4y7aJqnE473QkyPWYxPxRdVX2q/r8up+pUImAYV3ECQ6rFL7zBPXxMIvkCduMl1ioWsB2n8BnjcAffcLxi4ixG8R23EzzDTpxFgoloNB+/2XLaRRHPsTqEGhqx8ihmY/5YFJQtL3VRwA/U8htuCZOZfJIrdx15ASnmSsqVCRjDdJVEHTCGxYEek/6F1gws4mKPuWfgv89AX0BfwJYXMIyHWBFOxRRNXOtgez3+a9l9wQMcKCMoCz524QX24xHqsb6JqQ72U9irPah9uIwzwqm3WkQ0E1MeN/FT+zr+F0zEPm4U8ZYtwWm81Y4LWjgijCbNpRUcztnOxz4mFaBsCepCyJSNF2AZt4Tpztsv5+pqOIR3JTyFS3BBWO/7GCnroAAjsW0T58p4iwQQdnbD+qnerBeksW0n2z+8G4Xgd/EEl3Aw1m3WCz7gKd6XESTaoz+/gZhuo38dbx0BDcFfe41taAwI78KTwnOpVxiNnK8T4bZawB68Et5sVWKH8DitY3wQX4UTa9B6P64Ka3iMK/j0GzErczA0LPD5AAAAAElFTkSuQmCC"
                                    />
                                </a>
                            </Grid>
                        )}
                    </Grid>
                </div>
                {/*collection?.canister == "oeee4-qaaaa-aaaak-qaaeq-cai" ? <Alert severity="error"><strong>There seems to be an issue with the <a href="https://dashboard.internetcomputer.org/subnet/opn46-zyspe-hhmyp-4zu6u-7sbrh-dok77-m7dch-im62f-vyimr-a3n2c-4ae" target="_blank">oopn46-zyspe... subnet</a> which is causing issues with this collection.</strong></Alert> : ""*/}
                {collection.blurb && (
                    <div className={classes.blurbWrapper}>
                        <div
                            ref={blurbRef}
                            className={`${classes.blurb} ${
                                !isBlurbOpen ? classes.blurbCollapsed : ''
                            }`}
                            dangerouslySetInnerHTML={{__html: collection.blurb}}
                        />
                        {showReadMore && (
                            <button
                                style={{
                                    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                            >
                                {!isBlurbOpen ? 'Read More' : 'Read Less'}
                            </button>
                        )}
                    </div>
                )}
                {stats ? (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid
                            item
                            className={classes.statsWrapper}
                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
                        >
                            <span style={{textTransform: 'uppercase', opacity: '0.64'}}>
                                Volume
                            </span>
                            <ToniqChip
                                className={`toniq-chip-secondary ${classes.stats}`}
                                style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                                icon={Icp16Icon}
                                text={icpToString(stats.total, false, true)}
                            ></ToniqChip>
                        </Grid>
                        <Grid
                            item
                            className={classes.statsWrapper}
                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
                        >
                            <span style={{textTransform: 'uppercase', opacity: '0.64'}}>
                                Listings
                            </span>
                            <ToniqChip
                                className={`toniq-chip-secondary ${classes.stats}`}
                                style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                                text={formatNumber(stats.listings, true)}
                            ></ToniqChip>
                        </Grid>
                        <Grid
                            item
                            className={classes.statsWrapper}
                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
                        >
                            <span style={{textTransform: 'uppercase', opacity: '0.64'}}>
                                Avg. Price
                            </span>
                            <ToniqChip
                                className={`toniq-chip-secondary ${classes.stats}`}
                                style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                                icon={Icp16Icon}
                                text={icpToString(stats.average, false, true)}
                            ></ToniqChip>
                        </Grid>
                        <Grid
                            item
                            className={classes.statsWrapper}
                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
                        >
                            <span style={{textTransform: 'uppercase', opacity: '0.64'}}>
                                Minted
                            </span>
                            <ToniqChip
                                className={`toniq-chip-secondary ${classes.stats}`}
                                style={cssToReactStyleObject(toniqFontStyles.boldFont)}
                                text={formatNumber(size, true)}
                            ></ToniqChip>
                        </Grid>
                    </Grid>
                ) : (
                    ''
                )}
            </div>
        </>
    );
}
