# HelpDevOps

Website Factory Project #2.

Trusted, free, privacy-first, browser-based DevOps workspace.

## Roles
- Govind: Product Owner and final approval
- ChatGPT: research, product design, architecture, specifications and review
- ChatGPT Work: implementation, automated tests, manual site testing and bug fixing

## Current release

EP-002 / v0.2.0 implements the production platform shell with Astro static output, vanilla browser JavaScript, shared components, Universal Input and Decision Layer contracts, unified search, responsive navigation, truthful preview states, SEO, security headers, automated validators, Vitest, and Playwright.

## Commands

- `npm ci` — clean dependency installation
- `npm run dev` — local development
- `npm run check` — static and release checks
- `npm test` — unit tests
- `npm run build` — production build and security-header generation
- `npm run validate` — routes, metadata, links, sitemap, and robots validation
- `npm run audit:budgets` — compressed asset, transfer, and request budgets
- `npm run audit:dependencies` — blocks high/critical dependency advisories without automatic upgrades
- `npm run audit:lighthouse` — enforces 95+ Lighthouse category scores
- `npm run test:e2e` — Chromium, Firefox, WebKit, and mobile browser tests
- `npm run snapshot && npm run snapshot:validate` — create and verify the portable full snapshot

## Architecture

Static website + browser JavaScript + local processing. No backend, database, authentication, required APIs or paid dependencies without explicit approval.

The canonical origin is centrally configured in `src/config/site.js`. A production-channel source check fails while the `.example` placeholder remains.
