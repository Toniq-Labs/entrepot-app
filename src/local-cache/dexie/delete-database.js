export async function deleteDatabase(name) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    return new Promise((resolve, reject) => {
        const request = globalObj.indexedDB.deleteDatabase(name);
        request.onerror = event => reject(event);
        request.onsuccess = () => resolve();
    });
}
