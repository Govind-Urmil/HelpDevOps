import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {resolveNpmCommand,validateCertificationForDeployment} from '../scripts/deploy-cloudflare.mjs';
import {parseUnitSummary,parseCheckSummaries,parseLicenseSummary,parseSnapshotSummary} from '../scripts/certification-evidence.mjs';

describe('EP-013 certification remediation',()=>{
 it('captures real machine-readable totals',()=>{
  expect(parseUnitSummary('Test Files  21 passed\nTests  366 passed')).toMatchObject({passed:366,failed:0,filesPassed:21});
  expect(parseCheckSummaries('Diagnostic validation passed: 14 journeys.\nReference validation passed: 14 reviewed references.')).toMatchObject({diagnostics:{journeys:14},references:{references:14}});
  expect(parseLicenseSummary('Dependency license inventory passed: 619 packages, 14 license expressions, 0 unresolved metadata entries.')).toEqual({packages:619,licenseExpressions:14,unresolved:0});
  expect(parseSnapshotSummary('Snapshot validation passed: 386 forward-slash entries, 165 recovery files verified.')).toEqual({entries:386,recoveryFiles:165});
  expect(parseSnapshotSummary('Snapshot validation passed: 386 portable entries, 165 recovery files verified.')).toEqual({entries:386,recoveryFiles:165});
 });
 it('uses npm.cmd on Windows and npm elsewhere',()=>{expect(resolveNpmCommand('win32')).toBe('npm.cmd');expect(resolveNpmCommand('linux')).toBe('npm');});
 it('rejects absent, stale, core-only, mismatched, or incomplete browser certification',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'helpdevops-cert-'));const zip=path.join(root,'release.zip');fs.writeFileSync(zip,'release');
  const completeProjects={chromium:{passed:50,failed:0,skipped:0,total:50},firefox:{passed:50,failed:0,skipped:0,total:50},webkit:{passed:50,failed:0,skipped:0,total:50},mobile:{passed:49,failed:0,skipped:1,total:50}};
  const completeTotals={passed:199,failed:0,skipped:1,total:200};
  const base={gate:'passed',profile:'full',version:'0.13.0',ep:'EP-013',source:{gitAvailable:true,sourceCommit:'abc',sourceTreeClean:true,sourceTreeCleanAfter:true},package:{path:zip,sha256:'A'.repeat(64)},evidence:{browserTests:{projects:completeProjects,totals:completeTotals}}};
  const args={release:{version:'0.13.0',ep:'EP-013'},currentCommit:'abc',treeClean:true};
  expect(()=>validateCertificationForDeployment({...args,manifest:{...base,profile:'core'}})).toThrow(/profile is not full/);
  expect(()=>validateCertificationForDeployment({...args,manifest:{...base,source:{...base.source,sourceCommit:'old'}}})).toThrow(/source commit/);
  expect(()=>validateCertificationForDeployment({...args,manifest:base})).toThrow(/checksum/);
  const checksum=createHash('sha256').update(fs.readFileSync(zip)).digest('hex').toUpperCase();
  const valid={...base,package:{path:zip,sha256:checksum}};
  expect(validateCertificationForDeployment({...args,manifest:valid})).toBe(true);
  expect(()=>validateCertificationForDeployment({...args,manifest:{...valid,evidence:{browserTests:{projects:{chromium:completeProjects.chromium},totals:{passed:50,failed:0,skipped:0,total:50}}}}})).toThrow(/missing required project/);
  const noWebkit={...completeProjects};delete noWebkit.webkit;
  expect(()=>validateCertificationForDeployment({...args,manifest:{...valid,evidence:{browserTests:{projects:noWebkit,totals:{passed:149,failed:0,skipped:1,total:150}}}}})).toThrow(/webkit/);
  expect(()=>validateCertificationForDeployment({...args,manifest:{...valid,evidence:{browserTests:{projects:{...completeProjects,mobile:{passed:0,failed:0,skipped:0,total:0}},totals:{passed:150,failed:0,skipped:0,total:150}}}}})).toThrow(/mobile/);
  expect(()=>validateCertificationForDeployment({...args,manifest:{...valid,evidence:{browserTests:{projects:completeProjects,totals:{passed:198,failed:0,skipped:1,total:199}}}}})).toThrow(/aggregate browser/);
  expect(()=>validateCertificationForDeployment({...args,manifest:{...valid,evidence:{browserTests:{projects:{...completeProjects,webkit:{passed:49,failed:1,skipped:0,total:50}},totals:{passed:198,failed:1,skipped:1,total:200}}}}})).toThrow(/browser project failed: webkit/);
 });
 it('requires unresolved licenses to fail and supports legacy licenses metadata',()=>{
  const source=fs.readFileSync('scripts/audit-licenses.mjs','utf8');
  expect(source).toContain('meta.licenses');expect(source).toContain('installed.licenses');expect(source).toContain('if(unresolved.length)throw');
 });
 it('certification manifest includes evidence and a final clean-tree check',()=>{
  const source=fs.readFileSync('scripts/certify-release.mjs','utf8');
  expect(source).toContain('evidence.browserTests');expect(source).toContain('evidence.unitTests');expect(source).toContain('Final Git cleanliness');expect(source).toContain('schemaVersion:2');
 });
});
