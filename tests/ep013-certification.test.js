import {describe,it,expect} from 'vitest';import fs from 'node:fs';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));const release=JSON.parse(fs.readFileSync('release-meta.json','utf8'));
describe('EP-013 release certification foundation',()=>{
 it('keeps release identity aligned',()=>{expect(pkg.version).toBe('0.13.0');expect(release.version).toBe(pkg.version);expect(release.ep).toBe('EP-013');});
 it('provides distinct fast and strict owner commands',()=>{expect(pkg.scripts['verify:release']).toBeTruthy();expect(pkg.scripts['certify:release']).toContain('--profile full');expect(pkg.scripts['certify:release:core']).toContain('--profile core');});
 it('provides owner browser workflows',()=>{expect(pkg.scripts['browsers:install']).toBeTruthy();expect(pkg.scripts['verify:browsers']).toBeTruthy();expect(pkg.scripts['verify:browsers:focused']).toBeTruthy();expect(pkg.scripts['verify:browsers:headed']).toBeTruthy();});
 it('keeps generated certification evidence out of source snapshots',()=>{expect(fs.readFileSync('.gitignore','utf8')).toContain('release-certification/');expect(fs.readFileSync('scripts/snapshot-config.mjs','utf8')).toContain("'release-certification'");});
 it('prepares Workers Static Assets without credentials or a domain',()=>{const text=fs.readFileSync('wrangler.jsonc','utf8');expect(text).toContain('"directory": "./dist"');expect(text).toContain('"not_found_handling": "404-page"');expect(text).not.toMatch(/account_id|api[_-]?token/i);});
 it('forces preview builds to noindex without changing production content',()=>{const text=fs.readFileSync('src/layouts/BaseLayout.astro','utf8');expect(text).toContain("deploymentChannel === 'preview'");expect(text).toContain('noindex,nofollow');});
 it('requires certification and rollback recovery documents',()=>{for(const f of ['docs/RELEASE-CERTIFICATION.md','docs/ROLLBACK-RUNBOOK.md','docs/CLOUDFLARE-DEPLOYMENT-PREPARATION.md','docs/OWNER-RELEASE-CHECKLIST.md','docs/ACCESSIBILITY-MANUAL-CHECKLIST.md'])expect(fs.existsSync(f)).toBe(true);});
});
