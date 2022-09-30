import React from 'react';

export function EarnFeaturesBlocked() {
    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                Toniq Earn features are not available in your region.
            </h1>
            <p style={{textAlign: 'center'}}>
                Unfortunately, we are not providing service for certain regions, and we detected
                that your IP is from an unsupported region. Thank you for your understanding.
            </p>
        </>
    );
}
