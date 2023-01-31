export type NftExtraData = {
    nftId: string;
    offers: unknown[];
    listing:
        | {
              price: number;
              locked: boolean | number[];
          }
        | undefined;
};
