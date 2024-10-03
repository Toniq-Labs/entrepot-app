import extjs from './ic/extjs.js';
const api = extjs.connect('https://icp0.io/');
var loadedVolts = {};
//Will attempt to load volt for principal, returns either false if none, or the principal
export async function loadVolt(identity) {
    var currentPrincipal = identity.getPrincipal().toText();
    if (loadedVolts.hasOwnProperty(currentPrincipal)) {
        return loadedVolts[currentPrincipal];
    }
    let newVoltPrincipal = false;
    const voltFactoryAPI = extjs
        .connect('https://icp0.io/')
        .canister('flvm3-zaaaa-aaaak-qazaq-cai');
    const volt = await voltFactoryAPI.getOwnerCanister(identity.getPrincipal());
    if (volt.length) {
        newVoltPrincipal = volt[0].toText();
        loadedVolts[currentPrincipal] = newVoltPrincipal;
    }
    return newVoltPrincipal;
}

export async function loadVoltBalance(identity) {
    var currentPrincipal = identity.getPrincipal().toText();
    if (loadedVolts.hasOwnProperty(currentPrincipal)) {
        var voltPrincipal = loadedVolts[currentPrincipal];
        const voltAPI = extjs.connect('https://icp0.io/').canister(voltPrincipal, 'volt');
        const resp = await voltAPI.getBalances('icpledger', 'ryjl3-tyaaa-aaaaa-aaaba-cai', []);
        if (resp.hasOwnProperty('ok')) {
            return [
                Number(resp.ok[0]),
                Number(resp.ok[1]),
                Number(resp.ok[2]),
            ];
        } else return false;
    }
    return false;
}
