# Release Certification

## Commands

- `npm run verify:release` — fast development health check. Browser and Lighthouse checks may remain explicitly deferred.
- `npm run certify:release:core` — strict source, dependency, validator, test, build, metadata, security, and budget gates.
- `npm run certify:release` — deployment certification. Requires a clean Git tree, all browser projects, snapshot creation, snapshot validation, and a final ZIP checksum.
- `npm run certify:release:archive` — recovery-only core verification for a portable snapshot that intentionally has no `.git` directory.

## Mandatory full-certification prerequisites

1. Use the committed repository, not an extracted ZIP.
2. Run on the intended branch.
3. Ensure `git status --short` is empty.
4. Install Playwright browsers with `npm run browsers:install`.
5. Do not place credentials, account IDs, production domains, reports, or ZIPs inside the repository.

## Generated evidence

`release-certification/` contains `certification.json`, `certification.md`, and, for full certification, `checksums.txt`. This directory is temporary and excluded from Git and release snapshots. Never edit generated evidence by hand.

Full certification fails on any required unexecuted or failed browser/package gate. An intentional documented capability skip may remain a skip only when the suite explicitly models it.

## Certification evidence completeness

The generated `certification.json` records actual unit-test totals, browser totals by project, intentional skips, route and structured-data counts, resource counts, measured budgets, license status, snapshot/recovery totals, source commit, final clean-tree state, and release ZIP SHA-256. Command exit status alone is not treated as sufficient release evidence.

Certification checks Git cleanliness both before and after the build/package workflow. Retain `certification.json`, `certification.md`, `checksums.txt`, and the exact certified ZIP together outside the repository for rollback and audit purposes.

## Deployment binding

`npm run deploy:preview` and `npm run deploy:production` refuse to run unless `release-certification/certification.json` is a current successful **full** certification matching the current EP/version, current clean Git commit, browser evidence, and exact certified ZIP checksum. Core or archive certification cannot authorize deployment.

## Final certification evidence integrity

Deployment requires executed browser evidence for every configured mandatory project: Chromium, Firefox, WebKit, and mobile. Each project must contain at least one executed test, zero failures, and internally consistent passed/failed/skipped totals. Aggregate browser totals must exactly equal the sum of all project records.

Snapshot certification records both the portable archive entry count and recovery-file count. The parser accepts the validator's current `forward-slash entries` wording and the earlier `portable entries` wording so certification cannot silently emit a null archive count.

The certified ZIP path is local to the machine that produced the certificate. Retain the certificate, checksum file, and ZIP together. If the ZIP is moved and the certified path no longer exists, recertify before deployment rather than editing the generated manifest.
