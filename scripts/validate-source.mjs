import {diagnosticJourneys} from '../src/diagnostics/registry.js';
import fs from 'node:fs';
import path from 'node:path';
import {validateCredentialContent} from './secret-scan-policy.mjs';
const root=process.cwd();
const secretScanErrors=[];
const skippedSecretScanDirectories=new Set(['.git','node_modules','.astro','dist','evidence','release-health','release-certification','test-results','playwright-report','coverage','.tmp','.wrangler']);
function scanDirectory(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){if(entry.isDirectory()&&skippedSecretScanDirectories.has(entry.name))continue;const absolute=path.join(directory,entry.name);if(entry.isDirectory()){scanDirectory(absolute);continue;}if(!entry.isFile()||fs.statSync(absolute).size>2_000_000)continue;const relative=path.relative(root,absolute).split(path.sep).join('/');secretScanErrors.push(...validateCredentialContent(relative,fs.readFileSync(absolute,'utf8')));}}
scanDirectory(root);
const mojibakeFragments=[
 String.fromCodePoint(0xc2),
 String.fromCodePoint(0xc3,0x201a),
 String.fromCodePoint(0xe2,0x20ac),
 String.fromCodePoint(0xe2,0x2020),
 String.fromCodePoint(0xc3,0x192)
];
const mojibakeErrors=[];
function scanTextEncoding(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){if(entry.isDirectory()&&skippedSecretScanDirectories.has(entry.name))continue;const absolute=path.join(directory,entry.name);if(entry.isDirectory()){scanTextEncoding(absolute);continue;}if(!entry.isFile()||fs.statSync(absolute).size>2_000_000)continue;const relative=path.relative(root,absolute).split(path.sep).join('/');const content=fs.readFileSync(absolute,'utf8');for(const fragment of mojibakeFragments)if(content.includes(fragment))mojibakeErrors.push(`${relative}: common mojibake sequence detected`);}}
scanTextEncoding(root);
if(mojibakeErrors.length)throw new Error([...new Set(mojibakeErrors)].join('\n'));
if(secretScanErrors.length)throw new Error(secretScanErrors.join('\n'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json')));
const release=JSON.parse(fs.readFileSync(path.join(root,'release-meta.json')));
if(pkg.version!==release.version||release.version!=='0.21.0'||release.ep!=='EP-021') throw new Error('Release version metadata is inconsistent.');
const forbidden=['react','vue','svelte','angular','tailwind','analytics'];
const dependencies=Object.keys({...pkg.dependencies,...pkg.devDependencies}).join(' ').toLowerCase();
for(const item of forbidden) if(dependencies.includes(item)) throw new Error(`Forbidden dependency: ${item}`);
if(pkg.dependencies.astro!=='7.1.3')throw new Error('Astro must remain pinned to the reviewed patched version 7.1.3.');
for(const specFile of ['EP-002-SPEC.md','EP-003-SPEC.md','EP-004-SPEC.md','EP-005-SPEC.md','EP-006-SPEC.md','EP-007-SPEC.md','EP-008-SPEC.md','EP-009-SPEC.md','EP-011-SPEC.md']){const spec=fs.readFileSync(path.join(root,'docs',specFile),'utf8');if(spec.length<1000||!spec.includes('Acceptance Criteria'))throw new Error(`Authoritative specification is incomplete: ${specFile}`);}
const required=['src/layouts/BaseLayout.astro','src/layouts/DirectoryLayout.astro','src/layouts/ProductLayout.astro','src/layouts/PolicyLayout.astro','src/components/DesktopNav.astro','src/components/MobileNav.astro','src/config/security.js','.gitignore'];for(const file of required)if(!fs.existsSync(path.join(root,file)))throw new Error(`Required architecture file missing: ${file}`);
const siteSource=fs.readFileSync(path.join(root,'src','config','site.js'),'utf8');
if(process.env.RELEASE_CHANNEL==='production'){
 const configured=process.env.PUBLIC_SITE_URL||'';
 if(!configured||configured.includes('.example')||!configured.startsWith('https://'))throw new Error('Production release blocked: approved HTTPS PUBLIC_SITE_URL is required.');
}
const siteVersion=siteSource.match(/version:\s*'([^']+)'/)?.[1],siteEp=siteSource.match(/ep:\s*'([^']+)'/)?.[1];if(siteVersion!==release.version||siteEp!==release.ep)throw new Error(`Site release metadata is inconsistent: ${siteEp}/${siteVersion} versus ${release.ep}/${release.version}.`);
const footer=fs.readFileSync(path.join(root,'src','components','SiteFooter.astro'),'utf8');if(!footer.includes('{site.ep}')||!footer.includes('{site.version}'))throw new Error('Footer must render centralized release metadata.');
if(fs.existsSync(path.join(root,'docs','CODEX-WORKFLOW.md')))throw new Error('Obsolete workflow file must not return; use docs/CHATGPT-WORK-WORKFLOW.md.');
const currentUiFiles=['src/pages/index.astro','src/pages/preflight.astro','src/pages/privacy.astro','src/pages/workspace.astro'];
for(const file of currentUiFiles){const source=fs.readFileSync(path.join(root,file),'utf8');if(/EP-00[1-5]/.test(source))throw new Error(`${file}: stale current-release EP wording`);}
const snapshotSource=fs.readFileSync(path.join(root,'scripts','snapshot-config.mjs'),'utf8');
const requiredSnapshotSection=snapshotSource.split('requiredFiles=')[1]||'';
if(requiredSnapshotSection.includes("'evidence/")||requiredSnapshotSection.includes('\"evidence/'))throw new Error('Snapshot configuration must not require the ignored raw evidence directory.');

for(const required of ['docs/EVIDENCE-INTERPRETER-MODEL.md','docs/EVIDENCE-AUTHORING-GUIDE.md','docs/DIAGNOSTIC-KNOWLEDGE-MODEL.md','docs/DIAGNOSTIC-AUTHORING-GUIDE.md','docs/DIAGNOSTIC-REVIEW-STANDARD.md','docs/LOCAL-DATA-AND-PRIVACY-MODEL.md','docs/WORKSPACE-SCHEMA-REFERENCE.md','docs/OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md','docs/PRODUCTION-CHECKLIST.md']) if(!fs.existsSync(path.join(root,required))) throw new Error(`Required operational document missing: ${required}`);
const workspaceClient=fs.readFileSync(path.join(root,'src','scripts','workspace-client.js'),'utf8');
for(const forbiddenStorage of ['fetch(','XMLHttpRequest','sendBeacon']) if(workspaceClient.includes(forbiddenStorage)) throw new Error(`Workspace client must remain local-only: ${forbiddenStorage}`);

if(process.env.RELEASE_CHANNEL==='production'&&diagnosticJourneys.some(item=>item.status!=='reviewed'))throw new Error('Production release blocked: diagnostic journeys still require technical review.');

for(const required of ['src/references/registry.js','src/references/discovery.js','src/pages/reference/index.astro','src/pages/reference/[slug].astro','src/pages/errors/index.astro','scripts/validate-references.mjs','scripts/validate-discovery.mjs']) if(!fs.existsSync(path.join(root,required))) throw new Error(`EP-011 required file missing: ${required}`);
for(const required of ['src/pages/incident-brief.astro','src/incident-brief/brief.js','scripts/verify-release.mjs','docs/OWNER-QUICK-RECOVERY.md','docs/CHATGPT-WORK-DEFERRED-VERIFICATION.md']) if(!fs.existsSync(path.join(root,required))) throw new Error(`EP-012 required file missing: ${required}`);

for(const required of ['scripts/certify-release.mjs','scripts/validate-certification.mjs','docs/RELEASE-CERTIFICATION.md','docs/ROLLBACK-RUNBOOK.md','docs/CLOUDFLARE-DEPLOYMENT-PREPARATION.md','docs/OWNER-RELEASE-CHECKLIST.md','wrangler.jsonc','scripts/deploy-cloudflare.mjs','releases/manifest.json']) if(!fs.existsSync(path.join(root,required))) throw new Error(`EP-013 required file missing: ${required}`);


for(const required of ['scripts/verify-live-preview.mjs','scripts/cloudflare-dry-run.mjs','scripts/run-hosted-browser-tests.mjs','scripts/deployment-environment.mjs','tests/e2e/ep014-hosted-preview.spec.js','src/pages/robots.txt.js','docs/EP-014-SPEC.md','docs/CLOUDFLARE-PREVIEW-VALIDATION.md','docs/LIVE-SMOKE-TESTS.md','docs/PREVIEW-ROLLBACK-DRILL.md']) if(!fs.existsSync(path.join(root,required))) throw new Error(`EP-014 required file missing: ${required}`);

console.log('Source and release checks passed.');
