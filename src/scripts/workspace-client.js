import { tools } from '../config/tools.js';
import { workspaceConfig } from '../workspace/config.js';
import { addFavorite, removeFavorite, recordRecentTool, createWorkspace } from '../workspace/model.js';
import { scanSensitiveContent } from '../workspace/sensitive-content.js';
import { createWorkspaceExport, parseWorkspaceImport, mergeImportedWorkspaces } from '../workspace/export-import.js';
import { loadPreferences, savePreferences, openWorkspaceDatabase, listWorkspaces, putWorkspace, deleteWorkspace, replaceWorkspaces, clearWorkspaceDatabase, clearPreferences } from '../workspace/storage.js';
import { createWorkspaceChannel } from '../workspace/channel.js';
import { site } from '../config/site.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const toolByPath = tools.find(tool => tool.status === 'available' && location.pathname === tool.path);
let preferences = loadPreferences();
let dbPromise;
const db = () => {
  if (!dbPromise) dbPromise = openWorkspaceDatabase().catch(error => { dbPromise = undefined; throw error; });
  return dbPromise;
};
const channel = createWorkspaceChannel(message => {
  if (['preferences-updated','workspace-created','workspace-updated','workspace-deleted','all-local-data-cleared'].includes(message?.type)) refreshWorkspaceUI();
});

function setStatus(message, tone = '') {
  const nodes = $$('[data-workspace-status]');
  nodes.forEach(node => { node.textContent = message; node.dataset.tone = tone; });
}

function persistPreferences(next) {
  try { preferences = savePreferences(next); channel.post({ type:'preferences-updated' }); }
  catch { setStatus('Browser preference storage is unavailable. Tools still work normally.', 'warning'); }
  renderFavoriteButtons();
}

function renderFavoriteButtons() {
  $$('[data-favorite-tool]').forEach(button => {
    const active = preferences.favorites.includes(button.dataset.favoriteTool);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '★ Favorited' : '☆ Favorite';
  });
}

function collectCurrentToolState() {
  if (!toolByPath) return null;
  const root = $('[data-tool-root]');
  if (!root) return null;
  const input = {};
  $$('input, textarea, select', root).forEach((element, index) => {
    if (['button','submit','reset','file'].includes(element.type)) return;
    const key = element.name || element.id || element.dataset.inputKey || `field-${index + 1}`;
    if (element.type === 'checkbox' || element.type === 'radio') {
      if (element.type === 'radio' && !element.checked) return;
      input[key] = element.type === 'checkbox' ? element.checked : element.value;
    } else input[key] = element.value;
  });
  return { toolId:toolByPath.id, toolSchemaVersion:1, input, options:{ sourcePath:location.pathname }, resultSnapshot:null };
}

function describeWarnings(warnings) {
  return warnings.map(item => `${item.label} near line ${item.line}: ${item.excerpt}`).join('\n');
}

async function saveCurrentTool() {
  if (!preferences.workspaceEnabled) return setStatus('Saved workspaces are disabled in Local Data & Privacy settings.', 'warning');
  const state = collectCurrentToolState();
  if (!state) return setStatus('Open an available tool before saving a workspace.', 'warning');
  const warnings = scanSensitiveContent(state.input);
  if (warnings.some(item => item.severity === 'block')) {
    setStatus('Private-key material cannot be saved. Redact it and try again.', 'error');
    alert(`Saving was blocked because unmistakable private-key material was found.\n\n${describeWarnings(warnings)}`);
    return;
  }
  if (warnings.length && !confirm(`Possible sensitive content was found. Detection is incomplete. Redact secrets before saving.\n\n${describeWarnings(warnings)}\n\nSave anyway?`)) return;
  const titleInput = $('[data-workspace-title]');
  const title = titleInput?.value.trim() || `${toolByPath.title} workspace`;
  if (!title) return setStatus('Enter a workspace title.', 'warning');
  try {
    const database = await db();
    const workspace = createWorkspace({ id:crypto.randomUUID(), title, toolStates:[state] });
    workspace.sensitivity = { status:warnings.length ? 'acknowledged' : 'reviewed', warningsAcknowledged:warnings.map(item => item.id) };
    await putWorkspace(database, workspace);
    channel.post({ type:'workspace-created', id:workspace.id, revision:workspace.revision });
    if (titleInput) titleInput.value='';
    setStatus('Workspace saved in this browser.', 'success');
    await refreshWorkspaceUI();
  } catch (error) { setStatus(error.message || 'Workspace could not be saved.', 'error'); }
}

