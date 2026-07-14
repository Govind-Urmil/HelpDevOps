# HelpDevOps

Website Factory Project #2.

Trusted, free, privacy-first, browser-based DevOps workspace.

Current release: **EP-012 / v0.12.0**. The product now connects local deterministic analysis to reviewed guidance, explicit browser-local continuity, verification, and privacy-controlled Incident Brief handover.

Owner release gate: `npm run verify:release`. Browser assurance: `npm run verify:browsers`. Recovery guidance: `docs/OWNER-QUICK-RECOVERY.md`.

## Roles
- Govind: Product Owner and final approval
- ChatGPT: primary research, product design, architecture, implementation, core verification, documentation, and commit-ready packaging
- ChatGPT Work: focused environment-specific browser, Lighthouse, visual, and independent technical verification when those checks cannot be completed here

## Current release candidate

EP-008 / v0.8.0 expands the reviewed diagnostic platform to eight high-intent journeys.

EP-006 / v0.6.0 remains the completed container and Kubernetes engineering baseline.

EP-005 / v0.5.0 remains the completed privacy-first local continuity baseline.

EP-004 / v0.4.0 remains the completed developer-essentials and owner-operations baseline.

## Commands

- `npm ci` — clean dependency installation
- `npm run dev` — local development
- `npm run validate:resources` — tool resource-pack validation
- `npm run validate:diagnostics` — diagnostic structure, relationship, safety, and review validation
- `npm run check` — Astro, resource, source, and release checks
- `npm test` — unit tests
- `npm run build` — production build and security-header generation
- `npm run validate` — routes, metadata, links, sitemap, and robots validation
- `npm run audit:budgets` — compressed asset, transfer, and request budgets
- `npm run audit:dependencies` — high/critical dependency audit
- `npm run audit:lighthouse` — Lighthouse thresholds when a browser is available
- `npm run test:e2e` — Chromium, Firefox, WebKit, and mobile browser tests when browser binaries are available
- `npm run snapshot && npm run snapshot:validate` — create and verify the portable commit-ready snapshot

## Architecture

Static Astro website + vanilla browser JavaScript + local processing. No backend, database, authentication, required remote APIs, or paid dependencies without explicit approval.

Routine resource maintenance is documented in `docs/RESOURCE-MAINTENANCE-GUIDE.md`.


## EP-009 Evidence Interpreter Foundation
Five bounded, browser-local evidence interpreters connect supported command output to observations, interpretations, unknowns, safe next checks, and reviewed diagnostic journeys. Raw evidence is not saved automatically. Routine wording, examples, references, limitations, and fixtures remain resource-maintained.

## EP-011 operational coverage
Reviewed troubleshooting now includes Git push rejection, Jenkins agent offline, DNS resolution, connection refused, cron jobs, and shell execution failures.

## Release certification

Use `npm run verify:release` for fast health checks, `npm run certify:release:core` for strict non-browser gates, and `npm run certify:release` before preview deployment. See `docs/RELEASE-CERTIFICATION.md` and `docs/OWNER-RELEASE-CHECKLIST.md`.

## EP-014 preview workflow

HelpDevOps now supports certification-bound Cloudflare Workers Static Assets preview deployment. Set `PUBLIC_SITE_URL` to the exact HTTPS preview Worker URL, run full certification, deploy with `npm run deploy:preview`, then execute the live HTTP and hosted-browser checks. Production deployment remains blocked until an approved hostname is configured.
