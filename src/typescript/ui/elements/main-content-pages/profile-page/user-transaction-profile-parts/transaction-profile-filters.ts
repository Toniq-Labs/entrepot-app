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
import {FullProfileNft} from '../profile-nfts/full-profile-nft';

export type ProfileCompleteTransactionNft = UserTransactionWithDirection & FullProfileNft;

export const defaultProfileUserTransactionFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileCompleteTransactionNft>>
>()({
    Type: {
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
            'transactionTimeMillisecond',
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
