import {isTruthy} from '@augment-vir/common';
import {
    RawUserNftTransaction,
    UserTransactionWithDirection,
    TransactionDirection,
} from '../../../nft/user-nft-transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {decodeNftId, encodeNftId} from '../../../nft/nft-id';
import {getExtCanisterId} from '../../../canisters/canister-details/wrapped-canister-id';
import {NftListingPrice} from '../../../nft/nft-listing';
import {getNftMintNumber} from '../../../nft/nft-mint-number';

export type UserTransactionsInput = {
    userAccount: EntrepotUserAccount;
};

async function updateUserTransactions({
    userAccount,
}: UserTransactionsInput): Promise<ReadonlyArray<UserTransactionWithDirection>> {
    const userAccountAddress = userAccount.address;

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

    const transactions = await Promise.allSettled(
        rawTransactionsMapped.map(async (rawTransaction, index): Promise<any | undefined> => {
            const nftId = rawTransaction.token;

            if (!nftId) {
                return undefined;
            }

            const decodedNft = decodeNftId(rawTransaction.token);

            const listing: NftListingPrice = {
                price: rawTransaction.price,
                lockedTimestamp: rawTransaction.time,
            };

            const direction =
                rawTransaction.buyer === userAccountAddress
                    ? TransactionDirection.Purchase
                    : TransactionDirection.Sale;

            return {
                collectionId: rawTransaction.canister,
                buyerAddress: rawTransaction.buyer,
                nftIndex: decodedNft.index,
                nftId,
                nftMintNumber: getNftMintNumber({
                    collectionId: rawTransaction.canister,
                    nftIndex: decodedNft.index,
                }),
                sellerAddress: rawTransaction.seller,
                transactionTimeMillisecond: rawTransaction.time / 1_000_000,
                transactionId: rawTransaction.id ? rawTransaction.id : '',
                listing,
                directionForCurrentUser: direction,
            };
        }),
    ).then(results =>
        results.map(result => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return undefined;
            }
        }),
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
