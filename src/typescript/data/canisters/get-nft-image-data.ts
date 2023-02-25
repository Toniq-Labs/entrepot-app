import type {TemplateResult} from 'lit';
import type {Dimensions} from '@electrovir/resizable-image-element';
import {getCanisterDetails} from './canister-details/all-canister-details';
import {treasureCanisterId} from './treasure-canister';

export type NftImageInputs = {
    collectionId: string;
    fullSize: boolean;
    nftId: string;
    nftIndex: number;
    cachePriority: number;
    ref: number;
};

export type NftImageDisplayData = {
    url: string;
    extraHtml?: string | undefined | TemplateResult;
    forcedOriginalImageSize?: Dimensions | undefined;
    htmlSizeQuerySelector?: string | undefined;
};

export async function getNftImageData({
    collectionId,
    fullSize,
    nftId,
    nftIndex,
    cachePriority,
    ref,
}: NftImageInputs): Promise<NftImageDisplayData> {
    if (collectionId === treasureCanisterId) {
        if (!fullSize) {
            return {url: '/earn/loading.png'};
        }
    }

    const collectionCanisterDetails = getCanisterDetails(collectionId);

    return await collectionCanisterDetails.getNftImageData({
        fullSize,
        nftId,
        nftIndex,
        priority: Number(cachePriority) || 0,
        ref: Number(ref) || 0,
    });
}
