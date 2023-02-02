import {ensureType, mapObjectValues} from '@augment-vir/common';
import {TopTab} from '../../common/toniq-entrepot-top-tabs.element';

const profileTabValueToLabelMap = {
    'my-nfts': 'My NFTs',
    favorites: 'Favorites',
    offers: 'Offers',
    activity: 'Activity',
    earn: 'Earn',
} as const;

export type ProfileTopTabValue = keyof typeof profileTabValueToLabelMap;

export const profileTabMap = mapObjectValues(
    profileTabValueToLabelMap,
    (value, label): TopTab<ProfileTopTabValue> => {
        return {
            value,
            label,
        };
    },
) as {[TabValue in ProfileTopTabValue]: TopTab<TabValue>};

const profileTabArray = Object.values(profileTabMap) as ReadonlyArray<TopTab<ProfileTopTabValue>>;

export type ProfileTab = TopTab<ProfileTopTabValue>;

export function getAllowedTabs({isToniqEarnAllowed}: {isToniqEarnAllowed: boolean}) {
    return profileTabArray.filter(profileTab => {
        if (isToniqEarnAllowed) {
            return profileTab;
        } else {
            return true;
        }
    });
}
