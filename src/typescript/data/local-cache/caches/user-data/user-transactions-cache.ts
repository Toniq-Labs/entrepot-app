import {isTruthy} from '@augment-vir/common';
import {
    RawUserNftTransaction,
    UserTransactionWithDirection,
    TransactionDirection,
} from '../../../nft/user-nft-transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {decodeNftId, encodeNftId} from '../../../nft/nft-id';
import {NftListingPrice} from '../../../nft/nft-listing';
import {getNftMintNumber} from '../../../nft/nft-mint-number';
import {UserIdentity} from '../../../models/user-data/identity';
import {chain, merge, values, map} from 'lodash';
import {getExtCanisterId} from '../../../canisters/canister-details/wrapped-canister-id';

export type UserTransactionsInput = {
    userAccount: EntrepotUserAccount;
    userIdentity: UserIdentity;
};

async function updateUserTransactions({
    userAccount,
    userIdentity,
}: UserTransactionsInput): Promise<ReadonlyArray<UserTransactionWithDirection>> {
    const userAccountAddress = userAccount.address;
    const userPrincipal = userIdentity.getPrincipal().toText();

    const rawPrincipalTransactions = await (
        await fetch(`https://api.nftgeek.app/api/1/toniq/principal/${userPrincipal}/transactions`)
    ).json();

    const rawAccountIdentifierTransactions = await (
        await fetch(
            `https://api.nftgeek.app/api/1/toniq/accountIdentifier/${userAccountAddress}/transactions`,
        )
    ).json();

    const mergedTransactions = merge(rawAccountIdentifierTransactions, rawPrincipalTransactions);

    const rawTransactionsMapped: ReadonlyArray<RawUserNftTransaction> = chain(
        Object.keys(mergedTransactions.transactions),
    )
        .map(key => {
            return map(mergedTransactions.transactions[key], transaction => {
                return {
                    canister: key,
                    ...transaction,
                };
            });
        })
        .map(transactions => {
            return values(transactions);
        })
        .flattenDeep()
        .unionBy('timeMillis')
        .map(transaction => {
            return {
                buyer: transaction.buyerUniqueIdentifier
                    ? transaction.buyerUniqueIdentifier.id
                    : '',
                canister: transaction.canister,
                price: transaction.price,
                seller: transaction.sellerUniqueIdentifier
                    ? transaction.sellerUniqueIdentifier.id
                    : '',
                time: transaction.timeMillis * 1_000_000,
                token: encodeNftId(getExtCanisterId(transaction.canister), transaction.tokenId),
            };
        })
        .value();

    const transactions = await Promise.allSettled(
        rawTransactionsMapped.map(async (rawTransaction): Promise<any | undefined> => {
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
