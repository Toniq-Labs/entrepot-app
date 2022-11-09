import extjs from './ic/extjs.js';
const api = extjs.connect('https://ic0.app/');

export async function loadVoltBalance({
  account,
  identity,
  voltPrincipal,
  refreshVolt,
  setVoltPrincipal,
  setVoltAddress,
  setVoltBalances,
}) {
  let newVoltPrincipal = false;
  const voltFactoryAPI = extjs
    .connect('https://ic0.app/', identity)
    .canister('flvm3-zaaaa-aaaak-qazaq-cai');
  if (voltPrincipal == false || refreshVolt) {
    const volt = await voltFactoryAPI.getOwnerCanister(identity.getPrincipal());
    if (volt.length) {
      newVoltPrincipal = volt[0].toText();
      setVoltPrincipal(newVoltPrincipal);
      setVoltAddress(extjs.toAddress(newVoltPrincipal, 0));
    }
  }
  if (newVoltPrincipal || voltPrincipal) {
    const voltAPI = extjs
      .connect('https://ic0.app/', identity)
      .canister(newVoltPrincipal ? newVoltPrincipal : voltPrincipal, 'volt');
    const resp = await voltAPI.getBalances('icpledger', 'ryjl3-tyaaa-aaaaa-aaaba-cai', []);
    if (resp.hasOwnProperty('ok')) {
      setVoltBalances([Number(resp.ok[0]), Number(resp.ok[1]), Number(resp.ok[2])]);
    }
  }
}
