import React, {useState} from 'react';
import {Box, Link, makeStyles} from '@material-ui/core';
import {cssToReactStyleObject, toniqColors, toniqFontStyles} from '@toniq-labs/design-system';
import Timestamp from 'react-timestamp';
import {
    ToniqDropdown,
    ToniqMiddleEllipsis,
    ToniqPagination,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import PriceICP from '../../../components/PriceICP';
import {NftCard} from '../../../shared/NftCard';
import moment from 'moment';
import {EntrepotGetIcpUsd} from '../../../utils';
import PriceUSD from '../../../components/PriceUSD';
import orderBy from 'lodash.orderby';
import {getExtCanisterId} from '../../../typescript/data/canisters/canister-details/wrapped-canister-ids';
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

const defaultSortOption = {
    value: {
        type: 'date',
    },
    label: 'Date',
};
const sortOptions = [
    defaultSortOption,
    {
        value: {
            type: 'price',
        },
        label: 'Price',
    },
];
const defaultSortType = 'asc';

export default function DetailSectionActivity(props) {
    const {activity, activityPage, setActivityPage, transactions} = props;
    const classes = useStyles();
    const [
        sort,
        setSort,
    ] = useState(defaultSortOption);

    const sortedActivity = orderBy(activity, [sort.value.type], [defaultSortType]);

    return (
        <Box className={classes.activityWrapper}>
            {sortedActivity && sortedActivity.length > 0 && (
                <div className={classes.detailSectionContainer}>
                    <div className={classes.detailSectionTitleWrapper}>
                        <span className={classes.detailSectionTitle}>Activity</span>
                        <div className={classes.filterWrapper}>
                            <span
                                style={{
                                    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
                                    opacity: 0.64,
                                }}
                            >
                                Result ({sortedActivity.length})
                            </span>
                            <ToniqDropdown
                                style={{
                                    '--toniq-accent-secondary-background-color': 'transparent',
                                    width: 'unset',
                                }}
                                selected={sort}
                                onSelectChange={event => {
                                    setSort(event.detail);
                                }}
                                options={sortOptions}
                            />
                        </div>
                    </div>
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
                        {sortedActivity.slice().map((transaction, index) => {
                            return (
                                <NftCard
                                    listStyle={true}
                                    collectionId={transaction.canister}
                                    nftIndex={index}
                                    nftId={transaction.token}
                                    cachePriority={0}
                                    key={index}
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
                                                    price={transaction.price}
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
                                                        price={EntrepotGetIcpUsd(transaction.price)}
                                                    />
                                                    )
                                                </span>
                                            </div>,
                                            transaction.seller ? (
                                                <Link
                                                    href={`https://icscan.io/account/${transaction.seller}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    underline="none"
                                                >
                                                    <ToniqMiddleEllipsis
                                                        letterCount={4}
                                                        text={transaction.seller}
                                                        className={classes.linkText}
                                                    />
                                                </Link>
                                            ) : (
                                                '-'
                                            ),
                                            transaction.buyer ? (
                                                <Link
                                                    href={`https://icscan.io/account/${transaction.buyer}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    underline="none"
                                                >
                                                    <ToniqMiddleEllipsis
                                                        letterCount={4}
                                                        text={transaction.buyer}
                                                        className={classes.linkText}
                                                    />
                                                </Link>
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
    activityWrapper: {
        display: 'grid',
        gap: '16px',
        padding: '16px 0',
        [theme.breakpoints.down('sm')]: {
            padding: '32px 0',
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
        gap: 24,
        border: '1px solid rgba(0,0,0, 0.08)',
        padding: '24px 24px 0px 24px',
        [theme.breakpoints.down('md')]: {
            padding: '16px 14px',
            gap: 12,
        },
    },
    detailSectionTitle: {
        ...cssToReactStyleObject(toniqFontStyles.h3Font),
    },
    detailSectionTitleWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    filterWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
            alignItems: 'start',
        },
    },
    filterDropdown: {
        '--toniq-accent-secondary-background-color': 'transparent',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        width: 260,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    linkText: {
        cursor: 'pointer',
        color: toniqColors.pageInteraction.foregroundColor,
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
}));
