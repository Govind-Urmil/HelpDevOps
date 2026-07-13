# EP-008 Specification — Diagnostic Expansion I

## Purpose
EP-008 expands HelpDevOps from three to eight reviewed journeys without changing its static-first architecture. It adds Kubernetes CrashLoopBackOff, Terraform state-lock failure, HTTP 502 Bad Gateway, Docker disk usage excessive, and systemd service will not start.

## Product flow
Every journey follows symptom → context → evidence → interpretation → safest next check → scoped action → verification → prevention. Read-only checks come first, ambiguous evidence escalates, and matched text never proves root cause.

## Safety
Terraform unlock and Docker cleanup are high risk. Kubernetes probe/resource changes, HTTP intermediary changes and systemd service/security changes are contextual and rollback-aware. Sensitive output is flagged for redaction and permission-limited output is described as potentially incomplete.

## Architecture
The release reuses journey-owned JSON, Zod structural validation, semantic validation, generated indexes, shared runtime, dynamic Astro routes, search, Universal Input and explicit workspace state. No backend, graph service, AI, new runtime dependency, ads, affiliates or deployment is introduced.

## Discovery and SEO
Each journey has one canonical crawlable route. HTTP and Terraform hubs are generated from the existing registry. Reviewed aliases and exact errors support conservative local discovery.

## Testing
All eight journeys must pass semantic validation. Unit coverage verifies discovery and safety invariants. Build validation includes all 33 routes. Browser/Lighthouse work unavailable locally is recorded for a later consolidated environment-specific pass.

## Acceptance Criteria
- Eight reviewed journeys pass validation.
- Every question has an unclear/escalation path.
- Every modifying action has prerequisites and rollback.
- Every journey has meaningful verification.
- Five new signals route without root-cause claims.
- All static routes, metadata, links, sitemap, robots, CSP and budgets pass.
- Workspace compatibility and local-only processing remain intact.
- No backend, database, authentication, command execution, AI, ads, affiliates or deployment is added.
