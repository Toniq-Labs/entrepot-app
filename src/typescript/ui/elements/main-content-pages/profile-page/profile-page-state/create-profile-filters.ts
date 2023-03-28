import {ArrayElement} from '@augment-vir/common';
import {AsyncState, isRenderReady} from 'element-vir';
import {profileTabMap, ProfileTopTabValue} from './profile-tabs';
import {ProfilePageStateType, ProfileFullEarnNft} from './profile-page-state';
import {createProfileNftFilterInputs} from './profile-page-nft-filters/create-profile-nft-filter-inputs';
import {createUserTransactionFilterInputs} from './profile-page-transaction-filters/create-profile-transaction-filter-inputs';
import {
    AnyProfileEntriesAsyncState,
    AnyFullProfileEntries,
    isNftType,
    isEntriesType,
    AnyProfileEntryType,
} from '../profile-page-nfts/profile-nft-types';
import {CollectionMap} from '../../../../../data/models/collection';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {BaseNft} from '../../../../../data/nft/base-nft';
import {ProfileCompleteTransactionNft} from './profile-page-transaction-filters/profile-transaction-filters';
import {ProfileCompleteNft} from './profile-page-nft-filters/profile-nft-filters';
import {FullProfileNft} from '../profile-page-nfts/full-profile-nft';
import {createCollectionsFilter} from '../profile-page-nfts/profile-collections-filter';
import {WithFiltersElementInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {
    FilterDefinitions,
    SingleFilterDefinition,
} from '../../../common/with-filters/filters-types';
import {
    calculateOfferStatus,
    calculateOfferStatusFavorites,
} from './profile-page-nft-filters/profile-nft-offer-status';
import {createProfileOfferFilterInputs} from './profile-page-offer-filters/create-profile-offer-filter-inputs';

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

export function createProfileFilterInputs({
    currentProfilePageState,
    collectionMap,
    sellCallback,
    transferCallback,
    userAccount,
    nftClickCallback,
}: {
    currentProfilePageState: ProfilePageStateType;
    collectionMap: CollectionMap;
    sellCallback: (nft: FullProfileNft) => void;
    transferCallback: (nft: FullProfileNft) => void;
    nftClickCallback: (nft: FullProfileNft) => void;
    userAccount: EntrepotUserAccount | undefined;
}): WithFiltersElementInputs<AnyProfileEntryType, FilterDefinitions<AnyProfileEntryType>> {
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
                  const fullTransaction: ProfileCompleteTransactionNft = {
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
                  const fullUserNft: ProfileCompleteNft = {
                      ...nft,
                      nftNri,
                      isListed: !!nft.listing.price,
                      collection,
                      offerStatus: isNftType(
                          nft,
                          profileTabMap.favorites.value,
                          currentProfilePageState,
                      )
                          ? calculateOfferStatusFavorites(userAccount?.address ?? '', nft)
                          : calculateOfferStatus(userAccount?.address ?? '', nft),
                  };

                  return fullUserNft;
              }
          }) as AnyFullProfileEntries)
        : [];

    const areEntriesRenderReady = isRenderReady(asyncEntries);

    const currentCollectionsFilter = createCollectionsFilter({
        entries,
        collectionsExpanded: currentProfilePageState.collectionsFilterExpanded,
        selectedCollectionIds:
            currentProfilePageState.selectedCollections[
                currentProfilePageState.currentProfileTab.value
            ],
    });

    const defaultCollectionsFilter = createCollectionsFilter({
        entries,
        collectionsExpanded: false,
        selectedCollectionIds: [],
    });

    const filterInputs: WithFiltersElementInputs<
        AnyProfileEntryType,
        FilterDefinitions<AnyProfileEntryType>
    > = isEntriesType(entries, profileTabMap.activity.value, currentProfilePageState)
        ? createUserTransactionFilterInputs({
              ...currentProfilePageState,
              entries,
              isRenderReady: areEntriesRenderReady,
              nftClickCallback,
          })
        : isEntriesType(entries, profileTabMap.earn.value, currentProfilePageState)
        ? ({} as any)
        : currentProfilePageState.currentProfileTab.value === profileTabMap.offers.value
        ? createProfileOfferFilterInputs({
              ...currentProfilePageState,
              entries,
              isRenderReady: areEntriesRenderReady,
              sellCallback,
              transferCallback,
              userAccount,
              nftClickCallback,
          })
        : createProfileNftFilterInputs({
              ...currentProfilePageState,
              entries,
              isRenderReady: areEntriesRenderReady,
              sellCallback,
              transferCallback,
              userAccount,
              nftClickCallback,
          });

    return {
        ...filterInputs,
        currentFilters: {
            ...filterInputs.currentFilters,
            Collections: currentCollectionsFilter as SingleFilterDefinition<AnyProfileEntryType>,
        },
        defaultFilters: {
            ...filterInputs.currentFilters,
            Collections: defaultCollectionsFilter as SingleFilterDefinition<AnyProfileEntryType>,
        },
    };
}
