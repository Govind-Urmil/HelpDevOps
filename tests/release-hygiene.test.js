import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
describe('EP-004 release hygiene',()=>{
  it('keeps stale EP wording out of current UI while preserving historical specs',()=>{
    for(const file of ['src/pages/index.astro','src/pages/preflight.astro','src/pages/privacy.astro','src/pages/workspace.astro'])expect(fs.readFileSync(path.join(root,file),'utf8')).not.toMatch(/EP-00[1-3]/);
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
});
