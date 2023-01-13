export default ({IDL}) => {
    const definite_canister_settings = IDL.Record({
        freezing_threshold: IDL.Nat,
        controllers: IDL.Vec(IDL.Principal),
        memory_allocation: IDL.Nat,
        compute_allocation: IDL.Nat,
    });
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
        volt: IDL.Principal,
        binding: IDL.Bool,
        receiver: IDL.Principal,
    });
    const canister_id = IDL.Principal;
    const AccountIdentifier = IDL.Text;
    const SubAccount = IDL.Vec(IDL.Nat8);
    const ICPTs = IDL.Record({e8s: IDL.Nat64});
    const TransactionNotification = IDL.Record({
        to: IDL.Principal,
        to_subaccount: IDL.Opt(SubAccount),
        from: IDL.Principal,
        memo: IDL.Nat64,
        from_subaccount: IDL.Opt(SubAccount),
        amount: ICPTs,
        block_height: IDL.Nat64,
    });
    const Result_2 = IDL.Variant({ok: Authorization, err: IDL.Text});
    const Result_1 = IDL.Variant({ok: IDL.Nat, err: IDL.Text});
    const Result = IDL.Variant({ok: IDL.Null, err: IDL.Text});
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
    return IDL.Service({
        acceptCycles: IDL.Func([], [], []),
        admin_addPromos: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
        admin_addVersion: IDL.Func(
            [
                IDL.Nat,
                IDL.Vec(IDL.Nat8),
            ],
            [],
            [],
        ),
        admin_canisterStart: IDL.Func([IDL.Principal], [], []),
        admin_canisterStatus: IDL.Func(
            [IDL.Principal],
            [
                IDL.Record({
                    status: IDL.Variant({
                        stopped: IDL.Null,
                        stopping: IDL.Null,
                        running: IDL.Null,
                    }),
                    memory_size: IDL.Nat,
                    cycles: IDL.Nat,
                    settings: definite_canister_settings,
                    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
                }),
            ],
            [],
        ),
        admin_getBackup: IDL.Func(
            [],
            [
                IDL.Record({
                    owners: IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal)),
                    authorizations: IDL.Vec(IDL.Tuple(IDL.Nat, Authorization)),
                }),
            ],
            ['query'],
        ),
        admin_removeOwnerCanister: IDL.Func([IDL.Principal], [], []),
        admin_update: IDL.Func([canister_id], [IDL.Bool], []),
        admin_updateAll: IDL.Func([], [IDL.Bool], []),
        availableCycles: IDL.Func([], [IDL.Nat], ['query']),
        create: IDL.Func([], [IDL.Opt(IDL.Principal)], []),
        getAuthorization: IDL.Func([IDL.Nat], [IDL.Opt(Authorization)], ['query']),
        getAuthorizationBalances: IDL.Func(
            [canister_id],
            [
                IDL.Nat,
                IDL.Nat,
            ],
            ['query'],
        ),
        getAuthorizations: IDL.Func(
            [canister_id],
            [IDL.Vec(IDL.Tuple(IDL.Nat, Authorization))],
            ['query'],
        ),
        getCanisters: IDL.Func([], [IDL.Vec(canister_id)], ['query']),
        getLatestVersion: IDL.Func([], [IDL.Nat], ['query']),
        getLatestWasm: IDL.Func(
            [],
            [
                IDL.Nat,
                IDL.Vec(IDL.Nat8),
            ],
            ['query'],
        ),
        getOwnerCanister: IDL.Func([IDL.Principal], [IDL.Opt(canister_id)], ['query']),
        getPaymentAddress: IDL.Func([IDL.Principal], [AccountIdentifier], ['query']),
        getPromoList: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        hasFreeCanister: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
        hasOwnerCanister: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
        heartbeat_external: IDL.Func([], [], []),
        heartbeat_isRunning: IDL.Func([], [IDL.Bool], ['query']),
        heartbeat_pending: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ['query']),
        heartbeat_start: IDL.Func([], [], []),
        heartbeat_stop: IDL.Func([], [], []),
        heartbeat_upgrades: IDL.Func([], [], []),
        isCanister: IDL.Func([canister_id], [IDL.Bool], ['query']),
        paymentDetails: IDL.Func(
            [],
            [
                AccountIdentifier,
                IDL.Nat64,
            ],
            ['query'],
        ),
        transaction_notification: IDL.Func(
            [TransactionNotification],
            [IDL.Variant({Ok: IDL.Null, Err: IDL.Text})],
            [],
        ),
        volt_authorization: IDL.Func([IDL.Nat], [Result_2], []),
        volt_authorize: IDL.Func([Authorization], [Result_1], []),
        volt_cancel: IDL.Func([IDL.Nat], [Result], []),
        volt_transfer: IDL.Func([TransferRequest], [Result], []),
        volt_upgrade: IDL.Func([IDL.Nat], [], []),
    });
};
export const init = ({IDL}) => {
    return [];
};
