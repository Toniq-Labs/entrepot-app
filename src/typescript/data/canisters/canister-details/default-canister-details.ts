import {CanisterDetails} from './canister-details';

export function createDefaultCanisterDetails(canisterId: string): CanisterDetails {
    return {
        canisterId,
        collectionName: canisterId,
        extCanisterId: canisterId,
        hasWrappedCanister: false,
        getNftLinkUrl: ({nftId}) => {
            return `https://${canisterId}.raw.ic0.app/?tokenid=${nftId}`;
        },
        getNftImageHtml: ({nftId, priority = 10}) => {
            return `https://images.entrepot.app/t/${canisterId}/${nftId}?cache='${priority}`;
        },
    };
}
