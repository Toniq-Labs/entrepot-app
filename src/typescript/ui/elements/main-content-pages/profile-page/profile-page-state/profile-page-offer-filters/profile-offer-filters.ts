import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterDefinitions,
    BooleanFilterTypeEnum,
} from '../../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {
    profileNftSortDefinitions,
    ProfileCompleteNft,
    defaultProfileNftFilters,
} from '../profile-page-nft-filters/profile-nft-filters';

export type ProfileCompleteOffer = ProfileCompleteNft;

export const defaultProfileOfferFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileCompleteNft>>
>()({
    ...defaultProfileNftFilters,
    Offers: {
        ...defaultProfileNftFilters.Offers,
        radios: [
            {
                label: 'All',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Offers received',
                value: 'received',
                filterType: BooleanFilterTypeEnum.Contains,
            },
            {
                label: 'Offers placed',
                value: 'offered',
                filterType: BooleanFilterTypeEnum.Contains,
            },
        ],
    },
} as const);

export const profileOfferSortDefinitions = profileNftSortDefinitions;
