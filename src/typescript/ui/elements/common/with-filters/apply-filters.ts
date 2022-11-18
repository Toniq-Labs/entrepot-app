import {
    FilterDefinitions,
    FilterTypeEnum,
    SingleFilterDefinition,
    BooleanFilterEntry,
    BooleanFilterTypeEnum,
} from './filters-types';
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
        return filterEntry.checkboxes.every(checkbox => {
            // don't filter on unchecked boxes
            if (!checkbox.checked) {
                return true;
            }

            return matchSingleCheckboxFilter({
                dataEntry,
                fieldKeys: [
                    ...(filter.filterField as string[]),
                    filterEntry.key,
                ],
                checkbox,
            });
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
    return filter.checkboxes.every(checkbox => {
        return matchSingleCheckboxFilter({
            dataEntry,
            fieldKeys: filter.filterField as string[],
            checkbox,
        });
    });
}

function matchSingleCheckboxFilter<EntryData extends object>({
    dataEntry,
    fieldKeys,
    checkbox,
}: {
    dataEntry: EntryData;
    fieldKeys: string[];
    checkbox: BooleanFilterEntry;
}) {
    const matchThisData: unknown = getValueFromNestedKeys(
        dataEntry,
        fieldKeys as NestedKeys<EntryData>,
    );
    if (matchThisData == undefined) {
        return false;
    }

    const checkboxValue = checkbox.value ?? checkbox.label;

    const matchesData: ((value: string) => boolean) | undefined = Array.isArray(matchThisData)
        ? value => {
              return matchThisData.includes(value);
          }
        : typeof matchThisData === 'string'
        ? value => {
              if (checkbox.filterType === BooleanFilterTypeEnum.Contains) {
                  return matchThisData.includes(value);
              } else {
                  return value === matchThisData;
              }
          }
        : typeof matchThisData === 'boolean'
        ? () => {
              return matchThisData;
          }
        : undefined;

    if (matchesData == undefined) {
        console.error({fields: fieldKeys, dataEntry});
        throw new Error(
            `Failed to figure out what to match data against for a checkbox filter. See logged filter and dataEntry above.`,
        );
    }

    if (checkbox.checked) {
        return matchesData(checkboxValue);
    } else {
        return !matchesData(checkboxValue);
    }
}
