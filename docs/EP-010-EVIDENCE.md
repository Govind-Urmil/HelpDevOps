# EP-010 Evidence

Release: EP-010 / v0.10.0
Status: audit candidate; not committed, pushed, or deployed.

## Completed verification

- Clean dependency installation: 456 packages.
- Dependency audit: 0 vulnerabilities.
- Astro: 138 files, 0 errors, 0 warnings, 0 hints.
- Tool resources: 9 packs and 9 tools.
- Diagnostic resources: 14 reviewed journeys.
- Evidence resources: 5 reviewed interpreters and 12 executable synthetic fixtures.
- Unit tests: 327/327 passed across 18 files.
- Production build: 50 static routes.
- Route, metadata, internal-link, robots, sitemap, favicon, CSP, and security-header validation: passed.
- Structured-data CSP hashes: 48.
- Performance budgets: peak JavaScript 12.6 KB gzip, CSS 5.0 KB gzip, transfer 58.2 KB, 5 requests.

## EP-010 coverage

Six reviewed journeys were added for Git push rejection, Jenkins agents, DNS resolution, refused connections, cron execution, and shell execution failures. Focused regressions cover force-push guardrails, launch-method branching, DNS response classes, connection safety, cron launch-versus-command failure, shell least-privilege behavior, and conservative Universal Input routing.

## Deferred environment checks

Chromium, Firefox, WebKit, mobile, real-browser workspace restoration, accessibility/reflow, unexpected-network instrumentation, and Lighthouse remain deferred to the consolidated environment-specific verification pass when available. They are not claimed as passed in this release evidence.

## Narrow technical-review remediation
- Jenkins now triages manual/temporary and node-monitor offline reasons before launch-method troubleshooting.
- Cron now separates read-only evidence inspection from temporary, permission-restricted instrumentation with privacy, rollback, and cleanup requirements.
- Focused regression coverage prevents manual/monitor states from entering launch-method remediation and prevents interactive environment output from being represented as cron evidence.
