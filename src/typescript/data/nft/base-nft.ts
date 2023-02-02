import {CanisterId} from '../models/canister-id';

export type BaseNft = {
    nftId: string;
    nftIndex: number;
    nftMintNumber: number;
    collectionId: CanisterId;
    listPrice: number;
};
