export const snapshotName='HelpDevOps-v0.4.0-EP004-REMEDIATED-COMMIT-READY.zip';
export const excludedNames=new Set(['node_modules','.astro','dist','test-results','playwright-report','coverage','.tmp','.git','evidence']);
export const excludedFiles=new Set(['dev-out.log','dev-err.log',snapshotName]);
export const requiredFiles=['README.md','package.json','package-lock.json','.gitignore','release-meta.json','docs/EP-001-SPEC.md','docs/EP-002-SPEC.md','docs/EP-003-SPEC.md','docs/EP-004-SPEC.md','docs/EP-004-EVIDENCE.md','docs/OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md','docs/PRODUCTION-CHECKLIST.md','docs/RESOURCE-MAINTENANCE-GUIDE.md','src/pages/index.astro','.github/workflows/quality.yml'];
