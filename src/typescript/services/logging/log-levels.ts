import {typedArrayIncludes} from '@augment-vir/common';
import {ErrorEvent} from '@sentry/types';

export enum LogSeverityEnum {
    Warning = 'warning',
    Info = 'info',
    Debug = 'debug',
    Fatal = 'fatal',
    Error = 'error',
}

const errorLevels = [
    LogSeverityEnum.Error,
    LogSeverityEnum.Fatal,
] as const;

const warnLevels = [LogSeverityEnum.Warning] as const;

export function getEventConsoleLogFunction(event: ErrorEvent) {
    if (typedArrayIncludes(errorLevels, event.level)) {
        return console.error;
    } else if (typedArrayIncludes(warnLevels, event.level)) {
        return console.warn;
    } else {
        return console.info;
    }
}
