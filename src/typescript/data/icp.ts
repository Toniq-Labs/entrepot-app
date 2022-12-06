import {truncateNumber} from 'augment-vir';
import {BigNumber} from 'bignumber.js';

export type ValidIcp = BigNumber | number | BigInt;

export function toIcp(input: ValidIcp) {
    const numeric = convertToIcpNumber(input);
    return truncateNumber(numeric);
}

function convertToIcpNumber(input: ValidIcp): number {
    if (input instanceof BigNumber || isBigInt(input)) {
        return Number(input) / 100000000;
    } else {
        return input;
    }
}

// extra type guard because apparently TS isn't smart enough to use typeof on its own here
function isBigInt(input: unknown): input is BigInt {
    return typeof input === 'bigint';
}