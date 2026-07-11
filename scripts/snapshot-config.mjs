export const snapshotName='HelpDevOps-v0.2.0-EP002-COMMIT-READY.zip';
export const excludedNames=new Set(['node_modules','.astro','dist','test-results','coverage','.tmp','.git','evidence']);
export const excludedFiles=new Set(['dev-out.log','dev-err.log',snapshotName]);
export const requiredFiles=['README.md','package.json','package-lock.json','.gitignore','release-meta.json','docs/EP-001-SPEC.md','docs/EP-002-SPEC.md','src/pages/index.astro','.github/workflows/quality.yml'];
