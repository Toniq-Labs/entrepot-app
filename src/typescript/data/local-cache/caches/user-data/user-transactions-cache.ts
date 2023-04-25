import {isTruthy} from '@augment-vir/common';
import {
    RawUserNftTransaction,
    UserTransactionWithDirection,
    TransactionDirection,
} from '../../../nft/user-nft-transaction';
import {EntrepotUserAccount} from '../../../models/user-data/account';
import {defineAutomaticallyUpdatingCache, SubKeyRequirementEnum} from '../../define-local-cache';
import {decodeNftId} from '../../../nft/nft-id';
import {NftListingPrice} from '../../../nft/nft-listing';
import {getNftMintNumber} from '../../../nft/nft-mint-number';
import {createCloudFunctionsEndpointUrl} from '../../../../api/entrepot-apis/entrepot-data-api';

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

    const transactions = await Promise.allSettled(
        rawTransactions.map(async (rawTransaction): Promise<any | undefined> => {
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
