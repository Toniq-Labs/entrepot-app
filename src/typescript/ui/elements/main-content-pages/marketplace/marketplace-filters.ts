import {wrapNarrowTypeWithTypeCheck} from 'augment-vir';
import {Collection} from '../../../../data/models/collection';
import {
    FilterTypeEnum,
    FilterDefinitions,
    BooleanFilterTypeEnum,
    SortDefinition,
} from '../../common/with-filters/filters-types';

export const defaultMarketplaceFilters = wrapNarrowTypeWithTypeCheck<
    FilterDefinitions<Collection>
>()({
    Price: {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: [
            'stats',
            'floor',
        ],
    },
    Volume: {
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
});

export const sortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<SortDefinition<Collection>>
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
