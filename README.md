# HelpDevOps

Website Factory Project #2.

Trusted, free, privacy-first, browser-based DevOps workspace.

## Roles
- Govind: Product Owner and final approval
- ChatGPT: primary research, product design, architecture, implementation, core verification, documentation, and commit-ready packaging
- ChatGPT Work: focused environment-specific browser, Lighthouse, visual, and independent technical verification when those checks cannot be completed here

## Current release candidate

EP-007 / v0.7.0 adds the first reviewed diagnostic platform: crawlable troubleshooting hubs, guided evidence-first journeys, explicit safety labels, emergency view, and three pilot journeys for Linux disk pressure, Docker container exits, and Kubernetes Pod Pending.

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
