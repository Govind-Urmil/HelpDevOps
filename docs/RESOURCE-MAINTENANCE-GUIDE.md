# Resource Maintenance Guide

This guide is for Govind to maintain HelpDevOps without needing ChatGPT or ChatGPT Work for routine content updates.

## Principle

**Most routine updates should be resource updates, not code changes.** Wording, examples, references, recommendations, aliases, and visible limitations belong in readable resource or registry files. New parsing or analysis behavior requires code and tests.

## Resource locations

- Tool registry: `src/config/tools.js`
- Cron wording and references: `src/tools/cron/resources.json`
- Cron examples: `src/tools/cron/examples.json`
- JSON/YAML wording and references: `src/tools/structured-data/resources.json`
- JSON/YAML examples: `src/tools/structured-data/examples.json`

## Update wording or a limitation

1. Open the domain's `resources.json`.
2. Change only the relevant text.
3. Increase `resourceVersion` patch, for example `1.0.0` to `1.0.1`.
4. Run `npm run validate:resources`.
5. Run `npm test` and `npm run build`.
6. Review the Git diff before committing.

## Add an example

1. Open the domain's `examples.json`.
2. Copy a similar entry.
3. Give it a unique lowercase ID.
4. Add a clear label and input.
5. Add or update a unit test when the example represents new behavior.
6. Validate and test.

## Update a reference

Edit the relevant `references` entry. Prefer standards and official documentation. Keep the ID stable when only the URL or title changes.

## Tool registry updates

The tool registry drives the tools directory and search discovery. A tool marked `available` must have a working route and analyzer. Planned tools must remain clearly labelled as planned.

## Resource-only versus code changes

Usually resource-only:
- wording corrections
- examples using already supported syntax
- reference updates
- aliases
- limitation text

Requires code and tests:
- new cron syntax
- a new parser
- new classification logic
- a new result status
- a new tool

## Versioning

- Patch: wording, source, or example correction.
- Minor: backward-compatible new resource content.
- Major: incompatible resource structure.

Never edit a released historical Git commit. Make a new commit.

If a resource change introduces a new operational failure mode, update the Operations & Troubleshooting Runbook in the same EP. HelpDevOps cannot go live until that runbook and the Production Checklist are verified against real infrastructure.

## Validation commands

```bash
npm run validate:resources
npm run check
npm test
npm run build
npm run validate
npm run audit:budgets
```

## Rollback

Use Git history to restore the prior resource file, rerun validation and tests, then commit the rollback. Do not duplicate old resource files inside the repository.

## Workspace configuration maintenance

Workspace namespaces, schema versions and limits live in `src/workspace/config.js`. Changing a user-facing limit or format version requires corresponding schema documentation and tests. Do not rename localStorage/IndexedDB keys casually; treat that as a migration. Sensitive-warning patterns require regression tests for false positives, redaction and unsafe complexity. New tool-state fields must remain plain serializable data and must not store rendered HTML or analyzer functions.

## EP-006 container and Kubernetes resources

Routine wording, examples, references, and limitations live in `src/tools/dockerfile`, `src/tools/docker-compose`, and `src/tools/kubernetes-manifest`. Algorithmic checks remain code-and-test changes. Review Docker and Kubernetes official references before changing technical claims. Do not turn local resources into a pretend live schema: cluster-specific API versions, CRDs, policies, defaults and engine behavior require live-system validation and remain explicit limitations.

## Maintaining diagnostic journeys

Edit the journey-owned JSON files under `src/diagnostics/journeys/<journey>/`. Keep IDs stable. Update review dates, compatibility, limitations and primary references when technical guidance changes. Run `npm run validate:diagnostics`, `npm test`, `npm run build`, and `npm run validate`. Do not publish draft or needs-review content. Extract a shared record only after identical meaning is reused by multiple journeys.
