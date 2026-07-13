# EP-011 Evidence

## Completed verification
- Clean dependency installation: 456 packages.
- Dependency audit: 0 vulnerabilities.
- Astro: 146 files, 0 errors, 0 warnings, 0 hints.
- Tool resources: 9 packs and 9 tools.
- Diagnostic resources: 14 reviewed journeys.
- Evidence resources: 5 reviewed interpreters and 12 executable fixtures.
- Reference resources: 14 reviewed references.
- Discovery: 123 typed records and 71 canonical error/symptom entries.
- Unit tests: 341/341 passed across 19 files.
- Production build: 65 static routes.
- Metadata, canonical links, internal links, robots, sitemap, favicon, CSP and security headers: passed.
- Structured-data hashes: 63.
- Peak JavaScript: 13.2 KB gzip.
- Peak CSS: 5.2 KB gzip.
- Peak transfer: 219.2 KB.
- Peak requests: 5.

## Environment-specific checks
Full browser matrix, visual QA, accessibility/reflow, workspace browser regression, network instrumentation and Lighthouse remain deferred to the consolidated EP-012 hardening pass. They are not claimed as passed here.

## Focused remediation verification
- Canonicalized case-equivalent journey signals; exact-error status takes precedence over aliases.
- Discovery IDs are globally unique and stable across equivalent case/spacing inputs.
- Search ranking uses whole tokens and bounded token-prefix matching rather than unsafe substring matching.
- Negative collision fixtures confirm `lock` does not match `blocks` or filesystem results.
- Discovery validation now rejects duplicate IDs, duplicate normalized signals, duplicate visible error records, and inconsistent equivalent-query ranking.

## Package verification
- Final archive: 354 portable forward-slash entries.
- Fresh extraction: dependency installation, source/resource/discovery validation, 341 unit tests, 65-route production build, route/link/metadata validation, and performance budgets passed.
- Prohibited package entries: none found (`.git`, dependencies, build output, raw reports, nested ZIPs, and non-portable paths excluded).
- The nested snapshot-validation wrapper exceeded this environment's execution window; the same fresh-extraction gates were run directly and passed.
