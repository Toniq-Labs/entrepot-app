import {isTruthy} from '@augment-vir/common';
import {createCloudFunctionsEndpointUrl} from '../../../api/entrepot-apis/entrepot-data-api';
import {Transaction, RawTransaction, serializeTransaction} from '../../models/transaction';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../define-local-cache';

export enum TransactionDirection {
    Purchase = 'purchase',
    Sale = 'sale',
}

export type UserTransaction = Transaction & {directionForCurrentUser: TransactionDirection};

async function updateUserTransactions(
    userAddress: string,
): Promise<ReadonlyArray<UserTransaction>> {
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAddress,
        'transactions',
    ]);

    const rawTransactions: ReadonlyArray<RawTransaction> = await (
        await fetch(cloudFunctionsUrl)
    ).json();

    return rawTransactions
        .map((rawTransaction): UserTransaction | undefined => {
            const transaction = serializeTransaction(rawTransaction);

            if (!transaction) {
                return undefined;
            }

            const direction =
                transaction.buyerAddress === userAddress
                    ? TransactionDirection.Purchase
                    : TransactionDirection.Sale;

            return {
                ...transaction,
                directionForCurrentUser: direction,
            };
        })
        .filter(isTruthy);
}

export const userTransactions = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserTransactions>>,
    SubKeyRequirementEnum.Required,
    string
>({
    cacheName: 'user-transactions',
    valueUpdater: updateUserTransactions,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
