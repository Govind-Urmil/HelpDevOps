import { describe, it, expect } from 'vitest';
import { workspaceConfig, defaultPreferences } from '../src/workspace/config.js';
import { sanitizePreferences, addFavorite, removeFavorite, recordRecentTool, createWorkspace, validateWorkspace, updateWorkspace, estimateBytes } from '../src/workspace/model.js';
import { scanSensitiveContent, hasBlockingSensitiveContent } from '../src/workspace/sensitive-content.js';
import { createWorkspaceExport, parseWorkspaceImport, mergeImportedWorkspaces } from '../src/workspace/export-import.js';
import { loadPreferences, savePreferences, clearPreferences } from '../src/workspace/storage.js';

const memoryStorage = () => {
  const data = new Map();
  return { getItem:k => data.has(k) ? data.get(k) : null, setItem:(k,v) => data.set(k,String(v)), removeItem:k => data.delete(k) };
};
const sampleState = { toolId:'cron', toolSchemaVersion:1, input:{ expression:'*/5 * * * *' }, options:{}, resultSnapshot:null };
const sample = () => createWorkspace({ id:'w1', title:'Cron review', toolStates:[sampleState], now:'2026-07-13T00:00:00.000Z' });

describe('workspace preferences', () => {
  it('returns safe defaults from malformed values', () => expect(sanitizePreferences('bad')).toEqual(defaultPreferences));
  it('deduplicates favorite IDs', () => expect(sanitizePreferences({favorites:['cron','cron']}).favorites).toEqual(['cron']));
  it('adds and removes favorites', () => {
    const added=addFavorite(defaultPreferences,'cron'); expect(added.favorites).toEqual(['cron']); expect(removeFavorite(added,'cron').favorites).toEqual([]);
  });
  it('does not add favorites when disabled', () => expect(addFavorite({...defaultPreferences,rememberFavorites:false},'cron').favorites).toEqual([]));
  it('keeps recent tools unique and most-recent first', () => {
    let p=recordRecentTool(defaultPreferences,'cron','2026-01-01T00:00:00Z'); p=recordRecentTool(p,'ipv4-cidr','2026-01-02T00:00:00Z'); p=recordRecentTool(p,'cron','2026-01-03T00:00:00Z');
    expect(p.recentTools.map(x=>x.toolId)).toEqual(['cron','ipv4-cidr']);
  });
  it('caps recent tools', () => {
    let p=defaultPreferences; for(let i=0;i<20;i++) p=recordRecentTool(p,`tool-${i}`,new Date(i).toISOString());
    expect(p.recentTools).toHaveLength(workspaceConfig.maxRecentTools);
  });
  it('persists only normalized preferences', () => {
    const store=memoryStorage(); savePreferences({favorites:['cron','cron']},store); expect(loadPreferences(store).favorites).toEqual(['cron']); clearPreferences(store); expect(loadPreferences(store)).toEqual(defaultPreferences);
  });
  it('recovers from corrupted preference JSON', () => { const store=memoryStorage(); store.setItem(workspaceConfig.preferenceKey,'{bad'); expect(loadPreferences(store)).toEqual(defaultPreferences); });
});

describe('workspace schema', () => {
  it('creates a versioned workspace', () => { const w=sample(); expect(w.schemaVersion).toBe(1); expect(w.revision).toBe(1); expect(w.toolStates[0].resultSnapshot).toBeNull(); });
  it('requires an ID', () => expect(()=>createWorkspace({title:'x'})).toThrow(/ID/));
  it('requires a title', () => expect(()=>createWorkspace({id:'x'})).toThrow(/title/));
  it('rejects too many tool states', () => expect(()=>createWorkspace({id:'x',title:'x',toolStates:Array(26).fill(sampleState)})).toThrow(/limit/));
  it('rejects unknown schema versions', () => expect(()=>validateWorkspace({...sample(),schemaVersion:2})).toThrow(/Unsupported/));
  it('normalizes invalid result snapshots to null', () => expect(validateWorkspace({...sample(),toolStates:[{...sampleState,resultSnapshot:'html'}]}).toolStates[0].resultSnapshot).toBeNull());
  it('increments revisions on update', () => expect(updateWorkspace(sample(),{title:'Changed'},1).revision).toBe(2));
  it('detects stale revisions', () => expect(()=>updateWorkspace(sample(),{title:'Changed'},0)).toThrow(/revision conflict/));
  it('preserves immutable ID and creation time', () => { const w=sample(), u=updateWorkspace(w,{id:'other',createdAt:'other',title:'Changed'},1); expect(u.id).toBe('w1'); expect(u.createdAt).toBe(w.createdAt); });
  it('estimates UTF-8 byte size', () => expect(estimateBytes({x:'😀'})).toBeGreaterThan(JSON.stringify({x:'😀'}).length));
});

