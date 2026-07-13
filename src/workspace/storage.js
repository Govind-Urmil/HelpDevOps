import { workspaceConfig, defaultPreferences } from './config.js';
import { sanitizePreferences, validateWorkspace, updateWorkspace, estimateBytes } from './model.js';

export function loadPreferences(storage) {
  try { const target = storage || globalThis.localStorage; return sanitizePreferences(JSON.parse(target.getItem(workspaceConfig.preferenceKey) || 'null') || defaultPreferences); }
  catch { return sanitizePreferences(defaultPreferences); }
}

export function savePreferences(preferences, storage) {
  const normalized = sanitizePreferences(preferences);
  const target = storage || globalThis.localStorage;
  target.setItem(workspaceConfig.preferenceKey, JSON.stringify(normalized));
  return normalized;
}

export function clearPreferences(storage) { const target = storage || globalThis.localStorage; target.removeItem(workspaceConfig.preferenceKey); }

export function openWorkspaceDatabase(indexedDBFactory = globalThis.indexedDB) {
  if (!indexedDBFactory) return Promise.reject(new Error('Browser workspace storage is unavailable.'));
  return new Promise((resolve, reject) => {
    const request = indexedDBFactory.open(workspaceConfig.databaseName, workspaceConfig.databaseVersion);
    request.onerror = () => reject(request.error || new Error('Could not open workspace storage.'));
    request.onblocked = () => reject(new Error('Workspace storage upgrade is blocked by another tab.'));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(workspaceConfig.workspaceStore)) {
        const store = db.createObjectStore(workspaceConfig.workspaceStore, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
      if (!db.objectStoreNames.contains(workspaceConfig.metadataStore)) db.createObjectStore(workspaceConfig.metadataStore, { keyPath: 'key' });
    };
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
}

const requestPromise = request => new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
const transactionDone = transaction => new Promise((resolve, reject) => { transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error || new Error('Workspace transaction aborted.')); });

export async function listWorkspaces(db) {
  const tx = db.transaction(workspaceConfig.workspaceStore, 'readonly');
  const records = await requestPromise(tx.objectStore(workspaceConfig.workspaceStore).getAll());
  await transactionDone(tx);
  return records.map(validateWorkspace).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getWorkspace(db, id) {
  const tx = db.transaction(workspaceConfig.workspaceStore, 'readonly');
  const value = await requestPromise(tx.objectStore(workspaceConfig.workspaceStore).get(id));
  await transactionDone(tx);
  return value ? validateWorkspace(value) : null;
}

export async function putWorkspace(db, workspace, expectedRevision) {
  const incoming = validateWorkspace(workspace);
  if (estimateBytes(incoming) > workspaceConfig.maxWorkspaceBytes) throw new Error('Workspace exceeds the 512 KB limit.');
  const current = await getWorkspace(db, incoming.id);
  const toWrite = current ? updateWorkspace(current, incoming, expectedRevision) : incoming;
  const tx = db.transaction(workspaceConfig.workspaceStore, 'readwrite');
  await requestPromise(tx.objectStore(workspaceConfig.workspaceStore).put(toWrite));
  await transactionDone(tx);
  return toWrite;
}

export async function deleteWorkspace(db, id) {
  const tx = db.transaction(workspaceConfig.workspaceStore, 'readwrite');
  tx.objectStore(workspaceConfig.workspaceStore).delete(id);
  await transactionDone(tx);
}

export async function replaceWorkspaces(db, records) {
  const tx = db.transaction(workspaceConfig.workspaceStore, 'readwrite');
  const store = tx.objectStore(workspaceConfig.workspaceStore);
  store.clear();
  records.map(validateWorkspace).forEach(record => store.put(record));
  await transactionDone(tx);
}

export async function clearWorkspaceDatabase(indexedDBFactory = globalThis.indexedDB) {
  if (!indexedDBFactory) return;
  await new Promise((resolve, reject) => {
    const request = indexedDBFactory.deleteDatabase(workspaceConfig.databaseName);
    request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); request.onblocked = () => reject(new Error('Close other HelpDevOps tabs and try again.'));
  });
}
