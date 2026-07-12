# EP-003 Verification Evidence

## Passed in the implementation environment

- Clean dependency installation completed during implementation.
- Dependency audit: 0 vulnerabilities at the configured high threshold.
- Astro diagnostics: 81 files, 0 errors, 0 warnings, 0 hints.
- Resource validation: 2 resource packs and 4 registry tools passed, including enums, statuses, routes, analyzers, related tools, references, versions, limitations, and duplicate IDs.
- Source/release validation: passed.
- Vitest: 6 files, 58 tests passed.
- Production build: 12 static pages generated.
- Security-header generation: 11 structured-data hashes; HSTS remained disabled under the safe generic-host policy.
- Route, metadata, internal-link, robots, sitemap, and favicon validation: passed.
- Budgets: JavaScript 37.8 KB gzip, CSS 4.0 KB gzip, homepage 54.7 KB, 4 requests.
- Stale project terminology scan: clean after removing the obsolete duplicated workflow file.
- Generated reports, build output, dependencies, caches, logs, and local evidence are excluded from the commit-ready snapshot.

## Browser and Lighthouse remediation evidence

Final browser results: Chromium 15 passed; Firefox 15 passed; mobile 14 passed with one intentional desktop-navigation skip; WebKit 15 passed in the final single-worker verification. The initial concurrent WebKit run encountered a local worker crash and timeouts; the unchanged assertions passed when rerun without concurrency pressure.

Lighthouse: homepage 99/100/100/100; Cron Analyzer 100/100/100/100; structured-data tool 99/100/100/100 for Performance/Accessibility/Best Practices/SEO. Valid reports were written; Windows emitted a non-audit EPERM warning while cleaning temporary browser profiles.

Snapshot portability: 124 forward-slash entries, clean extraction, and 11 recovery files verified.

## Truthful scope

Compose and Kubernetes behavior is classification-only. No cluster, Docker Engine, environment, runtime, command execution, permissions, file existence, duplicate JSON key, or future cron run validation is claimed.
