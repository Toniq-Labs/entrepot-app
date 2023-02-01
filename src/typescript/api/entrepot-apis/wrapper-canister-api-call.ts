import {
    AnyFunction,
    isRuntimeTypeOf,
    PropertyValueType,
    typedHasProperty,
} from '@augment-vir/common';
import {allWrappedCanisters} from '../../data/canisters/canister-details/all-canister-details';
import {EntrepotTokenApi, defaultEntrepotApi} from './entrepot-data-api';

type EntrepotTokenApiMethods = {
    [ActionName in keyof EntrepotTokenApi as EntrepotTokenApi[ActionName] extends AnyFunction
        ? ActionName
        : never]: EntrepotTokenApi[ActionName];
};

export type AllWrappedCanistersApi = {
    [ActionName in keyof EntrepotTokenApiMethods]: (
        ...inputs: Parameters<EntrepotTokenApi[ActionName]>
    ) => Promise<{
        [CanisterId: string]: Awaited<ReturnType<EntrepotTokenApi[ActionName]>>;
    }>;
};

export const allWrappedCanistersApi: AllWrappedCanistersApi = new Proxy(
    defaultEntrepotApi.token(allWrappedCanisters[0]!.originalCanisterId),
    {
        get(target, property: PropertyKey) {
            const actualApiMethod: PropertyValueType<EntrepotTokenApiMethods> | undefined = (
                target as EntrepotTokenApiMethods
            )[property as keyof EntrepotTokenApiMethods];

            if (actualApiMethod == undefined || !isRuntimeTypeOf(actualApiMethod, 'function')) {
                return undefined;
            }

            return wrapApiCall(property as keyof EntrepotTokenApiMethods);
        },
    },
) as unknown as AllWrappedCanistersApi;

function wrapApiCall<MethodNameGeneric extends keyof EntrepotTokenApiMethods>(
    methodName: MethodNameGeneric,
) {
    return async (...inputs: Parameters<EntrepotTokenApiMethods[MethodNameGeneric]>) => {
        const wrappedOutputEntries = await Promise.all(
            allWrappedCanisters.map(async wrappedCanister => {
                return [
                    wrappedCanister.originalCanisterId,
                    await (
                        defaultEntrepotApi.token(wrappedCanister.originalCanisterId)[
                            methodName
                        ] as AnyFunction
                    )(...inputs),
                ];
            }),
        );

        return Object.fromEntries(wrappedOutputEntries);
    };
}
