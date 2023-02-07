import {defaultProfileFilters, filterKeyByTab, ProfilePageStateType} from './profile-page-state';
import {AnyFullProfileEntryType} from './profile-nfts/profile-nft-types';

export function createBaseProfileWithFiltersInputs({
    showFilters,
    isRenderReady,
    currentProfileTab,
    filters,
}: {
    isRenderReady: boolean;
} & Pick<ProfilePageStateType, 'showFilters' | 'currentProfileTab' | 'filters'>) {
    return {
        countName: 'NFTs',
        showFilters,
        isLoading: !isRenderReady,
        searchPlaceholder: 'Search: Collection Name or Keywords',
        defaultFilters: defaultProfileFilters[filterKeyByTab[currentProfileTab.value]] as any,
        currentFilters: filters[filterKeyByTab[currentProfileTab.value]],
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
