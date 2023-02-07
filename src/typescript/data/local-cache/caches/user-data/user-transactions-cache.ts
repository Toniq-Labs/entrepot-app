import {isTruthy} from '@augment-vir/common';
import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';
import {
    RawUserNftTransaction,
    parseRawUserNftTransaction,
    UserTransactionWithDirection,
    TransactionDirection,
} from '../../../nft/user-nft-transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {fetchRawNftListingAndOffers} from '../fetch-raw-nft-listing-and-offers';

export type UserTransactionsInput = {
    userAccount: EntrepotUserAccount;
};

async function updateUserTransactions({
    userAccount,
}: UserTransactionsInput): Promise<ReadonlyArray<UserTransactionWithDirection>> {
    const userAccountAddress = userAccount.address;
    const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
        'user',
        userAccountAddress,
        'transactions',
    ]);

    const rawTransactions: ReadonlyArray<RawUserNftTransaction> = await (
        await fetch(cloudFunctionsUrl)
    ).json();

    const transactions = await Promise.all(
        rawTransactions.map(
            async (rawTransaction, index): Promise<UserTransactionWithDirection | undefined> => {
                const nftId = rawTransaction.token;

                if (!nftId) {
                    return undefined;
                }

                const rawNftListingAndOffers = await fetchRawNftListingAndOffers(index + 1, nftId);

                const transaction = parseRawUserNftTransaction({
                    ...rawNftListingAndOffers,
                    rawTransaction,
                });

                const direction =
                    transaction.buyerAddress === userAccountAddress
                        ? TransactionDirection.Purchase
                        : TransactionDirection.Sale;

                return {
                    ...transaction,
                    directionForCurrentUser: direction,
                };
            },
        ),
    );

    return transactions.filter(isTruthy);
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
