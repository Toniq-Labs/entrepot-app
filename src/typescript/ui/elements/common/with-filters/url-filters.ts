import {
    copyThroughJson,
    getObjectTypedKeys,
    isObject,
    isTruthy,
    JsonCompatibleObject,
} from '@augment-vir/common';
import {ReadonlyDeep} from 'type-fest';
import {FilterDefinitions, FilterTypeEnum, SingleFilterDefinition} from './filters-types';
import {isStillAtDefaults} from './is-still-default';

export function filtersToUrlString(
    currentFilters: FilterDefinitions<any>,
    defaultFilters: FilterDefinitions<any>,
): string {
    const modifiedFilterKeys = Object.keys(currentFilters).filter(filterName => {
        const filter = currentFilters[filterName];
        const defaultFilter = defaultFilters[filterName];

        if (!filter || !defaultFilter) {
            return false;
        }

        return !isStillAtDefaults({
            defaultFilter,
            filter,
        });
    });

    const urlValues = Object.fromEntries(
        modifiedFilterKeys
            .map((filterKey): [string, string] | undefined => {
                const filter = currentFilters[filterKey]!;
                const defaultFilter = defaultFilters[filterKey];

                if (!defaultFilter) {
                    throw new Error(`Failed to find default filter by key '${filterKey}'`);
                }

                const urlValue = getFilterDiff({
                    filter,
                    defaultFilter,
                    filterKey,
                });

                if (urlValue) {
                    return [
                        filterKey,
                        urlValue,
                    ];
                } else {
                    return undefined;
                }
            })
            .filter(isTruthy),
    );

    return filterValueObjectToUrlString(urlValues);
}

export function filterValueObjectToUrlString(filterValueObject: Record<string, string>): string {
    return encodeURIComponent(JSON.stringify(filterValueObject));
}

export function urlStringToFilters<T extends object>({
    filterString,
    defaultFilters,
}: {
    filterString: string;
    defaultFilters: ReadonlyDeep<FilterDefinitions<T>>;
}): FilterDefinitions<T> | undefined {
    try {
        const newFilters: FilterDefinitions<T> = copyThroughJson(
            defaultFilters as FilterDefinitions<T>,
        );

        const parsedFilterString: Record<string, string> | undefined = JSON.parse(filterString);

        if (!isObject(parsedFilterString)) {
            throw new Error('parsed filter string is not an object');
        }

        getObjectTypedKeys(parsedFilterString).forEach(filterKey => {
            if (!(filterKey in newFilters)) {
                throw new Error(`Invalid filter key: ${filterKey}`);
            }

            const urlValue = parsedFilterString[filterKey]!;

            const filter = newFilters[filterKey]!;

            if (filter.filterType === FilterTypeEnum.Checkboxes) {
                const checkBoxIndexesToChange = urlValue.split(',').map(value => Number(value));
                filter.checkboxes.forEach((checkbox, index) => {
                    if (checkBoxIndexesToChange.includes(index)) {
                        filter.checkboxes[index]!.checked = !checkbox.checked;
                    }
                });
            } else if (filter.filterType === FilterTypeEnum.Radio) {
                if (typeof filter.value === 'boolean') {
                    filter.value = Boolean(urlValue);
                } else {
                    filter.value = urlValue;
                }
            } else if (filter.filterType === FilterTypeEnum.NumericRange) {
                const [
                    min,
                    max,
                ] = urlValue.split(',').map(value => (value === '' ? '' : Number(value)));

                if (min !== '') {
                    filter.currentMin = min;
                }
                if (max !== '') {
                    filter.currentMax = max;
                }
            }
        });

        return newFilters;
    } catch (error) {
        console.error(`failed to parse filterString`, filterString, error);
        return undefined;
    }
}

function getFilterDiff({
    filter,
    defaultFilter,
    filterKey,
}: {
    filter: SingleFilterDefinition<any>;
    defaultFilter: SingleFilterDefinition<any>;
    filterKey: string;
}): string {
    if (
        filter.filterType === FilterTypeEnum.Checkboxes &&
        defaultFilter.filterType === FilterTypeEnum.Checkboxes
    ) {
        const modifiedCheckboxIndexes = filter.checkboxes.map((checkbox, index) => {
            const defaultCheckbox = defaultFilter.checkboxes[index];

            if (!defaultCheckbox) {
                throw new Error(
                    `Failed to find default checkbox at index '${index}' on filter '${filterKey}'`,
                );
            }

            if (checkbox.checked === defaultCheckbox?.checked) {
                return undefined;
            } else {
                return index;
            }
        });

        return modifiedCheckboxIndexes.filter(entry => entry == undefined).join(',');
    } else if (
        filter.filterType === FilterTypeEnum.Radio &&
        defaultFilter.filterType === FilterTypeEnum.Radio
    ) {
        if (filter.value === defaultFilter.value) {
            return '';
        } else {
            return String(filter.value);
        }
    } else if (
        filter.filterType === FilterTypeEnum.NumericRange &&
        defaultFilter.filterType === FilterTypeEnum.NumericRange
    ) {
        const min =
            filter.currentMin === defaultFilter.currentMin ? '' : String(defaultFilter.currentMin);
        const max =
            filter.currentMax === defaultFilter.currentMax ? '' : String(defaultFilter.currentMax);

        if (min || max) {
            return [
                min,
                max,
            ].join(',');
        } else {
            return '';
        }
    }

    // the other filter types are not supported as URL strings
    return '';
}
