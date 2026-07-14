# Rollback Runbook

1. Stop promotion of the failing candidate.
2. Identify the last release whose certification gate is `passed`.
3. Obtain its exact full ZIP and verify the recorded SHA-256 before extraction.
4. Confirm version, EP, route count, and Workspace compatibility from the release manifest/evidence.
5. Build or redeploy only that known-good static asset set.
6. Smoke-test homepage, Universal Input, one tool, one diagnostic, one interpreter, Workspace, Incident Brief, headers, sitemap, and 404 handling.
7. Do not overwrite or delete the failed candidate; preserve it for diagnosis.
8. Record the rollback reason and any Workspace schema consideration.

The production rollback procedure is finalized after the EP-014 preview proves the selected Cloudflare deployment method.
