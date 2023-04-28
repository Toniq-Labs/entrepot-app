import {isRuntimeTypeOf, Overwrite, PartialAndNullable} from '@augment-vir/common';
import {initializeSentry} from './sentry-init';
import {ScopeContext} from '@sentry/types';
import type {Event as SentryEvent} from '@sentry/browser';
import {LogSeverityEnum} from './log-levels';

export type InfoEvent = Omit<SentryEvent, 'extra' | 'level'>;

export type InfoDetails = Overwrite<
    LogDetails,
    {
        severity: Exclude<
            LogSeverityEnum,
            NonNullable<LogSeverityEnum.Fatal | LogSeverityEnum.Error>
        >;
    }
>;

export function sendLogToSentry(
    info: string | InfoEvent,
    infoDetails: InfoDetails,
): string | undefined {
    const sentryClient = initializeSentry();

    if (!sentryClient) {
        return;
    }

    const scopeContext = createLoggingContext(infoDetails);

    let eventId: string;

    if (isRuntimeTypeOf(info, 'string')) {
        eventId = sentryClient.captureMessage(info, scopeContext);
    } else {
        eventId = sentryClient.captureEvent({
            ...info,
            ...scopeContext,
        });
    }

    return eventId;
}

type RequiredLogDetails = {
    severity: LogSeverityEnum;
};

export type LogDetails = PartialAndNullable<{
    extraData: Record<string, unknown>;
}> &
    RequiredLogDetails;

export function createLoggingContext(
    logDetails: LogDetails,
): Partial<Pick<ScopeContext, 'extra' | 'level'>> {
    const extra = {
        ...logDetails.extraData,
    };

    return {
        extra,
        level: logDetails.severity,
    };
}
