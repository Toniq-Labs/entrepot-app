export default ({IDL}) => {
    const AccountIdentifier = IDL.Text;
    const TokenIdentifier = IDL.Text;
    const Time = IDL.Int;
    const SubAccount = IDL.Vec(IDL.Nat8);
    const Settlement = IDL.Record({
        tokenid: TokenIdentifier,
        subaccount: SubAccount,
        seller: AccountIdentifier,
        buyer: AccountIdentifier,
        amount: IDL.Nat64,
    });
    const AuctionBid = IDL.Record({
        time: Time,
        volt: IDL.Principal,
        authId: IDL.Nat,
        address: AccountIdentifier,
        amount: IDL.Nat64,
    });
    const Auction = IDL.Record({
        end: Time,
        bids: IDL.Vec(AuctionBid),
        reserve: IDL.Nat64,
        seller: AccountIdentifier,
        authId: IDL.Nat,
    });
    const Result = IDL.Variant({ok: IDL.Null, err: IDL.Text});
    return IDL.Service({
        address: IDL.Func([], [AccountIdentifier], ['query']),
        admin_addAuction: IDL.Func(
            [
                TokenIdentifier,
                Time,
                AccountIdentifier,
                IDL.Nat64,
            ],
            [IDL.Bool],
            [],
        ),
        admin_cancelAuction: IDL.Func([TokenIdentifier], [IDL.Bool], []),
        allAuctions: IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
        allSettlements: IDL.Func([], [IDL.Vec(Settlement)], ['query']),
        auction: IDL.Func([TokenIdentifier], [IDL.Opt(Auction)], ['query']),
        auctions: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIdentifier, Auction))], ['query']),
        backup: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIdentifier, Auction))], ['query']),
        bid: IDL.Func(
            [
                TokenIdentifier,
                IDL.Nat64,
                AccountIdentifier,
                IDL.Nat,
                IDL.Principal,
            ],
            [Result],
            [],
        ),
        bids: IDL.Func([AccountIdentifier], [IDL.Vec(TokenIdentifier)], ['query']),
        createMemo: IDL.Func(
            [
                TokenIdentifier,
                AccountIdentifier,
            ],
            [IDL.Vec(IDL.Nat8)],
            ['query'],
        ),
        heartbeat_auctions: IDL.Func([], [], []),
        heartbeat_external: IDL.Func([], [], []),
        heartbeat_isRunning: IDL.Func([], [IDL.Bool], ['query']),
        heartbeat_pending: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ['query']),
        heartbeat_settlements: IDL.Func([], [], []),
        heartbeat_start: IDL.Func([], [], []),
        heartbeat_stop: IDL.Func([], [], []),
    });
};
export const init = ({IDL}) => {
    return [];
};
