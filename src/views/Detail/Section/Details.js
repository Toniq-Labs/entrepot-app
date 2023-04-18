import {Grid, Link, makeStyles, Tooltip} from '@material-ui/core';
import {
    Chain24Icon,
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    Paper24Icon,
    toniqColors,
    toniqFontStyles,
    User24Icon,
} from '@toniq-labs/design-system';
import React, {useState} from 'react';
import PriceICP from '../../../components/PriceICP';
import {NftCard} from '../../../shared/NftCard';

import {
    ToniqButton,
    ToniqIcon,
    ToniqMiddleEllipsis,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {DropShadowCard} from '../../../shared/DropShadowCard';
import TruncateMarkup from 'react-truncate-markup';
import parse from 'html-react-parser';
import {getExtCanisterId} from '../../../typescript/data/canisters/canister-details/wrapped-canister-id';
import {getCanisterDetails} from '../../../typescript/data/canisters/canister-details/all-canister-details';
import offerBlacklist from './../../../offer-blacklist.json';

function ListRow({items, classes, style}) {
    return (
        <div
            className="profile-list-view-nft-details-row"
            style={{
                display: 'flex',
                gap: '16px',
                maxHeight: '64px',
                alignItems: 'center',
                flexGrow: 1,
                ...cssToReactStyleObject(toniqFontStyles.labelFont),
                ...style,
            }}
        >
            {items[0] ? (
                <div
                    style={{
                        flexBasis: '48px',
                        flexShrink: 0,
                    }}
                >
                    &nbsp;
                </div>
            ) : (
                ''
            )}
            <div style={{display: 'flex', justifyContent: 'space-between', flexGrow: 1, gap: 16}}>
                <div className={classes.activityInfoContainer} style={{...style}}>
                    <div
                        style={{
                            flexBasis: 0,
                            marginLeft: '8px',
                            flexGrow: 1,
                            minWidth: 110,
                        }}
                    >
                        {items[1]}
                    </div>
                    <div
                        style={{
                            flexBasis: 0,
                            flexGrow: 1,
                            minWidth: 115,
                        }}
                        className={classes.hideWhenMobile}
                    >
                        {items[2]}
                    </div>
                    <div
                        style={{
                            flexGrow: 1,
                            flexBasis: 0,
                            marginLeft: '32px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                            }}
                        >
                            {items[3]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DetailSectionDetails(props) {
    const {
        offerListing,
        getPriceData,
        floor,
        canister,
        tokenid,
        owner,
        attributes,
        cancelOffer,
        acceptOffer,
        setOpenOfferForm,
    } = props;
    const collection = props.collections.find(e => e.canister === canister);
    const classes = useStyles();
    const [
        isBlurbOpen,
        setIsBlurbOpen,
    ] = useState(false);

    const getFloorDelta = amount => {
        if (!floor) return reloadIcon();
        var fe = floor * 100000000;
        var ne = Number(amount);
        if (ne > fe) {
            return (((ne - fe) / ne) * 100).toFixed(2) + '% above';
        } else if (ne < fe) {
            return ((1 - ne / fe) * 100).toFixed(2) + '% below';
        } else return reloadIcon();
    };

    const reloadIcon = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <ToniqIcon
                    style={{
                        color: String(toniqColors.pagePrimary.foregroundColor),
                        alignSelf: 'center',
                    }}
                    icon={LoaderAnimated24Icon}
                />
            </div>
        );
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

    const makeOffer = async () => {
        setOpenOfferForm(true);
    };

    const isBlacklistedFromOffer = () => {
        return offerBlacklist.includes(canister);
    };

    React.useEffect(() => {
        props.loader(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={classes.detailSectionWrapper}>
            <div className={classes.detailSectionContainer}>
                <div className={classes.detailSectionTitleContainer}>
                    <span className={classes.detailSectionTitle}>Details</span>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <ToniqIcon icon={Chain24Icon} />
                        <Link
                            href={getCanisterDetails(collection.canister).getNftLinkUrl({
                                nftId: tokenid,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            underline="none"
                            className={classes.linkTextBold}
                        >
                            View On-Chain
                        </Link>
                    </div>
                    {owner && (
                        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                            <ToniqIcon icon={User24Icon} />
                            {props.account.address === owner ? (
                                <span className={classes.ownerWrapper}>Owned by you</span>
                            ) : (
                                <span className={classes.ownerWrapper}>
                                    {`Owner : `}
                                    &nbsp;
                                    <Link
                                        href={`https://dashboard.internetcomputer.org/account/${owner}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        underline="none"
                                    >
                                        <span className={classes.linkTextBold}>
                                            {owner.substring(0, 6) + '...'}
                                        </span>
                                    </Link>
                                </span>
                            )}
                        </div>
                    )}
                    {collection.nftlicense !== '' ? (
                        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                            <ToniqIcon icon={Paper24Icon} />
                            <Link
                                href={collection.nftlicense}
                                target="_blank"
                                rel="noreferrer"
                                underline="none"
                                className={classes.linkTextBold}
                            >
                                License
                            </Link>
                        </div>
                    ) : (
                        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                            <ToniqIcon icon={Paper24Icon} />
                            <Tooltip title="Coming Soon" arrow placement="top">
                                <span className={classes.linkTextBold}>License</span>
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div id="detailsContent" className={classes.detailSectionContent}>
                    <div className={classes.listRowContainer}>
                        {collection.blurb && (
                            <div className={classes.blurbWrapper} style={{marginRight: 8}}>
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
                        {!attributes ? (
                            <span className={classes.noDataText} style={{flexGrow: 1}}>
                                {reloadIcon()}
                            </span>
                        ) : (
                            <>
                                {typeof attributes === 'object' && attributes.length ? (
                                    <div className={classes.attributeWrapper}>
                                        {attributes.map((attribute, attributeIndex) => (
                                            <DropShadowCard
                                                enableHover
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    padding: '0',
                                                    minHeight: 132,
                                                }}
                                                key={attributeIndex}
                                            >
                                                <span className={classes.attributeHeader}>
                                                    <span
                                                        style={cssToReactStyleObject(
                                                            toniqFontStyles.labelFont,
                                                        )}
                                                    >
                                                        {attribute.category}
                                                    </span>
                                                </span>
                                                <Grid
                                                    container
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        padding: '16px 20px',
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            ...cssToReactStyleObject(
                                                                toniqFontStyles.paragraphFont,
                                                            ),
                                                            ...cssToReactStyleObject(
                                                                toniqFontStyles.boldFont,
                                                            ),
                                                            display: '-webkit-box',
                                                            overflow: 'hidden',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {attribute.value}
                                                    </span>
                                                </Grid>
                                            </DropShadowCard>
                                        ))}
                                    </div>
                                ) : (
                                    <span className={classes.noDataText} style={{flexGrow: 1}}>
                                        NO META DATA AVAILABLE
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!isBlacklistedFromOffer() && (
                <div className={classes.detailSectionContainer}>
                    <span className={classes.detailSectionTitle}>Offers</span>
                    <div className={classes.listRowContainer}>
                        <div className={classes.listRowHeader}>
                            <ListRow
                                items={[
                                    true,
                                    'PRICE',
                                    'FLOOR DIFFERENCE',
                                    'FROM',
                                ]}
                                classes={classes}
                                style={{
                                    ...cssToReactStyleObject(toniqFontStyles.labelFont),
                                    height: '32px',
                                }}
                            />
                        </div>
                        {!offerListing ? (
                            <span className={classes.noDataText} style={{flexGrow: 1}}>
                                {reloadIcon()}
                            </span>
                        ) : (
                            <>
                                {typeof offerListing === 'object' && offerListing.length ? (
                                    <div
                                        id="offersContent"
                                        className={classes.detailSectionContent}
                                        style={{paddingBottom: 24}}
                                    >
                                        {offerListing.slice().map((offer, index) => {
                                            return (
                                                <NftCard
                                                    listStyle={true}
                                                    collectionId={getExtCanisterId(canister)}
                                                    nftIndex={index}
                                                    nftId={tokenid}
                                                    cachePriority={0}
                                                    key={index}
                                                    style={{margin: '0 8px', padding: 12}}
                                                    max={{height: 64, width: 64}}
                                                    min={{height: 64, width: 64}}
                                                >
                                                    <ListRow
                                                        items={[
                                                            '',
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignContent: 'center',
                                                                    justifyContent: 'left',
                                                                    alignItems: 'center',
                                                                    ...cssToReactStyleObject(
                                                                        toniqFontStyles.paragraphFont,
                                                                    ),
                                                                }}
                                                            >
                                                                <PriceICP
                                                                    large={false}
                                                                    volume={true}
                                                                    clean={false}
                                                                    price={offer.amount}
                                                                />
                                                            </div>,
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                {floor ? (
                                                                    getFloorDelta(offer.amount)
                                                                ) : (
                                                                    <ToniqIcon
                                                                        style={{
                                                                            color: String(
                                                                                toniqColors
                                                                                    .pagePrimary
                                                                                    .foregroundColor,
                                                                            ),
                                                                            alignSelf: 'center',
                                                                        }}
                                                                        icon={LoaderAnimated24Icon}
                                                                    />
                                                                )}
                                                            </div>,
                                                            <div>
                                                                {owner &&
                                                                props.account &&
                                                                props.account.address == owner ? (
                                                                    <ToniqButton
                                                                        text="Accept"
                                                                        onClick={acceptOffer}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        {props.identity &&
                                                                        props.identity
                                                                            .getPrincipal()
                                                                            .toText() ===
                                                                            offer.buyer.toText() ? (
                                                                            <ToniqButton
                                                                                text="Cancel"
                                                                                onClick={
                                                                                    cancelOffer
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Link
                                                                                href={`https://icscan.io/account/${offer.buyer}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                underline="none"
                                                                            >
                                                                                <ToniqMiddleEllipsis
                                                                                    letterCount={4}
                                                                                    text={offer.buyer.toText()}
                                                                                    className={
                                                                                        classes.linkText
                                                                                    }
                                                                                />
                                                                            </Link>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>,
                                                        ]}
                                                        classes={classes}
                                                    />
                                                </NftCard>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <span className={classes.noDataText}>
                                            THERE ARE NO OPEN OFFERS
                                        </span>
                                        {props.identity &&
                                        props.account.address !== owner &&
                                        getPriceData() ? (
                                            <ToniqButton
                                                className={'toniq-button-outline'}
                                                text="Make an Offer"
                                                onClick={() => {
                                                    makeOffer();
                                                }}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    detailSectionWrapper: {
        padding: '16px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '32px 0',
        },
    },
    detailSectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        borderRadius: 16,
        border: '1px solid rgba(0,0,0, 0.08)',
        padding: '24px',
        width: '50%',
        minHeight: 500,
        maxHeight: 512,
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
            minHeight: 'unset',
            width: '100%',
            padding: '16px 14px',
            gap: 12,
        },
    },
    hideScrollbar: {
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    detailSectionContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxHeight: 448,
        height: '100%',
        overflowY: 'auto',
        paddingRight: 18,
        paddingBottom: 6,
        scrollbarColor: '#00D093 #F0F0F0',
        scrollbarWidth: 6,
        '&::-webkit-scrollbar': {
            width: 8,
        },
        '&::-webkit-scrollbar-track': {
            width: 8,
            borderRadius: 20,
            backgroundColor: '#F0F0F0',
        },
        '&::-webkit-scrollbar-thumb': {
            width: 6,
            height: 120,
            borderRadius: 20,
            backgroundColor: '#00D093',
        },
        [theme.breakpoints.down('md')]: {
            paddingBottom: 16,
        },
    },
    detailSectionTitle: {
        ...cssToReactStyleObject(toniqFontStyles.h3Font),
    },
    detailSectionTitleContainer: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            gap: 14,
            flexDirection: 'column',
            alignItems: 'start',
        },
    },
    activityInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        maxHeight: '64px',
        alignItems: 'center',
        flexGrow: 1,
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'start',
            ...cssToReactStyleObject(toniqFontStyles.labelFont),
        },
    },
    listRowHeader: {
        display: 'flex',
        backgroundColor: toniqColors.accentSecondary.backgroundColor,
        borderRadius: '8px',
        padding: '0 16px',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    listRowContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        backgroundColor: 'white',
        flex: 1,
        [theme.breakpoints.down('sm')]: {
            gap: 24,
        },
    },
    hideWhenMobile: {
        [theme.breakpoints.down('sm')]: {
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
    ownerWrapper: {
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        wordBreak: 'break-all',
    },
    linkText: {
        cursor: 'pointer',
        color: toniqColors.pageInteraction.foregroundColor,
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
    linkTextBold: {
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        cursor: 'pointer',
        color: toniqColors.pageInteraction.foregroundColor,
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
    attributeWrapper: {
        display: 'grid',
        gap: 16,
        margin: '0 8px',
        gridTemplateColumns: '1fr 1fr 1fr',
        marginBottom: '16px',
        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr 1fr',
            marginTop: '8px',
        },
    },
    attributeHeader: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#F1F3F6',
        width: '100%',
        padding: '4px 0',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
    },
    readMoreBtn: {
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: toniqColors.pageInteraction.foregroundColor,
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
    noDataText: {
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
}));
