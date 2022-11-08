/* global BigInt */
import React from 'react';
import {Box, Grid, makeStyles} from '@material-ui/core';
import {
    cssToReactStyleObject,
    LoaderAnimated24Icon,
    ToniqButton,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import Timestamp from 'react-timestamp';
import {DropShadowCard} from '../../../shared/DropShadowCard';
import {
    ToniqIcon,
    ToniqMiddleEllipsis,
    ToniqPagination,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import PriceICP, {icpToString} from '../../../components/PriceICP';
import {Accordion} from '../../../components/Accordion';
import {NftCard} from '../../../shared/NftCard';
import moment from 'moment';
import {EntrepotGetICPUSD, EntrepotNFTImage} from '../../../utils';
import PriceUSD from '../../../components/PriceUSD';
import {getEXTCanister} from '../../../utilities/load-tokens';

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
                ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
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
                            marginLeft: '32px',
                            flexGrow: 1,
                            minWidth: 100,
                        }}
                    >
                        {items[1]}
                    </div>
                    <div
                        style={{
                            flexBasis: 0,
                            flexGrow: 1,
                            minWidth: 150,
                        }}
                        className={classes.hideWhenMobile}
                    >
                        {items[2]}
                    </div>
                    <div
                        style={{
                            flexGrow: 1,
                            flexBasis: 0,
                            minWidth: 150,
                        }}
                        className={classes.hideWhenMobile}
                    >
                        {items[3]}
                    </div>
                    <div
                        style={{
                            flexGrow: 1,
                            flexBasis: 0,
                            minWidth: 250,
                        }}
                        className={classes.hideWhenMobile}
                    >
                        {items[4]}
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
                            {items[5]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DetailSectionActivity(props) {
    const {
        tokenid,
        offerListing,
        displayImage,
        cancelOffer,
        floor,
        setOfferPage,
        offerPage,
        offers,
        setOfferListing,
        attributes,
        activity,
        activityPage,
        setActivityPage,
        transactions,
    } = props;
    const classes = useStyles();

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

    return (
        <Box style={{display: 'grid', gap: '16px', padding: '16px 0'}}>
            {activity && (
                <div className={classes.detailSectionContainer} style={{minHeight: 350}}>
                    <span>Activity</span>
                    <div container className={classes.listRowContainer}>
                        <div className={classes.listRowHeader}>
                            <ListRow
                                items={[
                                    true,
                                    'PRICE',
                                    'FROM',
                                    'TO',
                                    'DATE',
                                    'TIME',
                                ]}
                                classes={classes}
                                style={{
                                    ...cssToReactStyleObject(toniqFontStyles.labelFont),
                                    height: '32px',
                                }}
                            />
                        </div>
                        {activity.slice().map((transaction, index) => {
                            return (
                                <NftCard
                                    listStyle={true}
                                    imageUrl={EntrepotNFTImage(
                                        getEXTCanister(transaction.canister),
                                        index,
                                        transaction.token,
                                        false,
                                        0,
                                    )}
                                    key={index}
                                >
                                    <>
                                        <ListRow
                                            items={[
                                                '',
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignContent: 'center',
                                                        justifyContent: 'left',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <PriceICP
                                                        large={false}
                                                        volume={true}
                                                        clean={false}
                                                        price={transaction.price}
                                                    />
                                                    &nbsp; (
                                                    <PriceUSD
                                                        price={EntrepotGetICPUSD(transaction.price)}
                                                    />
                                                    )
                                                </div>,
                                                transaction.seller ? (
                                                    <ToniqMiddleEllipsis
                                                        externalLink={`https://icscan.io/account/${transaction.seller}`}
                                                        letterCount={5}
                                                        text={transaction.seller}
                                                        className={classes.hoverText}
                                                    />
                                                ) : (
                                                    '-'
                                                ),
                                                transaction.buyer ? (
                                                    <ToniqMiddleEllipsis
                                                        externalLink={`https://icscan.io/account/${transaction.buyer}`}
                                                        letterCount={5}
                                                        text={transaction.buyer}
                                                        className={classes.hoverText}
                                                    />
                                                ) : (
                                                    '-'
                                                ),
                                                moment
                                                    .unix(Number(transaction.time / 1000000000))
                                                    .format('MMMM D, YYYY (h:mm a)'),
                                                <Timestamp
                                                    relative
                                                    autoUpdate
                                                    date={Number(transaction.time / 1000000000)}
                                                    style={{
                                                        ...cssToReactStyleObject(
                                                            toniqFontStyles.boldParagraphFont,
                                                        ),
                                                    }}
                                                />,
                                            ]}
                                            classes={classes}
                                        />
                                    </>
                                </NftCard>
                            );
                        })}

                        <div className={classes.pagination}>
                            <ToniqPagination
                                currentPage={activityPage + 1}
                                pageCount={transactions.length}
                                pagesShown={6}
                                onPageChange={event => {
                                    setActivityPage(event.detail - 1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
}

const useStyles = makeStyles(theme => ({
    btn: {
        backgroundColor: '#ffffff',
        marginLeft: '10px',
        color: '#2B74DC',
        fontWeight: 'bold',
        boxShadow: 'none',
        border: '1px solid #2B74DC',
        textTransform: 'capitalize',
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0px',
            marginTop: '10px',
        },
    },
    button: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    typo: {
        fontWeight: 'bold',
        padding: '20px 0px',
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
        },
    },
    personal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    container: {
        maxWidth: 1312,
        [theme.breakpoints.up('md')]: {
            marginTop: '32px',
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '16px',
        },
    },
    nftImage: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: '0',
        maxWidth: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    nftVideo: {
        borderRadius: '16px',
    },
    nftIframeContainer: {
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        paddingTop: '100%',
        borderRadius: '16px',
    },
    nftIframe: {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    iconsBorder: {
        border: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
    div: {
        display: 'flex',
        padding: '10px',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E9ECEE',
        borderRadius: '5px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: 'bold',
        marginLeft: 20,
    },
    nftDescWrapper: {
        maxWidth: 1312,
        [theme.breakpoints.up('sm')]: {
            padding: '0px 16px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0',
        },
    },
    imageWrapperActivity: {
        maxWidth: '96px',
        [theme.breakpoints.up('md')]: {
            display: 'grid',
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
        },
        '& div, & iframe': {
            borderRadius: '8px',
            backgroundColor: '#f1f1f1',
        },
    },
    offerDesc: {
        display: 'flex',
        justifyContent: 'center',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    },
    attributeWrapper: {
        [theme.breakpoints.up('md')]: {
            marginTop: '16px',
            marginBottom: '16px',
        },
        [theme.breakpoints.down('md')]: {
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
    accordionWrapper: {
        [theme.breakpoints.up('md')]: {
            margin: '32px 0',
        },
        [theme.breakpoints.down('md')]: {
            margin: '16px 0',
        },
    },
    ntfCardContainer: {
        [theme.breakpoints.up('sm')]: {
            margin: '32px 0px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '16px 0px',
        },
    },
    tableHeader: {
        backgroundColor: '#F1F3F6',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            marginTop: '32px',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
            marginTop: '0px',
        },
        padding: '8px 16px',
        borderRadius: '8px',
    },
    tableHeaderName: {
        textTransform: 'uppercase',
        ...cssToReactStyleObject(toniqFontStyles.labelFont),
    },
    tableCard: {
        maxHeight: '96px',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    },
    buyerMobile: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
        },
    },
    buyerDesktop: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
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
    hideWhenMobile: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    hideWhenTablet: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    showWhenMobile: {
        display: 'none',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            alignItems: 'center',
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
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
        maxWidth: '100%',
        backgroundColor: 'white',
        paddingBottom: '32px',
        marginTop: '32px',
        [theme.breakpoints.down('sm')]: {
            marginTop: '16px',
            paddingBottom: '16px',
        },
    },
    detailSectionContainer: {
        borderRadius: 16,
        border: '1px solid rgba(0,0,0, 0.08)',
        padding: 24,
        [theme.breakpoints.down('md')]: {
            padding: '16px 14px',
        },
    },
    hoverText: {
        '&:hover': {
            color: toniqColors.pageInteraction.foregroundColor,
        },
    },
}));
