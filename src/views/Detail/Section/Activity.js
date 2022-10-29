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
import {icpToString} from '../../../components/PriceICP';
import {Accordion} from '../../../components/Accordion';

const DetailSectionActivity = props => {
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
        setActivity,
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
            <Accordion title="Offers" open={true} center={true}>
                {offerListing ? (
                    <>
                        {offerListing.length > 0 ? (
                            <Grid container className={classes.accordionWrapper}>
                                <Grid container className={classes.tableHeader}>
                                    <Grid
                                        item
                                        xs={8}
                                        sm={6}
                                        md={4}
                                        className={classes.tableHeaderName}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Time
                                    </Grid>
                                    <Grid
                                        item
                                        xs={1}
                                        sm={2}
                                        md={2}
                                        className={classes.tableHeaderName}
                                    >
                                        Floor Delta
                                    </Grid>
                                    <Grid
                                        item
                                        xs={1}
                                        sm={2}
                                        md={3}
                                        className={classes.tableHeaderName}
                                    >
                                        Buyer
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        md={3}
                                        className={classes.tableHeaderName}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'right',
                                        }}
                                    >
                                        Price
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className={classes.ntfCardContainer}>
                                    {offerListing.slice().map((offer, index) => (
                                        <Grid item key={index} xs={12}>
                                            <DropShadowCard enableHover>
                                                <Grid
                                                    container
                                                    className={classes.tableCard}
                                                    alignItems="center"
                                                    spacing={4}
                                                >
                                                    <Grid item xs={10} md={4}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={4}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={4}
                                                                sm={2}
                                                                md={4}
                                                                className={
                                                                    classes.imageWrapperActivity
                                                                }
                                                            >
                                                                {displayImage(tokenid)}
                                                            </Grid>
                                                            <Grid item xs={8} sm={10} md={8}>
                                                                <div>
                                                                    <span>
                                                                        <Timestamp
                                                                            relative
                                                                            autoUpdate
                                                                            date={Number(
                                                                                offer.time /
                                                                                    1000000000n,
                                                                            )}
                                                                        />
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            classes.buyerMobile
                                                                        }
                                                                    >
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
                                                                            <ToniqMiddleEllipsis
                                                                                externalLink={`https://icscan.io/account/${offer.buyer}`}
                                                                                letterCount={5}
                                                                                text={offer.buyer.toText()}
                                                                            />
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={2}
                                                        className={classes.buyerDesktop}
                                                        style={{
                                                            marginLeft: '-16px',
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
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={3}
                                                        className={classes.buyerDesktop}
                                                    >
                                                        {props.identity &&
                                                        props.identity.getPrincipal().toText() ===
                                                            offer.buyer.toText() ? (
                                                            <ToniqButton
                                                                text="Cancel"
                                                                onClick={cancelOffer}
                                                            />
                                                        ) : (
                                                            <ToniqMiddleEllipsis
                                                                externalLink={`https://icscan.io/account/${offer.buyer}`}
                                                                letterCount={5}
                                                                text={offer.buyer.toText()}
                                                            />
                                                        )}
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        md={3}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'right',
                                                            fontWeight: '700',
                                                            color: toniqColors.pageInteraction
                                                                .foregroundColor,
                                                        }}
                                                    >
                                                        +{icpToString(offer.amount, true, true)}
                                                    </Grid>
                                                </Grid>
                                            </DropShadowCard>
                                        </Grid>
                                    ))}
                                </Grid>
                                <div className={classes.pagination}>
                                    <ToniqPagination
                                        currentPage={offerPage + 1}
                                        pageCount={offers.length}
                                        pagesShown={6}
                                        onPageChange={event => {
                                            setOfferPage(event.detail - 1);
                                            setOfferListing(false);
                                        }}
                                    />
                                </div>
                            </Grid>
                        ) : (
                            <Grid className={classes.accordionWrapper}>
                                <span className={classes.offerDesc}>
                                    There are currently no offers!
                                </span>
                            </Grid>
                        )}
                    </>
                ) : (
                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                )}
            </Accordion>
            <Accordion title="Attributes" open={true} center={true}>
                {attributes ? (
                    <>
                        {attributes.length > 0 ? (
                            <Grid container className={classes.accordionWrapper}>
                                <Grid container className={classes.attributeWrapper} spacing={2}>
                                    {attributes.map((attribute, attributeIndex) => (
                                        <Grid item key={attributeIndex} xs={12} md={3}>
                                            <DropShadowCard
                                                enableHover
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    padding: '0',
                                                    minHeight: 132,
                                                }}
                                            >
                                                <span className={classes.attributeHeader}>
                                                    <span
                                                        style={cssToReactStyleObject(
                                                            toniqFontStyles.paragraphFont,
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
                                                        padding: '8px 8px 16px 8px',
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            ...cssToReactStyleObject(
                                                                toniqFontStyles.h3Font,
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
                                                    {/* <Grid item>
					  <ToniqChip className="toniq-chip-secondary" text={''}></ToniqChip>
					</Grid> */}
                                                </Grid>
                                            </DropShadowCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid className={classes.accordionWrapper}>
                                <span className={classes.offerDesc}>No Attributes</span>
                            </Grid>
                        )}
                    </>
                ) : (
                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                )}
            </Accordion>
            <Accordion title="Activity" open={true} center={true}>
                {activity ? (
                    <>
                        {activity.length > 0 ? (
                            <Grid container className={classes.accordionWrapper}>
                                <Grid container className={classes.tableHeader}>
                                    <Grid
                                        item
                                        xs={8}
                                        sm={6}
                                        md={4}
                                        className={classes.tableHeaderName}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Date
                                    </Grid>
                                    <Grid
                                        item
                                        xs={1}
                                        sm={2}
                                        md={2}
                                        className={classes.tableHeaderName}
                                    >
                                        Activity
                                    </Grid>
                                    <Grid
                                        item
                                        xs={1}
                                        sm={2}
                                        md={3}
                                        className={classes.tableHeaderName}
                                    >
                                        Details
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        md={3}
                                        className={classes.tableHeaderName}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'right',
                                        }}
                                    >
                                        Cost
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className={classes.ntfCardContainer}>
                                    {activity.slice().map((transaction, index) => (
                                        <Grid item key={index} xs={12}>
                                            <DropShadowCard enableHover>
                                                <Grid
                                                    container
                                                    className={classes.tableCard}
                                                    alignItems="center"
                                                    spacing={4}
                                                >
                                                    <Grid item xs={10} md={4}>
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                            spacing={4}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={4}
                                                                sm={2}
                                                                md={4}
                                                                className={
                                                                    classes.imageWrapperActivity
                                                                }
                                                            >
                                                                {displayImage(tokenid)}
                                                            </Grid>
                                                            <Grid item xs={8} sm={10} md={8}>
                                                                <div>
                                                                    <span>
                                                                        <Timestamp
                                                                            relative
                                                                            autoUpdate
                                                                            date={Number(
                                                                                BigInt(
                                                                                    transaction.time,
                                                                                ) / 1000000000n,
                                                                            )}
                                                                        />
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            classes.buyerMobile
                                                                        }
                                                                    >
                                                                        TO: &nbsp;
                                                                        <ToniqMiddleEllipsis
                                                                            externalLink={`https://icscan.io/account/${transaction.buyer}`}
                                                                            letterCount={5}
                                                                            text={transaction.buyer}
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={2}
                                                        className={classes.buyerDesktop}
                                                        style={{
                                                            marginLeft: '-16px',
                                                        }}
                                                    >
                                                        Sale
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}
                                                        sm={2}
                                                        md={3}
                                                        className={classes.buyerDesktop}
                                                    >
                                                        TO: &nbsp;
                                                        <ToniqMiddleEllipsis
                                                            externalLink={`https://icscan.io/account/${transaction.buyer}`}
                                                            letterCount={5}
                                                            text={transaction.buyer}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        md={3}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'right',
                                                            fontWeight: '700',
                                                            color: toniqColors.pageInteraction
                                                                .foregroundColor,
                                                        }}
                                                    >
                                                        +
                                                        {icpToString(transaction.price, true, true)}
                                                    </Grid>
                                                </Grid>
                                            </DropShadowCard>
                                        </Grid>
                                    ))}
                                </Grid>
                                <div className={classes.pagination}>
                                    <ToniqPagination
                                        currentPage={activityPage + 1}
                                        pageCount={transactions.length}
                                        pagesShown={6}
                                        onPageChange={event => {
                                            setActivityPage(event.detail - 1);
                                            setActivity(false);
                                        }}
                                    />
                                </div>
                            </Grid>
                        ) : (
                            <Grid className={classes.accordionWrapper}>
                                <span className={classes.offerDesc}>No Activity</span>
                            </Grid>
                        )}
                    </>
                ) : (
                    <Grid className={classes.accordionWrapper}>{reloadIcon()}</Grid>
                )}
            </Accordion>
        </Box>
    );
};
export default DetailSectionActivity;

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
}));
