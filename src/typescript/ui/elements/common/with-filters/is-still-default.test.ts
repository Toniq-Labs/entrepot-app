import {itCases} from '@augment-vir/browser-testing';
import {copyThroughJson, wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {FilterTypeEnum, FilterDefinitions} from './filters-types';
import {countFiltersNotAtDefaults} from './is-still-default';

describe(countFiltersNotAtDefaults.name, () => {
    const exampleDefaultFilters = wrapNarrowTypeWithTypeCheck<FilterDefinitions<any>>()({
        a: {
            filterType: FilterTypeEnum.NumericRange,
            currentMax: 0,
            currentMin: 0,
            filterField: ['test-field'],
        },
    });

    itCases(countFiltersNotAtDefaults, [
        {
            it: 'should detect when no filters have changed',
            input: {
                defaultFilters: exampleDefaultFilters,
                filters: copyThroughJson(exampleDefaultFilters),
            },
            expect: 0,
        },
        {
            it: 'should detect when a filter has changed',
            input: {
                defaultFilters: exampleDefaultFilters,
                filters: {
                    ...exampleDefaultFilters,
                    a: {
                        ...exampleDefaultFilters.a,
                        currentMax: 100,
                    },
                },
            },
            expect: 1,
        },
    ]);
});
