import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    BooleanFilterTypeEnum,
} from '../../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {FullProfileNft} from '../../profile-page-nfts/full-profile-nft';
import {BaseNft} from '../../../../../../data/nft/base-nft';
import {icpFactor} from '../../../../../../data/icp';
import {ProfileNftOfferStatus} from './nft-profile-offer-status';

export type ProfileCompleteNft = BaseNft &
    FullProfileNft & {
        isListed: boolean;
        offerStatus: ProfileNftOfferStatus;
    };

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
    Offers: {
        filterType: FilterTypeEnum.Radio,
        radios: [
            {
                label: 'Any',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Has no offers',
                value: 'none',
            },
            {
                label: 'Has offers from others',
                value: 'received',
                filterType: BooleanFilterTypeEnum.Contains,
            },
            {
                label: 'Has offers from me',
                value: 'offered',
                filterType: BooleanFilterTypeEnum.Contains,
            },
        ],
        filterField: ['offerStatus'],
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
        factor: 1 / icpFactor,
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
