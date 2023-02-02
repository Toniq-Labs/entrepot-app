import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {UserNft} from '../../../../../data/nft/user-nft';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    BooleanFilterTypeEnum,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {assign, html, isRenderReady} from 'element-vir';
import {createWithFiltersInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileCardElement} from '../toniq-entrepot-profile-nft-card.element';
import {ProfilePageStateType} from '../entrepot-profile-page-state';
import {BaseFullProfileEntry} from '../profile-entries/base-full-profile-entry';
import {createBaseProfileWithFiltersInputs} from '../base-profile-filters';

export type ProfileFullUserNft = UserNft & BaseFullProfileEntry & {isListed: boolean};

export const defaultProfileUserNftFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileFullUserNft>>
>()({
    Listed: {
        filterType: FilterTypeEnum.Checkboxes,
        checkboxes: [
            {
                checked: true,
                label: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                checked: false,
                label: 'Listed',
                value: true,
            },
            {
                checked: false,
                label: 'Unlisted',
                value: false,
            },
        ],
        filterField: ['isListed'],
    },
} as const);

export const profileUserNftSortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<ReadonlyDeep<SortDefinition<ProfileFullUserNft>>>
>()([
    {
        sortName: 'Mint #',
        sortField: [
            'nftMintNumber',
        ],
    },
    {
        sortName: 'Price',
        sortField: [
            'listPrice',
        ],
    },
    {
        sortName: 'Rarity',
        sortField: [
            'nftNri',
        ],
    },
] as const);

export function createUserNftFilterInputs({
    showFilters,
    currentSort,
    filters,
    isRenderReady,
    entries,
    currentTopTab,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileFullUserNft>>;
} & Pick<ProfilePageStateType, 'currentSort' | 'filters' | 'showFilters' | 'currentTopTab'>) {
    createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({isRenderReady, showFilters}),
        currentSort: currentSort[currentTopTab.value],
        sortDefinitions: profileUserNftSortDefinitions,
        defaultFilters: defaultProfileUserNftFilters,
        currentFilters: filters[currentTopTab.value],
        allEntries: entries,
        createEntryTemplateCallback: (entry: ProfileFullUserNft) => {
            if (!isRenderReady) {
                return 'loading';
            }
            return html`
                            <${EntrepotProfileCardElement}
                                ${assign(EntrepotProfileCardElement, {
                                    nft: {
                                        ...entry,
                                    },
                                })}
                            ></${EntrepotProfileCardElement}>`;
        },
    });
}
