export type RawUserNft = {
    id: string;
    canister: string;
    owner: string;
    price: number;
    time: number;
};

export type UserNft = {
    nftId: string;
    collectionId: string;
    ownerAddress: string;
    listPrice: number;
    /** I don't actually know what this time property represents, I've only ever seen it be 0. */
    time: number;
};

export function parseRawUserNft(raw: RawUserNft): UserNft {
    return {
        collectionId: raw.canister,
        listPrice: raw.price,
        nftId: raw.id,
        ownerAddress: raw.owner,
        time: raw.time,
    };
}
