import {Grid, Link, makeStyles} from '@material-ui/core';
import {
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import React, {createRef, useState} from 'react';
import PriceICP from '../../../components/PriceICP';
import PriceUSD from '../../../components/PriceUSD';
import {NftCard} from '../../../shared/NftCard';
import {getEXTCanister} from '../../../utilities/load-tokens';
import {EntrepotGetICPUSD, EntrepotNFTImage, EntrepotNFTLink} from '../../../utils';
import Timestamp from 'react-timestamp';
import {
    ToniqButton,
    ToniqIcon,
    ToniqMiddleEllipsis,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {isEllipsisActive} from '../../../utilities/element-utils';
import {DropShadowCard} from '../../../shared/DropShadowCard';

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
                            marginLeft: '8px',
                            minWidth: 70,
                        }}
                    >
                        {items[3]}
                    </div>
                    <div
                        style={{
                            flexGrow: 1,
                            flexBasis: 0,
                        }}
                        className={classes.hideWhenMobile}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                            }}
                        >
                            {items[4]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DetailSectionDetails(props) {
    const {offerListing, floor, index, canister, tokenid, owner, attributes, cancelOffer} = props;
    const collection = props.collections.find(e => e.canister === canister);
    const classes = useStyles();
    const blurbRef = createRef();
    const [
        isBlurbOpen,
        setIsBlurbOpen,
    ] = useState(false);
    const [
        showReadMore,
        setShowReadMore,
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

    const shorten = a => {
        return a.substring(0, 12) + '...';
    };

    const isScrollableY = id => {
        const scrollableEl = document.querySelector(`#${id}`);
        if (scrollableEl) {
            return scrollableEl.scrollHeight > scrollableEl.clientHeight;
        } else return false;
    };

    React.useEffect(() => {
        props.loader(true);
        setShowReadMore(isEllipsisActive(blurbRef.current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={classes.detailSectionWrapper}>
            <div className={classes.detailSectionContainer}>
                <div className={classes.detailSectionTitleContainer}>
                    <span className={classes.detailSectionTitle}>Details</span>
                    <Link
                        href={EntrepotNFTLink(collection.canister, index, tokenid)}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        className={classes.linkTextBold}
                    >
                        View On-Chain
                    </Link>
                    {owner && (
                        <>
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
                                            {shorten(owner)}
                                        </span>
                                    </Link>
                                </span>
                            )}
                        </>
                    )}
                    <Link
                        href={EntrepotNFTLink(collection.canister, index, tokenid)}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        className={classes.linkTextBold}
                    >
                        License
                    </Link>
                </div>
                <div
                    id="detailsContent"
                    className={`${classes.detailSectionContent} ${
                        isScrollableY('detailsContent') ? '' : classes.hideScrollbar
                    }`}
                >
                    {collection.blurb && (
                        <div className={classes.blurbWrapper}>
                            <div
                                ref={blurbRef}
                                className={`${classes.blurb} ${
                                    !isBlurbOpen ? classes.blurbCollapsed : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: collection.blurb,
                                }}
                            />
                            {showReadMore && (
                                <button
                                    className={classes.readMoreBtn}
                                    onClick={() => setIsBlurbOpen(!isBlurbOpen)}
                                >
                                    {!isBlurbOpen ? 'Read More' : 'Read Less'}
                                </button>
                            )}
                        </div>
                    )}
                    {attributes && attributes.length ? (
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
                                            style={cssToReactStyleObject(toniqFontStyles.labelFont)}
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
                                            padding: '8px 8px 16px 8px',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <span
                                            style={{
                                                ...cssToReactStyleObject(
                                                    toniqFontStyles.paragraphFont,
                                                ),
                                                ...cssToReactStyleObject(toniqFontStyles.boldFont),
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
                </div>
            </div>
            <div className={classes.detailSectionContainer}>
                <span className={classes.detailSectionTitle}>Offers</span>
                <div container className={classes.listRowContainer}>
                    <div className={classes.listRowHeader}>
                        <ListRow
                            items={[
                                true,
                                'PRICE',
                                'FLOOR DIFFERENCE',
                                'EXPIRATION',
                                'FROM',
                            ]}
                            classes={classes}
                            style={{
                                ...cssToReactStyleObject(toniqFontStyles.labelFont),
                                height: '32px',
                            }}
                        />
                    </div>
                    {offerListing && offerListing.length ? (
                        <div
                            id="offersContent"
                            className={`${classes.detailSectionContent} ${
                                isScrollableY('offersContent') ? '' : classes.hideScrollbar
                            }`}
                            style={{paddingBottom: 32}}
                        >
                            {offerListing.slice().map((offer, index) => {
                                return (
                                    <NftCard
                                        listStyle={true}
                                        imageUrl={EntrepotNFTImage(
                                            getEXTCanister(canister),
                                            index,
                                            tokenid,
                                            false,
                                            0,
                                        )}
                                        key={index}
                                        style={{marginRight: 8}}
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
                                                    &nbsp;
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        (
                                                        <PriceUSD
                                                            price={EntrepotGetICPUSD(offer.amount)}
                                                        />
                                                        )
                                                    </span>
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
                                                                    toniqColors.pagePrimary
                                                                        .foregroundColor,
                                                                ),
                                                                alignSelf: 'center',
                                                            }}
                                                            icon={LoaderAnimated24Icon}
                                                        />
                                                    )}
                                                </div>,
                                                <Timestamp
                                                    relative
                                                    autoUpdate
                                                    relativeTo={Number(offer.time / 1000000000n)}
                                                    style={{
                                                        ...cssToReactStyleObject(
                                                            toniqFontStyles.boldParagraphFont,
                                                        ),
                                                    }}
                                                />,
                                                <div>
                                                    {props.identity &&
                                                    props.identity.getPrincipal().toText() ===
                                                        offer.buyer.toText() ? (
                                                        <ToniqButton
                                                            text="Cancel"
                                                            onClick={cancelOffer}
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
                                                                className={classes.linkText}
                                                            />
                                                        </Link>
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
                            <span className={classes.noDataText}>THERE ARE NO OPEN OFFERS</span>
                            <ToniqButton className={'toniq-button-outline'} text="Make an Offer" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    detailSectionWrapper: {
        padding: '56px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '32px 0',
        },
    },
    detailSectionContainer: {
        borderRadius: 16,
        border: '1px solid rgba(0,0,0, 0.08)',
        padding: 24,
        width: '50%',
        height: 560,
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
            height: 'unset',
            width: '100%',
            padding: '16px 14px',
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
        gap: '16px',
        maxHeight: 448,
        height: '100%',
        overflowY: 'scroll',
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
        [theme.breakpoints.down('sm')]: {
            // overflowY: 'hidden',
            // '&::-webkit-scrollbar': {
            //     display: 'none',
            // },
        },
    },
    detailSectionTitle: {
        ...cssToReactStyleObject(toniqFontStyles.h3Font),
    },
    detailSectionTitleContainer: {
        display: 'flex',
        gap: 24,
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
        gap: '16px',
        backgroundColor: 'white',
        marginTop: '32px',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            marginTop: '16px',
            paddingBottom: '16px',
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
        marginTop: 32,
        [theme.breakpoints.down('sm')]: {
            marginTop: 16,
        },
    },
    blurb: {
        textAlign: 'left',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '& > a': {
            color: `${toniqColors.pagePrimary.foregroundColor}`,
            '&:hover': {
                color: toniqColors.pageInteractionHover.foregroundColor,
            },
        },
        '& > p': {
            margin: 0,
        },
    },
    blurbCollapsed: {
        '-webkit-line-clamp': 3,
        overflow: 'hidden',
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
        margin: 8,
        gridTemplateColumns: '1fr 1fr 1fr',
        [theme.breakpoints.up('md')]: {
            marginTop: '16px',
            marginBottom: '16px',
        },
        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr 1fr',
            marginTop: '8px',
            marginBottom: '8px',
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
