import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    BooleanFilterTypeEnum,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {
    TransactionDirection,
    UserTransactionWithDirection,
} from '../../../../../data/nft/user-nft-transaction';
import {BaseFullProfileNft} from '../profile-nfts/base-full-profile-nft';

export type ProfileCompleteTransactionNft = UserTransactionWithDirection & BaseFullProfileNft;

export const defaultProfileUserTransactionFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileCompleteTransactionNft>>
>()({
    Listed: {
        filterType: FilterTypeEnum.Radio,
        radios: [
            {
                label: 'All',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Purchases',
                value: TransactionDirection.Purchase,
            },
            {
                label: 'Sales',
                value: TransactionDirection.Sale,
            },
        ],
        filterField: ['directionForCurrentUser'],
        value: 'All',
    },
} as const);

export const profileUserTransactionSortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<ReadonlyDeep<SortDefinition<ProfileCompleteTransactionNft>>>
>()([
    {
        sortName: 'Time',
        sortField: [
            'timestampMillisecond',
        ],
    },
    {
        sortName: 'Price',
        sortField: [
            'listing',
            'price',
        ],
    },
    {
        sortName: 'Rarity',
        sortField: [
            'nftNri',
        ],
    },
] as const);
