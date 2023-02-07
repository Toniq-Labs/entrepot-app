import {assign, html} from 'element-vir';
import {createWithFiltersInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileCardElement} from '../toniq-entrepot-profile-nft-card.element';
import {ProfilePageStateType} from '../profile-page-state';
import {createBaseProfileWithFiltersInputs} from '../base-profile-filters';
import {
    ProfileCompleteTransactionNft,
    profileUserTransactionSortDefinitions,
} from './transaction-profile-filters';

export function createUserTransactionFilterInputs({
    showFilters,
    currentSort,
    filters,
    isRenderReady,
    entries,
    currentProfileTab,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileCompleteTransactionNft>>;
} & Pick<ProfilePageStateType, 'currentSort' | 'filters' | 'showFilters' | 'currentProfileTab'>) {
    return createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({
            isRenderReady,
            showFilters,
            filters,
            currentProfileTab,
        }),
        currentSort: currentSort[currentProfileTab.value],
        sortDefinitions: profileUserTransactionSortDefinitions,
        allEntries: entries ? entries : [],
        createEntryTemplateCallback: (entry: ProfileCompleteTransactionNft) => {
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
