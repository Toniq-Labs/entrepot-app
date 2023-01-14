import {TemplateResult} from 'lit';
import {Overwrite} from '@augment-vir/common';
import {Promisable, SetOptional} from 'type-fest';

export type GetNftImageHtmlInputs = {
    fullSize?: boolean;
    nftId: string;
    nftIndex: number;
    priority?: number;
    /** I have no idea what this is, something to do with refresh counts. */
    ref?: number | undefined;
};

export type RawGetNftImageHtmlInputs = SetOptional<
    Required<
        GetNftImageHtmlInputs & {
            originalCanisterId: string;
            nftLinkUrl: string;
        }
    >,
    'ref'
>;

export type RawCanisterDetails = {
    collectionName: string;
    canisterId:
        | {
              extWrapped: string;
              original: string;
          }
        | string;
    /** If this isn't provided, the default method will be used. */
    getNftLinkUrl?: (
        inputs: Pick<RawGetNftImageHtmlInputs, 'originalCanisterId' | 'nftId' | 'nftIndex'>,
    ) => string | undefined;
    /** If this isn't provided, the default method will be used. */
    getNftImageHtml?: (inputs: RawGetNftImageHtmlInputs) => Promisable<TemplateResult | undefined>;
};

export type CanisterDetails = Required<
    Overwrite<
        RawCanisterDetails,
        {
            hasWrappedCanister: boolean;
            extCanisterId: string;
            getNftLinkUrl: (
                inputs: Pick<RawGetNftImageHtmlInputs, 'originalCanisterId' | 'nftId' | 'nftIndex'>,
            ) => string;
            getNftImageHtml: (inputs: GetNftImageHtmlInputs) => Promisable<TemplateResult>;
        }
    >
>;
