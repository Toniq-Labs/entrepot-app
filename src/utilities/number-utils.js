import {truncateNumber} from 'augment-vir';

export function isInRange(value, min, max) {
    return value >= min && value <= max;
}

export function numberWithCommas(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export function formatNumber(number, truncate) {
    number = Number(number)
        .toFixed(8)
        .replace(/0{1,6}$/, '');
    if (truncate) {
        return truncateNumber(number);
    } else {
        return numberWithCommas(number);
    }
}
