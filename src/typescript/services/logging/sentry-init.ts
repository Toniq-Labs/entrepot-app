import * as Sentry from '@sentry/browser';
import {environmentByUrl, isProd} from '../../environment/environment-by-url';
import {BrowserOptions as SentryConfig, Dedupe, HttpContext} from '@sentry/browser';
import {ensureError} from '@augment-vir/common';
import {getEventConsoleLogFunction} from './log-levels';

// this is a public key, it does not need to be a secret
const toniqIoSentryDsn =
    'https://40c7d3bf235f49e5a2092036feeb8191@o4504718034927616.ingest.sentry.io/4505037528629248';

const errorLevels = [] as const;

export const toniqIoSentryConfig: SentryConfig = {
    dsn: toniqIoSentryDsn,
    defaultIntegrations: false,
    environment: environmentByUrl,
    enabled: true,
    integrations: [
        new HttpContext(),
        new Dedupe(),
    ],
    beforeSend(event, hint) {
        const consoleMethod = getEventConsoleLogFunction(event);

        if (isProd) {
            consoleMethod('sending to Sentry:', hint.originalException, hint.captureContext);
            return event;
        } else {
            consoleMethod(
                'would have sent to Sentry:',
                hint.originalException,
                hint.captureContext,
            );
            return null;
        }
    },
    beforeSendTransaction() {
        return null;
    },
};

export function initializeSentry() {
    try {
        Sentry.init(toniqIoSentryConfig);

        return Sentry;
    } catch (caught) {
        const error = ensureError(caught);
        error.message = 'Sentry init failed: ' + error.message;
        console.error(error);
        return undefined;
    }
}
