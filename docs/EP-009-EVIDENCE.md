# EP-009 Evidence

## Candidate

- Release: EP-009 / v0.9.0
- Status: audit candidate
- Architecture: static Astro, vanilla browser JavaScript, no backend, no authentication, no database, no remote analysis service

## Verification performed

- Clean `npm ci`: 456 packages installed
- Dependency audit: 0 vulnerabilities
- Astro check: 138 files, 0 errors, 0 warnings, 0 hints
- Tool resources: 9 packs and 9 tools validated
- Diagnostic resources: 8 reviewed journeys validated
- Evidence resources: 5 reviewed interpreters and 12 executable synthetic fixtures validated
- Unit tests: 311/311 passed across 18 files
- Production build: 39/39 static routes generated
- Route, metadata, internal-link, robots, sitemap, favicon, CSP, and security-header validation: passed
- Structured-data hashes: 36
- Budgets: peak JavaScript 12.6 KB gzip; CSS 5.0 KB gzip; transfer 52.6 KB; 5 requests

## Safety and privacy evidence

- Evidence parsing is bounded to 64 KB, 5,000 lines, and 16 KB per line.
- Structured evidence is preferred; human-readable recognition is labelled accordingly.
- Results separate observations, interpretations, unknowns, and next checks.
- Terraform lock age is never used to declare staleness.
- Full Docker configuration is not echoed; only allowlisted state fields are formatted.
- Lone Kubernetes status tokens are not treated as full structured evidence.
- Raw evidence is not saved automatically.
- Interpretation-only workspace saving omits raw evidence by default; users may explicitly opt in to saving raw evidence after privacy review.
- No command execution, backend request, AI interpretation, or live-infrastructure access was introduced.

## Deferred environment-specific checks

A targeted Playwright run was attempted, but the browser matrix did not complete in the primary environment. The following remain deferred for the consolidated ChatGPT Work verification pass:

- Chromium, Firefox, WebKit, and mobile interpreter flows
- Universal Input evidence transfer in real browsers
- interpretation-only and raw-evidence workspace save/restoration
- accessibility, keyboard, mobile, and 200%-equivalent reflow
- unexpected-network-request instrumentation
- Lighthouse for homepage, interpret hub, and representative interpreter pages

These checks are unverified, not failed or passed.


## Packaging recovery and extracted-package proof

The first EP-009 snapshot omitted `src/core/evidence/` and `src/resources/evidence/`. That incomplete package was rejected during technical review. The implementation and resources were reconstructed from the frozen specification, existing imports, pages, tests, and documentation. Snapshot recovery requirements now explicitly include the evidence interpreter source, parser modules, definitions, fixtures, and tests.

The corrected snapshot is validated from a brand-new extraction by running `npm ci`, `npm run validate:evidence`, `npm test`, and `npm run build`. A package is not considered commit-ready unless those extracted-copy checks pass.

## Technical-review remediation

A focused technical review of the recovered package identified four release blockers. The remediation completed the following:

- Docker structured detection now requires multiple Docker State fields or a Docker-specific formatted list record; generic JSON containing only `Status` is not classified as Docker evidence.
- Auto-detection now supports the reviewed POSIX `df -P` header family while retaining structural checks that reject unrelated percentage tables.
- Kubernetes Pod JSON now records current and previous termination reason, exit code, and signal separately and limits structured container/status processing to 50 entries.
- Evidence-save review now warns about operational identifiers such as email/owner values, Terraform state paths, private/internal IPs, and likely internal hostnames, including interpretation-only saves. Private-key material remains blocking.
- Evidence fixtures are executable validation inputs with expected parser and status metadata rather than provenance-only records.

Post-remediation verification must be taken from the final extracted package. The final evidence count is updated only after all release checks and fresh-extraction execution pass.

## Final remediation verification

- Clean `npm ci`: 456 packages installed.
- Dependency audit: 0 vulnerabilities.
- Astro/source/resource/diagnostic/evidence validation: passed.
- Unit tests: 311/311 passed across 18 files.
- Production build: 39/39 routes.
- Route, metadata, links, robots, sitemap, favicon, CSP, and security headers: passed.
- Budgets: peak JavaScript 12.6 KB gzip; CSS 5.0 KB gzip; transfer 52.6 KB; 5 requests.
- Final package validation is performed again from a brand-new extraction before approval.
