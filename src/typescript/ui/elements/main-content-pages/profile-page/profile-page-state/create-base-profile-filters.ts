import {ProfilePageStateType} from './profile-page-state';
import {AnyFullProfileEntryType} from '../profile-page-nfts/profile-nft-types';
import {
    filterSortKeyByTab,
    sortDefinitions,
    defaultProfileFilters,
} from './profile-page-filter-definitions';

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
