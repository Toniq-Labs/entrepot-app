import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {
    FilterTypeEnum,
    FilterDefinitions,
    SortDefinition,
    BooleanFilterTypeEnum,
} from '../../../common/with-filters/filters-types';
import {ReadonlyDeep} from 'type-fest';
import {assign, html, isRenderReady, listen} from 'element-vir';
import {createWithFiltersInputs} from '../../../common/with-filters/toniq-entrepot-with-filters.element';
import {ProfilePageStateType} from '../profile-page-state';
import {BaseFullProfileEntry} from '../profile-entries/base-full-profile-entry';
import {createBaseProfileWithFiltersInputs} from '../base-profile-filters';
import {
    ToniqIcon,
    LoaderAnimated24Icon,
    ToniqButton,
    toniqFontStyles,
    toniqColors,
} from '@toniq-labs/design-system';
import {EntrepotProfileCardElement} from '../toniq-entrepot-profile-nft-card.element';
import {ProfileTab, ProfileTopTabValue} from '../profile-tabs';
import {EntrepotUserAccount} from '../../../../../data/models/user-data/account';
import {BaseNft} from '../../../../../data/nft/base-nft';

export type ProfileFullUserNft = BaseNft & BaseFullProfileEntry & {isListed: boolean};

export const defaultProfileUserNftFilters = wrapNarrowTypeWithTypeCheck<
    ReadonlyDeep<FilterDefinitions<ProfileFullUserNft>>
>()({
    'List Status': {
        filterType: FilterTypeEnum.Radio,
        radios: [
            {
                label: 'All',
                value: 'All',
                filterType: BooleanFilterTypeEnum.Everything,
            },
            {
                label: 'Listed',
                value: true,
            },
            {
                label: 'Unlisted',
                value: false,
            },
        ],
        filterField: ['isListed'],
        value: 'All',
    },
    'List Price': {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: [
            'listing',
            'price',
        ],
    },
    NRI: {
        filterType: FilterTypeEnum.NumericRange,
        currentMin: undefined,
        currentMax: undefined,
        filterField: ['nftNri'],
        factor: 100,
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
            'listing',
            'price',
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
    currentProfileTab,
    sellCallback,
    transferCallback,
    userAccount,
}: {
    isRenderReady: boolean;
    entries: ReadonlyArray<Readonly<ProfileFullUserNft>>;
    sellCallback: (nftId: string) => void;
    transferCallback: (nftId: string) => void;
    userAccount: EntrepotUserAccount | undefined;
} & Pick<ProfilePageStateType, 'currentSort' | 'filters' | 'showFilters' | 'currentProfileTab'>) {
    return createWithFiltersInputs({
        ...createBaseProfileWithFiltersInputs({isRenderReady, showFilters}),
        currentSort: currentSort[currentProfileTab.value],
        sortDefinitions: profileUserNftSortDefinitions,
        defaultFilters: defaultProfileUserNftFilters,
        currentFilters: filters[currentProfileTab.value],
        allEntries: entries,
        createEntryTemplateCallback: (entry: ProfileFullUserNft) => {
            if (!isRenderReady) {
                return html`
                    <${ToniqIcon}
                        ${assign(ToniqIcon, {
                            icon: LoaderAnimated24Icon,
                        })}
                    ></${ToniqIcon}>
                `;
            }

            console.log({entry, userAccount});

            const rightSideTemplate = createRightSideTemplate({
                sellCallback: () => {
                    sellCallback(entry.nftId);
                },
                transferCallback: () => {
                    transferCallback(entry.nftId);
                },
                currentProfileTab,
                offers: entry.offers,
                userOwns:
                    userAccount?.address != undefined &&
                    userAccount?.address === entry.ownerAddress,
            });

            return html`
                <${EntrepotProfileCardElement}
                    ${assign(EntrepotProfileCardElement, {
                        nft: {
                            ...entry,
                        },
                    })}
                >
                    ${rightSideTemplate}
                </${EntrepotProfileCardElement}>`;
        },
    });
}

function createRightSideTemplate({
    sellCallback,
    transferCallback,
    currentProfileTab,
    offers,
    userOwns,
}: {
    currentProfileTab: ProfileTab;
    sellCallback: () => void;
    transferCallback: () => void;
    offers: Readonly<BaseNft['offers']>;
    userOwns: boolean;
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
        const includingYoursDisplay = offersIncludeCurrentUser
            ? 'including yours'
            : html`
                  &nbsp
              `;

        return html`
            <style>
                .offers-column {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .offers {
                    ${toniqFontStyles.boldParagraphFont};
                }

                .including-yours {
                    ${toniqFontStyles.labelFont};
                    color: ${toniqColors.pageSecondary.foregroundColor};
                }
            </style>
            <div class="offers-column">
                <div class="offers">${offersDisplay}</div>
                <div class="including-yours">${includingYoursDisplay}</div>
            </div>
        `;
    }
}
