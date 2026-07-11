# EP-002 Remediation Evidence

Release remains EP-002 / v0.2.0. No commit, push, deployment, production domain selection, production tool, or real Preflight capability was introduced.

## Confirmed remediations

- Portable snapshot: Node/AdmZip generator creates forward-slash entries; validation rejects backslashes/self-inclusion, extracts cleanly, and checks recovery files.
- Dependencies: Astro resolved 5.18.2 before remediation and is now pinned to patched 7.0.7. Lighthouse is pinned to unaffected 12.6.1. Final npm audit: zero vulnerabilities.
- Security gate: CI runs `npm audit --audit-level=high`; no force upgrades.
- Contract preservation: full 11,560-byte authoritative EP-002 specification restored; former condensed document renamed `EP-002-SUMMARY.md`.
- Repository policy: `.gitignore` documents dependencies, caches, build/test output, reports, profiles, logs, environments, and OS/editor files.
- Layouts: Base, Directory, Product, and Policy layouts now have distinct responsibilities.
- Components: navigation, metadata, search, primitives, and Result Contract boundaries extracted; intentional consolidations are recorded in `COMPONENT-ARCHITECTURE.md`.
- Information architecture: About removed from primary navigation and retained in the footer.
- Active state: centralized nested-route matching and `aria-current="page"` with visible styling; regression tests added.
- Lighthouse: CI/local 95 thresholds; missing favicon 404 fixed; current evidence-integrity run scored 99/100/100/100.
- Headers: central security policy separated from the `_headers` host adapter. Generic output has no HSTS.
- HSTS: disabled pending real HTTPS domain/subdomain approval; `includeSubDomains` also disabled.
- Edge/zoom: actual Edge 150 on Windows tested. A documented 200%-equivalent reflow viewport (1440x900 to 720x450) covered Home, Tools, and Privacy with no overflow or clipped landmarks; the search dialog remained inside the viewport.
- Canonical: `.example` remains centralized and production-channel validation blocks release while present.

## Evidence summary

- Astro check: 0 errors/warnings/hints after final source correction.
- Vitest: 9 passed.
- Playwright: 47 applicable cases passed; one desktop-only assertion skipped in the mobile project.
- Axe: zero serious/critical violations.
- Budgets remained far below EP-002 limits: JS 1.5 KB gzip, CSS 3.6 KB gzip, homepage 15.3 KB, and 3 requests.
- Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Snapshot: 99 portable entries, clean extraction, nine required recovery files.
- Extracted recovery: clean npm install, Astro check, 9 unit tests, ten-page build, security adapter, and output validation passed.

## Remaining consolidations and limitations

The intentional component consolidations in `COMPONENT-ARCHITECTURE.md` remain. The canonical domain is deliberately a non-production `.example` placeholder. HSTS remains a deployment decision. Edge evidence is Windows-specific. Lighthouse on this Windows/OneDrive environment writes a valid report but its Chrome launcher can emit an EPERM while removing its temporary profile; Linux CI is not subject to the same locked-profile behavior.