function downloadJSON(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function exportAll() {
  try {
    const records = await listWorkspaces(await db());
    if (!records.length) return setStatus('There are no saved workspaces to export.', 'warning');
    const warnings = scanSensitiveContent(records);
    if (warnings.some(item => item.severity === 'block')) return setStatus('Export blocked: private-key material exists in a saved workspace.', 'error');
    if (warnings.length && !confirm(`Possible sensitive content exists in this export. Review before sharing.\n\n${describeWarnings(warnings)}\n\nExport anyway?`)) return;
    downloadJSON(`helpdevops-workspaces-${new Date().toISOString().slice(0,10)}.json`, createWorkspaceExport(records, site.version));
    setStatus('Workspace export created locally.', 'success');
  } catch (error) { setStatus(error.message || 'Export failed.', 'error'); }
}

async function importFile(file, mode = 'merge') {
  if (!file) return;
  if (!preferences.workspaceEnabled) return setStatus('Saved workspaces are disabled in Local Data & Privacy settings.', 'warning');
  try {
    if (file.size > workspaceConfig.maxImportBytes) throw new Error('Import file exceeds the 2 MB limit.');
    const parsed = parseWorkspaceImport(await file.text());
    const warnings = scanSensitiveContent(parsed.workspaces);
    if (warnings.some(item => item.severity === 'block')) throw new Error('Import blocked because private-key material was found.');
    if (warnings.length && !confirm(`Possible sensitive content was found in the import.\n\n${describeWarnings(warnings)}\n\nContinue?`)) return;
    const database = await db();
    const existing = await listWorkspaces(database);
    const records = mode === 'replace' ? parsed.workspaces : [...existing, ...mergeImportedWorkspaces(existing, parsed.workspaces)];
    if (records.length > workspaceConfig.maxWorkspaces) throw new Error('Import would exceed the 100-workspace limit.');
    if (mode === 'replace' && !confirm('Replace all saved workspaces with this validated import? This cannot be undone unless you export first.')) return;
    await replaceWorkspaces(database, records);
    channel.post({ type:'workspace-updated' });
    setStatus(`${parsed.workspaces.length} workspace(s) imported locally.`, 'success');
    await refreshWorkspaceUI();
  } catch (error) { setStatus(error.message || 'Import failed. Existing data was preserved.', 'error'); }
}

async function clearAll() {
  if (!confirm('Clear favorites, recent tools, preferences, and every saved workspace from this browser?')) return;
  try {
    if (dbPromise) { try { (await dbPromise).close(); } catch {} dbPromise=undefined; }
    await clearWorkspaceDatabase(); clearPreferences(); preferences = loadPreferences();
    channel.post({ type:'all-local-data-cleared' });
    setStatus('All HelpDevOps local data was cleared.', 'success');
    await refreshWorkspaceUI();
  } catch (error) { setStatus(error.message || 'Local data could not be cleared.', 'error'); }
}

async function renderWorkspaceList() {
  const list = $('[data-workspace-list]');
  if (!list) return;
  try {
    const records = await listWorkspaces(await db());
    list.innerHTML = records.length ? records.map(item => `
      <article class="workspace-item" data-workspace-id="${item.id}">
        <div><strong>${escapeHTML(item.title)}</strong><p>${item.toolStates.length} tool item(s) · Updated ${new Date(item.updatedAt).toLocaleString()}</p></div>
        <div class="workspace-item-actions"><button class="button secondary" data-workspace-open="${item.id}">Open</button><button class="button ghost" data-workspace-rename="${item.id}">Rename</button><button class="button ghost" data-workspace-duplicate="${item.id}">Duplicate</button><button class="button ghost" data-workspace-export="${item.id}">Export</button><button class="button ghost" data-workspace-delete="${item.id}">Delete</button></div>
      </article>`).join('') : '<p class="muted">No saved workspaces. Saving is always explicit.</p>';
    $$('[data-workspace-open]', list).forEach(button => button.onclick = () => {
      const record = records.find(item => item.id === button.dataset.workspaceOpen);
      const state = record?.toolStates?.[0];
      const target = tools.find(tool => tool.id === state?.toolId && tool.status === 'available');
      if (!state || !target) return setStatus('This workspace references an unavailable tool.', 'warning');
      sessionStorage.setItem('helpdevops.transfer.v1', JSON.stringify({ contractVersion:1, source:'saved-workspace', workspaceId:record.id, state }));
      location.href = target.path;
    });
    $$('[data-workspace-rename]', list).forEach(button => button.onclick = async () => {
      const record = records.find(item => item.id === button.dataset.workspaceRename);
      const title = prompt('Rename workspace', record.title)?.trim();
      if (!title || title === record.title) return;
      try { await putWorkspace(await db(), {...record,title},record.revision); channel.post({type:'workspace-updated',id:record.id}); setStatus('Workspace renamed.', 'success'); refreshWorkspaceUI(); }
      catch(error){ setStatus(error.message || 'Workspace could not be renamed.', 'error'); }
    });
    $$('[data-workspace-duplicate]', list).forEach(button => button.onclick = async () => {
      const record = records.find(item => item.id === button.dataset.workspaceDuplicate);
      try { const copy=createWorkspace({id:crypto.randomUUID(),title:`${record.title} (Copy)`,toolStates:record.toolStates,notes:record.notes}); copy.sensitivity=structuredClone(record.sensitivity); await putWorkspace(await db(),copy); channel.post({type:'workspace-created',id:copy.id}); setStatus('Workspace duplicated.', 'success'); refreshWorkspaceUI(); }
      catch(error){ setStatus(error.message || 'Workspace could not be duplicated.', 'error'); }
    });
    $$('[data-workspace-delete]', list).forEach(button => button.onclick = async () => {
      if (!confirm('Delete this saved workspace from this browser?')) return;
      await deleteWorkspace(await db(), button.dataset.workspaceDelete); channel.post({type:'workspace-deleted'}); setStatus('Workspace deleted.', 'success'); refreshWorkspaceUI();
    });
    $$('[data-workspace-export]', list).forEach(button => button.onclick = async () => {
      const record = records.find(item => item.id === button.dataset.workspaceExport);
      const warnings = scanSensitiveContent(record);
      if (warnings.some(item => item.severity === 'block')) return setStatus('Export blocked: private-key material exists in this workspace.', 'error');
      if (warnings.length && !confirm(`Possible sensitive content exists in this export. Review before sharing.\n\n${describeWarnings(warnings)}\n\nExport anyway?`)) return;
      downloadJSON('helpdevops-workspace.json', createWorkspaceExport(record, site.version));
    });
    const count = $('[data-workspace-count]'); if (count) count.textContent = String(records.length);
  } catch { list.innerHTML = '<p class="muted">Saved workspace storage is unavailable. Analysis tools remain available.</p>'; }
}

function escapeHTML(value) { const node = document.createElement('div'); node.textContent = value; return node.innerHTML; }

async function renderDock() {
  const dock = $('[data-session-dock]'); if (!dock) return;
  $('[data-dock-favorites]', dock).textContent = `${preferences.favorites.length} favorite tool(s)`;
  $('[data-dock-recent]', dock).textContent = `${preferences.recentTools.length} recent tool(s)`;
  try { $('[data-dock-workspaces]', dock).textContent = `${(await listWorkspaces(await db())).length} saved workspace(s)`; }
  catch { $('[data-dock-workspaces]', dock).textContent = 'Workspace storage unavailable'; }
  dock.dataset.collapsed = String(preferences.sessionDock.collapsed);
}


function renderPreferenceControls() {
  $$('[data-preference-toggle]').forEach(control => { control.checked = Boolean(preferences[control.dataset.preferenceToggle]); });
}

async function renderStorageEstimate() {
  const node = $('[data-storage-estimate]');
  if (!node || !navigator.storage?.estimate) return;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    node.textContent = `This origin currently uses about ${(usage / 1024).toFixed(1)} KB. Browser quota is approximately ${(quota / 1024 / 1024).toFixed(1)} MB and may change.`;
  } catch { node.textContent = 'Browser storage estimates are unavailable. Local saving may still work.'; }
}

