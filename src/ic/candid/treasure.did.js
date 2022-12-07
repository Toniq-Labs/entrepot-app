export default ({IDL}) => {
    const SubAccount = IDL.Vec(IDL.Nat8);
    const TokenIndex = IDL.Nat32;
    const AccountIdentifier = IDL.Text;
    const Settlement = IDL.Record({
        subaccount: SubAccount,
        seller: IDL.Principal,
        buyer: AccountIdentifier,
        price: IDL.Nat64,
    });
    const TokenIdentifier = IDL.Text;
    const AccountIdentifier__1 = IDL.Text;
    const User = IDL.Variant({
        principal: IDL.Principal,
        address: AccountIdentifier__1,
    });
    const BalanceRequest = IDL.Record({
        token: TokenIdentifier,
        user: User,
    });
    const Balance = IDL.Nat;
    const CommonError__1 = IDL.Variant({
        InvalidToken: TokenIdentifier,
        Other: IDL.Text,
    });
    const BalanceResponse = IDL.Variant({
        ok: Balance,
        err: CommonError__1,
    });
    const TokenIdentifier__1 = IDL.Text;
    const CommonError = IDL.Variant({
        InvalidToken: TokenIdentifier,
        Other: IDL.Text,
    });
    const Result_8 = IDL.Variant({
        ok: AccountIdentifier,
        err: CommonError,
    });
    const Time = IDL.Int;
    const Listing = IDL.Record({
        locked: IDL.Opt(Time),
        seller: IDL.Principal,
        price: IDL.Nat64,
    });
    const Result_9 = IDL.Variant({
        ok: IDL.Tuple(AccountIdentifier, IDL.Opt(Listing)),
        err: CommonError,
    });
    const Extension = IDL.Text;
    const Metadata = IDL.Variant({
        fungible: IDL.Record({
            decimals: IDL.Nat8,
            metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
            name: IDL.Text,
            symbol: IDL.Text,
        }),
        nonfungible: IDL.Record({metadata: IDL.Opt(IDL.Vec(IDL.Nat8))}),
    });
    const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
    const HttpRequest = IDL.Record({
        url: IDL.Text,
        method: IDL.Text,
        body: IDL.Vec(IDL.Nat8),
        headers: IDL.Vec(HeaderField),
    });
    const HttpStreamingCallbackToken = IDL.Record({
        key: IDL.Text,
        sha256: IDL.Opt(IDL.Vec(IDL.Nat8)),
        index: IDL.Nat,
        content_encoding: IDL.Text,
    });
    const HttpStreamingCallbackResponse = IDL.Record({
        token: IDL.Opt(HttpStreamingCallbackToken),
        body: IDL.Vec(IDL.Nat8),
    });
    const HttpStreamingStrategy = IDL.Variant({
        Callback: IDL.Record({
            token: HttpStreamingCallbackToken,
            callback: IDL.Func(
                [HttpStreamingCallbackToken],
                [HttpStreamingCallbackResponse],
                ['query'],
            ),
        }),
    });
    const HttpResponse = IDL.Record({
        body: IDL.Vec(IDL.Nat8),
        headers: IDL.Vec(HeaderField),
        streaming_strategy: IDL.Opt(HttpStreamingStrategy),
        status_code: IDL.Nat16,
    });
    const ListRequest = IDL.Record({
        token: TokenIdentifier__1,
        from_subaccount: IDL.Opt(SubAccount),
        price: IDL.Opt(IDL.Nat64),
    });
    const Result_6 = IDL.Variant({ok: IDL.Null, err: CommonError});
    const Result_7 = IDL.Variant({ok: Metadata, err: CommonError});
    const Balance__1 = IDL.Nat;
    const Result_5 = IDL.Variant({ok: Balance__1, err: CommonError});
    const User__1 = IDL.Variant({
        principal: IDL.Principal,
        address: AccountIdentifier__1,
    });
    const Memo__1 = IDL.Vec(IDL.Nat8);
    const Result_4 = IDL.Variant({
        ok: IDL.Vec(TokenIndex),
        err: CommonError,
    });
    const Result_3 = IDL.Variant({
        ok: IDL.Vec(IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))),
        err: CommonError,
    });
    const Result = IDL.Variant({ok: IDL.Null, err: IDL.Text});
    const Result_2 = IDL.Variant({ok: IDL.Text, err: IDL.Text});
    const Result_1 = IDL.Variant({ok: AccountIdentifier, err: IDL.Text});
    const TPRequest = IDL.Record({
        repaid: IDL.Bool,
        reward: IDL.Nat64,
        tokenid: TokenIdentifier__1,
        date: Time,
        fees: IDL.Tuple(IDL.Nat64, IDL.Nat64),
        live: IDL.Bool,
        user: IDL.Principal,
        subaccount: SubAccount,
        locked: IDL.Opt(Time),
        repayment: IDL.Opt(AccountIdentifier),
        filled: IDL.Opt(Time),
        lender: IDL.Opt(AccountIdentifier),
        length: Time,
        amount: IDL.Nat64,
        payment: IDL.Opt(AccountIdentifier),
        defaulted: IDL.Bool,
    });
    const Transaction = IDL.Record({
        token: TokenIdentifier__1,
        time: Time,
        seller: IDL.Principal,
        buyer: AccountIdentifier,
        price: IDL.Nat64,
    });
    const Memo = IDL.Vec(IDL.Nat8);
    const SubAccount__1 = IDL.Vec(IDL.Nat8);
    const TransferRequest = IDL.Record({
        to: User,
        token: TokenIdentifier,
        notify: IDL.Bool,
        from: User,
        memo: Memo,
        subaccount: IDL.Opt(SubAccount__1),
        amount: Balance,
    });
    const TransferResponse = IDL.Variant({
        ok: Balance,
        err: IDL.Variant({
            CannotNotify: AccountIdentifier__1,
            InsufficientBalance: IDL.Null,
            InvalidToken: TokenIdentifier,
            Rejected: IDL.Null,
            Unauthorized: AccountIdentifier__1,
            Other: IDL.Text,
        }),
    });
    const Treasure = IDL.Service({
        acceptCycles: IDL.Func([], [], []),
        adminKillHeartbeat: IDL.Func([], [], []),
        adminStartHeartbeat: IDL.Func([], [], []),
        allPayments: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(SubAccount)))],
            ['query'],
        ),
        allSettlements: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, Settlement))], ['query']),
        availableCycles: IDL.Func([], [IDL.Nat], ['query']),
        balance: IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
        bearer: IDL.Func([TokenIdentifier__1], [Result_8], ['query']),
        clearPayments: IDL.Func(
            [
                IDL.Principal,
                IDL.Vec(SubAccount),
            ],
            [],
            [],
        ),
        cronCapEvents: IDL.Func([], [], []),
        cronDisbursements: IDL.Func([], [], []),
        cronSettlements: IDL.Func([], [], []),
        details: IDL.Func([TokenIdentifier__1], [Result_9], ['query']),
        extensions: IDL.Func([], [IDL.Vec(Extension)], ['query']),
        getMinter: IDL.Func([], [IDL.Principal], ['query']),
        getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier))], ['query']),
        getTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, Metadata))], ['query']),
        historicExport: IDL.Func([], [IDL.Bool], []),
        http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
        initCap: IDL.Func([], [], []),
        isHeartbeatRunning: IDL.Func([], [IDL.Bool], ['query']),
        list: IDL.Func([ListRequest], [Result_6], []),
        listings: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, Listing, Metadata))], ['query']),
        lock: IDL.Func(
            [
                TokenIdentifier__1,
                IDL.Nat64,
                AccountIdentifier,
                SubAccount,
            ],
            [Result_8],
            [],
        ),
        metadata: IDL.Func([TokenIdentifier__1], [Result_7], ['query']),
        payments: IDL.Func([], [IDL.Opt(IDL.Vec(SubAccount))], ['query']),
        pendingCronJobs: IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
        setMinter: IDL.Func([IDL.Principal], [], []),
        settle: IDL.Func([TokenIdentifier__1], [Result_6], []),
        settlements: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier, IDL.Nat64))],
            ['query'],
        ),
        stats: IDL.Func(
            [],
            [
                IDL.Nat64,
                IDL.Nat64,
                IDL.Nat64,
                IDL.Nat64,
                IDL.Nat,
                IDL.Nat,
                IDL.Nat,
            ],
            ['query'],
        ),
        supply: IDL.Func([TokenIdentifier__1], [Result_5], ['query']),
        tokenTransferNotification: IDL.Func(
            [
                TokenIdentifier__1,
                User__1,
                Balance__1,
                Memo__1,
            ],
            [IDL.Opt(Balance__1)],
            [],
        ),
        tokens: IDL.Func([AccountIdentifier], [Result_4], ['query']),
        tokens_ext: IDL.Func([AccountIdentifier], [Result_3], ['query']),
        tp_cancel: IDL.Func([TokenIdentifier__1], [Result], []),
        tp_clear: IDL.Func([], [], []),
        tp_close: IDL.Func([TokenIndex], [Result_2], []),
        tp_create: IDL.Func(
            [
                TokenIdentifier__1,
                SubAccount,
                IDL.Nat64,
                Time,
                IDL.Nat64,
                IDL.Nat64,
                IDL.Nat64,
            ],
            [Result_1],
            [],
        ),
        tp_fill: IDL.Func(
            [
                TokenIdentifier__1,
                AccountIdentifier,
                IDL.Nat64,
            ],
            [Result_1],
            [],
        ),
        tp_loanDetails: IDL.Func([TokenIdentifier__1], [IDL.Opt(TPRequest)], ['query']),
        tp_loans: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, TPRequest))], ['query']),
        tp_loansActive: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, TPRequest))], ['query']),
        tp_loansByAddress: IDL.Func(
            [AccountIdentifier],
            [IDL.Vec(IDL.Tuple(TokenIndex, TPRequest))],
            ['query'],
        ),
        tp_requests: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIdentifier__1, TPRequest))], ['query']),
        tp_requestsAll: IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(TokenIdentifier__1, TPRequest))],
            ['query'],
        ),
        tp_requestsByAddress: IDL.Func(
            [AccountIdentifier],
            [IDL.Vec(IDL.Tuple(TokenIdentifier__1, TPRequest))],
            ['query'],
        ),
        tp_settle: IDL.Func([AccountIdentifier], [Result], []),
        tp_test: IDL.Func([], [], []),
        tp_tokenOwner: IDL.Func([TokenIdentifier__1], [IDL.Opt(AccountIdentifier)], []),
        tp_whitelistCanister: IDL.Func([IDL.Text], [], []),
        tp_whitelisted: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        transactions: IDL.Func([], [IDL.Vec(Transaction)], ['query']),
        transfer: IDL.Func([TransferRequest], [TransferResponse], []),
        viewDisbursements: IDL.Func(
            [],
            [
                IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier, SubAccount, IDL.Nat64)),
            ],
            ['query'],
        ),
    });
    return Treasure;
};
export const init = ({IDL}) => {
    return [];
};
