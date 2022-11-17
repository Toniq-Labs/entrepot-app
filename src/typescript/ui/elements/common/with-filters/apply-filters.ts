import {FilterDefinitions, FilterTypeEnum, SingleFilterDefinition} from './with-filters-types';
import {getValueFromNestedKeys, NestedKeys} from '../../../../augments/object';

export function applyAllFilters<
    EntryData extends object,
    FilterDefinitionsGeneric extends FilterDefinitions<EntryData>,
>(dataEntry: EntryData, filters: FilterDefinitionsGeneric): boolean {
    return Object.values(filters).every(filter => {
        return applyIndividualFilter(dataEntry, filter);
    });
}

function applyIndividualFilter<EntryData extends object>(
    dataEntry: EntryData,
    filter: SingleFilterDefinition<EntryData>,
): boolean {
    if (filter.filterType === FilterTypeEnum.Checkboxes) {
        return applyCheckboxFilter(dataEntry, filter);
    } else if (filter.filterType === FilterTypeEnum.ExpandingList) {
        return applyExpandingListFilter(dataEntry, filter);
    } else if (filter.filterType === FilterTypeEnum.NumericRange) {
        return applyNumericRangeFilter(dataEntry, filter);
    } else {
        throw new Error(`Invalid filterType received: ${(filter as any).filterType}`);
    }
}

function applyExpandingListFilter<EntryData extends object>(
    dataEntry: EntryData,
    filter: Extract<SingleFilterDefinition<EntryData>, {filterType: FilterTypeEnum.ExpandingList}>,
): boolean {
    return filter.entries.every(filterEntry => {
        return filterEntry.checkboxes
            ? applyCheckboxFilter(dataEntry, {
                  filterType: FilterTypeEnum.Checkboxes,
                  checkboxes: filterEntry.checkboxes,
                  filterField: filter.filterField,
              })
            : applyExpandingListFilter(dataEntry, {
                  filterType: FilterTypeEnum.ExpandingList,
                  entries: filterEntry.children,
                  filterField: filter.filterField,
              });
    });
}

function applyNumericRangeFilter<EntryData extends object>(
    dataEntry: EntryData,
    filter: Extract<SingleFilterDefinition<EntryData>, {filterType: FilterTypeEnum.NumericRange}>,
): boolean {
    if (filter.currentMax == undefined && filter.currentMin == undefined) {
        return true;
    }
    const value: unknown = getValueFromNestedKeys(
        dataEntry,
        filter.filterField as NestedKeys<EntryData>,
    );
    if (value == undefined) {
        return false;
    }
    const matchThisData: number = Number(value);

    if (isNaN(matchThisData)) {
        console.error({filter, dataEntry});
        throw new Error(
            `Failed to get a numeric value to filter to. See logged filter and dataEntry above.`,
        );
    }

    const matchesMax = filter.currentMax == undefined ? true : matchThisData <= filter.currentMax;
    const matchesMin = filter.currentMin == undefined ? true : matchThisData >= filter.currentMin;

    return matchesMax && matchesMin;
}

function applyCheckboxFilter<EntryData extends object>(
    dataEntry: EntryData,
    filter: Extract<SingleFilterDefinition<EntryData>, {filterType: FilterTypeEnum.Checkboxes}>,
): boolean {
    const matchThisData: unknown = getValueFromNestedKeys(
        dataEntry,
        filter.filterField as NestedKeys<EntryData>,
    );
    if (matchThisData == undefined) {
        return false;
    }

    const matchesData: ((label: string, checked: boolean) => boolean) | undefined = Array.isArray(
        matchThisData,
    )
        ? (label, checked) => {
              return matchThisData.includes(label);
          }
        : typeof matchThisData === 'string'
        ? label => {
              return label === matchThisData;
          }
        : typeof matchThisData === 'boolean'
        ? (label, checked) => {
              return matchThisData;
          }
        : undefined;

    if (matchesData == undefined) {
        console.error({filter, dataEntry});
        throw new Error(
            `Failed to figure out what to match data against for a checkbox filter. See logged filter and dataEntry above.`,
        );
    }

    return filter.checkboxes.every(checkbox => {
        if (checkbox.checked) {
            return matchesData(checkbox.label, checkbox.checked);
        } else {
            return !matchesData(checkbox.label, checkbox.checked);
        }
    });
}
