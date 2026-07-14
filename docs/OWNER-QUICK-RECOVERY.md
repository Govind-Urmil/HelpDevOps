# Owner Quick Recovery

- Site does not build: run `npm ci`, then `npm run build`; use the first reported source error.
- Tests fail: run the named failing test directly; do not weaken assertions.
- Browser tests fail: build first, install Playwright browsers, confirm port 4321 is not serving an older checkout, then run `npm run verify:browsers`.
- Search index stale: run the discovery validator and rebuild.
- Resource validation fails: correct the named definition or relationship; do not bypass review rules.
- Workspace data cannot open: preserve an export if possible and confirm schema compatibility. Unsupported future versions must not replace existing data.
- CSP blocks behavior: inspect generated `_headers` and hashes; do not add broad `unsafe-*` allowances.
- Release ZIP incomplete: run `npm run snapshot:validate`, then recreate it from the intended release root.
- Route missing from sitemap: confirm it builds as static HTML and is not `noindex`, then rebuild.
- Production deployment failure: preserve the last known-good artifact and follow the host rollback procedure.
- Rollback needed: redeploy the last owner-approved snapshot. Browser-local data is separate and not permanent backup.

## Certification or package recovery

Run `npm run certify:release:archive` inside an extracted portable snapshot for non-browser recovery verification. Use the committed repository and `npm run certify:release` for deployable certification.