describe('sensitive-content warning', () => {
  it('hard-blocks private keys', () => expect(hasBlockingSensitiveContent('-----BEGIN PRIVATE KEY-----')).toBe(true));
  it('warns about bearer tokens', () => expect(scanSensitiveContent('Authorization: Bearer abcdefghijklmnop')[0].id).toBe('bearer-token'));
  it('warns about GitHub tokens', () => expect(scanSensitiveContent('gh'+'p_'+'abcdefghijklmnopqrstuvwxyz123456')[0].id).toBe('github-token'));
  it('warns about AWS keys', () => expect(scanSensitiveContent('AK'+'IA'+'ABCDEFGHIJKLMNOP')[0].id).toBe('aws-key'));
  it('warns about sensitive assignments', () => expect(scanSensitiveContent('password=hunter2')[0].id).toBe('sensitive-assignment'));
  it('warns about operational identifiers in interpretation-only evidence', () => { const warnings=scanSensitiveContent({summary:JSON.stringify({observations:[{label:'Path',value:'s3://company-prod-state/team/prod.tfstate'},{label:'Who',value:'alice@example.com'}]})}); expect(warnings.map(item=>item.id)).toEqual(expect.arrayContaining(['terraform-state-path','email-address'])); });
  it('warns about internal IP and owner fields without hard blocking', () => { const warnings=scanSensitiveContent({Who:'alice',Address:'10.20.30.40'}); expect(warnings.map(item=>item.id)).toEqual(expect.arrayContaining(['ownership-field','ip-address'])); expect(warnings.some(item=>item.severity==='block')).toBe(false); });
  it('warns about Kubernetes Secrets', () => expect(scanSensitiveContent('kind: Secret')[0].id).toBe('kubernetes-secret'));
  it('reports line numbers', () => expect(scanSensitiveContent('safe\npassword=x')[0].line).toBe(2));
  it('does not echo a complete long secret', () => expect(scanSensitiveContent('password=abcdefghijklmnopqrstuvwxyz')[0].excerpt).not.toContain('abcdefghijklmnopqrstuvwxyz'));
  it('returns no warning for ordinary input', () => expect(scanSensitiveContent('*/5 * * * *')).toEqual([]));
});

describe('workspace import/export', () => {
  it('creates a versioned export', () => { const x=createWorkspaceExport(sample(),'0.5.0','2026-07-13T00:00:00Z'); expect(x.format).toBe('helpdevops-workspace'); expect(x.workspaces).toHaveLength(1); });
  it('parses a valid export', () => { const x=createWorkspaceExport(sample(),'0.5.0'); expect(parseWorkspaceImport(JSON.stringify(x)).workspaces[0].id).toBe('w1'); });
  it('rejects invalid JSON', () => expect(()=>parseWorkspaceImport('{')).toThrow(/valid JSON/));
  it('rejects wrong format markers', () => expect(()=>parseWorkspaceImport(JSON.stringify({format:'other',formatVersion:1,workspaces:[]}))).toThrow(/Unrecognized/));
  it('rejects unsupported export versions', () => expect(()=>parseWorkspaceImport(JSON.stringify({format:'helpdevops-workspace',formatVersion:2,workspaces:[]}))).toThrow(/Unsupported/));
  it('rejects oversized imports', () => expect(()=>parseWorkspaceImport(' '.repeat(workspaceConfig.maxImportBytes+1))).toThrow(/2 MB/));
  it('rejects excessive workspace counts', () => expect(()=>parseWorkspaceImport(JSON.stringify({format:'helpdevops-workspace',formatVersion:1,workspaces:Array(101).fill(sample())}))).toThrow(/collection/));
  it('renames conflicting imports', () => { const imported=mergeImportedWorkspaces([sample()],[sample()],()=> 'copy'); expect(imported[0].id).toBe('copy'); expect(imported[0].title).toMatch(/Imported/); });
  it('preserves non-conflicting imports', () => { const other={...sample(),id:'w2'}; expect(mergeImportedWorkspaces([sample()],[other],()=> 'copy')[0].id).toBe('w2'); });
});

describe('workspace hardening', () => {
  it('rejects unsafe workspace IDs', () => expect(()=>createWorkspace({id:'bad" onclick="x',title:'x'})).toThrow(/unsupported characters/));
  it('rejects imports containing unknown tool IDs', () => {
    const bad=createWorkspaceExport({...sample(),toolStates:[{...sampleState,toolId:'unknown-tool'}]},'0.5.0');
    expect(()=>parseWorkspaceImport(JSON.stringify(bad))).toThrow(/Unknown or unavailable tool ID/);
  });
});

describe('workspace limits', () => {
  it('rejects titles longer than 120 characters', () => expect(()=>createWorkspace({id:'long-title',title:'x'.repeat(121)})).toThrow(/120-character/));
  it('rejects notes longer than the configured limit', () => expect(()=>createWorkspace({id:'long-notes',title:'x',notes:'x'.repeat(workspaceConfig.maxNoteChars+1)})).toThrow(/20 KB/));
  it('rejects individual imported workspaces over 512 KB', () => {
    const large=createWorkspace({id:'large1',title:'large',toolStates:[{...sampleState,input:{value:'x'.repeat(workspaceConfig.maxWorkspaceBytes)}}]});
    const envelope={format:'helpdevops-workspace',formatVersion:1,workspaces:[large]};
    expect(()=>parseWorkspaceImport(JSON.stringify(envelope))).toThrow(/512 KB/);
  });
  it('rejects planned tools in imported workspace state', () => {
    const planned=createWorkspace({id:'planned1',title:'planned',toolStates:[{...sampleState,toolId:'kubernetes'}]});
    const envelope={format:'helpdevops-workspace',formatVersion:1,workspaces:[planned]};
    expect(()=>parseWorkspaceImport(JSON.stringify(envelope))).toThrow(/unavailable tool ID/);
  });
});
