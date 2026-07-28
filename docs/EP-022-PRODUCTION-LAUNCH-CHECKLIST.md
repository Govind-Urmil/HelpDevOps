# EP-022 executable production launch checklist

## Before deployment

- [ ] Confirm `main`, the approved EP-022 commit, and a clean worktree.
- [ ] Review `git diff --name-status origin/main...HEAD` and `git diff --check`.
- [ ] Stage explicit reviewed paths only; inspect `git diff --cached --name-status` and `git diff --cached`. Do not use unaudited `git add .`.
- [ ] Confirm no secrets, local paths, temporary files, ZIPs, dependencies, build output, screenshots, or reports are staged.
- [ ] Run clean install, audit, checks, unit/browser tests, build, route/link/sitemap/robots validation, budgets, Lighthouse, and snapshot validation.
- [ ] Verify homepage, navigation, search, zero results, investigations, tools, Workspace import/export, trust, 15 issue guides, 404, mobile widths, and reduced motion.
- [ ] Verify Privacy, Terms, About, and methodology contain no fake authority or guarantee.
- [ ] Set approved HTTPS `PUBLIC_SITE_URL`; confirm canonicals, robots, and sitemap contain no preview host.
- [ ] Identify production Worker/project, domain, DNS, TLS, cache/header configuration, and rollback version.
- [ ] Create report, evidence, ZIP and SHA-256; obtain owner approval before commit, push, tag or release.

## Deployment

- [ ] Deploy the exact certified commit and record its Cloudflare version.

## After deployment

- [ ] Run `HELPDEVOPS_BASE_URL=https://<host> HELPDEVOPS_CANONICAL_URL=https://<host> npm run verify:production:smoke`.
- [ ] Verify DNS, certificate, HTTPS, CSP, HSTS, content-type, referrer, permissions, frame and cache headers.
- [ ] Confirm key routes, normal `/preflight/` 404, current brand, no public release label, no preview canonical, no mixed release content, and no console/hydration failure.
- [ ] Submit the production sitemap to Google and Bing.
- [ ] Monitor aggregate errors without collecting evidence or search text.
- [ ] Record approval or roll back to the identified prior version.
