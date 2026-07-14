# EP-013 Evidence

Status: commit-ready candidate pending focused technical review and owner full browser certification.

## Executed in the implementation environment

- Clean dependency installation: passed.
- Dependency audit: 0 vulnerabilities.
- Dependency license inventory: passed.
- Astro/source/resource validation: 160 files, 0 errors, 0 warnings, 0 hints; 9 packs, 9 tools, 14 journeys, 5 interpreters, 12 fixtures, 14 references, 123 discovery records, and 71 canonical signals.
- Unit tests: 366 passed across 21 files.
- Production build: 67 routes and 64 structured-data hashes.
- Route, metadata, internal-link, robots, and sitemap validation: passed.
- Performance budgets: 13.0 KB peak JavaScript gzip, 5.4 KB CSS gzip, 220.0 KB peak transfer, 5 requests.
- Core archive certification: passed.
- Preview build robots policy: `noindex,nofollow` confirmed.
- Production source gate: correctly blocked while the placeholder canonical domain remains.

## Environment limitation

Playwright browser executables were unavailable. The browser download attempt failed because `cdn.playwright.dev` could not resolve. No browser, visual-regression, or Lighthouse pass is claimed for EP-013 implementation. The owner full certification command intentionally requires those browser gates from a clean Git repository before preview deployment.

## Integrity

Generated `release-certification/`, dependencies, build output, reports, screenshots, and ZIP files are excluded from the repository snapshot. No commit, push, deployment, domain configuration, or EP-014 work occurred.


## Focused remediation

The certification manifest now captures actual test, browser, resource, route, budget, license, snapshot, recovery, source and package totals. Deployment is bound to a current successful full certification and matching release ZIP checksum. Wrangler invocation is Windows-safe through `npm exec`. Legacy `licenses` arrays are recognized and unresolved license metadata now fails the gate. Certification rechecks Git cleanliness after all commands.

## Final certification-integrity remediation

Snapshot evidence parsing now accepts the validator's actual `forward-slash entries` wording as well as the earlier `portable entries` wording, and full certification fails if archive-entry or recovery-file totals are missing. Deployment and full certification both require complete, internally consistent browser evidence for Chromium, Firefox, WebKit, and mobile; a partial project set, an empty project, aggregate mismatch, or any project failure is rejected.