async function requestPersistence() {
  if (!navigator.storage?.persist) return setStatus('Persistent-storage requests are unavailable in this browser.', 'warning');
  try {
    const granted = await navigator.storage.persist();
    setStatus(granted ? 'The browser granted persistent storage. User clearing can still remove it.' : 'The browser did not grant persistent storage. Export important workspaces.', granted ? 'success' : 'warning');
  } catch { setStatus('The browser could not process the persistence request.', 'warning'); }
}


function renderNavigationLists() {
  const favoriteList = $('[data-favorite-list]');
  const recentList = $('[data-recent-list]');
  if (favoriteList) {
    const items = preferences.favorites.map(id => tools.find(tool => tool.id === id)).filter(Boolean);
    favoriteList.innerHTML = items.length ? items.map(tool => `<a class="workspace-link" href="${tool.path}">${escapeHTML(tool.title)}</a>`).join('') : '<p class="muted">No favorites yet.</p>';
  }
  if (recentList) {
    const items = preferences.recentTools.map(item => ({...item,tool:tools.find(tool=>tool.id===item.toolId)})).filter(item=>item.tool);
    recentList.innerHTML = items.length ? items.map(item => `<a class="workspace-link" href="${item.tool.path}">${escapeHTML(item.tool.title)}<small>${new Date(item.visitedAt).toLocaleString()}</small></a>`).join('') : '<p class="muted">No recent tools yet.</p>';
  }
}

