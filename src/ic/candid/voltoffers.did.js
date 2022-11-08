export default ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const Time = IDL.Int;
  const AccountIdentifier = IDL.Text;
  const Offer = IDL.Record({
    'time' : Time,
    'volt' : IDL.Principal,
    'authId' : IDL.Nat,
    'address' : AccountIdentifier,
    'offerer' : IDL.Principal,
    'amount' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  return IDL.Service({
    'allOffers' : IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
    'backupAllOffers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIdentifier, IDL.Vec(Offer)))],
        ['query'],
      ),
    'cancelOffer' : IDL.Func([TokenIdentifier], [], []),
    'createMemo' : IDL.Func(
        [TokenIdentifier, AccountIdentifier],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'offer' : IDL.Func(
        [TokenIdentifier, IDL.Nat64, AccountIdentifier, IDL.Nat, IDL.Principal],
        [Result],
        [],
      ),
    'offered' : IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
    'offers' : IDL.Func([TokenIdentifier], [IDL.Vec(Offer)], ['query']),
    'tokenTransferNotification' : IDL.Func(
        [TokenIdentifier, User, IDL.Nat, IDL.Vec(IDL.Nat8)],
        [IDL.Opt(IDL.Nat)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };