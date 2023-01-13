import {Overwrite} from '@augment-vir/common';
import {Promisable} from 'type-fest';

export type GetNftImageHtmlInputs = {
    /** I have no idea what this is, something to do with refresh counts. */
    ref?: number | undefined;
    nftIndex: number;
    nftId: string;
    fullSize?: boolean;
    priority?: number;
};

export type RawGetNftImageHtmlInputs = Required<
    GetNftImageHtmlInputs & {
        originalCanisterId: string;
        nftLinkUrl: string;
    }
>;

export type RawCanisterDetails = {
    collectionName: string;
    canisterId:
        | {
              extWrapped: string;
              original: string;
          }
        | string;
    getNftLinkUrl: (
        inputs: Pick<RawGetNftImageHtmlInputs, 'originalCanisterId' | 'nftId' | 'nftIndex'>,
    ) => string;
    getNftImageHtml: (inputs: RawGetNftImageHtmlInputs) => Promisable<string>;
};

export type CanisterDetails = Overwrite<
    RawCanisterDetails,
    {
        hasWrappedCanister: boolean;
        extCanisterId: string;
        getNftImageHtml: (inputs: GetNftImageHtmlInputs) => Promisable<string>;
    }
>;
