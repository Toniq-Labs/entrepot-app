import {LocalCacheOptions} from './cache-options';
import {maskObjects} from '../../augments/object';

/** If we need to modify a setting globally for all caches, do so here. */
const globalCacheOptions: LocalCacheOptions = {
    enableCacheBrowserStorage: true,
    enableAutomaticUpdating: true,
    enableLogging: false,
    minUpdateInterval: 1_000_000,
} as const;

export function maskOptionsWithGlobalOptions(
    options: Partial<LocalCacheOptions>,
): LocalCacheOptions {
    const masked = maskObjects(globalCacheOptions, options);
    return {
        ...masked,
        minUpdateInterval:
            masked.minUpdateInterval < globalCacheOptions.minUpdateInterval
                ? globalCacheOptions.minUpdateInterval
                : masked.minUpdateInterval,
    };
}
