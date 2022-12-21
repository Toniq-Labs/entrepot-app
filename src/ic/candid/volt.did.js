export default ({IDL}) => {
    const TransferRequest = IDL.Record({
        id: IDL.Opt(IDL.Nat),
        to: IDL.Text,
        notify: IDL.Opt(IDL.Bool),
        other: IDL.Opt(IDL.Vec(IDL.Nat8)),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        canister: IDL.Text,
        amount: IDL.Nat,
        standard: IDL.Text,
    });
    const Result_3 = IDL.Variant({ok: IDL.Nat, err: IDL.Text});
    const Result_2 = IDL.Variant({ok: IDL.Null, err: IDL.Text});
    const AccountIdentifier = IDL.Text;
    const TransferResponse = IDL.Record({
        data: IDL.Opt(IDL.Vec(IDL.Nat8)),
        error: IDL.Opt(IDL.Text),
        success: IDL.Bool,
    });
    const Result = IDL.Variant({ok: TransferResponse, err: IDL.Text});
    const TransferRequest__1 = IDL.Record({
        id: IDL.Opt(IDL.Nat),
        to: IDL.Text,
        notify: IDL.Opt(IDL.Bool),
        other: IDL.Opt(IDL.Vec(IDL.Nat8)),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        canister: IDL.Text,
        amount: IDL.Nat,
        standard: IDL.Text,
    });
    const Authorization = IDL.Record({
        request: TransferRequest__1,
        binding: IDL.Bool,
        receiver: IDL.Principal,
    });
    const Result_1 = IDL.Variant({
        ok: IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Nat),
        err: IDL.Text,
    });
    return IDL.Service({
        acceptCycles: IDL.Func([], [], []),
        authorize: IDL.Func(
            [
                TransferRequest,
                IDL.Bool,
                IDL.Principal,
            ],
            [Result_3],
            [],
        ),
        availableCycles: IDL.Func([], [IDL.Nat], ['query']),
        cancel: IDL.Func([IDL.Nat], [Result_2], []),
        capture: IDL.Func(
            [
                IDL.Nat,
                IDL.Opt(AccountIdentifier),
                IDL.Opt(IDL.Nat),
            ],
            [Result],
            [],
        ),
        getAddress: IDL.Func([], [AccountIdentifier], ['query']),
        getAuthorization: IDL.Func([IDL.Nat], [IDL.Opt(Authorization)], ['query']),
        getAuthorizationBalances: IDL.Func(
            [
                IDL.Text,
                IDL.Text,
                IDL.Opt(IDL.Nat),
            ],
            [
                IDL.Nat,
                IDL.Nat,
            ],
            ['query'],
        ),
        getAvailableTranslations: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        getBalances: IDL.Func(
            [
                IDL.Text,
                IDL.Text,
                IDL.Opt(IDL.Nat),
            ],
            [Result_1],
            [],
        ),
        getOwner: IDL.Func([], [IDL.Principal], ['query']),
        getVersion: IDL.Func([], [IDL.Nat], ['query']),
        proxy: IDL.Func(
            [
                IDL.Principal,
                IDL.Text,
                IDL.Vec(IDL.Nat8),
            ],
            [IDL.Vec(IDL.Nat8)],
            [],
        ),
        proxyWithCycles: IDL.Func(
            [
                IDL.Principal,
                IDL.Text,
                IDL.Vec(IDL.Nat8),
                IDL.Nat,
            ],
            [IDL.Vec(IDL.Nat8)],
            [],
        ),
        transfer: IDL.Func([TransferRequest], [Result], []),
        upgrade: IDL.Func([], [], []),
    });
};
export const init = ({IDL}) => {
    return [];
};
