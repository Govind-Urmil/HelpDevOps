# EP-021 final remediation validation evidence

## Validation summary

- Dependency audit: 0 known vulnerabilities at the configured high-severity gate.
- Astro and source validation: 215 files, 0 errors, 0 warnings, 0 hints.
- Unit and contract tests: 486 passed across 36 files.
- Production build: 97 pages generated successfully.
- Generated-output validation: 97 routes passed metadata, internal-link, robots, and sitemap checks.
- Performance budgets: passed on all 97 routes; peak JavaScript 18.3 KB gzip, peak CSS 8.8 KB gzip, peak transfer 204.6 KB, peak requests 10.
- Browser suite: 279 passed across Chromium, Firefox, WebKit, and mobile; 13 hosted-preview-only cases skipped by their existing environment guard.
- Required viewport checks: 1440, 1280, 1024, 768, 390, 360, and 320 CSS pixels passed without horizontal overflow.
- Accessibility: targeted axe checks passed with no serious violations.
- Lighthouse: homepage performance 96; representative tool performance 99; accessibility, best practices, and SEO 100 on all five audited routes.

Lighthouse emitted Windows temporary-directory cleanup warnings after producing the reports. The audit command exited successfully and all required score gates passed.

## Scope evidence

- The discontinued product route now resolves through the normal 404 path and is absent from navigation, sitemap, search, capability registries, and current product source.
- Public output contains no engineering EP/version labels.
- Correction reporting appears on Workspace only, not in the global layout or footer.
- The previous large rotating homepage demo and its scenario timer were removed.
- The new decorative network pauses under reduced motion, while offscreen, and while the document is hidden.
- Internal `site.ep`, package version, and historical release documentation remain as maintenance metadata and engineering history; they are not rendered publicly.

## Release contents

The final archive is created from the Git manifest and excludes `.git`, dependencies, build output, browser reports, caches, evidence captures, local logs, and nested archives. A fresh extraction is validated separately before certification.
