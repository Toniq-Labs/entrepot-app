import {CurrentSort, SortDefinition} from './filters-types';
import {getValueFromNestedKeys, NestedKeys} from '../../../../augments/object';

export function applySort<EntryGeneric extends object>({
    sortDefinitions,
    currentSort,
    entries,
}: {
    sortDefinitions: ReadonlyArray<SortDefinition<EntryGeneric>>;
    currentSort: CurrentSort;
    entries: ReadonlyArray<EntryGeneric>;
}) {
    const sortToUse = sortDefinitions.find(
        sortDefinition => sortDefinition.sortName === currentSort.name,
    );

    if (!sortToUse) {
        throw new Error(`Failed to find sort definition by sort name "${currentSort.name}"`);
    }

    return [...entries].sort((a, b) => {
        const aValue: unknown = getValueFromNestedKeys(
            a,
            sortToUse.sortField as NestedKeys<EntryGeneric>,
        );
        const bValue: unknown = getValueFromNestedKeys(
            b,
            sortToUse.sortField as NestedKeys<EntryGeneric>,
        );

        const numericA = Number(aValue);
        const numericB = Number(bValue);

        if (bValue == undefined) {
            return -1;
        } else if (aValue == undefined) {
            return 1;
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (currentSort.ascending) {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        } else if (!isNaN(numericA) && !isNaN(numericB)) {
            if (currentSort.ascending) {
                return numericA - numericB;
            } else {
                return numericB - numericA;
            }
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            const noQuoteA = aValue.replace(/^['"]/, '').replace(/['"]$/, '');
            const noQuoteB = bValue.replace(/^['"]/, '').replace(/['"]$/, '');

            if (currentSort.ascending) {
                return noQuoteA.localeCompare(noQuoteB);
            } else {
                return noQuoteB.localeCompare(noQuoteA);
            }
        } else {
            console.error({aValue, bValue, currentSort});
            throw new Error(`Could not compare the above a,b values.`);
        }
    });
}
