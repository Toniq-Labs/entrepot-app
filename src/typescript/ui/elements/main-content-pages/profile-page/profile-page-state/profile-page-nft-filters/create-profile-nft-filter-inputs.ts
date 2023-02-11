import {assign, html, listen} from 'element-vir';
import {createWithFiltersInputs} from '../../../../common/with-filters/toniq-entrepot-with-filters.element';
import {ProfilePageStateType, ProfileViewStyleEnum} from '../profile-page-state';
import {createBaseProfileWithFiltersInputs} from '../create-base-profile-filters';
import {ToniqIcon, LoaderAnimated24Icon, ToniqButton} from '@toniq-labs/design-system';
import {EntrepotProfileNftCardElement} from '../../profile-nft-card-element/toniq-entrepot-profile-nft-card.element';
import {ProfileTab} from '../profile-tabs';
import {EntrepotUserAccount} from '../../../../../../data/models/user-data/account';
import {BaseNft} from '../../../../../../data/nft/base-nft';
import {ProfileCompleteNft} from './profile-nft-filters';
import {FullProfileNft} from '../../profile-page-nfts/full-profile-nft';
import {createRightSideTextTemplate} from '../../profile-page-nfts/create-right-column-template';
import {EntrepotProfileNftListItemElement} from '../../profile-nft-card-element/toniq-entrepot-profile-nft-list-item.element';

export function createProfileNftFilterInputs({
    showFilters,
    allSorts,
    allFilters,
    isRenderReady,
    entries,
    currentProfileTab,
    sellCallback,
    transferCallback,
    userAccount,
    nftClickCallback,
    viewStyle,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileCompleteNft>>;
    sellCallback: (nft: FullProfileNft) => void;
    transferCallback: (nft: FullProfileNft) => void;
    nftClickCallback: (nft: FullProfileNft) => void;
    userAccount: EntrepotUserAccount | undefined;
} & Pick<
    ProfilePageStateType,
    'allFilters' | 'showFilters' | 'currentProfileTab' | 'allSorts' | 'viewStyle'
>) {
    return createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({
            isRenderReady,
            showFilters,
            allFilters,
            currentProfileTab,
            allSorts,
        }),
        allEntries: entries,
        createEntryTemplateCallback: (entry: ProfileCompleteNft) => {
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
                sellCallback: () => {
                    sellCallback(entry);
                },
                transferCallback: () => {
                    transferCallback(entry);
                },
                currentProfileTab,
                offers: entry.offers,
                viewStyle,
                userOwns:
                    userAccount?.address != undefined &&
                    userAccount?.address === entry.ownerAddress,
            });

            if (viewStyle === ProfileViewStyleEnum.Grid) {
                return html`
                    <${EntrepotProfileNftCardElement}
                        ${assign(EntrepotProfileNftCardElement, {
                            nft: entry,
                        })}
                        ${listen('click', () => {
                            nftClickCallback(entry);
                        })}
                    >
                        ${rightSideTemplate}
                    </${EntrepotProfileNftCardElement}>
                `;
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
    sellCallback,
    transferCallback,
    currentProfileTab,
    offers,
    userOwns,
    viewStyle,
}: {
    currentProfileTab: ProfileTab;
    sellCallback: () => void;
    transferCallback: () => void;
    offers: Readonly<BaseNft['offers']>;
    userOwns: boolean;
    viewStyle: ProfileViewStyleEnum;
}) {
    if (currentProfileTab.value === 'my-nfts') {
        return html`
        <style>
            .buttons-row {
                display: flex;
                gap: 16px;
            }
        </style>
        <div class="buttons-row">
            <${ToniqButton}
                class=${ToniqButton.hostClasses.secondary}
                ${assign(ToniqButton, {
                    text: 'Sell',
                })}
                ${listen('click', sellCallback)}
            ></${ToniqButton}>
            <${ToniqButton}
                ${assign(ToniqButton, {
                    text: 'Transfer',
                })}
                ${listen('click', transferCallback)}
            ></${ToniqButton}>
        </div>
    `;
    } else {
        const plural = offers.length === 1 ? '' : 's';
        const received = userOwns ? ' Received' : '';
        const offersDisplay = `${offers.length} Offer${plural}${received}`;

        const offersIncludeCurrentUser = false;
        const includingYoursDisplay = offersIncludeCurrentUser ? 'including yours' : '';

        return createRightSideTextTemplate({
            topString: offersDisplay,
            bottomString: includingYoursDisplay,
            useNbsp: viewStyle !== ProfileViewStyleEnum.List,
        });
    }
}
