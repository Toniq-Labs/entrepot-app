import {createQueryParamString} from '../augments/url';

export function formEntrepotImagesUrl({
    entrepotImagesCanisterId,
    nftId,
    cachePriority,
    useCacheBuster,
}: {
    entrepotImagesCanisterId: string;
    nftId: string;
    cachePriority?: number | undefined;
    /** If enabled, images will not be cached */
    useCacheBuster?: boolean | undefined;
}) {
    const searchString = createQueryParamString({
        cache: cachePriority,
        cachebuster: useCacheBuster ? (Math.random() + 1).toString(36).substring(7) : undefined,
    });

    return (
        [
            'https://images.entrepot.app/t',
            entrepotImagesCanisterId,
            nftId,
        ].join('/') + searchString
    );
}

export function formEntrepotTncImagesUrl({
    canisterId,
    nftId,
    ref,
}: {
    canisterId: string;
    nftId: string;
    ref: number | undefined;
}) {
    const searchString = createQueryParamString({}, [ref]);

    return (
        [
            'https://images.entrepot.app/tnc',
            canisterId,
            nftId,
        ].join('/') + searchString
    );
}
