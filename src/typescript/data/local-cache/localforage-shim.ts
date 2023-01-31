import type LocalForageType from 'localforage';
// @ts-ignore this explicit .js file has no typings
import localForageImport from 'localforage/src/localforage.js';

export const localForage: typeof LocalForageType = localForageImport;
