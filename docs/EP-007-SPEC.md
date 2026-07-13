# EP-007 Specification — Diagnostic Platform Foundation

## Objective
EP-007 introduces the smallest maintainable HelpDevOps diagnostic platform. It adds three reviewed, static-first journeys: Linux disk appears full, Docker container exits immediately, and Kubernetes Pod Pending. The product flow is symptom → evidence → interpretation → safest next check → action → verification → prevention.

## Architecture
Journey logic is stored in human-readable JSON owned by each journey. Stable identifiers and explicit next-node relationships drive a shared Astro renderer. Structural and semantic validation runs at build time. No graph database, backend, command execution, telemetry ingestion, generic AI, or runtime schema service is introduced.

The existing Result Contract, local search, Universal Input, and EP-005 explicit workspace persistence are extended rather than replaced. Journey progress stays in memory by default. Saving is explicit and continues through the existing sensitive-content controls.

## Safety
Risk labels are Read-only, Low risk, Moderate risk, High risk, and Expert review required. Read-only checks appear first. Higher-risk actions require prerequisites, rollback guidance, and verification. Every question provides an unclear or escalation path. HelpDevOps never claims access to a live system or guaranteed diagnosis.

## Public routes
The release adds `/troubleshoot/`, domain hubs, and three crawlable journey pages. Static summaries, first checks, limitations, and official references remain available without JavaScript. Interactive guidance enhances those pages in the browser.

## Acceptance Criteria
- Three journeys validate and build.
- Broken references, unreachable nodes, unsupported risk labels, missing fallbacks, missing rollback, and missing verification fail validation.
- Search discovers symptom aliases and reviewed error strings.
- Guided and emergency views work without duplicated resource content.
- Previous/restart navigation works.
- Explicit workspace save and restoration work.
- Existing tools and privacy rules do not regress.
- All routes are static, accessible, performant, and commit-ready.
