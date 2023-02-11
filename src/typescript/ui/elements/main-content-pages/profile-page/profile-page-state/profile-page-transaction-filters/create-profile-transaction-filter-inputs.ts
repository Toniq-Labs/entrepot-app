import {assign, html, listen} from 'element-vir';
import {createWithFiltersInputs} from '../../../../common/with-filters/toniq-entrepot-with-filters.element';
import {EntrepotProfileNftCardElement} from '../../profile-nft-card-element/toniq-entrepot-profile-nft-card.element';
import {ProfilePageStateType, ProfileViewStyleEnum} from '../profile-page-state';
import {createBaseProfileWithFiltersInputs} from '../create-base-profile-filters';
import {ProfileCompleteTransactionNft} from './profile-transaction-filters';
import {
    ToniqIcon,
    LoaderAnimated24Icon,
    toniqFontStyles,
    toniqColors,
} from '@toniq-labs/design-system';
import {TransactionDirection} from '../../../../../../data/nft/user-nft-transaction';
import {FullProfileNft} from '../../profile-page-nfts/full-profile-nft';
import {getRelativeDate} from '../../../../../../augments/relative-date';
import {createRightSideTextTemplate} from '../../profile-page-nfts/create-right-column-template';
import {EntrepotProfileNftListItemElement} from '../../profile-nft-card-element/toniq-entrepot-profile-nft-list-item.element';

export function createUserTransactionFilterInputs({
    showFilters,
    allSorts,
    allFilters,
    isRenderReady,
    entries,
    currentProfileTab,
    nftClickCallback,
    viewStyle,
}: {
    isRenderReady: boolean;
    nftClickCallback: (nft: FullProfileNft) => void;
    entries: ReadonlyArray<Readonly<ProfileCompleteTransactionNft>>;
} & Pick<
    ProfilePageStateType,
    'allFilters' | 'showFilters' | 'currentProfileTab' | 'allSorts' | 'viewStyle'
>) {
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

            if (viewStyle === ProfileViewStyleEnum.Grid) {
                return html`
                <${EntrepotProfileNftCardElement}
                    ${assign(EntrepotProfileNftCardElement, {
                        nft: {
                            ...entry,
                        },
                    })}
                    ${listen('click', () => {
                        nftClickCallback(entry);
                    })}
                >
                    ${rightSideTemplate}
                </${EntrepotProfileNftCardElement}>`;
            } else {
                return html`
                    <${EntrepotProfileNftListItemElement}
                        ${assign(EntrepotProfileNftListItemElement, {
                            nft: entry,
                        })}
                        ${listen('click', () => {
                            nftClickCallback(entry);
                        })}
                    >
                        ${rightSideTemplate}
                    </${EntrepotProfileNftListItemElement}>
                `;
            }
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
        useNbsp: true,
    });
}
