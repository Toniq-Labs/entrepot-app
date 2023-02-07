import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    BooleanFilterTypeEnum,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {BaseFullProfileNft} from '../profile-nfts/base-full-profile-nft';
import {BaseNft} from '../../../../../data/nft/base-nft';

export type ProfileCompleteNft = BaseNft & BaseFullProfileNft & {isListed: boolean};

export const defaultProfileNftFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileCompleteNft>>
>()({
    'List Status': {
        filterType: FilterTypeEnum.Radio,
        radios: [
            {
                label: 'All',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Listed',
                value: true,
            },
            {
                label: 'Unlisted',
                value: false,
            },
        ],
        filterField: ['isListed'],
        value: 'All',
    },
    'List Price': {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: [
            'listing',
            'price',
        ],
    },
    NRI: {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: ['nftNri'],
        factor: 100,
    },
} as const);

export const profileNftSortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<ReadonlyDeep<SortDefinition<ProfileCompleteNft>>>
>()([
    {
        sortName: 'Mint #',
        sortField: [
            'nftMintNumber',
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
