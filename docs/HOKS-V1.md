# HelpDevOps Operational Knowledge Specification (HOKS) v1.0

HOKS defines the implemented, static operational-knowledge model in `src/operational-knowledge/` and its resource catalog in `src/resources/operational-knowledge/`. It is not a conversational or probabilistic system.

## Principles and object model

Knowledge is deterministic, browser-local, evidence-backed, version-aware, vendor-neutral, and safe by default. Each released object has a stable `technology.slug` ID, taxonomy family, title, summary, review status, maturity, reviewed versions, review date, compatibility assumptions, recognition rules, assessment, investigation, action, prevention, relations, references, and limitations. Core identity, provenance, recognition guards, first evidence step, safety, verification, recovery, official references, and limitations are mandatory. Rollback and rejected hypotheses are conditional because read-only first steps do not require invented rollback text.

## Taxonomy and coverage

The hierarchy is technology → issue family → issue object. EP-016 covers only Kubernetes, Docker, Linux/systemd, Git, and Terraform. `coverage.js` derives owner-facing coverage from validated objects and fixtures. Maturity levels are: 0 placeholder, 1 recognition, 2 evidence and next action, 3 remediation/verification/safety complete, and 4 versioned with extensive deep review. Only levels 3 and 4 may be published as reviewed guidance. Counts are factual field counts, never trust percentages.

## Evidence, matching, and confidence

Recognition combines positive indicators with at least one required technology/context indicator. Exclusions win before scoring. Normalized substring rules are explicit data, not vague token similarity. Scores are bounded at 100: a corroborated match begins at 45, each matched positive indicator adds 15, and each required-context indicator adds 15. High is 85–100, Medium 65–84, Low 45–64, and anything lower is insufficient evidence. Equal top scores are ambiguous; IDs provide stable tie ordering. The same normalized input and catalog always produce the same output. Generic phrases such as `permission denied` cannot identify a technology without required context.

## Safety model

Classes are Observe, Read-only, Low risk, Review required, Service impact, Destructive, and Irreversible. Every first recommendation in the released catalog is Observe or Read-only. Validation rejects unsafe first commands, including deletion, forced history changes, Terraform state removal/unlock/destroy, and recursive filesystem deletion. Any future state-changing guidance must state prerequisites, impact, safer evidence, verification, recovery, rollback where possible, and stop/escalation criteria.

## Versions, references, fixtures, and validation

Released objects require reviewed version ranges, ISO review dates, compatibility assumptions, version notes, an HTTPS official reference, and known limitations. Each object has a positive fixture, a negative/exclusion fixture, and an ambiguous context-poor fixture. Validators enforce schema completeness, unique IDs, taxonomy membership, safety, fixture behavior, coverage completeness, and reference presence. Local validation does not make live requests to official sites.

## Rendering and boundaries

Objects render at stable anchors on five bounded technology pages under the static `/knowledge/` directory. The first view contains “What’s happening,” “Do this first,” one read-only command, and “Check this.” Evidence, recovery, versions, limitations, and references use native progressive disclosure. Universal Input can match the same resource catalog locally. It does not access a cluster, daemon, host, repository, state backend, or cloud account and never claims universal coverage.

## Lifecycle

Add or update resource seeds, fixtures, and metadata; run focused knowledge validation; review official sources and versions; inspect the rendered page; then run the normal release gate. Deprecate by changing publication metadata and documenting the replacement rather than deleting historical meaning. False positives are corrected with an exclusion and regression fixture before changing score boundaries.
