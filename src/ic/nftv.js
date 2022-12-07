export default function getNri(canister, index) {
    if (typeof index == 'undefined') {
        return loadNri(canister);
        //Easy load without extra import
    } else {
        if (gridata.hasOwnProperty(canister)) return gridata[canister][index];
        else return false;
    }
}
async function loadNri(canister) {
    if (gridata.hasOwnProperty(canister)) return true;
    try {
        var fd = await fetch('/nri/' + canister + '.json').then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(data => {
                    return data;
                });
            } else {
                return response.text().then(text => {
                    return false;
                });
            }
        });
        if (fd) gridata[canister] = fd;
    } catch (error) {
        console.error(canister, error);
        return false;
    }
    return true;
}
var gridata = {};
