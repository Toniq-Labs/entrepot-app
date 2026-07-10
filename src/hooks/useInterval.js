import React from 'react';

/**
 * Declarative setInterval hook (Dan Abramov's pattern). Previously this exact implementation was
 * copy-pasted into ~19 components; it now lives here so the behaviour is defined once. Passing
 * `delay = null` pauses the interval.
 */
export default function useInterval(callback, delay) {
    const savedCallback = React.useRef();

    // Remember the latest callback.
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    React.useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
