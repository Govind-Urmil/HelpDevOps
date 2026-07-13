# HelpDevOps Operations & Troubleshooting Runbook

Primary reader: Govind, HelpDevOps owner. This is the owner-safe first response guide. HelpDevOps is not publicly deployed. Replace every `[TODO: ...]` infrastructure placeholder and verify it before launch.

## Severity and emergency principle

- **P1 — CRITICAL:** site unavailable to most users; materially wrong systematic results from a major tool; security/privacy incident; corrupted release; domain/TLS outage; major cross-browser failure.
- **P2 — MAJOR:** one production tool or major browser broken; navigation/search materially broken; serious accessibility regression; major performance degradation.
- **P3 — MINOR:** cosmetic defect; isolated copy failure with fallback; minor documentation defect; low-impact browser inconsistency; routine maintenance.

When uncertain between two severities, initially use the higher severity until impact is understood.

For P1, separate **RESTORE SERVICE** from **FIX ROOT CAUSE**:

Incident → Stop further damage → Restore last known-good production → Verify recovery → Investigate root cause → Develop permanent fix → Test → Deploy normally → Record incident.

Do not experiment in production. Preserve failing inputs, timestamps, screenshots without secrets, intended release hash, and observed behavior.

## Production site is down — P1

**Check:** confirm from another network/browser; check `[TODO: production URL]`, `[TODO: Cloudflare project]`, deployment status, DNS/TLS, and the last Git/deployment change.  
**Safest restore:** stop any active rollout. Redeploy or roll back to the documented last known-good release through `[TODO: verified deployment workflow]`. Do not rebuild an old release from memory.  
**Verify:** URL, HTTPS, homepage, navigation, one production tool, headers, robots and sitemap.  
**Prevent:** record cause, release hash, rollback duration and monitoring improvement.

## Site loads but tools do not work — P1/P2

**Check:** reproduce with a non-secret example; inspect browser console and network activity; test another tool/browser; confirm the deployed assets match the intended Git release.  
**Safest fix:** if widespread or misleading, restore the last known-good release. If isolated, disable or clearly label the affected capability only through a reviewed change.  
**Verify:** supported examples, invalid inputs, keyboard use, mobile and no unexpected request. Add a regression test.

## One tool gives wrong results — P1/P2

1. Preserve the exact failing input and expected/actual output.
2. Confirm reproducibility without secrets.
3. Compare with its authoritative specification/reference.
4. Identify affected tool and release.
5. Determine whether the defect is systematic.
6. Treat materially misleading systematic results as P1 where appropriate.
7. Restore the last known-good release if required.
8. Add a failing regression test, implement the narrow fix, run all gates, deploy normally, and record root cause.

Tool-specific anchors: Cron—field/range/step parsing; JSON/YAML—syntax, aliases and classification-only limits; Encoding/Hash—UTF-8, strict/tolerant decode and SHA algorithm; IPv4—unsigned arithmetic, contiguous masks and curated IANA ranges; Linux permissions—owner/group/other and special bits; Git references—selected context versus revision explanation, never repository resolution; Universal Input—high-confidence routing and unknown fallback.

## Deployment failed — P1/P2

**Check:** first genuine deployment log error, intended commit, branch, Node version, build output, configuration and provider status.  
**Safest fix:** leave the working production deployment in place. Fix source/configuration through the normal reviewed flow; do not repeatedly retry a broken release.  
**Verify:** deployment identifies the intended commit and passes the recovery checklist.

## Custom domain stopped working — P1

**Check:** registrar status, DNS records, Cloudflare domain binding, certificate/TLS status and recent changes. Values are `[TODO: domain]`, `[TODO: DNS records]`, `[TODO: TLS mode]`.  
**Safest fix:** restore the last documented working DNS/domain configuration. Avoid speculative record changes. DNS propagation can take time.  
**Verify:** apex and intended hostnames, HTTPS certificate, redirects and multiple networks.

## Browser shows an old version — P2/P3

Compare release metadata and deployed commit first. Check provider/CDN cache, service workers (none are expected unless deliberately added), and browser cache. Use a private window and cache-busting request for diagnosis. Purge only the correct project cache when justified. Verify assets and footer metadata match the intended release.

## Security credential was exposed — P1

1. Assume exposed; revoke or rotate immediately.
2. Determine affected systems and review unauthorized use where possible.
3. Replace safely and remove from current source.
4. Determine whether expert-assisted history cleanup is necessary.
5. Rescan repository, verify deployment configuration, and record the incident.

Deleting a secret from the latest commit does not remove exposure. For GitHub/Cloudflare credentials, use the provider’s revocation and audit controls. Suspicious repository access is P1 until scoped.

## Repository was accidentally damaged — P1/P2

First run `git status`, `git diff`, `git log --oneline -10`, and `git branch --show-current`. Do not commit or push while uncertain.

