# EP-019 Validation Evidence

Executed locally on 2026-07-27 against v0.19.0.

## Passed

- `npm ci`: 474 packages installed; 475 audited; 0 vulnerabilities.
- `npm run check`: 207 Astro/source files; 0 errors, warnings, or hints. Nine tools, 30 journeys, five interpreters, 14 references, 218 discovery records, 149 canonical errors, 100 operational families, and 100 coverage rows validated.
- `npm test`: 32 files passed; 458 tests passed.
- `npm run build`: 90 pages built; 92 security-header rules generated.
- `npm run validate`: 90 routes, metadata, links, robots, and sitemap validated.
- `npm run audit:budgets`: peak JavaScript 15.1 KB gzip, CSS 7.1 KB gzip, transfer 165.7 KB, and 12 requests.
- `npm run audit:dependencies`: 0 vulnerabilities.
- `npm run audit:licenses`: 629 packages; 0 unresolved licence metadata entries.
- `npm run test:e2e`: 259 passed across Chromium, Firefox, WebKit, and mobile; 13 hosted-preview tests skipped by their existing environment gate.
- `npm run audit:lighthouse`: homepage performance 97; four representative tool pages 99; accessibility, best practices, and SEO 100 for all five audited pages.
- `npm run snapshot` and `npm run snapshot:validate`: portable snapshot created; 466 archive entries; 220 recovery files verified through fresh extraction.
- `git diff --check`: passed.
- Tracked-file, machine-path, credential-pattern, generated-artifact, and raw user-facing path audits executed.

## Qualified evidence

Lighthouse completed with exit code 0 and reported passing scores. Chrome launcher then logged Windows `EPERM` errors while deleting four temporary Lighthouse profile directories. This was cleanup noise after results, not a fabricated pass.

The browser suite intentionally skipped 12 hosted-preview cases because no hosted-preview environment variable was supplied, plus one desktop-navigation test in the mobile project by test design.

## Not executed

- No Cloudflare deployment or live-preview verification.
- No production-domain verification.
- No GitHub-hosted Actions run; local tests confirm the workflow references checkout v5, setup-node v5, and Node 22.


## Pre-merge remediation validation (executed 2026-07-27)

- `npm run check`: passed; 208 source files, 0 errors, 0 warnings, 0 hints; source/release, credential, mojibake, registries, diagnostics, discovery, operational knowledge, coverage, and certification checks passed.
- `npm test`: passed; 33 files and 468 tests.
- `npm run build`: passed; 90 pages and 92 security-header rules.
- `npm run validate`: passed; 90 routes plus metadata, internal links, robots, and sitemap.
- `npm run audit:budgets`: passed; peak JavaScript 17.5 KB gzip, CSS 7.1 KB gzip, transfer 174.3 KB, 12 requests.
- Full Playwright command with lightweight reporter: 259 passed and 13 existing environment-gated/design skips across Chromium, Firefox, WebKit, and Pixel 7 mobile.
- Focused EP-019 Playwright: 20 passed across all four configured projects.
- `git diff --check`: passed.
- `scripts/validate-source.mjs`: passed, including secret and mojibake scanning.

The first snapshot validation attempt correctly failed because duplicate per-error browser search records exceeded the 250 KB route budget. Duplicate records were removed from the browser payload while exact errors remain indexed on journey records; the production budget then passed. Final snapshot results are recorded with the delivered archive.
- Final `npm run snapshot` and `npm run snapshot:validate`: passed; 467 forward-slash archive entries and 220 recovery files verified through fresh extraction.
