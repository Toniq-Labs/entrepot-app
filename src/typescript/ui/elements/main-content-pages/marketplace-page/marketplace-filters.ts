import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {ReadonlyDeep} from 'type-fest';
import {Collection} from '../../../../data/models/collection';
import {
    FilterTypeEnum,
    FilterDefinitions,
    // BooleanFilterTypeEnum,
    SortDefinition,
} from '../../common/with-filters/filters-types';

export const defaultMarketplaceFilters = wrapNarrowTypeWithTypeCheck<
    FilterDefinitions<Collection>
>()({
    'Floor Price': {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: [
            'stats',
            'floor',
        ],
    },
    'Total Volume': {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        // selectedType: VolumeDurationEnum.days7,
        // types: getEnumTypedValues(VolumeDurationEnum),
        filterField: [
            'stats',
            'total',
        ],
    },
    // Dev: {
    //     filterType: FilterTypeEnum.Checkboxes,
    //     checkboxes: [
    //         {
    //             label: 'dev',
    //             checked: false,
    //             filterType: BooleanFilterTypeEnum.Exclusive,
    //         },
    //     ],
    //     filterField: ['dev'],
    // },
    // Bonus: {
    //     filterType: FilterTypeEnum.ExpandingList,
    //     expanded: false,
    //     entries: [
    //         {
    //             expanded: false,
    //             name: 'Keywords',
    //             key: 'keywords',
    //             checkboxes: [
    //                 {
    //                     checked: false,
    //                     label: 'meme',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //                 {
    //                     checked: false,
    //                     label: 'fun',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //                 {
    //                     checked: false,
    //                     label: 'collection',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //             ],
    //         },
    //         {
    //             expanded: false,
    //             name: 'Brief',
    //             key: 'brief',
    //             checkboxes: [
    //                 {
    //                     checked: false,
    //                     label: 'the ',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //                 {
    //                     checked: false,
    //                     label: 'an ',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //                 {
    //                     checked: false,
    //                     label: 'and ',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //                 {
    //                     checked: false,
    //                     label: 'of ',
    //                     filterType: BooleanFilterTypeEnum.Contains,
    //                 },
    //             ],
    //         },
    //     ],
    //     filterField: [],
    // },
});

export const sortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<ReadonlyDeep<SortDefinition<Collection>>>
>()([
    {
        sortName: 'Volume',
        sortField: [
            'stats',
            'total',
        ],
    },
    {
        sortName: 'Listings',
        sortField: [
            'stats',
            'listings',
        ],
    },
    {
        sortName: 'Price',
        sortField: [
            'stats',
            'floor',
        ],
    },
    {
        sortName: 'Name',
        sortField: ['name'],
    },
] as const);
