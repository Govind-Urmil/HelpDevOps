# EP-005 Verification Evidence

Status: implementation candidate pending independent browser/Lighthouse verification and Govind’s approval.

## Core verification genuinely executed here

- Clean `npm ci --ignore-scripts`: 442 packages installed in the final Windows verification environment; 0 vulnerabilities reported.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Astro check: 104 files; 0 errors, 0 warnings, 0 hints.
- Resource validation: 6 packs and 8 tools passed existing route/analyzer/reference gates.
- Source/release validation: passed for EP-005 / v0.5.0 and required privacy/workspace documentation.
- Unit tests: 227/227 passed across 12 files, including 42 workspace/privacy/import tests.
- Production build: 16 static routes.
- Build validation: metadata, internal links, favicon, robots, sitemap, CSP/security headers and structured data passed.
- Structured-data hashes: 12; HSTS remains disabled under the approved pre-deployment policy.
- Budgets: peak JavaScript 10.4 KB gzip; peak CSS 4.6 KB gzip; peak transfer 30.1 KB; peak requests 5.
- Astro local development server started successfully and returned HTTP 200 for `/` and `/workspace/`.

## Final focused browser and Lighthouse verification

- The original active-tool blocker was reproduced and remediated by adding the shared `data-tool-root` contract to Cron Analyzer and JSON/YAML Inspector. Save/reopen and private-key blocking then passed in Chromium, Firefox, WebKit and the configured mobile project.
- A remaining Firefox cross-tab failure was traced to an ordering race between a `localStorage` preference write and a separate `BroadcastChannel` notification. Firefox could deliver the notification before another process observed the durable preference value, leaving the receiving tab stale.
- Cross-tab notifications now use the storage-event transport as the primary path, preserving write/notification ordering. `BroadcastChannel` remains the fallback when notification storage is unavailable.
- Focused add/remove synchronization passed in Chromium, Firefox, WebKit and mobile. The receiving tab verified the persisted favorite state after each notification.
- Representative Chromium checks passed for rename, duplicate, delete, replace import, malformed import rejection, unsupported-version rejection, Universal Input transfer, explicit save, reopen/restoration and absence of external application requests.
- Targeted workspace accessibility and 200%-equivalent reflow checks passed across the configured browser projects; no material overflow or inaccessible controls were observed.
- Lighthouse: homepage 98 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; workspace 100 / 100 / 100 / 100.

Windows allowed both Lighthouse reports to complete but denied removal of Chrome's temporary profile, producing a cleanup-only nonzero process exit. Scores above come from the completed JSON reports; raw reports and temporary profiles are excluded from the package.

## Permanent evidence policy

Raw Playwright, Lighthouse, traces, screenshots, build output and temporary reports are excluded from the Git commit-ready package. Only concise truthful evidence is retained here.

## Snapshot and commit hygiene

- Complete repository snapshot: 165 portable forward-slash entries.
- Fresh extraction: passed.
- Required recovery files: 19 verified.
- Excluded: `.git`, dependencies, build output, raw browser/Lighthouse evidence, screenshots, traces, logs, nested ZIPs, caches and local environment files.
- Credential-like token and local absolute-path scan: passed; test fixtures avoid literal credential-shaped strings in the committed package.

## Narrow remediation after focused browser verification

ChatGPT Work reproduced one cross-browser blocker in the original candidate: the Session Dock could not collect state from the Cron Analyzer or JSON/YAML Inspector because those two established EP-003 routes did not expose the shared `data-tool-root` contract used by EP-005 workspace saving. The routes now expose that contract without changing analyzer behavior or introducing automatic persistence.

A source-level regression test requires every available tool route to expose a serializable tool root. Focused browser coverage now also requires cross-tab favorite addition and removal to refresh from persisted state. Core verification and the previously blocked targeted browser flows were rerun after the final fix.
