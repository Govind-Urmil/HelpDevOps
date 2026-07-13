# EP-011 Specification — Reference, Discovery and Topic Clusters

## Purpose
Turn HelpDevOps into a coherent discovery system connecting user wording, reviewed evidence, references, tools and diagnostic journeys without adding thin content or remote search.

## Scope
- Fourteen reviewed operational references.
- `/reference/` hub and static reference routes.
- Generated `/errors/` index sourced from reviewed diagnostic truth.
- Unified deterministic search across tools, diagnostics, interpreters, references, errors and hubs.
- Stable-ID related-content graph and crawlable breadcrumbs.
- Metadata, canonical, sitemap, validation and owner-maintenance updates.

## Architecture
Reference facts remain in journey-like human-readable JSON folders. Code owns registry loading, deterministic ranking and relationship resolution. Search remains local, bounded and transparent. No AI, embeddings, remote API or analytics are introduced.

## Content quality
Every reference must define a real operational distinction, limitations, official sources and a useful next destination. Template-only pages, copied documentation, hidden SEO copy and orphan routes are prohibited.

## Acceptance Criteria
1. Exactly fourteen reviewed references validate.
2. All reference routes build with unique metadata and crawlable links.
3. The error index is generated from reviewed aliases and exact errors.
4. Search ranking fixtures pass and generic terms do not produce overconfident exact matches.
5. Every reference has valid related destinations and no broken IDs.
6. Existing tools, diagnostics, interpreters and Workspace remain unchanged in behavior.
7. Performance, security, snapshot and fresh-extraction gates pass.
8. No backend, AI, analytics, ads, deployment or EP-012 work occurs.
