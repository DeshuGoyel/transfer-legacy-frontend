/**
 * Secure Key Store (IndexedDB + Migration Layer)
 * Mitigates XSS / LocalStorage credential scraping (TL-SEC-03)
 */

const DB_NAME = 'transfer_legacy_vault';
const STORE_NAME = 'secure_keys';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to sessionStorage if IndexedDB fails
    sessionStorage.setItem(key, value);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    const db = await getDb();
    const idbValue = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });

    if (idbValue) return idbValue;

    // Backward-compatibility: Check and migrate from legacy localStorage if present
    const legacyValue = localStorage.getItem(key);
    if (legacyValue) {
      await setSecureItem(key, legacyValue);
      localStorage.removeItem(key); // Scrub from unencrypted localStorage
      return legacyValue;
    }

    return sessionStorage.getItem(key);
  } catch {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }
}

export async function removeSecureItem(key: string): Promise<void> {
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore error
  }
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}
