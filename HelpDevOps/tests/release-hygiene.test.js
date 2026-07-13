import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
describe('EP-007 release hygiene',()=>{
  it('keeps stale EP wording out of current UI while preserving historical specs',()=>{
    for(const file of ['src/pages/index.astro','src/pages/preflight.astro','src/pages/privacy.astro','src/pages/workspace.astro'])expect(fs.readFileSync(path.join(root,file),'utf8')).not.toMatch(/EP-00[1-5]/);
    expect(fs.readFileSync(path.join(root,'docs/EP-003-SPEC.md'),'utf8')).toMatch(/EP-003/);
  });
  it('prevents the obsolete workflow from returning',()=>expect(fs.existsSync(path.join(root,'docs/CODEX-WORKFLOW.md'))).toBe(false));
  it('keeps raw ignored evidence out of snapshot requirements',()=>{
    const config=fs.readFileSync(path.join(root,'scripts/snapshot-config.mjs'),'utf8');
    expect(config).not.toMatch(/requiredFiles=.*evidence\//);
    expect(config).toMatch(/excludedNames=.*'evidence'/);
  });
  it('requires owner operations recovery files',()=>{
    for(const file of ['docs/OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md','docs/PRODUCTION-CHECKLIST.md'])expect(fs.existsSync(path.join(root,file))).toBe(true);
  });

  it('keeps workspace title input selectors unique and input-only',()=>{
    const dock=fs.readFileSync(path.join(root,'src/components/SessionDockShell.astro'),'utf8');
    const client=fs.readFileSync(path.join(root,'src/scripts/workspace-client.js'),'utf8');
    const diagnostic=fs.readFileSync(path.join(root,'src/components/diagnostics/DiagnosticJourney.astro'),'utf8');
    expect(dock).toMatch(/<input[^>]*data-workspace-title-input/);
    expect(client).toMatch(/\$\('\[data-workspace-title-input\]'\)/);
    expect(diagnostic).not.toMatch(/data-workspace-title(?:=|\s)/);
    expect(diagnostic).toMatch(/data-workspace-entity-title=/);
  });
  it('exposes a serializable tool root on every available tool route', async()=>{
    const { tools } = await import('../src/config/tools.js');
    for (const tool of tools.filter(item => item.status === 'available')) {
      const routeFile = path.join(root, 'src/pages', tool.path.replace(/^\//, '').replace(/\/$/, '') + '.astro');
      expect(fs.existsSync(routeFile), `Missing route source for ${tool.id}`).toBe(true);
      expect(fs.readFileSync(routeFile, 'utf8'), `${tool.id} must expose data-tool-root`).toMatch(/data-tool-root/);
    }
  });
});
