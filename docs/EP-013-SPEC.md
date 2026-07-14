# EP-013 — Owner-Controlled Production Hardening

## Purpose

EP-013 turns HelpDevOps verification into an owner-operated release-certification process. It adds no DevOps content. Its outcome is a reproducible, browser-tested, package-verified candidate that can move to preview deployment without depending on ChatGPT Work.

## Scope

- strict `certify:release` core and full profiles;
- Git/source identity and clean-tree gating;
- machine-readable certification manifest and checksum output;
- owner browser installation, focused, headed, and full commands;
- security, privacy, accessibility, SEO, budget, snapshot, and recovery gates through existing validators;
- Workers Static Assets deployment preparation only;
- preview/production environment separation;
- rollback, accessibility, release, and owner checklists;
- local clean-extraction recovery drill.

## Non-goals

No new tools, diagnostics, interpreters, references, redesign, backend, accounts, analytics, advertisements, domain configuration, deployment, Search Console work, or EP-014 execution.

## Acceptance Criteria

1. `npm run certify:release:core` executes all mandatory non-browser gates.
2. `npm run certify:release` requires Git identity, a clean tree, full browser execution, snapshot creation, and snapshot validation.
3. Certification writes truthful generated JSON/Markdown evidence and the package checksum.
4. Portable snapshot recovery works without Git metadata through explicit archive mode.
5. Browser workflows are owner-readable and executable.
6. Workers Static Assets configuration contains no credentials or production domain.
7. Rollback and recovery instructions identify the exact certified ZIP and checksum.
8. Existing product behavior and performance budgets do not regress.
