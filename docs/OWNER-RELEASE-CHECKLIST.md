# Owner Release Checklist

## Before certification

- [ ] Correct branch and expected commit.
- [ ] Clean Git working tree.
- [ ] Supported Node version installed.
- [ ] `npm run browsers:install` completed.
- [ ] No ZIPs, reports, screenshots, credentials, or local paths in the repository.

## Certification

- [ ] Run `npm run certify:release`.
- [ ] Gate is `passed`.
- [ ] Browser totals have zero unexplained failures.
- [ ] Snapshot validation and fresh extraction pass.
- [ ] Record the generated ZIP SHA-256 outside the repository.
- [ ] Complete the accessibility manual checklist.

## Before preview

- [ ] Review `wrangler.jsonc` and Cloudflare account/project selection.
- [ ] Confirm no production domain or secret is committed.
- [ ] Confirm rollback candidate and checksum are available.
- [ ] Do not deploy production from an uncertified source tree.

## Evidence retention

- [ ] Copy `release-certification/certification.json`, `certification.md`, and `checksums.txt` beside the exact certified release ZIP in the owner release archive.
- [ ] Confirm the deployment wrapper accepts the current full certification before preview deployment.
- [ ] Never deploy from core-only, archive-mode, stale, or checksum-mismatched certification evidence.
