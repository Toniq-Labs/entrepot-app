export default ({IDL}) => {
    const PricingGroups = IDL.Record({
        end: IDL.Nat64,
        name: IDL.Text,
        public: IDL.Bool,
        limit: IDL.Tuple(IDL.Nat64, IDL.Nat64),
        pricing: IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64)),
        start: IDL.Nat64,
    });
    const LaunchInfo = IDL.Record({
        id: IDL.Text,
        end: IDL.Nat64,
        groups: IDL.Vec(PricingGroups),
        start: IDL.Nat64,
        quantity: IDL.Nat64,
        remaining: IDL.Nat64,
    });
    const FunctionCallResult = IDL.Variant({ok: IDL.Text, err: IDL.Text});
    const SendCyclesResult = IDL.Variant({ok: IDL.Nat64, err: IDL.Text});
    return IDL.Service({
        get_all_launch_settings: IDL.Func([], [IDL.Vec(LaunchInfo)], ['query']),
        get_cycles: IDL.Func([], [IDL.Nat64], ['query']),
        reset_and_update_launch_cache: IDL.Func([IDL.Vec(LaunchInfo)], [FunctionCallResult], []),
        send_cycles: IDL.Func([IDL.Nat64], [SendCyclesResult], []),
    });
};
export const init = ({IDL}) => {
    return [];
};
