import {isTruthy} from '@augment-vir/common';
import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';
import {Transaction, RawTransaction, parseRawTransaction} from '../../../models/transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';

export enum TransactionDirection {
    Purchase = 'purchase',
    Sale = 'sale',
}

export type UserTransaction = Transaction & {directionForCurrentUser: TransactionDirection};

export type UserTransactionsInput = {
    userAccount: EntrepotUserAccount;
};

async function updateUserTransactions({
    userAccount,
}: UserTransactionsInput): Promise<ReadonlyArray<UserTransaction>> {
    const userAccountAddress = userAccount.address;
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAccountAddress,
        'transactions',
    ]);

    const rawTransactions: ReadonlyArray<RawTransaction> = await (
        await fetch(cloudFunctionsUrl)
    ).json();

    return rawTransactions
        .map((rawTransaction): UserTransaction | undefined => {
            const transaction = parseRawTransaction(rawTransaction);

            if (!transaction) {
                return undefined;
            }

            const direction =
                transaction.buyerAddress === userAccountAddress
                    ? TransactionDirection.Purchase
                    : TransactionDirection.Sale;

            return {
                ...transaction,
                directionForCurrentUser: direction,
            };
        })
        .filter(isTruthy);
}

export const userTransactionsCache = defineAutomaticallyUpdatingCache<
    Awaited<ReturnType<typeof updateUserTransactions>>,
    SubKeyRequirementEnum.Required,
    UserTransactionsInput
>({
    cacheName: 'user-transactions',
    valueUpdater: updateUserTransactions,
    keyGenerator: ({userAccount}) => userAccount.address,
    subKeyRequirement: SubKeyRequirementEnum.Required,
});