function applyPendingTransfer() {
  if (!toolByPath) return;
  let transfer;
  try { transfer = JSON.parse(sessionStorage.getItem('helpdevops.transfer.v1') || 'null'); } catch { transfer = null; }
  sessionStorage.removeItem('helpdevops.transfer.v1');
  if (!transfer?.state || transfer.state.toolId !== toolByPath.id) return;
  const root = $('[data-tool-root]'); if (!root) return;
  const inputs = transfer.state.input || {};
  $$('input, textarea, select', root).forEach((element,index) => {
    const key = element.name || element.id || element.dataset.inputKey || `field-${index+1}`;
    if (!(key in inputs)) return;
    if (element.type === 'checkbox') element.checked = Boolean(inputs[key]);
    else if (element.type === 'radio') element.checked = element.value === inputs[key];
    else element.value = inputs[key];
  });
  setStatus('Saved tool state opened in this tab. Re-run analysis to generate a current result.', 'success');
}
async function refreshWorkspaceUI() {
  preferences = loadPreferences(); renderFavoriteButtons(); renderPreferenceControls(); renderNavigationLists(); await Promise.all([renderWorkspaceList(), renderDock(), renderStorageEstimate()]);
}

document.addEventListener('click', async event => {
  const favorite = event.target.closest('[data-favorite-tool]');
  if (favorite) {
    const id = favorite.dataset.favoriteTool;
    persistPreferences(preferences.favorites.includes(id) ? removeFavorite(preferences,id) : addFavorite(preferences,id));
  }
  if (event.target.closest('[data-save-current-tool]')) await saveCurrentTool();
  if (event.target.closest('[data-export-all]')) await exportAll();
  if (event.target.closest('[data-clear-all-local]')) await clearAll();
  if (event.target.closest('[data-request-persistence]')) await requestPersistence();
  if (event.target.closest('[data-clear-recent]')) { preferences.recentTools=[]; persistPreferences(preferences); setStatus('Recent tool metadata cleared.', 'success'); }
  if (event.target.closest('[data-clear-favorites]')) { preferences.favorites=[]; persistPreferences(preferences); setStatus('Favorite tool metadata cleared.', 'success'); }
});

$$('[data-preference-toggle]').forEach(control => control.addEventListener('change', () => { const key=control.dataset.preferenceToggle; preferences[key]=control.checked; if(!control.checked&&key==='rememberFavorites')preferences.favorites=[]; if(!control.checked&&key==='rememberRecentTools')preferences.recentTools=[]; persistPreferences(preferences); refreshWorkspaceUI(); }));
$('[data-import-file]')?.addEventListener('change', event => importFile(event.target.files?.[0], $('[data-import-mode]')?.value || 'merge'));
$('[data-dock-collapse]')?.addEventListener('click', () => { preferences.sessionDock.collapsed = !preferences.sessionDock.collapsed; persistPreferences(preferences); renderDock(); });

if (toolByPath) {
  persistPreferences(recordRecentTool(preferences, toolByPath.id));
  document.documentElement.dataset.currentTool = toolByPath.id;
}
applyPendingTransfer();
refreshWorkspaceUI();
window.addEventListener('pagehide', () => channel.close(), { once:true });
