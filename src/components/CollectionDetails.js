import React, {useState} from 'react';
import {Grid, Link, Avatar, makeStyles} from '@material-ui/core';
import {EntrepotUpdateStats, EntrepotAllStats, EntrepotCollectionStats} from '../utils';
import {
    cssToReactStyleObject,
    toniqFontStyles,
    toniqShadows,
    CircleWavyCheck24Icon,
    Icp16Icon,
    toniqColors,
    BrandIcScan24Icon,
    Code24Icon,
} from '@toniq-labs/design-system';
import {ToniqChip, ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from './PriceICP.js';
import {formatNumber} from '../utilities/number-utils.js';
import TruncateMarkup from 'react-truncate-markup';
import parse from 'html-react-parser';
import {CopyButton} from './shared/CopyButton';
import {defaultEntrepotApi} from '../typescript/api/entrepot-data-api';

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
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: 256,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    avatarWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        top: -50,
        height: 312,
        width: 256,
        backgroundColor: 'white',
        borderRadius: 16,
        border: '12px solid rgb(255, 255, 255)',
        borderWidth: '12px 12px 20px 12px',
        gap: 24,
        overflow: 'visible',
        ...cssToReactStyleObject(toniqShadows.popupShadow),
        [theme.breakpoints.down('sm')]: {
            top: 'unset',
            gap: 12,
            margin: '0 auto',
        },
        [theme.breakpoints.down('xs')]: {
            height: 210,
            width: 160,
            margin: '0 auto',
        },
    },
    avatar: {
        height: 232,
        width: 232,
        background: '#FFF',
        '& > img': {
            borderRadius: '8px',
        },
        [theme.breakpoints.down('xs')]: {
            height: 144,
            width: 144,
        },
    },
    nftNameWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 32,
        [theme.breakpoints.down('sm')]: {
            marginTop: 0,
            justifyContent: 'center',
        },
    },
    nftName: {
        ...cssToReactStyleObject(toniqFontStyles.h2Font),
        ...cssToReactStyleObject(toniqFontStyles.extraBoldFont),
        [theme.breakpoints.up('xs')]: {
            fontSize: 36,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 32,
        },
    },
    headerWrapper: {
        display: 'flex',
        gap: 32,
        width: '100%',
        maxWidth: 'calc(100vw - 20%)',
        margin: '0 auto',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            gap: 16,
            flexDirection: 'column',
            marginBottom: 16,
        },
    },
    detailsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        [theme.breakpoints.down('sm')]: {
            gap: 16,
        },
    },
    socialsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        flexFlow: 'column',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    socialsMobileContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        flexFlow: 'column',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    blurbWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    blurb: {
        textAlign: 'left',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        '& > a': {
            color: `${toniqColors.pagePrimary.foregroundColor}`,
            '&:hover': {
                color: toniqColors.pageInteractionHover.foregroundColor,
            },
        },
        '& > p': {
            display: 'inline !important',
            margin: 0,
        },
    },
    readMoreEllipsis: {
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        color: toniqColors.pageInteraction.foregroundColor,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
    },
    statsContainer: {
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
        },
        [theme.breakpoints.up('xl')]: {
            justifyContent: 'start',
        },
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
    divider: {
        opacity: 0.1,
        margin: '0 32px',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            height: 1,
            margin: '32px 0',
            display: 'inline-block',
        },
    },
    contentWrapper: {
        display: 'grid',
        gridTemplateColumns: '2fr auto 1fr',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
        [theme.breakpoints.down('sm')]: {
            gap: 20,
        },
    },
    socialLinkIcon: {
        display: 'flex',
    },
    cardActionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        gap: 16,
        [theme.breakpoints.down('sm')]: {
            gap: 8,
        },
    },
    cardActionsExplorers: {
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        [theme.breakpoints.down('sm')]: {
            gap: 20,
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
        stats,
        setStats,
    ] = useState(false);
    var collection = props.collection;

    React.useEffect(() => {
        if (EntrepotAllStats().length) setStats(EntrepotCollectionStats(collection.canister));

        defaultEntrepotApi
            .token(collection.canister)
            .size()
            .then(s => {
                setSize(s);
            });
        _updates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _updates = async (s, canister) => {
        EntrepotUpdateStats().then(() => {
            setStats(EntrepotCollectionStats(collection.canister));
        });
    };

    const readMoreEllipsisBtn = () => {
        return (
            <span>
                ...
                <button
                    className={classes.readMoreEllipsis}
                    onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                >
                    {!isBlurbOpen ? 'Read More' : 'Read Less'}
                </button>
            </span>
        );
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
            />
            <div className={classes.headerWrapper}>
                <Avatar className={classes.avatarWrapper}>
                    <Avatar
                        variant="square"
                        className={classes.avatar}
                        src={
                            typeof collection.avatar != 'undefined' && collection.avatar
                                ? collection.avatar
                                : '/collections/' + collection.canister + '.jpg'
                        }
                    />
                    <div className={classes.cardActionsWrapper}>
                        <div className={classes.cardActionsExplorers}>
                            <Link
                                href={'https://icscan.io/canister/' + collection.canister}
                                target="_blank"
                                rel="noreferrer"
                                underline="none"
                            >
                                <ToniqIcon icon={BrandIcScan24Icon} />
                            </Link>
                            <Link
                                href={
                                    'https://t5t44-naaaa-aaaah-qcutq-cai.raw.ic0.app/collection/' +
                                    collection.canister
                                }
                                target="_blank"
                                rel="noreferrer"
                                underline="none"
                            >
                                <img
                                    alt="create"
                                    style={{width: 24}}
                                    src={'/icon/svg/nftgeek.svg'}
                                />
                            </Link>
                        </div>
                        <hr className={classes.divider} style={{margin: 0}} />
                        <CopyButton text={collection.canister} copyMessage="Copy canister ID" />
                    </div>
                </Avatar>
                <div className={classes.detailsWrapper}>
                    <div container item className={classes.nftNameWrapper}>
                        <span className={classes.nftName}>{collection.name}</span>
                        {collection.kyc && (
                            <ToniqIcon
                                icon={CircleWavyCheck24Icon}
                                style={{color: toniqColors.pageInteraction.foregroundColor}}
                            />
                        )}
                    </div>
                    <div className={classes.contentWrapper}>
                        <div className={classes.contentContainer}>
                            <div className={classes.socialsMobileContainer}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                >
                                    {[
                                        'telegram',
                                        'twitter',
                                        'medium',
                                        'discord',
                                        'dscvr',
                                        'distrikt',
                                    ]
                                        .filter(
                                            social =>
                                                collection.hasOwnProperty(social) &&
                                                collection[social],
                                        )
                                        .map(social => {
                                            return (
                                                <Grid key={social} item>
                                                    <a
                                                        href={collection[social]}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={classes.socialLinkIcon}
                                                    >
                                                        <img
                                                            alt="create"
                                                            style={{width: 24}}
                                                            src={'/icon/svg/' + social + '.svg'}
                                                        />
                                                    </a>
                                                </Grid>
                                            );
                                        })}
                                    {collection.web && (
                                        <Link
                                            href={collection.web}
                                            target="_blank"
                                            rel="noreferrer"
                                            underline="none"
                                        >
                                            <ToniqIcon
                                                icon={Code24Icon}
                                                style={{
                                                    color: toniqColors.pagePrimary.foregroundColor,
                                                }}
                                            />
                                        </Link>
                                    )}
                                </Grid>
                            </div>
                            {collection.blurb && (
                                <div className={classes.blurbWrapper}>
                                    {isBlurbOpen ? (
                                        <span style={{textAlign: 'left'}}>
                                            <span
                                                className={classes.blurb}
                                                dangerouslySetInnerHTML={{
                                                    __html: collection.blurb,
                                                }}
                                            />
                                            <button
                                                className={classes.readMoreEllipsis}
                                                onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                                            >
                                                {!isBlurbOpen ? 'Read More' : 'Read Less'}
                                            </button>
                                        </span>
                                    ) : (
                                        <TruncateMarkup
                                            lines={3}
                                            ellipsis={readMoreEllipsisBtn()}
                                            tokenize="words"
                                        >
                                            <div className={classes.blurb}>
                                                {parse(collection.blurb)}
                                            </div>
                                        </TruncateMarkup>
                                    )}
                                </div>
                            )}
                            {stats && (
                                <Grid container spacing={2} className={classes.statsContainer}>
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
                                            text={icpToString(
                                                isNaN(stats.total) ? '0.00' : stats.total,
                                                false,
                                                true,
                                            )}
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
                                            text={stats.listings}
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
                                            text={icpToString(
                                                isNaN(stats.average) ? '0.00' : stats.average,
                                                false,
                                                true,
                                            )}
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
                                            text={size}
                                        ></ToniqChip>
                                    </Grid>
                                    {collection.commission && (
                                        <Grid
                                            item
                                            className={classes.statsWrapper}
                                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
                                        >
                                            <span
                                                style={{
                                                    textTransform: 'uppercase',
                                                    opacity: '0.64',
                                                }}
                                            >
                                                Royalties
                                            </span>
                                            <ToniqChip
                                                className={`toniq-chip-secondary ${classes.stats}`}
                                                style={cssToReactStyleObject(
                                                    toniqFontStyles.boldFont,
                                                )}
                                                text={`${formatNumber(
                                                    (collection.commission - 0.01) * 100,
                                                    true,
                                                )}%`}
                                            ></ToniqChip>
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                        </div>
                        <hr className={classes.divider} />
                        <div style={{display: 'flex', flexDirection: 'column', gap: 36}}>
                            <div className={classes.socialsContainer}>
                                <Grid container spacing={2} alignItems="center" direction="row">
                                    {[
                                        'telegram',
                                        'twitter',
                                        'medium',
                                        'discord',
                                        'dscvr',
                                        'distrikt',
                                    ]
                                        .filter(
                                            social =>
                                                collection.hasOwnProperty(social) &&
                                                collection[social],
                                        )
                                        .map(social => {
                                            return (
                                                <Grid key={social} item>
                                                    <a
                                                        href={collection[social]}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={classes.socialLinkIcon}
                                                    >
                                                        <img
                                                            alt="create"
                                                            style={{width: 24}}
                                                            src={'/icon/svg/' + social + '.svg'}
                                                        />
                                                    </a>
                                                </Grid>
                                            );
                                        })}
                                    {collection.web && (
                                        <Link
                                            href={collection.web}
                                            target="_blank"
                                            rel="noreferrer"
                                            underline="none"
                                            style={{padding: 8}}
                                        >
                                            <ToniqIcon
                                                icon={Code24Icon}
                                                style={{
                                                    color: toniqColors.pagePrimary.foregroundColor,
                                                }}
                                            />
                                        </Link>
                                    )}
                                </Grid>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'start',
                                }}
                            >
                                <span
                                    style={{
                                        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                                        display: 'flex',
                                        justifySelf: 'start',
                                    }}
                                >
                                    Benefits
                                </span>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 60,
                                        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
                                    }}
                                >
                                    <span className={classes.noDataText}>COMING SOON</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
