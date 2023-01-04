export default function getNri(canister, index) {
    if (typeof index == 'undefined') {
        return loadNri(canister);
        // Easy load without extra import
    } else {
        if (nriData.hasOwnProperty(canister)) return nriData[canister][index];
        else return false;
    }
}
async function loadNri(canister) {
    if (nriData.hasOwnProperty(canister)) return true;
    try {
        var fd = await fetch('/nri/' + canister + '.json').then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(data => {
                    return data;
                });
            } else {
                return response.text().then(() => {
                    return false;
                });
            }
        });
        if (fd) {
            nriData[canister] = fd;
        }
    } catch (error) {
        console.error(canister, error);
        return false;
    }
    return true;
}
var nriData = {};
