# EP-020 Validation Evidence

Executed on 2026-07-28 against the final EP-020 working snapshot.

## Passed

- `npm ci`: 475 packages audited; 0 vulnerabilities.
- `npm run check`: Astro reported 0 errors, 0 warnings, and 0 hints; resource, diagnostic, evidence, reference, discovery, operational knowledge, coverage, certification architecture, source encoding, secret scanning, and release metadata checks passed. Diagnostic count: 37.
- `npm test`: 34 files and 478 tests passed.
- `npm run build`: 98 static pages built.
- `npm run validate`: 98 routes, metadata, links, robots, and sitemap validated.
- `npm run audit:budgets`: passed; peak JavaScript 17.7 KB gzip, CSS 7.3 KB gzip, transfer 203.0 KB, and 12 requests.
- `npm run audit:dependencies`: 0 vulnerabilities.
- `npm run audit:licenses`: 629 packages, 15 license expressions, 0 unresolved metadata entries.
- `npm run test:e2e`: 259 passed and 13 environment-gated tests skipped across Chromium, Firefox, WebKit, and mobile; 0 failed.
- `npm run audit:lighthouse`: homepage performance 96; four representative tools performance 99; accessibility, best practices, and SEO 100 for all five audited pages.

## Observed non-failing warnings

- Dependency installation reported three packages with install scripts not covered by the local allow-scripts preference.
- Lighthouse completed with exit code 0 and reported all scores, then emitted Windows temporary-profile cleanup `EPERM` warnings. No audit category failed.

## Not executed

- Hosted-preview validation, production deployment, commit, and push were not performed.
