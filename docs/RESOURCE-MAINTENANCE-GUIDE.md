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
