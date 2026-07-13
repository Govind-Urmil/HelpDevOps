# EP-004 Remediated Verification Evidence

Final verification date: 2026-07-13. Status: remediation candidate pending independent audit and Govind’s approval. This document is a concise permanent summary; raw browser and Lighthouse reports are intentionally excluded by repository policy.

## Supported npm workflow and automated gates

- Clean dependency installation: the official npm 11.6.2 CLI ran `npm ci --ignore-scripts` against the committed `package-lock.json`; 449 packages installed and 450 packages audited.
- Dependency security: npm reported 0 vulnerabilities. The desktop environment did not expose npm directly, so the official npm CLI was invoked transiently; npm remains the project package manager and no pnpm lock is part of the repository.
- Astro/source: 0 errors, 0 warnings and 0 hints across 97 files. Release metadata, architecture, current-UI wording, terminology and snapshot requirements passed.
- Resources: 6 resource packs and 8 registered tools validated, including routes, analyzers, references and domain constraints.
- Unit tests: 184 passed in 11 files. Focused remediation coverage includes `HEAD` rejected in branch context but recognized as revision syntax; world-write detection for `0666`, `0606`, `0622`, `0002` and comparisons; special-bit preservation; stale-current-release prevention; obsolete workflow prevention; and snapshot raw-evidence hygiene.
- Production: 16 static routes built. Metadata, canonical data, internal links, robots, sitemap, generated security headers and structured-data hashes validated.
- Budgets: all 16 routes passed. Peak JavaScript 2.6 KB gzip; peak CSS 4.1 KB gzip; peak measured transfer 20.5 KB; peak requests 4.

## Browser matrix

The two-worker run executed 88 cases: 86 passed, one intentional mobile skip, and one unchanged WebKit Cron assertion timed out under concurrency. The complete unchanged WebKit platform spec was immediately rerun with one worker and all 13 tests passed, including that Cron case. Final validated coverage by project:

- Chromium: 22 passed.
- Firefox: 22 passed.
- WebKit: 22 validated (developer/navigation cases passed in the matrix; all 13 platform cases passed in the stable rerun).
- Pixel 7 mobile: 21 passed; one intentional skip because desktop primary navigation is hidden in the mobile project.

Coverage includes the six production tools, Universal Input, hostile-text rendering, search dialog, keyboard navigation, focus and focus return, mobile layout, accessibility with no serious/critical Axe findings, 200% equivalent CSS-viewport reflow, horizontal overflow, metadata and truthful 404 behavior.

## Lighthouse

| Route | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 99 | 100 | 100 | 100 |
| Encoding & Hash | 100 | 100 | 100 | 100 |
| IPv4 CIDR | 100 | 100 | 100 | 100 |
| Linux Permissions | 100 | 100 | 100 | 100 |
| Git Reference | 100 | 100 | 100 | 100 |

All reports were written, parsed and threshold-checked from the final build, then deleted. Windows emitted permission warnings while Lighthouse cleaned temporary browser profiles after scoring; this did not prevent report parsing or threshold enforcement.

## Security, privacy and manual limits

Automated checks found no credential-like tokens, local Windows user-profile paths in the package, unexpected third-party runtime assets or raw ignored reports. User input remains local and commands are not executed. Production URL, Cloudflare project, custom domain, DNS, TLS, production branch/workflow and real rollback remain clearly marked pre-launch manual checks because HelpDevOps is not publicly deployed.

No commit, push, deployment, architecture expansion or EP-005 work occurred. This evidence does not approve EP-004.
