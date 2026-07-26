# EP-018 Validation Evidence

Executed on 2026-07-26 against the remediated v0.18.0 source.

## Focused remediation checks

- `npm test -- --run tests/ep018-platform.test.js`: 1 file and 7 tests passed, covering 30-journey integrity, six priority evidence-branch sets, local brand-color marks and documentation, and common mojibake signatures.
- `npm run validate:diagnostics`: 30 journeys passed structural, reachability, risk, rollback, and verification validation.
- `node scripts/validate-source.mjs`: source and release checks passed, including the repository-wide mojibake gate.

## Full existing suite

`npm run test:all` completed with exit code 0 and executed:

- Dependency audit: 0 vulnerabilities.
- Astro/source/resource checks: 202 Astro files with 0 errors, 0 warnings, and 0 hints; 9 resource packs, 9 tools, 30 journeys, 5 evidence interpreters, 14 references, 218 discovery records, 149 canonical error/symptom entries, 100 operational knowledge families, coverage, certification architecture, source identity, secret scanning, and encoding checks passed.
- Unit tests: 31 files and 450 tests passed.
- Static build: 90 pages built; 92 route-specific security-header rules generated.
- Build validation: 90 routes, metadata, internal links, robots, and sitemap passed.
- Budgets: 90 routes passed; peak JavaScript 29.5 KB gzip, CSS 6.5 KB gzip, transfer 165.2 KB, and 12 requests.
- Browser tests: 239 passed and 13 environment-gated tests skipped across Chromium, Firefox, WebKit, and mobile projects.
- Lighthouse: homepage scored 98 performance and 100 accessibility, best practices, and SEO; Encoding & Hash, IPv4 CIDR, Linux Permissions, and Git Reference scored 99 performance and 100 in the other categories.

On Windows, Lighthouse emitted non-fatal `EPERM` warnings while removing temporary Chrome profiles after results were collected. The audit and full suite returned exit code 0; the warnings are recorded rather than suppressed.

## Release and archive

- `npm run verify:release`: checks, 450 unit tests, build validation, and budgets passed; release health reported `core-passed-with-deferred-independent-checks` because independent hosted checks remain environment-controlled.
- `npm run snapshot` and `npm run snapshot:validate`: portable archive created; hygiene, fresh-extraction execution, and portability passed with 455 forward-slash entries and 220 recovery files verified.

