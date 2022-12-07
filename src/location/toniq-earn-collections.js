const toniqEarnRelatedCollectionRouteNames = ['earn-contracts'];

export function isToniqEarnCollection(collection) {
    return toniqEarnRelatedCollectionRouteNames.includes(collection.route);
}
