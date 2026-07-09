/* global BigInt */
/**
 * ICP amount helpers.
 *
 * ICP is denominated in e8s (1 ICP = 100,000,000 e8s). Converting a user-entered decimal amount to
 * e8s with `BigInt(Math.floor(value * 1e8))` is unsafe: `value * 1e8` is a floating point
 * multiplication and can lose precision (e.g. `4.15 * 1e8` -> 414999999.99999994 -> floors to
 * 414999999, silently under-charging/under-listing by 1 e8). These helpers parse the decimal string
 * directly so no floating point rounding is involved.
 */

const E8S_PER_ICP = BigInt(100000000);
const DECIMALS = 8;

/**
 * Convert a decimal ICP amount (number or string) to a BigInt of e8s. Extra fractional digits
 * beyond 8 are truncated, matching the ledger.
 */
export function icpToE8s(value) {
    if (value === null || value === undefined || value === '') return BigInt(0);
    // Use a fixed-notation string so we never hit scientific notation for the
    // small numbers used here, and so we operate on exact decimal digits.
    const str = typeof value === 'number' ? value.toFixed(DECIMALS) : String(value).trim();
    const negative = str.startsWith('-');
    const unsigned = negative ? str.slice(1) : str;
    const [
        whole = '0',
        frac = '',
    ] = unsigned.split('.');
    // Strip any non-digits defensively (whole/frac should already be digits).
    const wholeDigits = whole.replace(/\D/g, '') || '0';
    const fracDigits = (frac.replace(/\D/g, '') + '0'.repeat(DECIMALS)).slice(0, DECIMALS);
    const e8s = BigInt(wholeDigits) * E8S_PER_ICP + BigInt(fracDigits);
    return negative ? -e8s : e8s;
}

/** Convert a BigInt/number of e8s back to a decimal ICP number. */
export function e8sToIcp(e8s) {
    return Number(e8s) / Number(E8S_PER_ICP);
}
