# HelpDevOps Production Checklist

Owner: Govind. HelpDevOps is not publicly deployed. Replace and verify all `[TODO]` infrastructure values before launch. This checklist complements the detailed Operations & Troubleshooting Runbook.

## Before implementation

- [ ] Approved EP scope and acceptance criteria exist
- [ ] Architecture/security/privacy boundaries are unchanged or explicitly approved
- [ ] Operational failure modes and authoritative resources are identified
- [ ] A clean authoritative `main` baseline and starting commit are recorded

## Before commit

- [ ] Review `git status`, `git diff` and every new file
- [ ] Run clean install, audit, check, resource validation, unit tests, build, route validation and budgets
- [ ] Run Chromium, Firefox, WebKit, mobile, accessibility, keyboard, focus and reflow checks
- [ ] Run Lighthouse on changed critical routes
- [ ] Scan secrets, personal paths, stale terminology and stale current-release wording
- [ ] Confirm no raw reports, screenshots, build output, dependencies, caches, logs or nested archives
- [ ] Update permanent evidence, runbook and checklist where applicable
- [ ] Create and freshly extract the portable snapshot; confirm its SHA-256

## Before push

- [ ] Govind approved the exact diff and commit message
- [ ] Commit contains only required source, tests, operations and maintenance files
- [ ] Local branch/remote/account are correct
- [ ] Remote changes are fetched and divergence understood
- [ ] No force push is planned

## Before deployment

- [ ] `[TODO: GitHub repository]` and `[TODO: production branch]` verified
- [ ] `[TODO: Cloudflare project]` and deployment workflow verified
- [ ] Intended commit and release metadata recorded
- [ ] Last known-good release and rollback procedure tested
- [ ] Secrets/configuration use provider controls, not repository files
- [ ] Production build and security headers validated

## Immediately after deployment

- [ ] `[TODO: production URL]` loads over HTTPS
- [ ] Homepage, navigation, search, Universal Input and production tools work
- [ ] Mobile and one major desktop browser checked
- [ ] No serious console errors or unexpected network requests
- [ ] Security headers, robots and sitemap verified
- [ ] Deployed commit/release matches intent

## After custom-domain configuration

- [ ] `[TODO: custom domain]`, DNS records and TLS mode documented
- [ ] Apex/hostnames, redirect behavior and certificate verified
- [ ] Canonical URLs and sitemap use the real domain
- [ ] DNS/domain rollback procedure verified

## Routine maintenance

- [ ] Review dependency advisories and provider/repository access
- [ ] Check broken links, metadata, performance and browser compatibility
- [ ] Verify runbook contacts/placeholders remain current
- [ ] Preserve incident and release records

## Resource update

- [ ] Use authoritative source and record review/version metadata
- [ ] Preserve IDs unless intentionally migrating them
- [ ] Run resource validation, affected unit regressions, full build and routes
- [ ] For IANA ranges, validate CIDR, overlaps/classification and truthful limits
- [ ] Keep a safe Git rollback path; do not store backup copies in the repository

## Dependency update

- [ ] Use npm and preserve `package-lock.json`
- [ ] Review changelog/advisory and avoid unrelated upgrades
- [ ] Run `npm ci`, audit, complete tests/build/browser/budgets
- [ ] Confirm bundle/request budgets and static architecture remain intact

## P1 recovery verification

- [ ] Stop further damage and restore last known-good production
- [ ] Verify URL/domain/HTTPS, homepage, navigation, search and tools
- [ ] Verify headers, robots, sitemap and release identity
- [ ] Investigate root cause separately from restoration
- [ ] Add regression, deploy permanent fix normally and record incident

## Pre-go-live final readiness

- [ ] Runbook/checklist verified against the actual GitHub repository
- [ ] Actual Cloudflare project and deployment workflow documented
- [ ] Production branch, domain, DNS, TLS and rollback process tested
- [ ] Current production-tool smoke tests documented and performed
- [ ] Monitoring/incident ownership and last known-good release defined
- [ ] Govind gives final approval

HelpDevOps cannot publicly launch until the Operations & Troubleshooting Runbook and Production Checklist reflect and have been verified against the real GitHub repository, Cloudflare project, deployment workflow, production branch, custom domain, DNS, TLS, rollback process and current production tools.
