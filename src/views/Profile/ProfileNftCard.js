import {css} from 'element-vir';
import {cssToReactStyleObject, toniqFontStyles, toniqColors} from '@toniq-labs/design-system';
import {ToniqButton} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {ProfileTabs, nftStatusesByTab, ProfileViewType} from './ProfileTabs';
import PriceICP from '../../components/PriceICP';
import {getRelativeDate} from '../../typescript/augments/relative-date';

export function ListRow({items, style}) {
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
            <div
                style={{
                    flexBasis: 0,
                    marginLeft: '32px',
                    flexGrow: 1,
                    maxWidth: '120px',
                }}
            >
                {items[1]}
            </div>
            <div
                style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    maxWidth: '64px',
                }}
            >
                {items[2]}
            </div>
            <div
                style={{
                    flexGrow: 1,
                    flexBasis: 0,
                }}
            >
                {items[3]}
            </div>
            {items[4]}
        </div>
    );
}

export function nftCardContents(userNft, props) {
    const listing =
        props.currentTab === ProfileTabs.Activity ? (
            <PriceICP price={userNft.price} />
        ) : userNft.listing ? (
            <PriceICP price={userNft.listing.price} />
        ) : (
            'Unlisted'
        );

    const formattedDateString = userNft.date
        ? userNft.date.toISOString().replace('T', ' ').replace(/\.\d+/, '')
        : '';
    const relativeDate = userNft.date ? getRelativeDate(userNft.date) : '';
    const includesYourOffer = userNft.offers.find(offer => offer[3] === props.address);

    const isListView = props.viewType === ProfileViewType.List;

    const extraDetails =
        props.currentTab === ProfileTabs.MyNfts ? (
            <>
                <ToniqButton
                    style={{marginRight: '16px'}}
                    className="toniq-button-secondary"
                    text="Sell"
                    onClick={event => {
                        props.onSellClick({
                            id: userNft.token,
                            listing: userNft.listing,
                        });
                        event.stopPropagation();
                    }}
                />
                <ToniqButton
                    text="Transfer"
                    onClick={event => {
                        props.onTransferClick({
                            id: userNft.token,
                            listing: userNft.listing,
                        });
                        event.stopPropagation();
                    }}
                />
            </>
        ) : props.currentTab === ProfileTabs.Activity ? (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <span
                    style={{
                        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                    }}
                    title={formattedDateString}
                >
                    {relativeDate}
                </span>
                <span
                    style={{
                        ...cssToReactStyleObject(toniqFontStyles.labelFont),
                        color: String(toniqColors.pageSecondary.foregroundColor),
                    }}
                >
                    {userNft.statuses.has(nftStatusesByTab[ProfileTabs.Activity].Bought)
                        ? 'Bought'
                        : 'Sold'}
                </span>
            </div>
        ) : (
            <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span
                        style={{
                            ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                            alignSelf: 'flex-end',
                        }}
                    >{`${userNft.offers.length} Offer${
                        userNft.offers.length === 1 ? '' : 's'
                    }`}</span>
                    <span
                        style={{
                            ...cssToReactStyleObject(toniqFontStyles.labelFont),
                            color: String(toniqColors.pageSecondary.foregroundColor),
                        }}
                    >
                        {includesYourOffer ? 'including yours' : ''}
                    </span>
                </div>
            </>
        );

    return isListView ? (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: String(css`
                        .profile-list-view-nft-details-row > span {
                        }
                    `),
                }}
            ></style>
            <ListRow
                items={[
                    '',
                    `#${userNft.mintNumber}`,
                    userNft.nri ? (userNft.nri * 100).toFixed(1) + '%' : '-',
                    listing,
                    extraDetails,
                ]}
            />
        </>
    ) : (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <span
                style={{
                    marginBottom: '16px',
                    marginTop: '16px',
                    ...cssToReactStyleObject(toniqFontStyles.h3Font),
                }}
            >
                #{userNft.mintNumber}
            </span>
            <div style={{display: 'flex'}}>
                <div
                    style={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}
                >
                    <span style={cssToReactStyleObject(toniqFontStyles.boldParagraphFont)}>
                        {listing}
                    </span>
                    <span style={cssToReactStyleObject(toniqFontStyles.labelFont)}>
                        {userNft.nri ? `NRI: ${(userNft.nri * 100).toFixed(1)}%` : ''}
                    </span>
                </div>
                {extraDetails}
            </div>
        </div>
    );
}
