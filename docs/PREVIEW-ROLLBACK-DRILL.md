# Preview Rollback Drill

Perform only against `helpdevops-preview`.

1. Record the active Cloudflare version and deployment IDs.
2. Deploy the certified candidate and verify it.
3. Roll back to the previously recorded preview version through Wrangler or the dashboard.
4. Verify the previous version is active and core routes work.
5. Redeploy the exact certified candidate.
6. Verify its version ID, routes, headers, Workspace and Incident Brief.
7. Record timestamps and IDs in `docs/EP-014-EVIDENCE.md` without account IDs, tokens or private dashboard links.

If no earlier preview exists, first deploy the last certified EP-013 state as the harmless baseline. Never use the production Worker for this drill.
