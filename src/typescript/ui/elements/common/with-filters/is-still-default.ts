import {areJsonEqual, isTruthy} from '@augment-vir/common';
import {
    FilterTypeEnum,
    SingleFilterDefinition,
    ExpandingListFilterEntry,
    FilterDefinitions,
} from './filters-types';

export function countFiltersNotAtDefaults({
    filters,
    defaultFilters,
}: {
    filters: FilterDefinitions<any>;
    defaultFilters: FilterDefinitions<any>;
}): number {
    return Object.keys(filters)
        .map(filterName => {
            const filter = filters[filterName]!;
            const defaultFilter = defaultFilters[filterName]!;

            return !isStillAtDefaults({filter, defaultFilter});
        })
        .filter(isTruthy).length;
}

export function isStillAtDefaults({
    defaultFilter,
    filter,
}: {
    defaultFilter: SingleFilterDefinition<any>;
    filter: SingleFilterDefinition<any>;
}): boolean {
    if (
        defaultFilter.filterType === FilterTypeEnum.Checkboxes &&
        filter.filterType === FilterTypeEnum.Checkboxes
    ) {
        return defaultFilter.checkboxes.every((checkbox, index) => {
            return checkbox.checked === filter.checkboxes[index]!.checked;
        });
    } else if (
        defaultFilter.filterType === FilterTypeEnum.ExpandingList &&
        filter.filterType === FilterTypeEnum.ExpandingList
    ) {
        return compareExpandingList(defaultFilter, filter);
    } else if (
        defaultFilter.filterType === FilterTypeEnum.NumericRange &&
        filter.filterType === FilterTypeEnum.NumericRange
    ) {
        return (
            defaultFilter.currentMax === filter.currentMax &&
            defaultFilter.currentMin === filter.currentMin &&
            defaultFilter.selectedType === filter.selectedType
        );
    } else if (
        defaultFilter.filterType === FilterTypeEnum.Radio &&
        filter.filterType === FilterTypeEnum.Radio
    ) {
        return defaultFilter.value === filter.value;
    } else if (
        defaultFilter.filterType === FilterTypeEnum.ImageToggles &&
        filter.filterType === FilterTypeEnum.ImageToggles
    ) {
        const defaultEnabledMap = Object.values(defaultFilter.entries).map(entry => entry.checked);
        const currentEnabledMap = Object.values(defaultFilter.entries).map(entry => entry.checked);
        return areJsonEqual(defaultEnabledMap, currentEnabledMap);
    } else {
        throw new Error(
            `Unsupported filter types for calculating if at default value: ${defaultFilter.filterType}, ${filter.filterType}`,
        );
    }
}

function compareExpandingList(
    a: Extract<SingleFilterDefinition<any>, {filterType: FilterTypeEnum.ExpandingList}>,
    b: Extract<SingleFilterDefinition<any>, {filterType: FilterTypeEnum.ExpandingList}>,
): boolean {
    return a.entries.every((aEntry, index) => {
        const bEntry = b.entries[index]!;

        return compareExpandingListEntries(aEntry, bEntry);
    });
}

function compareExpandingListEntries(
    a: ExpandingListFilterEntry,
    b: ExpandingListFilterEntry,
): boolean {
    return a.checkboxes.every((checkbox, index) => {
        return checkbox.checked === b.checkboxes![index]!.checked;
    });
}
