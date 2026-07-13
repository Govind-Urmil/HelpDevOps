import { workspaceConfig, defaultPreferences } from './config.js';

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max = 500) => typeof value === 'string' ? value.slice(0, max) : '';

export function sanitizePreferences(value = {}) {
  const source = isRecord(value) ? value : {};
  const favorites = Array.isArray(source.favorites) ? [...new Set(source.favorites.filter(x => typeof x === 'string'))] : [];
  const recentTools = Array.isArray(source.recentTools)
    ? source.recentTools.filter(isRecord).filter(x => typeof x.toolId === 'string' && typeof x.visitedAt === 'string').slice(0, workspaceConfig.maxRecentTools)
    : [];
  return {
    ...defaultPreferences,
    ...source,
    schemaVersion: workspaceConfig.schemaVersion,
    favorites,
    recentTools,
    sessionDock: { collapsed: Boolean(source.sessionDock?.collapsed) }
  };
}

export function addFavorite(preferences, toolId) {
  const next = sanitizePreferences(preferences);
  if (!next.rememberFavorites || !toolId) return next;
  next.favorites = [...new Set([...next.favorites, toolId])];
  return next;
}

export function removeFavorite(preferences, toolId) {
  const next = sanitizePreferences(preferences);
  next.favorites = next.favorites.filter(id => id !== toolId);
  return next;
}

export function recordRecentTool(preferences, toolId, visitedAt = new Date().toISOString()) {
  const next = sanitizePreferences(preferences);
  if (!next.rememberRecentTools || !toolId) return next;
  next.recentTools = [{ toolId, visitedAt }, ...next.recentTools.filter(item => item.toolId !== toolId)].slice(0, workspaceConfig.maxRecentTools);
  return next;
}

export function createWorkspace({ id, title, toolStates = [], notes = '', now = new Date().toISOString() }) {
  if (!id || typeof id !== 'string') throw new Error('Workspace ID is required.');
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id)) throw new Error('Workspace ID contains unsupported characters.');
  if (!title || typeof title !== 'string') throw new Error('Workspace title is required.');
  if (title.length > workspaceConfig.maxTitleChars) throw new Error('Workspace title exceeds the 120-character limit.');
  if (typeof notes !== 'string' || notes.length > workspaceConfig.maxNoteChars) throw new Error('Workspace notes exceed the 20 KB character limit.');
  if (!Array.isArray(toolStates) || toolStates.length > workspaceConfig.maxToolStatesPerWorkspace) throw new Error('Workspace tool-state limit exceeded.');
  return {
    id,
    schemaVersion: workspaceConfig.schemaVersion,
    revision: 1,
    title: text(title, workspaceConfig.maxTitleChars),
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    toolStates: toolStates.map(validateToolState),
    notes: text(notes, workspaceConfig.maxNoteChars),
    source: 'manual-save',
    sensitivity: { status: 'reviewed', warningsAcknowledged: [] }
  };
}

export function validateToolState(value) {
  if (!isRecord(value) || typeof value.toolId !== 'string') throw new Error('Invalid tool state.');
  return {
    toolId: value.toolId,
    toolSchemaVersion: Number.isInteger(value.toolSchemaVersion) ? value.toolSchemaVersion : 1,
    input: isRecord(value.input) ? structuredClone(value.input) : {},
    options: isRecord(value.options) ? structuredClone(value.options) : {},
    resultSnapshot: null
  };
}

export function validateWorkspace(value) {
  if (!isRecord(value)) throw new Error('Workspace must be an object.');
  if (value.schemaVersion !== workspaceConfig.schemaVersion) throw new Error('Unsupported workspace schema version.');
  const normalized = createWorkspace({ id: value.id, title: value.title, toolStates: value.toolStates || [], notes: value.notes || '', now: value.createdAt || new Date().toISOString() });
  normalized.revision = Number.isInteger(value.revision) && value.revision > 0 ? value.revision : 1;
  normalized.updatedAt = text(value.updatedAt, 40) || normalized.createdAt;
  normalized.lastOpenedAt = text(value.lastOpenedAt, 40) || normalized.updatedAt;
  normalized.sensitivity = isRecord(value.sensitivity) ? value.sensitivity : normalized.sensitivity;
  return normalized;
}

export function updateWorkspace(existing, patch, expectedRevision) {
  const current = validateWorkspace(existing);
  if (expectedRevision !== undefined && current.revision !== expectedRevision) throw new Error('Workspace revision conflict. Reload the latest version or save as a copy.');
  const updated = validateWorkspace({ ...current, ...patch, id: current.id, createdAt: current.createdAt, schemaVersion: current.schemaVersion });
  updated.revision = current.revision + 1;
  updated.updatedAt = new Date().toISOString();
  return updated;
}

export function estimateBytes(value) {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