- **OWNER-SAFE:** inspect status/diff/log; switch to the known branch when clean; restore one uncommitted tracked file with `git restore -- path`; restore a deleted tracked file the same way; make a fresh clone; compare files or release hashes.
- **OWNER-SAFE WITH CAUTION:** resolve a small understood merge conflict; use `git revert <commit>` for an already-pushed bad commit; remove an accidentally committed file in a new commit after checking whether it contained a secret.
- **EXPERT ASSISTANCE RECOMMENDED:** history rewrite, force push, complex conflicts, lost commits, suspected credential exposure, or damaged shared main.

Do not use `git reset --hard` or force push as a routine fix. Preserve work first and prefer `git restore`, `git revert`, a backup branch, or a clean clone.

Common cases:

- Wrong branch: inspect status; only switch when changes are safely committed/stashed or absent.
- Push rejected: fetch and inspect divergence; do not force. Rebase/merge only under the project workflow.
- Authentication/wrong account: inspect credential manager and `git remote -v`; authenticate the intended owner account.
- Merge conflict: pause, preserve both sides, resolve only understood files, then run all tests.
- Accidentally committed file: if unpushed, seek assistance before rewriting; if pushed, make a corrective commit. Rotate any secret regardless.
- Last known-good: use release records and `git log`; verify the chosen commit’s checks/package hash.
- Clean rebuild: fresh clone → checkout intended commit → `npm ci` → verification commands.
- Package comparison: compare SHA-256 and extracted tree; the package must have no `.git`, dependencies, build output or raw reports.

## Build suddenly fails — P2

Diagnose in this order:

1. Confirm Node version (`node --version`; repository requires Node 22.12+).
2. Confirm repository, branch and remote.
3. Confirm clean working tree.
4. Run `npm ci`.
5. Run `npm run check`.
6. Run `npm run validate:resources`.
7. Run `npm test`.
8. Run `npm run build`.
9. Read the first genuine failure.
10. Fix the root cause and rerun the complete gates.

Never delete `package-lock.json` as a generic troubleshooting step. “npm not recognized” usually means Node/npm is not installed or PATH needs a new terminal. For PowerShell execution-policy errors, use the approved environment policy or `npm.cmd`; do not lower machine security broadly. An `npm ci` lock mismatch means package.json and lockfile disagree—repair them through a reviewed dependency update. Astro/type failures point to reported files. Unit/resource failures must not be bypassed. Missing routes/links are handled by build validation. Dependency advisories require impact review and a tested supported upgrade; do not blindly update major versions.

## Resource update broke the site — P1/P2

Preserve the failing resource and validator output. Restore the last known-good resource file with Git, validate, test and build, then deploy normally. Never duplicate backup resources inside the repository.

Typical causes: duplicate resource ID; unknown capability/input kind; missing analyzer/route; broken related-tool ID; malformed JSON/schema mismatch; planned tool marked available; release metadata mismatch; stale source. For IANA IPv4 updates, use the official registry, preserve valid CIDR prefixes and unique identities, update review/version metadata, test overlapping/special ranges, and do not infer network reachability or ownership.

## Performance suddenly degraded — P2

Compare the intended release, route budgets and Lighthouse report with the prior known-good release. Check newly referenced assets, request count, third-party requests, large data, cache configuration and browser scope. Restore last known-good if users are materially affected. Fix the specific asset/code path; do not relax budgets to hide regression.

## Security and privacy checks

Unexpected network request, unsafe user-input rendering, missing CSP/security header, personal path leak or serious dependency advisory is at least P2 and may be P1. Preserve evidence without secrets. Compare central security policy and generated headers; test hostile input as text; search source/package for secrets and local Windows user-profile paths. Do not add analytics, remote APIs or credential-bearing code during incident response.

## Recovery verification checklist

- [ ] `[TODO: production URL]` loads
- [ ] `[TODO: custom domain]` loads
- [ ] HTTPS works
- [ ] Homepage renders; navigation and search work
- [ ] Universal Input and all available production tools work
- [ ] Mobile layout and keyboard/focus behavior work
- [ ] No serious console errors or unexpected network requests
- [ ] Security headers are present
- [ ] `robots.txt` and sitemap work
- [ ] Release metadata is correct
- [ ] Latest regression tests pass
- [ ] Deployment matches the intended Git release

Production URL, domain, TLS, DNS, provider deployment and rollback checks cannot be finalized until real infrastructure exists.

## Incident log template

```text
Incident ID:
Date/time:
Detected by:
Severity:
Affected release:
Affected functionality:
User impact:
First observed symptom:
Immediate action:
Rollback performed:
Service restored at:
Root cause:
Permanent fix:
Regression test added:
Prevention improvement:
Closed at:
```

## Maintenance rules

Every EP that introduces a new operational failure mode must update the Operations & Troubleshooting Runbook before the EP can be considered complete.

HelpDevOps cannot go live until the Operations & Troubleshooting Runbook and Production Checklist reflect and have been verified against the real deployed infrastructure.

## EP-005 local workspace incidents

### Saved workspace is missing — P2/P3

**Likely causes:** browser/site data was cleared, private browsing ended, browser storage was evicted, the user opened another browser profile/device, or the workspace was never explicitly saved.

**OWNER-SAFE:** confirm the same browser profile and origin are in use; open Workspace and check the saved list; import a previously exported HelpDevOps workspace JSON if available. Do not describe browser-local data as backup or cloud sync.

**Verify:** the workspace appears, opens the intended tool state, and current analysis can be rerun.

### Browser workspace storage is unavailable — P2 for continuity, not analysis

Core tools must continue working. Check browser privacy policy, blocked IndexedDB, quota errors, private mode, and other HelpDevOps tabs blocking an upgrade/delete. Close other tabs and retry. Export existing workspaces before risky browser cleanup.

### Private-mode data disappeared — P3

This is expected browser behavior. Explain that private-session storage is temporary. Restore only from an explicit export. Do not claim private-mode detection or guaranteed persistence.

### Quota exceeded or workspace too large — P2/P3

Do not delete existing workspaces automatically. Export important records, remove unneeded workspaces, reduce large raw inputs, and retry. The application limit is 512 KB per workspace, 100 workspaces, and 2 MB per import file; browser quota may be lower or higher.

### Import was rejected — P2/P3

Check JSON syntax, `format`, `formatVersion`, workspace schema version, known tool IDs, record limits, and sensitive-content findings. Existing data must remain unchanged. Never manually strip validation fields simply to force an import.

### Import or migration partially changed data — P1/P2

This should not occur. Preserve the file and browser details, stop further writes, export remaining data if possible, and treat it as a transaction/integrity defect. Add a regression before shipping a fix.

### Cross-tab revision conflict — P2/P3

Do not overwrite silently. Reload the latest workspace or save the local state as a copy. Close stale tabs if necessary. Complex collaborative merge is not supported.

### Clear-all did not complete — P2

Close other HelpDevOps tabs that may hold IndexedDB open, retry from Workspace, and verify favorites, recent tools and saved workspaces are gone. Avoid telling users to clear all browser data as the first-line application workflow.

### Sensitive content was accidentally saved or exported — P1/P2

1. Delete the affected workspace and clear local HelpDevOps data if required.
2. Delete exported copies from downloads, shared locations and backups under the user’s control.
3. If the value may have left the local browser or was shared, revoke/rotate it immediately.
4. Confirm HelpDevOps made no network transmission.
5. Add or improve a bounded warning regression without claiming complete secret detection.

### New release cannot open older workspace — P2

Do not wipe data. Record the stored schema/export version, preserve an export where possible, and fix the sequential migration or compatibility logic. An older release seeing a newer schema must refuse mutation and offer recovery guidance.

### IndexedDB blocked by another tab — P2/P3

Close other HelpDevOps tabs/windows, retry, and verify the operation. The application must report the block rather than hanging or silently deleting data.

## EP-006 container and Kubernetes tool incidents

### Dockerfile/Compose/Kubernetes input parses but a live command fails

Severity: usually P2 or P3 unless the guidance caused material production risk. Owner-safe first checks: preserve the exact input, confirm the HelpDevOps release, review the tool's **What was not checked** section, and reproduce with the authoritative live command (`docker build`, `docker compose config`, server-side Kubernetes validation, or `kubectl diff`) in a safe environment. HelpDevOps static inspection is not proof of engine/cluster acceptance. Add a regression fixture only when the local analyzer made an incorrect supported claim.

### A container/Kubernetes finding is misleading

Treat systematic unsafe or materially wrong guidance as P1-capable. Roll back the HelpDevOps release when necessary, preserve the input, compare with official Docker/Kubernetes documentation and a reproducible environment, correct the rule, add regression coverage, rerun all domain and release checks, and record the incident. Do not weaken limitations to hide the discrepancy.

## EP-007 diagnostic-platform incidents

Treat a systematically misleading diagnostic branch as a potential P1 correctness incident. Preserve the journey URL, selected answers, displayed command, affected release and authoritative counter-evidence. Disable or roll back the reviewed journey if necessary while leaving existing tools operational. Correct the resource, add a regression fixture, rerun diagnostic validation and technical review, then verify search, guided flow, emergency view, workspace restoration and static page content.

If a journey does not advance, first confirm JavaScript loaded without console errors, then validate node IDs and relationships with `npm run validate:diagnostics`. If the static summary loads but choices fail, restore the previous known-good release rather than editing production files.


## EP-008 diagnostic incidents
Treat unsafe unlock, destructive cleanup, weakened probes/security, or misleading HTTP-layer guidance as potentially P1. Preserve the failing path, roll back if needed, correct the resource and add a regression.


## EP-009 Evidence Interpreter Foundation
Five bounded, browser-local evidence interpreters connect supported command output to observations, interpretations, unknowns, safe next checks, and reviewed diagnostic journeys. Raw evidence is not saved automatically. Routine wording, examples, references, limitations, and fixtures remain resource-maintained.

## EP-010 resource incidents
If an operational journey gives a misleading result, preserve the input/path, disable or roll back the affected reviewed resource, add a regression fixture, rerun diagnostic validation, tests, build, and browser verification.


## Reference or discovery issue
If a reference is missing, a search result is wrong, or a link is broken: run reference and discovery validation, confirm the stable IDs and routes, rebuild, and verify the generated `/reference/` and `/errors/` pages before release.
