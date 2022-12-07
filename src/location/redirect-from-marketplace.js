import {isToniqEarnCollection} from './toniq-earn-collections';
export function redirectIfBlockedFromEarnFeatures(navigate, collection, props) {
    if (isToniqEarnCollection(collection) && !props.isToniqEarnAllowed) {
        navigate('/earn');
    }
}
