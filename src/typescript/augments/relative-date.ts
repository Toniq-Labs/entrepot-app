import {duration} from 'moment';

export function getRelativeDate(input: number) {
    const nowNumber = Date.now();
    const thenNumber = Number(input);
    const diff = thenNumber - nowNumber;
    if (diff !== 0) return duration(diff).humanize(true);
    else return 'Just Now';
}
