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
    allSorts,
    allFilters,
    isRenderReady,
    entries,
    currentProfileTab,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileCompleteTransactionNft>>;
} & Pick<ProfilePageStateType, 'allFilters' | 'showFilters' | 'currentProfileTab' | 'allSorts'>) {
    return createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({
            isRenderReady,
            showFilters,
            allFilters,
            allSorts,
            currentProfileTab,
        }),
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
