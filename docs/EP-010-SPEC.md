# EP-010 Specification — Operational Coverage Completion

Release: EP-010 / v0.10.0

EP-010 closes the primary pre-launch coverage gaps with six reviewed, read-only-first diagnostic journeys: Git push rejection, Jenkins agent offline, DNS resolution, connection refused, cron execution, and shell execution failure. The release reuses the existing diagnostic model, workspace, search, Universal Input, SEO, privacy, and validation architecture.

## Safety

Every journey identifies the execution boundary before recommending a change. Force pushing, DNS record changes, network exposure, scheduler changes, package installation, and permission changes are risk-rated and include prerequisites, rollback, verification, and escalation.

## Non-goals

No backend, AI, command execution, generic log parser, cloud credentials, deployment, monetization, theme redesign, or EP-011 work.
