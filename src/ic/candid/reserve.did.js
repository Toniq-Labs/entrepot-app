export default ({ IDL }) => {
  const Time = IDL.Int;
  const TxKind = IDL.Variant({ 'topup' : IDL.Null });
  const AccountIdentifier = IDL.Text;
  const Transaction = IDL.Record({
    'expires' : Time,
    'settled' : IDL.Bool,
    'kind' : TxKind,
    'paid' : IDL.Bool,
    'rate' : IDL.Nat64,
    'amount_icp' : IDL.Nat64,
    'address' : AccountIdentifier,
    'finalized' : IDL.Bool,
  });
  const TxResponse = IDL.Record({
    'txid' : IDL.Nat32,
    'amount_usd' : IDL.Nat64,
  });
  return IDL.Service({
    'ICPUSD' : IDL.Func([IDL.Nat64], [IDL.Nat64], ['query']),
    'adminSetRate' : IDL.Func([IDL.Nat64], [], []),
    'adminSettle' : IDL.Func(
        [IDL.Nat32, IDL.Nat64],
        [IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text })],
        [],
      ),
    'getRate' : IDL.Func([], [IDL.Nat64], ['query']),
    'getTx' : IDL.Func([IDL.Nat32], [IDL.Opt(Transaction)], ['query']),
    'topup' : IDL.Func(
        [IDL.Nat64, AccountIdentifier],
        [IDL.Variant({ 'ok' : TxResponse, 'err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };