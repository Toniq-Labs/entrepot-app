import type LocalForageType from 'localforage';
// @ts-ignore this explicit .js file has no typings
import localForageImport from 'localforage/src/localforage.js';

export const localForage: typeof LocalForageType = localForageImport;

async function clearLocalForage() {
    await localForage.clear();
    globalThis.location.reload();
}

// use this for debugging
(globalThis as any).clearLocalForage = clearLocalForage;
(globalThis as any).localForage = localForage;
