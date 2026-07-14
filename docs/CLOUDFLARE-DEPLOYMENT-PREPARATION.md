# Cloudflare Deployment Preparation

EP-013 prepares, but does not execute, deployment.

## Default target

Workers Static Assets with `dist/` as the asset directory, automatic trailing-slash handling, and the generated `404.html` as the nearest 404 page. The committed `wrangler.jsonc` contains no account ID, API token, custom domain, route, or secret.

## Owner checks before EP-014

- Review the Worker name in the Cloudflare account.
- Connect only the HelpDevOps repository if Git integration is selected.
- Keep preview and production names distinct.
- Run full release certification before preview deployment.
- Verify canonical URLs are not switched to production until the domain is approved.
- Preview deployments must not be submitted for indexing.

The repository includes deployment commands, but they require explicit owner invocation and Cloudflare authentication outside source control.

## Enforced deployment prerequisite

The deployment wrappers validate the current full certification before building or invoking Wrangler. Missing, core-only, stale, commit-mismatched, dirty-tree, browser-incomplete, missing-ZIP, or checksum-mismatched certification is rejected. Wrangler is invoked through `npm exec -- wrangler` so the owner workflow remains Windows-safe without relying on `npx` executable resolution.
