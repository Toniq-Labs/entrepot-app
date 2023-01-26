import {filterObject} from '@augment-vir/common';

export function createQueryParamString(
    queryRecord: Record<string, unknown>,
    valuesWithoutKeys?: ReadonlyArray<unknown>,
): string {
    const filteredRecord = filterObject(queryRecord, (key, value) => {
        return !!key && value != undefined;
    });

    const entriesWithoutKeys: [string, unknown][] = (
        valuesWithoutKeys?.filter(value => value != undefined) ?? []
    ).map((valueWithoutKey): [string, unknown] => [
        '',
        valueWithoutKey,
    ]);

    const allParams: [string, any][] = [
        ...Object.entries(filteredRecord),
        ...entriesWithoutKeys,
    ];

    const urlSearchParamsInstance = new URLSearchParams(allParams);

    const searchParamsString = urlSearchParamsInstance.toString().replace(/&=/g, '&');

    if (searchParamsString) {
        return `?${searchParamsString}`.replace(/\?=/, '?');
    } else {
        return '';
    }
}
