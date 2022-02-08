export default ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const Time = IDL.Int;
  const entrepot = IDL.Service({
    'cancelOffer' : IDL.Func([TokenIdentifier], [], []),
    'like' : IDL.Func([TokenIdentifier], [IDL.Nat], []),
    'liked' : IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
    'likes' : IDL.Func([TokenIdentifier], [IDL.Nat], ['query']),
    'offer' : IDL.Func([TokenIdentifier, IDL.Nat64, IDL.Text], [], []),
    'offered' : IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
    'offers' : IDL.Func(
        [TokenIdentifier],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat64, Time, IDL.Text))],
        ['query'],
      ),
    'unlike' : IDL.Func([TokenIdentifier], [IDL.Nat], []),
  });
  return entrepot;
};
export const init = ({ IDL }) => { return []; };
