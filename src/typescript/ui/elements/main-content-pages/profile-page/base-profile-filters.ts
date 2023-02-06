import {ProfilePageStateType} from './profile-page-state';
import {AnyFullProfileEntryType} from './profile-entries/profile-entry-types';

export function createBaseProfileWithFiltersInputs({
    showFilters,
    isRenderReady,
}: {
    isRenderReady: boolean;
} & Pick<ProfilePageStateType, 'showFilters'>) {
    return {
        countName: 'NFTs',
        showFilters,
        isLoading: !isRenderReady,
        searchPlaceholder: 'Search: Collection Name or Keywords',
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
