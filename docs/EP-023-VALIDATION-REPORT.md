# EP-023 validation report

## Tested candidate

- Baseline SHA: `2f7e58205c756b0a004e94286e2a5893921e3507`
- Candidate version: `0.23.0` / `EP-023`
- Production URL: `https://helpdevops.work-on.workers.dev/`
- Candidate commit SHA: pending final commit

## Executed results

- Fresh locked install: 474 packages added; 475 audited; 0 vulnerabilities.
- Source/type/content gate: 225 files, 0 errors, 0 warnings, 0 hints. Nine packs, nine tools, 37 investigations, five evidence interpreters, 12 evidence fixtures, 14 reviewed reference resources, 256 discovery records, 179 canonical entries, 100 operational issue families, 300 fixtures, 100 coverage rows, 15 issue entries, and nine governed technologies passed.
- Unit and contract tests: 501 passed across 38 files.
- Production build: 114 pages and 100 Cloudflare header rules; 98 unique inline-script hashes; HSTS enabled.
- Route/build validation: 114 routes, metadata, canonical URLs, internal links, robots, sitemap, and generated headers passed.
- Performance budgets: 114 routes passed; peak JavaScript 18.7 KB gzip, CSS 8.9 KB gzip, transfer 216.0 KB, and 10 requests.
- Dependency audit: 0 vulnerabilities at the configured high threshold.
- Browser matrix:
  - Chromium: 74 passed, 3 hosted-preview-only skips.
  - Firefox: 74 passed, 3 hosted-preview-only skips.
  - WebKit final rerun: 74 passed, 3 hosted-preview-only skips.
  - Mobile (Pixel 7): 73 passed, 4 intentional desktop/hosted-only skips.
  - One initial WebKit Tools-page locator timeout was not reproducible: the exact test passed three consecutive isolated repetitions and the complete WebKit rerun passed.
- Browser coverage includes navigation, search exact/no-result states, valid and malformed tools, investigations, workspace/session dock, clipboard/download behavior, exports/imports, back/restart state, 404 behavior, keyboard flow, focus, axe checks, 200% equivalent reflow, reduced motion, responsive layouts, and console-error assertions.
- Lighthouse final run, one attempt per page:
  - Homepage: 96 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 2,500 ms; CLS 0; TBT 0 ms.
  - Search directory: 99 / 100 / 100 / 100; LCP 1,862 ms; CLS 0; TBT 0 ms.
  - Complex investigation: 98 / 100 / 100 / 100; LCP 2,174 ms; CLS 0; TBT 0 ms.
  - Technology directory: 100 / 100 / 100 / 100; LCP 1,666 ms; CLS 0; TBT 0 ms.
  - Issue page: 100 / 100 / 100 / 100; LCP 1,664 ms; CLS 0; TBT 0 ms.
  - 404: 100 / 100 / 100 / 66; LCP 1,667 ms; CLS 0; TBT 0 ms. The SEO score reflects the required noindex error-page policy.

## Exact diagnostic totals

- Investigations: 37
- Nodes: 405
- Directed choices/branches: 818
- Terminal states: 77
- Unreachable paths: 0
- Reachable graph cycles: 0
- Actions: 65
- Displayed commands: 144
- Journey references: 61

## Explicit limitations

- Chrome DevTools trace tooling was not configured, so trace-level network-chain, long-task, and INP evidence is not claimed. Lighthouse lab TBT was available and was 0 ms on all six pages.
- Lighthouse generated valid reports and passed, while Chrome on Windows emitted known temporary-profile cleanup `EPERM` warnings after report creation.
- Hosted-preview-only browser checks were skipped by their existing environment guard because this run targeted the local production build.
- Production smoke and deployed-SHA evidence remain pending until the validated snapshot is committed and deployed.
