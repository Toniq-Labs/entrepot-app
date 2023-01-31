import {extractErrorMessage, wait} from '@augment-vir/common';

export function throttle<T extends (...args: any[]) => void>(
    /** The delay between the initial firing and when subsequent firing takes effect. */
    delayMs: number,
    callback: T,
) {
    let timeoutId: number | undefined;
    /**
     * When set to true, indicates the function was fired again after the initial call and before
     * the timeout finished.
     */
    let fireAgain = false;
    let latestArgs: Parameters<T>;

    return (...args: Parameters<T>): void => {
        latestArgs = args;

        // on initial firing, fire the callback
        if (timeoutId == undefined) {
            timeoutId = window.setTimeout(() => {
                timeoutId = undefined;
                if (fireAgain) {
                    callback(...latestArgs);
                }
            }, delayMs);

            fireAgain = false;
            callback(...latestArgs);
        } else if (!fireAgain) {
            fireAgain = true;
        }
    };
}

export async function retry<T>({
    maxRetryCount,
    functionToCall,
    retryInterval = 1000,
}: {
    maxRetryCount: number;
    functionToCall: () => T | Promise<T>;
    retryInterval?: number;
}): Promise<NonNullable<T>> {
    let retryCount = 0;
    let lastError: unknown;
    while (retryCount < maxRetryCount) {
        lastError = undefined;
        let result: T | undefined = undefined;

        try {
            result = await functionToCall();
        } catch (error) {
            lastError = error;
        }

        if (lastError || !result) {
            retryCount++;
            await wait(retryInterval);
        } else {
            return result;
        }
    }

    if (lastError) {
        throw new Error(
            `Retry attempts ('${maxRetryCount}') maxed: ${extractErrorMessage(lastError)}`,
        );
    } else {
        throw new Error(`Retry attempts ('${maxRetryCount}') maxed.`);
    }
}
