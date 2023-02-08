import {assign, html, listen} from 'element-vir';
import {createWithFiltersInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileCardElement} from '../toniq-entrepot-profile-nft-card.element';
import {ProfilePageStateType} from '../profile-page-state';
import {createBaseProfileWithFiltersInputs} from '../base-profile-filters';
import {ProfileCompleteTransactionNft} from './transaction-profile-filters';
import {
    ToniqIcon,
    LoaderAnimated24Icon,
    toniqFontStyles,
    toniqColors,
} from '@toniq-labs/design-system';
import {TransactionDirection} from '../../../../../data/nft/user-nft-transaction';
import {FullProfileNft} from '../profile-nfts/full-profile-nft';
import {getRelativeDate} from '../../../../../augments/relative-date';
import {createRightSideTextTemplate} from '../profile-nfts/create-right-column-template';

export function createUserTransactionFilterInputs({
    showFilters,
    allSorts,
    allFilters,
    isRenderReady,
    entries,
    currentProfileTab,
    nftClickCallback,
}: {
    isRenderReady: boolean;
    nftClickCallback: (nft: FullProfileNft) => void;
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
                return html`
                    <${ToniqIcon}
                        ${assign(ToniqIcon, {
                            icon: LoaderAnimated24Icon,
                        })}
                    ></${ToniqIcon}>
                `;
            }

            const rightSideTemplate = createRightSideTemplate({
                timestampMilliseconds: entry.transactionTimeMillisecond,
                direction: entry.directionForCurrentUser,
            });

            return html`
                <${EntrepotProfileCardElement}
                    ${assign(EntrepotProfileCardElement, {
                        nft: {
                            ...entry,
                        },
                    })}
                    ${listen('click', () => {
                        nftClickCallback(entry);
                    })}
                >
                    ${rightSideTemplate}
                </${EntrepotProfileCardElement}>`;
        },
    });
}

function createRightSideTemplate({
    timestampMilliseconds,
    direction,
}: {
    timestampMilliseconds: number;
    direction: TransactionDirection;
}) {
    const directionDisplayString = direction === TransactionDirection.Purchase ? 'Bought' : 'Sold';
    const relativeDateDisplayString = getRelativeDate(timestampMilliseconds);

    return createRightSideTextTemplate({
        topString: relativeDateDisplayString,
        bottomString: directionDisplayString,
    });
}
