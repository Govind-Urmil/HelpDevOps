# HelpDevOps

Website Factory Project #2.

Trusted, free, privacy-first, browser-based DevOps workspace.

## Roles
- Govind: Product Owner and final approval
- ChatGPT: research, product design, architecture, implementation when assigned, and independent review
- ChatGPT Work: repository implementation and testing when available

## Current release candidate

EP-004 / v0.4.0 adds four deterministic Developer Essentials: Encoding & Hash, IPv4 CIDR, Linux Permissions, and Git Reference tools. It also extends conservative Universal Input routing, versioned resources, validation, discovery, and regression coverage without changing the local-only static architecture.

EP-003 / v0.3.0 remains the deterministic core-tool baseline.

EP-002 / v0.2.0 remains the completed platform-shell and Obsidian Signal baseline.

## Commands

- `npm ci` — clean dependency installation
- `npm run dev` — local development
- `npm run validate:resources` — resource-pack validation
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
