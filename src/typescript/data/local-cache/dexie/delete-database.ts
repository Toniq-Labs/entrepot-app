import {createDeferredPromiseWrapper} from '@augment-vir/common';

export async function deleteDatabase(name: string): Promise<void> {
    const deferredPromise = createDeferredPromiseWrapper();

    const request = globalThis.indexedDB.deleteDatabase(name);

    request.onerror = event => {
        deferredPromise.reject(event);
    };

    request.onsuccess = () => {
        deferredPromise.resolve();
    };

    return deferredPromise.promise;
}
