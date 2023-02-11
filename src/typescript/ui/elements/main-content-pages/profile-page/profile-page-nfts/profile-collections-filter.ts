import {FullProfileNft} from './full-profile-nft';
import {
    FilterTypeEnum,
    SingleFilterDefinition,
    ImageToggleEntry,
} from '../../../common/with-filters/filters-types';
import {CanisterId} from '../../../../../data/models/canister-id';
import {Collection} from '../../../../../data/models/collection';

export type CollectionsFilter = Extract<
    SingleFilterDefinition<FullProfileNft>,
    {filterType: FilterTypeEnum.ImageToggles}
>;

export function createCollectionsFilter({
    selectedCollectionIds,
    collectionsExpanded,
    entries,
}: {
    selectedCollectionIds: ReadonlyArray<CanisterId>;
    collectionsExpanded: boolean;
    entries: ReadonlyArray<FullProfileNft>;
}): CollectionsFilter {
    const uniqueCollections = new Map<CanisterId, {collection: Collection; count: number}>();

    entries.forEach(entry => {
        if (entry.collection) {
            const collectionEntry = uniqueCollections.get(entry.collectionId);
            if (collectionEntry) {
                collectionEntry.count++;
            } else {
                uniqueCollections.set(entry.collectionId, {
                    collection: entry.collection,
                    count: 1,
                });
            }
        }
    });

    const collectionEntries: Readonly<Record<string, ImageToggleEntry>> = Object.fromEntries(
        Array.from(uniqueCollections.values())
            .sort((a, b) => a.count - b.count)
            .map((entry): [string, ImageToggleEntry] => {
                return [
                    entry.collection.name,
                    {
                        checked: selectedCollectionIds.includes(entry.collection.id),
                        count: entry.count,
                        filterValue: entry.collection.id,
                        imageUrl: entry.collection.avatar,
                    },
                ];
            }),
    );

    return {
        filterType: FilterTypeEnum.ImageToggles,
        allEntriesTitle: 'All Collections',
        entries: collectionEntries,
        expanded: collectionsExpanded,
        filterField: ['collectionId'],
    };
}
