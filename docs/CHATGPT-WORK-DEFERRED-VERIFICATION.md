# Deferred Independent Verification Ledger

The consolidated independent verification ledger through EP-012 was closed before EP-013. ChatGPT Work is not a development, certification, deployment, or launch dependency.

## New deferred assurance from EP-013 onward

- One final independent pre-launch audit of the latest certified candidate, when ChatGPT Work is available.
- Independent review of the owner-generated full certification manifest and ZIP checksum.
- Independent browser/visual spot checks only where they add assurance beyond the owner full matrix.
- Independent Cloudflare preview review after EP-014, if available.

These are additional assurance tasks only. They do not replace `npm run certify:release`, owner browser execution, preview validation, rollback evidence, or production gates.

## Current environment limitation

The EP-013 implementation environment could not download Playwright browser binaries because `cdn.playwright.dev` DNS resolution failed. Browser commands and a focused smoke suite are committed for owner execution. Core certification and all non-browser gates were executed separately.
