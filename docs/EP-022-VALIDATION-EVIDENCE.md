# EP-022 validation evidence

## Executed local certification

- Locked dependency installation: passed; 474 packages installed.
- Dependency audit: 0 known vulnerabilities.
- Source/Astro checking: 223 files, 0 errors, 0 warnings, 0 hints.
- Resource validation: 9 packs and 9 tools.
- Investigation validation: 37 published journeys.
- Evidence validation: 5 interpreters and 12 synthetic fixtures.
- Reference validation: 14 reviewed references.
- Discovery validation: 256 records and 179 canonical error/symptom entries.
- Operational knowledge: 100 issue families and 300 fixtures.
- Launch readiness: 15 issue entries and 9 governed technology families.
- Unit and contract tests: 491 passed across 37 files.
- Production build: 114 routes.
- Route, title, description, canonical, internal-link, robots, and sitemap validation: passed for 114 routes.
- Browser tests: 295 passed across Chromium, Firefox, WebKit, and mobile; 13 hosted-preview-only checks skipped by their existing environment guard.
- Required responsive widths: 1440, 1280, 1024, 768, 390, 360, and 320 CSS pixels passed on representative launch surfaces.
- Accessibility: focused axe checks and the repository suite found no serious or critical violation; Lighthouse accessibility was 100 on all audited routes.
- Performance budgets: passed on 114 routes; peak JavaScript 18.5 KB gzip, CSS 8.9 KB gzip, transfer 215.5 KB, and 10 requests.
- Security headers: 100 Cloudflare rules for 114 HTML routes; strict route-scoped CSP, global security headers, and immutable asset caching validated.
- Lighthouse: homepage 96 performance / 100 accessibility / 100 best practices / 100 SEO; four representative tools scored 99 / 100 / 100 / 100.
- Snapshot hygiene: 505 forward-slash repository entries; no `.git`, dependencies, build output, caches, browser reports, nested archives, secrets, or machine-local paths.
- Fresh-extraction certification: passed clean install, dependency audit, source checks, 491 unit tests, production build, route/link/sitemap/robots validation, and performance budgets; 259 required recovery files verified.

Live preview and production DNS, TLS, response-header, canonical, indexing, and smoke checks are deferred until the owner authorizes deployment.

Lighthouse emitted Windows temporary-directory cleanup warnings after producing successful reports. Scores and thresholds completed and the command exited successfully.
