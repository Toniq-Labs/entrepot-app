import {createDeferredPromiseWrapper} from '@augment-vir/common';

export async function deleteDatabase(name) {
    const deferredPromise = createDeferredPromiseWrapper();
    const globalObj = typeof window !== 'undefined' ? window : global;
    const request = globalObj.indexedDB.deleteDatabase(name);

    request.onerror = event => {
        deferredPromise.reject(event);
    };

    request.onsuccess = () => {
        deferredPromise.resolve();
    };

    return deferredPromise.promise;
}
