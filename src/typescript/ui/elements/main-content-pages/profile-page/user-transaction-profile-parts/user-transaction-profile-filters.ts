import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    CurrentSort,
    BooleanFilterTypeEnum,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {assign, html, isRenderReady} from 'element-vir';
import {createWithFiltersInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileCardElement} from '../toniq-entrepot-profile-nft-card.element';
import {TransactionDirection} from '../../../../../data/local-cache/caches/user-data/user-transactions-cache';
import {ProfilePageStateType} from '../entrepot-profile-page-state';
import {createBaseProfileWithFiltersInputs} from '../base-profile-filters';
import {UserTransactionWithDirection} from '../../../../../data/nft/user-nft-transaction';
import {BaseFullProfileEntry} from '../profile-entries/base-full-profile-entry';

export type ProfileFullUserTransaction = UserTransactionWithDirection & BaseFullProfileEntry;

const defaultProfileUserTransactionFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileFullUserTransaction>>
>()({
    Listed: {
        filterType: FilterTypeEnum.Radio,
        radios: [
            {
                label: 'All',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Purchases',
                value: TransactionDirection.Purchase,
            },
            {
                label: 'Sales',
                value: TransactionDirection.Sale,
            },
        ],
        filterField: ['directionForCurrentUser'],
        value: 'All',
    },
} as const);

const profileUserTransactionSortDefinitions = wrapNarrowTypeWithTypeCheck<
    ReadonlyArray<ReadonlyDeep<SortDefinition<ProfileFullUserTransaction>>>
>()([
    {
        sortName: 'Time',
        sortField: [
            'timestampMillisecond',
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

export function createUserTransactionFilterInputs({
    showFilters,
    currentSort,
    filters,
    isRenderReady,
    entries,
    currentProfileTab,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileFullUserTransaction>>;
} & Pick<ProfilePageStateType, 'currentSort' | 'filters' | 'showFilters' | 'currentProfileTab'>) {
    return createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({isRenderReady, showFilters}),
        currentSort: currentSort[currentProfileTab.value],
        sortDefinitions: profileUserTransactionSortDefinitions,
        defaultFilters: defaultProfileUserTransactionFilters,
        currentFilters: filters[currentProfileTab.value],
        allEntries: entries ? entries : [],
        createEntryTemplateCallback: (entry: ProfileFullUserTransaction) => {
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
