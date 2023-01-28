import {isRuntimeTypeOf, mapObjectValues, typedHasProperty} from '@augment-vir/common';

export function maskObjects<A extends object, B extends object>(a: A, b: B): A & B {
    return mapObjectValues(a, (key, aValue) => {
        if (typedHasProperty(b, key)) {
            const bValue = b[key];
            return bValue;
        }
        return aValue;
    }) as unknown as A & B;
}
