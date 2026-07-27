# EP-019 Release Notes — v0.19.0

EP-019 adds a cohesive Guided Investigation Experience to the existing static, privacy-first HelpDevOps platform.

- Four role-based starting points route into existing product surfaces.
- Every journey gains environment context, follow-up evidence interpretation, command prerequisites, before/after verification, timeline, explicit local resume, privacy clearing, feedback, and redacted handoff exports.
- Universal Input hides classification internals behind “Why this result?”
- Journey routes use breadcrumbs and user-facing trust wording.
- GitHub Actions checkout and setup-node move to v5 without changing Node 22.

No backend, account, telemetry, remote analysis, PWA, production-launch, or probabilistic diagnosis capability was added.


## Pre-merge audit remediation

- Unified handoff redaction with the repository sensitive-content policy.
- Added context- and role-aware investigation ordering and guidance.
- Added incident-channel, ticket, Markdown, and sanitized-command-transcript exports.
- Added complete browser-local clearing, risk-grouped command bundles, richer timeline events, and explicit verification criteria.
- Added descriptive destination labels, command-fragment search, deeper bounded operational starts, and homepage artifact regression coverage.