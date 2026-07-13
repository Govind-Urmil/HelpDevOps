export const snapshotName='HelpDevOps-v0.10.0-EP010-REMEDIATED-COMMIT-READY.zip';
export const excludedNames=new Set(['node_modules','.astro','dist','test-results','playwright-report','coverage','.tmp','.git']);
export const excludedPaths=new Set(['evidence']);
export const excludedFiles=new Set(['dev-out.log','dev-err.log',snapshotName]);
export const requiredFiles=[
'README.md','package.json','package-lock.json','.gitignore','release-meta.json',
'docs/EP-001-SPEC.md','docs/EP-002-SPEC.md','docs/EP-003-SPEC.md','docs/EP-004-SPEC.md','docs/EP-004-EVIDENCE.md','docs/EP-005-SPEC.md','docs/EP-005-EVIDENCE.md','docs/EP-006-SPEC.md','docs/EP-006-IMPLEMENTATION-REPORT.md','docs/EP-006-EVIDENCE.md','docs/EP-007-SPEC.md','docs/EP-007-IMPLEMENTATION-REPORT.md','docs/EP-007-EVIDENCE.md','docs/EP-008-SPEC.md','docs/EP-008-IMPLEMENTATION-REPORT.md','docs/EP-008-EVIDENCE.md','docs/EP-009-SPEC.md','docs/EP-009-IMPLEMENTATION-REPORT.md','docs/EP-009-EVIDENCE.md','docs/EP-010-SPEC.md','docs/EP-010-IMPLEMENTATION-REPORT.md','docs/EP-010-EVIDENCE.md','docs/EVIDENCE-INTERPRETER-MODEL.md','docs/EVIDENCE-AUTHORING-GUIDE.md','docs/DIAGNOSTIC-KNOWLEDGE-MODEL.md','docs/DIAGNOSTIC-AUTHORING-GUIDE.md','docs/DIAGNOSTIC-REVIEW-STANDARD.md','docs/LOCAL-DATA-AND-PRIVACY-MODEL.md','docs/WORKSPACE-SCHEMA-REFERENCE.md','docs/OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md','docs/PRODUCTION-CHECKLIST.md','docs/RESOURCE-MAINTENANCE-GUIDE.md',
'src/pages/index.astro','src/pages/interpret/index.astro','src/pages/interpret/[slug].astro',
'src/core/evidence/interpreter.js','src/core/evidence/registry.js','src/core/evidence/normalize.js','src/core/evidence/result.js',
'src/core/evidence/parsers/df.js','src/core/evidence/parsers/kubernetes-pod.js','src/core/evidence/parsers/docker-state.js','src/core/evidence/parsers/terraform-lock.js','src/core/evidence/parsers/systemd-unit.js',
'src/resources/evidence/shared.json',
'src/resources/evidence/df-usage/definition.json','src/resources/evidence/df-usage/fixtures.json',
'src/resources/evidence/kubernetes-pod/definition.json','src/resources/evidence/kubernetes-pod/fixtures.json',
'src/resources/evidence/docker-state/definition.json','src/resources/evidence/docker-state/fixtures.json',
'src/resources/evidence/terraform-lock/definition.json','src/resources/evidence/terraform-lock/fixtures.json',
'src/resources/evidence/systemd-unit/definition.json','src/resources/evidence/systemd-unit/fixtures.json',
'src/diagnostics/journeys/push-rejected/journey.json','src/diagnostics/journeys/push-rejected/nodes.json',
'src/diagnostics/journeys/agent-offline/journey.json','src/diagnostics/journeys/agent-offline/nodes.json',
'src/diagnostics/journeys/dns-resolution/journey.json','src/diagnostics/journeys/dns-resolution/nodes.json',
'src/diagnostics/journeys/connection-refused/journey.json','src/diagnostics/journeys/connection-refused/nodes.json',
'src/diagnostics/journeys/job-not-running/journey.json','src/diagnostics/journeys/job-not-running/nodes.json',
'src/diagnostics/journeys/execution-failure/journey.json','src/diagnostics/journeys/execution-failure/nodes.json',
'tests/evidence-interpreter.test.js','tests/workspace.test.js','tests/e2e/evidence-interpreter.spec.js','src/workspace/sensitive-content.js','scripts/validate-evidence.mjs','.github/workflows/quality.yml'
];
