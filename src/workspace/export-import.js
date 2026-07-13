import { tools } from '../config/tools.js';
import { workspaceConfig } from './config.js';
import { validateWorkspace, estimateBytes } from './model.js';

export function createWorkspaceExport(workspaces, applicationVersion, exportedAt = new Date().toISOString()) {
  const list = (Array.isArray(workspaces) ? workspaces : [workspaces]).map(validateWorkspace);
  return {
    format: workspaceConfig.exportFormat,
    formatVersion: workspaceConfig.exportFormatVersion,
    exportedAt,
    applicationVersion,
    workspaces: list
  };
}

export function parseWorkspaceImport(text) {
  if (new TextEncoder().encode(text).byteLength > workspaceConfig.maxImportBytes) throw new Error('Import file exceeds the 2 MB limit.');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Import file is not valid JSON.'); }
  if (parsed?.format !== workspaceConfig.exportFormat) throw new Error('Unrecognized HelpDevOps workspace format.');
  if (parsed?.formatVersion !== workspaceConfig.exportFormatVersion) throw new Error('Unsupported workspace export version.');
  if (!Array.isArray(parsed.workspaces) || parsed.workspaces.length > workspaceConfig.maxWorkspaces) throw new Error('Invalid workspace collection.');
  const workspaces = parsed.workspaces.map(validateWorkspace);
  const knownTools = new Set(tools.filter(tool => tool.status === 'available').map(tool => tool.id));
  for (const workspace of workspaces) {
    if (estimateBytes(workspace) > workspaceConfig.maxWorkspaceBytes) throw new Error(`Workspace ${workspace.id} exceeds the 512 KB limit.`);
    for (const state of workspace.toolStates) if (!knownTools.has(state.toolId)) throw new Error(`Unknown or unavailable tool ID in import: ${state.toolId}`);
  }
  return { ...parsed, workspaces };
}

export function mergeImportedWorkspaces(existing, imported, idFactory = crypto.randomUUID.bind(crypto)) {
  const existingIds = new Set(existing.map(item => item.id));
  return imported.map(item => {
    if (!existingIds.has(item.id)) { existingIds.add(item.id); return item; }
    const copy = { ...item, id: idFactory(), title: `${item.title} (Imported)`, revision: 1 };
    existingIds.add(copy.id);
    return copy;
  });
}
