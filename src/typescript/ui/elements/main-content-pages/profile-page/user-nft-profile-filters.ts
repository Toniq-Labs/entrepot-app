import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {NftExtraData} from '../../../../data/nft/nft-extra-data';
import {UserNft} from '../../../../data/nft/user-nft';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    CurrentSort,
    BooleanFilterTypeEnum,
} from '../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {assign, html, isRenderReady} from 'element-vir';
import {createWithFiltersInputs} from '../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileCardElement} from './toniq-entrepot-profile-nft-card.element';
import {UserNftTransaction} from '../../../../data/nft/user-nft-transaction';

export type ProfileUserNft = UserNft &
    NftExtraData & {nftNri: number | undefined} & {isListed: boolean};

export const defaultProfileFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileUserNft>>
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
    ReadonlyArray<ReadonlyDeep<SortDefinition<ProfileUserNft>>>
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

export function createUserNftFilterInputs(
    showFilters: boolean,
    currentSort: ReadonlyDeep<CurrentSort>,
    currentFilters: typeof defaultProfileFilters,
    isRenderReady: boolean,
    entries: ReadonlyArray<ProfileUserNft>,
) {
    createWithFiltersInputs({
        countName: 'NFTs',
        showFilters,
        currentSort,
        sortDefinitions: profileUserNftSortDefinitions,
        defaultFilters: defaultProfileFilters,
        currentFilters,
        isLoading: !isRenderReady,
        allEntries: entries ? entries : [],
        searchPlaceholder: 'Search: Collection Name or Keywords',
        searchCallback: (searchTerm, collection) => {
            return true;
            // const allSearchAreas = [
            //     collection.name,
            //     collection.keywords,
            //     collection.route,
            //     collection.id,
            // ].join(' ');
            // return allSearchAreas.toLowerCase().includes(searchTerm.toLowerCase());
        },
        createEntryTemplateCallback: (entry: ProfileUserNft) => {
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
