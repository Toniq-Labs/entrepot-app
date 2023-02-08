import {
    defaultProfileFilters,
    filterSortKeyByTab,
    ProfilePageStateType,
    sortDefinitions,
} from './profile-page-state';
import {AnyFullProfileEntryType} from './profile-nfts/profile-nft-types';
import {FullProfileNft} from './profile-nfts/full-profile-nft';
import {
    FilterTypeEnum,
    SingleFilterDefinition,
    ImageToggleEntry,
} from '../../common/with-filters/filters-types';
import {CanisterId} from '../../../../data/models/canister-id';
import {Collection} from '../../../../data/models/collection';

export function createBaseProfileWithFiltersInputs({
    showFilters,
    isRenderReady,
    currentProfileTab,
    allFilters,
    allSorts,
}: {
    isRenderReady: boolean;
} & Pick<ProfilePageStateType, 'showFilters' | 'currentProfileTab' | 'allSorts' | 'allFilters'>) {
    return {
        countName: 'NFTs',
        showFilters,
        isLoading: !isRenderReady,
        searchPlaceholder: 'Search: Collection Name or Keywords',

        currentSort: allSorts[filterSortKeyByTab[currentProfileTab.value]],
        sortDefinitions: sortDefinitions[filterSortKeyByTab[currentProfileTab.value]] as any,

        currentFilters: allFilters[filterSortKeyByTab[currentProfileTab.value]],
        defaultFilters: {
            ...(defaultProfileFilters[filterSortKeyByTab[currentProfileTab.value]] as any),
        },

        searchCallback: (searchTerm: string, entry: AnyFullProfileEntryType) => {
            return (
                entry.nftId.includes(searchTerm) ||
                entry.collectionId.includes(searchTerm) ||
                entry.collection?.name.includes(searchTerm) ||
                entry.collection?.keywords.includes(searchTerm) ||
                entry.nftMintNumber === Number(searchTerm) ||
                entry.nftIndex === Number(searchTerm)
            );
        },
    };
}
