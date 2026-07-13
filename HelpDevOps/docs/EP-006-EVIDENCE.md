# EP-006 Verification Evidence

Status: implementation candidate; not self-approved.

## Verified in the primary implementation environment

- Clean `npm ci`: 456 packages installed; 457 packages audited.
- Dependency audit: 0 vulnerabilities at the configured high threshold.
- Astro check: 115 files, 0 errors, 0 warnings, 0 hints.
- Resource validation: 9 packs and 9 available tools; routes, analyzers and references verified.
- Unit tests: 260/260 passed across 16 files.
- Production build: 19/19 static pages generated.
- Static validation: 19 routes plus metadata, internal links, favicon, robots, sitemap, CSP/security headers and structured-data hashes passed.
- Structured-data CSP hashes: 15.
- Performance budgets: peak JavaScript 11.9 KB gzip; peak CSS 4.6 KB gzip; peak transfer 31.1 KB; peak requests 5.
- Local Astro server: `/`, `/tools/dockerfile/`, `/tools/docker-compose/`, and `/tools/kubernetes-manifest/` returned HTTP 200 on an isolated port.

## Browser and Lighthouse limitation

Playwright browser execution was attempted. The configured Chromium, Firefox, WebKit, and mobile projects stopped at browser launch because the required Playwright browser executables were unavailable in this environment. These are environment launch failures, not application failures, and are not reported as passes. Lighthouse was not claimed because a supported browser was unavailable.

A narrow ChatGPT Work verification should therefore cover only the three new routes, Universal Input transfer, explicit workspace save/reopen, accessibility, desktop/mobile/200%-equivalent reflow, and homepage/new-route Lighthouse. Existing unchanged EP-005 flows do not require another broad audit unless a regression is observed.

## Capability boundary

- Dockerfile analysis does not execute builds, inspect build context, resolve images, or scan the resulting image.
- Compose analysis does not resolve interpolation, env files, profiles, referenced files, build context, or engine runtime behavior.
- Kubernetes analysis is not cluster-aware OpenAPI, CRD, admission, RBAC, quota, defaulting, or live-state validation.
- Findings are bounded review signals and do not prove production correctness or security.
- Input remains browser-local unless the user explicitly saves a workspace.

## Delivery integrity

The candidate snapshot is created only after removing/ignoring dependencies, builds, caches, browser output, raw evidence, logs, screenshots and temporary files. Snapshot validation must confirm portable forward-slash paths, clean extraction, required recovery files, no nested archive, no credentials/personal paths, and no `.git` directory.
