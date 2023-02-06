import {ArrayElement} from '@augment-vir/common';
import {AsyncState, isRenderReady} from 'element-vir';
import {profileTabMap, ProfileTopTabValue} from '../profile-tabs';
import {UserNft} from '../../../../../data/nft/raw-user-nft';
import {NftListing, emptyNftListing} from '../../../../../data/nft/nft-listing';
import {ProfilePageStateType, ProfileFullEarnNft} from '../entrepot-profile-page-state';
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

function combineOffers({
    userOffersMade,
    userNfts,
    nftExtraData,
}: Pick<ProfilePageStateType, 'userOffersMade' | 'userNfts' | 'nftExtraData'>):
    | Error
    | PromiseLike<any>
    | ReadonlyArray<UserNft> {
    if (!isRenderReady(nftExtraData)) {
        return nftExtraData;
    }

    const allOffers: UserNft[] = [
        ...(Array.isArray(userOffersMade) ? userOffersMade : []),
        ...(Array.isArray(userNfts) ? userNfts : []),
    ];

    return allOffers.filter(userNft => {
        return !!nftExtraData[userNft.nftId]?.offers.length;
    });
}

function getAsyncStateForCurrentTab(
    currentState: Pick<
        ProfilePageStateType,
        | 'userOffersMade'
        | 'userNfts'
        | 'nftExtraData'
        | 'userFavorites'
        | 'userTransactions'
        | 'currentProfileTab'
    >,
) {
    const tabToStateProp: Record<ProfileTopTabValue, AsyncState<ReadonlyArray<any>>> = {
        'my-nfts': currentState.userNfts,
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
              const extraNftData: NftListing = isRenderReady(currentProfilePageState.nftExtraData)
                  ? currentProfilePageState.nftExtraData[nft.nftId] ?? emptyNftListing
                  : emptyNftListing;

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
                      ...extraNftData,
                      nftNri,
                      collection,
                  };

                  return fullTransaction;
              } else if (isNftType(nft, profileTabMap.earn.value, currentProfilePageState)) {
                  // need to figure out earn types still
                  const fullEarn: ProfileFullEarnNft = {
                      ...extraNftData,
                      ...nft,
                      nftNri,
                      collection,
                  };
                  return fullEarn;
              } else {
                  const fullUserNft: ProfileFullUserNft = {
                      ...extraNftData,
                      ...nft,
                      nftNri,
                      isListed: !!nft.listPrice,
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
