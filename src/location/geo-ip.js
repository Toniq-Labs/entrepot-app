// these features are loaded in index.html via the geoip-js.com/js/apis/geoip2/v2.1/geoip2.js script

const blockedToniqEarnCountryCodes = [
    'us',
    // these should get blocked by other means already, but lets throw them here just in case
    'cf',
    'cu',
    'ir',
    'kp',
    'sy',
];

export async function checkIfToniqEarnAllowed() {
    return new Promise((resolve) => {
        if (window.location.hostname === 'localhost') {
            // allow in localhost for testing
            resolve(true);
        }
        try {
            window.geoip2.country((result) => {            
                const allowed = !blockedToniqEarnCountryCodes.includes(result.country.iso_code.toLowerCase())
                resolve(allowed);
            }, (error) => {
                console.error(error);
                // if any error occurs, resort to simply allowing the user to access Toniq Earn features
                resolve(true);
            });
        } catch (error) {
            console.error(error);
            // if any error occurs, resort to simply allowing the user to access Toniq Earn features
            resolve(true);
        }
    });
}