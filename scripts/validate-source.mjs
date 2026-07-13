import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json')));
const release=JSON.parse(fs.readFileSync(path.join(root,'release-meta.json')));
if(pkg.version!==release.version||release.version!=='0.6.0'||release.ep!=='EP-006') throw new Error('Release version metadata is inconsistent.');
const forbidden=['react','vue','svelte','angular','tailwind','analytics'];
const dependencies=Object.keys({...pkg.dependencies,...pkg.devDependencies}).join(' ').toLowerCase();
for(const item of forbidden) if(dependencies.includes(item)) throw new Error(`Forbidden dependency: ${item}`);
if(pkg.dependencies.astro!=='7.0.7')throw new Error('Astro must remain pinned to the reviewed patched version 7.0.7.');
for(const specFile of ['EP-002-SPEC.md','EP-003-SPEC.md','EP-004-SPEC.md','EP-005-SPEC.md','EP-006-SPEC.md']){const spec=fs.readFileSync(path.join(root,'docs',specFile),'utf8');if(spec.length<1000||!spec.includes('Acceptance Criteria'))throw new Error(`Authoritative specification is incomplete: ${specFile}`);}
const required=['src/layouts/BaseLayout.astro','src/layouts/DirectoryLayout.astro','src/layouts/ProductLayout.astro','src/layouts/PolicyLayout.astro','src/components/DesktopNav.astro','src/components/MobileNav.astro','src/config/security.js','.gitignore'];for(const file of required)if(!fs.existsSync(path.join(root,file)))throw new Error(`Required architecture file missing: ${file}`);
const siteSource=fs.readFileSync(path.join(root,'src','config','site.js'),'utf8');if(process.env.RELEASE_CHANNEL==='production'&&siteSource.includes('.example'))throw new Error('Production release blocked: placeholder .example canonical domain remains.');
const siteVersion=siteSource.match(/version:\s*'([^']+)'/)?.[1],siteEp=siteSource.match(/ep:\s*'([^']+)'/)?.[1];if(siteVersion!==release.version||siteEp!==release.ep)throw new Error(`Site release metadata is inconsistent: ${siteEp}/${siteVersion} versus ${release.ep}/${release.version}.`);
const footer=fs.readFileSync(path.join(root,'src','components','SiteFooter.astro'),'utf8');if(!footer.includes('{site.ep}')||!footer.includes('{site.version}'))throw new Error('Footer must render centralized release metadata.');
if(fs.existsSync(path.join(root,'docs','CODEX-WORKFLOW.md')))throw new Error('Obsolete workflow file must not return; use docs/CHATGPT-WORK-WORKFLOW.md.');
const currentUiFiles=['src/pages/index.astro','src/pages/preflight.astro','src/pages/privacy.astro','src/pages/workspace.astro'];
for(const file of currentUiFiles){const source=fs.readFileSync(path.join(root,file),'utf8');if(/EP-00[1-5]/.test(source))throw new Error(`${file}: stale current-release EP wording`);}
const snapshotSource=fs.readFileSync(path.join(root,'scripts','snapshot-config.mjs'),'utf8');if(/evidence\//.test(snapshotSource))throw new Error('Snapshot configuration must not require ignored raw evidence.');

for(const required of ['docs/LOCAL-DATA-AND-PRIVACY-MODEL.md','docs/WORKSPACE-SCHEMA-REFERENCE.md','docs/OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md','docs/PRODUCTION-CHECKLIST.md']) if(!fs.existsSync(path.join(root,required))) throw new Error(`Required operational document missing: ${required}`);
const workspaceClient=fs.readFileSync(path.join(root,'src','scripts','workspace-client.js'),'utf8');
for(const forbiddenStorage of ['fetch(','XMLHttpRequest','sendBeacon']) if(workspaceClient.includes(forbiddenStorage)) throw new Error(`Workspace client must remain local-only: ${forbiddenStorage}`);

console.log('Source and release checks passed.');
