import moment from 'moment';

export function getDurationDate(date: number) {
    const dateDuration: moment.Duration = moment.duration(moment(date).diff(moment()));
    var days = parseInt(dateDuration.asDays().toFixed(2));
    var hours = parseInt(dateDuration.asHours().toFixed(2)) - days * 24;
    var minutes = parseInt(dateDuration.asMinutes().toFixed(2)) - (days * 24 * 60 + hours * 60);

    return {
        days,
        hours,
        minutes,
    };
}
