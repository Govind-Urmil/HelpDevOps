# EP-007 Evidence

Candidate status: independently reviewed diagnostic resources; final release approval still required.

## Completed verification

- Clean dependency installation: 456 packages.
- Direct diagnostic schema dependency: zod 4.4.3 (development/build validation only).
- Dependency audit: 0 vulnerabilities.
- Astro check: 124 files, 0 errors, 0 warnings, 0 hints.
- Tool resources: 9 packs and 9 tools passed.
- Diagnostic validation: 3 journeys passed structural, relationship, safety, fallback, rollback, verification and review-metadata checks.
- Unit tests: 276/276 passed across 17 files.
- Production build: 26 static routes.
- Route, metadata, internal-link, robots, sitemap, favicon and security-header validation: passed.
- Structured-data CSP hashes: 23.
- Performance budgets: peak JavaScript 12.0 KB gzip, peak CSS 5.0 KB gzip, peak transfer 50.0 KB, peak requests 5.
- Local HTTP checks: homepage, troubleshoot hub and all three pilot routes returned HTTP 200.

## Independent technical and browser review

ChatGPT Work independently reviewed the Linux, Docker, and Kubernetes journeys and found all three technically acceptable for promotion to `reviewed`. The browser matrix completed with 163 passes, one intentional mobile navigation skip, and no failures. Accessibility, Emergency View, Firefox cross-tab regression, and 200%-equivalent reflow checks passed.

The review found one release blocker: Universal Input hardcoded `reviewed` wording even when a journey remained a technical-review candidate. The remediation now derives all discovery status language from the journey resource status and includes regression coverage for both candidate and reviewed records.

Two non-blocking review notes were incorporated: Docker inspect output now warns that environment/configuration values may require redaction, and Linux disk-usage commands state that insufficient permissions can produce incomplete results.

## Final integration remediation

The final targeted browser pass found one integration collision: the diagnostic journey root reused `data-workspace-title`, causing the Session Dock client to select a section instead of the real title input and throw before IndexedDB persistence. The remediation gives the Session Dock title input a dedicated `data-workspace-title-input` contract, renames the journey metadata attribute to `data-workspace-entity-title`, and adds a regression check that the selector remains unique and input-only.

Diagnostic workspace save/restoration, expanded network/privacy verification, and Lighthouse remain for one final targeted environment pass. Raw browser and Lighthouse reports are not committed.
