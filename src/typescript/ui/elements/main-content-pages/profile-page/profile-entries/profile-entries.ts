import {ArrayElement} from '@augment-vir/common';
import {AsyncState, isRenderReady} from 'element-vir';
import {profileTabMap, ProfileTopTabValue} from '../profile-tabs';
import {NftListing, emptyNftListing} from '../../../../../data/nft/nft-listing';
import {ProfilePageStateType, ProfileFullEarnNft} from '../profile-page-state';
import {
    ProfileFullUserNft,
    createUserNftFilterInputs,
} from '../user-nft-profile-parts/user-nft-profile-filters';
import {
    ProfileFullUserTransaction,
    createUserTransactionFilterInputs,
} from '../user-transaction-profile-parts/user-transaction-profile-filters';
import {
    AnyProfileEntriesAsyncState,
    AnyFullProfileEntries,
    isNftType,
    isEntriesType,
} from './profile-entry-types';
import {CollectionMap} from '../../../../../data/models/collection';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {BaseNft} from '../../../../../data/nft/base-nft';

function combineOffers({
    userOffersMade,
    userOwnedNfts,
}: Pick<ProfilePageStateType, 'userOffersMade' | 'userOwnedNfts'>):
    | Error
    | PromiseLike<any>
    | ReadonlyArray<BaseNft> {
    const allPotentialNftsWithOffers: BaseNft[] = [
        ...(Array.isArray(userOffersMade) ? userOffersMade : []),
        ...(Array.isArray(userOwnedNfts) ? userOwnedNfts : []),
    ];

    return allPotentialNftsWithOffers.filter(nft => {
        return nft.offers.length;
    });
}

function getAsyncStateForCurrentTab(
    currentState: Pick<
        ProfilePageStateType,
        | 'userOffersMade'
        | 'userOwnedNfts'
        | 'userFavorites'
        | 'userTransactions'
        | 'currentProfileTab'
    >,
) {
    const tabToStateProp: Record<ProfileTopTabValue, AsyncState<ReadonlyArray<any>>> = {
        'my-nfts': currentState.userOwnedNfts,
        favorites: currentState.userFavorites,
        offers: combineOffers(currentState),
        activity: currentState.userTransactions,
        // earn: currentState.userEarnNfts,
        earn: [],
    };
    return tabToStateProp[currentState.currentProfileTab.value];
}

export function generateProfileWithFiltersInput({
    currentProfilePageState,
    collectionMap,
    sellCallback,
    transferCallback,
    userAccount,
}: {
    currentProfilePageState: ProfilePageStateType;
    collectionMap: CollectionMap;
    sellCallback: (nftId: string) => void;
    transferCallback: (nftId: string) => void;
    userAccount: EntrepotUserAccount | undefined;
}) {
    const asyncEntries: AnyProfileEntriesAsyncState =
        getAsyncStateForCurrentTab(currentProfilePageState);

    const entries: AnyFullProfileEntries = isRenderReady(asyncEntries)
        ? (asyncEntries.map((nft): ArrayElement<AnyFullProfileEntries> => {
              const nftNri: number | undefined = isRenderReady(
                  currentProfilePageState.collectionNriData,
              )
                  ? currentProfilePageState.collectionNriData[nft.collectionId]?.nriData?.[
                        nft.nftIndex
                    ]
                  : undefined;

              const collection = collectionMap[nft.collectionId];

              if (isNftType(nft, profileTabMap.activity.value, currentProfilePageState)) {
                  const fullTransaction: ProfileFullUserTransaction = {
                      ...nft,
                      nftNri,
                      collection,
                  };

                  return fullTransaction;
              } else if (isNftType(nft, profileTabMap.earn.value, currentProfilePageState)) {
                  // need to figure out earn types still
                  const fullEarn: ProfileFullEarnNft = {
                      ...nft,
                      nftNri,
                      collection,
                  };
                  return fullEarn;
              } else {
                  const fullUserNft: ProfileFullUserNft = {
                      ...nft,
                      nftNri,
                      isListed: !!nft.listing.price,
                      collection,
                  };

                  return fullUserNft;
              }
          }) as AnyFullProfileEntries)
        : [];

    const isEntriesRenderReady = isRenderReady(asyncEntries);

    if (isEntriesType(entries, profileTabMap.activity.value, currentProfilePageState)) {
        return createUserTransactionFilterInputs({
            ...currentProfilePageState,
            entries,
            isRenderReady: isEntriesRenderReady,
        });
    } else if (isEntriesType(entries, profileTabMap.earn.value, currentProfilePageState)) {
        return {} as any;
    } else {
        return createUserNftFilterInputs({
            ...currentProfilePageState,
            entries,
            isRenderReady: isEntriesRenderReady,
            sellCallback,
            transferCallback,
            userAccount,
        });
    }
}
