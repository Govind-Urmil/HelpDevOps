# EP-023 implementation summary

## Scope and architecture impact

EP-023 hardens the existing static-first HelpDevOps product without adding investigations, technologies, tools, pages, workflows, dependencies, analytics, or backend behavior. The architecture remains Astro-generated HTML with browser-local interaction and structured diagnostic resources.

The implementation baseline was authoritative `main` at `2f7e58205c756b0a004e94286e2a5893921e3507`, using Node.js 24.18.0 and npm 11.16.0. The working tree was clean and matched `origin/main` before work began.

## Traceable behavioral changes

- Terraform provider initialization: `terraform providers lock` is no longer described as read-only. A read-only provider inspection precedes a reviewed moderate-risk lock-file action, with platform scope, `.terraform.lock.hcl` diff review, production implications, verification routing, and file-specific rollback.
- Rollback quality: the 16 EP-018 factory actions and seven EP-020 factory actions now use investigation-specific rollback guidance. No action retains the audited generic rollback paragraph.
- Git rejected push: the history-rewrite path now requires fetch, review, and recording the exact remote tip SHA before an explicit `--force-with-lease=refs/heads/<branch>:<expected-remote-sha>` push. The wording does not present force push as routine recovery.
- Linux disk full: the reachable return-to-start cycle was removed. Ambiguous mount evidence now progresses to block or inode evidence paths.
- Metadata and wording: the homepage journey count derives from `publishedJourneys.length`; troubleshooting output correctly pluralizes “node”; the troubleshooting directory’s intended UTF-8 separators were restored.
- Production controls: HSTS is enabled as `max-age=31536000` for the production host without `includeSubDomains` or preload. The generator, route validator, unit tests, and production smoke contract agree on this policy. The smoke brand assertion now targets the current `brand-mark` class.
- Search: bounded corrections were added for common technology and operational misspellings. Corrections only normalize to existing indexed terms; the conservative no-result state remains and no approximate destination is fabricated.
- Parser confidence: existing 64 KB, 5,000-line, and 16 KB-per-line limits remain. New regression coverage certifies ANSI stripping, CRLF/CR normalization, tabs, Unicode preservation, and oversized-input rejection.
- Diagnostic maintainability: semantic validation now rejects reachable graph cycles, recognized state-changing commands classified as read-only, and the known generic rollback sentence.
- Performance certification: the Lighthouse matrix now covers the required homepage, search directory, complex investigation, technology directory, issue page, and 404. Indexable routes retain 95 category floors; the intentionally noindex 404 uses a route-specific SEO floor.
- Release reliability: the full browser certification command uses two bounded workers, avoiding host saturation while preserving every configured project and test.

## Review inventory

The unchanged feature inventory contains 37 investigations, 405 nodes, 818 directed choices, 77 terminal states, 65 actions, 144 displayed commands, and 61 journey references. All were traversed by the diagnostic validators; all action nodes were checked for prerequisites and rollback; all reachable graphs were checked for broken links, unreachable nodes, and cycles. Existing source validation covers common mojibake signatures and authoritative-reference/resource constraints.

## Files modified

Implementation changes are limited to diagnostic factories/data, diagnostic validation, homepage and troubleshooting metadata/content, search behavior, security configuration and validation, production smoke assertions, release identity/snapshot configuration, focused tests, Lighthouse coverage, and EP-023 reports. The final repository diff is the authoritative file list.
