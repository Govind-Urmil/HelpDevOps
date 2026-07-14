# EP-014 Specification — Cloudflare Preview Deployment and Live Infrastructure Validation

## Purpose

EP-014 prepares and validates a persistent non-production Cloudflare Workers Static Assets deployment without launching the production site. It binds preview deployment to the existing EP-013 certification model, introduces one environment-driven public URL, adds live route/header/browser verification, preserves browser-local privacy, and documents a rollback drill.

## Scope

- `PUBLIC_SITE_URL` is the single source for Astro site metadata, canonicals, Open Graph, structured data, sitemap, and robots sitemap URLs.
- Preview builds require a real HTTPS URL and emit both `noindex,nofollow` HTML metadata and `X-Robots-Tag` headers.
- Fingerprinted `/_astro/*` assets receive immutable caching; HTML and non-fingerprinted files remain revalidation-oriented.
- Preview and production deploy wrappers remain owner-triggered and certification-bound.
- Live verification accepts an explicit URL and checks representative routes, metadata, placeholder leakage, HTTPS, indexing protection, and 404 behavior.
- A hosted Playwright smoke suite verifies the real origin without starting a local server.
- Production remains blocked until an approved hostname is configured.
- No Cloudflare credentials, account IDs, zone IDs, or personal domain values are committed.

## Safety and privacy boundaries

Preview deployment serves static assets only. Pasted evidence, diagnostic answers, Workspace contents, Incident Brief content, and exports remain in the browser. Preview verification may request only same-origin application assets and user-initiated external documentation links. No telemetry, analytics, ads, remote analysis, or custom Worker logging is introduced.

## Owner workflow

1. Create and commit the EP-014 candidate locally.
2. Run full certification from a clean Git tree.
3. Authenticate interactively with Wrangler.
4. Set `PUBLIC_SITE_URL` to the exact preview Worker URL.
5. Deploy with `npm run deploy:preview`.
6. Run `npm run verify:preview -- --url <https-url>`.
7. Run `npm run verify:preview:browsers -- --url <https-url>`.
8. Record the Cloudflare version/deployment ID.
9. Perform the preview-only rollback drill and redeploy the certified candidate.
10. Run the production dry run only after the final production hostname is approved.

## Acceptance Criteria

- Release identity is EP-014 / v0.14.0.
- Preview URL validation rejects HTTP and placeholder domains.
- Production validation rejects missing or mismatched approved hostnames.
- Preview HTML and HTTP headers prevent indexing without blocking crawler access.
- Live route verification is explicit, repeatable, and produces no committed raw evidence.
- Hosted browser smoke tests run against an explicit remote origin.
- Hashed assets use immutable caching while HTML is not globally cached for a year.
- Deployment remains tied to a successful full certification and exact clean Git commit.
- No production deployment, domain attachment, DNS change, indexing request, analytics, or monetization occurs.
- Owner documentation explains preview deployment, live checks, rollback, and evidence handling.
