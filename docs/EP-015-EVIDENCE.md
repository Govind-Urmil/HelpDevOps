# EP-015 Verification Evidence

Status: certification candidate. This document records local verification only and does not self-approve EP-015.

## Repository integrity

- Baseline: `v0.14.1` / `ec6873e5945113a79553e5aa1f9614e2082c1f9a`.
- Working branch: `ep-015`.
- Required source evidence trees remain tracked: `src/core/evidence` and `src/resources/evidence`.
- Packaging uses tracked files from the exact implementation commit; ignored build, dependency, raw evidence, and report folders are excluded.

## Verification

- Clean install completed; dependency audit found 0 vulnerabilities.
- Astro checked 174 files with 0 errors, warnings, or hints.
- Resources: 9 packs and 9 tools; diagnostics: 14 journeys.
- Evidence: 5 reviewed interpreters and 12 executable synthetic fixtures.
- References: 14 reviewed; discovery: 123 records and 71 canonical signals.
- Unit tests: 387/387 passed across 25 files.
- Build validation: 67 routes, metadata, internal links, robots, and sitemap passed.
- Browser matrix: 203 passed, 13 intentional hosted-preview/mobile-desktop skips, 0 failed across Chromium, Firefox, WebKit, and mobile; retries disabled.
- Budgets: peak JavaScript 13.2 KB gzip, CSS 6.5 KB gzip, transfer 243.9 KB, and 5 requests.
- Lighthouse, five representative routes: Performance 99; Accessibility 100; Best Practices 100; SEO 100.
- Security headers: 69 rules for 67 HTML routes; 65 unique inline-script hashes; longest header/CSP line 410 characters.

Lighthouse completed all audits and reports; Windows emitted non-fatal temporary-profile cleanup warnings after the scores were written.
