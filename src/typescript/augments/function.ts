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
