import {ProfilePageStateType} from '../profile-page-state';
import {EntrepotUserAccount} from '../../../../../../data/models/user-data/account';
import {ProfileCompleteOffer} from './profile-offer-filters';
import {FullProfileNft} from '../../profile-page-nfts/full-profile-nft';
import {createProfileNftFilterInputs} from '../profile-page-nft-filters/create-profile-nft-filter-inputs';
import offerBlacklist from './../../../../../../../offer-blacklist.json';

export function createProfileOfferFilterInputs({
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
    entries: ReadonlyArray<Readonly<ProfileCompleteOffer>>;
    sellCallback: (nft: FullProfileNft) => void;
    transferCallback: (nft: FullProfileNft) => void;
    nftClickCallback: (nft: FullProfileNft) => void;
    userAccount: EntrepotUserAccount | undefined;
} & Pick<
    ProfilePageStateType,
    'allFilters' | 'showFilters' | 'currentProfileTab' | 'allSorts' | 'viewStyle'
>) {
    const createProfileFilterInputs = createProfileNftFilterInputs({
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
    });

    const filteredBlacklistedCanisterOffers = {
        ...createProfileFilterInputs,
        allEntries: createProfileFilterInputs.allEntries.filter(entry => {
            return !offerBlacklist.includes(entry.collectionId);
        }),
    };

    return filteredBlacklistedCanisterOffers;
}