import {isTruthy} from '@augment-vir/common';
import {
    RawUserNftTransaction,
    parseRawUserNftTransaction,
    UserTransactionWithDirection,
    TransactionDirection,
} from '../../../nft/user-nft-transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {fetchRawNftListingAndOffers} from '../fetch-raw-nft-listing-and-offers';
import {encodeNftId} from '../../../nft/nft-id';
import {getExtCanisterId} from '../../../canisters/canister-details/wrapped-canister-id';

export type UserTransactionsInput = {
    userAccount: EntrepotUserAccount;
};

async function updateUserTransactions({
    userAccount,
}: UserTransactionsInput): Promise<ReadonlyArray<UserTransactionWithDirection>> {
    const userAccountAddress = userAccount.address;
    // const cloudFunctionsUrl = createCloudFunctionsEndpointUrl([
    //     'user',
    //     userAccountAddress,
    //     'transactions',
    // ]);
    // const rawTransactions: ReadonlyArray<RawUserNftTransaction> = await (
    //     await fetch(cloudFunctionsUrl)
    // ).json();

    const rawTransactions = await fetch(
        `https://api.nftgeek.app/api/1/accountIdentifier/${userAccountAddress}/transactions`,
    ).then(r => r.json());

    const rawTransactionsMapped: ReadonlyArray<RawUserNftTransaction> = Object.keys(
        rawTransactions.transactions,
    )
        .map(key => {
            return {
                canister: key,
                ...rawTransactions.transactions[key][0],
            };
        })
        .map(transaction => {
            return {
                buyer: transaction.buyerUniqueIdentifier.id,
                canister: transaction.canister,
                price: transaction.price,
                seller: transaction.sellerUniqueIdentifier.id,
                time: transaction.timeMillis * 1000000,
                token: encodeNftId(getExtCanisterId(transaction.canister), transaction.tokenId),
            };
        });

    const transactions = await Promise.all(
        rawTransactionsMapped.map(
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
