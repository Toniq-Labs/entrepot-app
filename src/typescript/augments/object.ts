import {extractErrorMessage, ObjectValueType, typedHasProperty} from '@augment-vir/common';

export type NestedKeys<ObjectGeneric extends object> = ObjectValueType<{
    [Prop in keyof ObjectGeneric]: NonNullable<ObjectGeneric[Prop]> extends object
        ? [Prop, ...(NestedKeys<NonNullable<ObjectGeneric[Prop]>> | [])]
        : [Prop];
}>;

export type NestedValue<
    ObjectGeneric extends object,
    NestedKeysGeneric extends NestedKeys<ObjectGeneric>,
> = NestedKeysGeneric extends readonly [infer FirstEntry, ...infer FollowingEntries]
    ? FirstEntry extends keyof ObjectGeneric
        ? FollowingEntries extends never[]
            ? ObjectGeneric[FirstEntry]
            : ObjectGeneric[FirstEntry] extends object
            ? FollowingEntries extends NestedKeys<ObjectGeneric[FirstEntry]>
                ? NestedValue<ObjectGeneric[FirstEntry], FollowingEntries>
                : never
            : never
        : never
    : never;

export function getValueFromNestedKeys<
    ObjectGeneric extends object,
    KeysGeneric extends NestedKeys<ObjectGeneric>,
>(
    inputObject: ObjectGeneric,
    nestedKeys: KeysGeneric,
): NestedValue<ObjectGeneric, KeysGeneric> | undefined {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */

    const keyToAccess = nestedKeys[0];
    try {
        if (!typedHasProperty(inputObject, keyToAccess)) {
            return undefined;
        }

        const currentValue = inputObject[keyToAccess];

        if (nestedKeys.length > 1) {
            return getValueFromNestedKeys(
                currentValue as any,
                (nestedKeys as KeysGeneric).slice(1) as any,
            ) as any;
        } else {
            return currentValue as NestedValue<ObjectGeneric, KeysGeneric>;
        }
    } catch (error) {
        console.error({inputObject, nestedKeys});
        throw new Error(
            `Failed to traverse into inputObject using key "${String(
                keyToAccess,
            )}": ${extractErrorMessage(error)}`,
        );
    }
}
