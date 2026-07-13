# Architecture

## Default
Static HTML/CSS/JavaScript with local browser processing.

## Principles
Single source of truth; reusable modules; shared validation; progressive enhancement; safe failure; minimal dependencies; transparent validation limits.

## Boundary
Backend, database, authentication, required remote APIs and paid runtime dependencies require explicit Product Owner approval.

## EP-002 layout boundaries

- `BaseLayout`: document shell, metadata, global navigation/footer, search and Session Dock.
- `DirectoryLayout`: Tools, Guides, References, About and future discovery surfaces.
- `ProductLayout`: Workspace, Preflight and future major product surfaces.
- `PolicyLayout`: Privacy, Terms and future policy reading surfaces.

Navigation, SEO/structured data, search input/results and Result Contract responsibilities are separated into reusable components. Small purely presentational homepage fragments remain consolidated where a separate component would add indirection without reuse; these consolidations are documented in the implementation report.


## EP-003 resource and analysis layer

The centralized tool registry drives discovery and status. Domain-owned JSON resources contain maintainable wording, examples, references, and limitations. Domain analyzers remain small JavaScript modules. Universal Input routes supported input through deterministic parsing and renders the shared Result Contract. YAML parsing is local and uses the pinned `yaml` dependency with bounded alias handling.

## Operations and launch gate

Operational knowledge is maintained in `OPERATIONS-AND-TROUBLESHOOTING-RUNBOOK.md`; release actions are summarized in `PRODUCTION-CHECKLIST.md`. Every EP introducing a new operational failure mode must update the runbook. Public launch is blocked until both documents are verified against the real deployed infrastructure.

## EP-005 local continuity layer

Small non-sensitive preferences use the versioned `helpdevops.preferences.v1` localStorage namespace. Explicitly saved structured workspaces use the native `helpdevops-workspace` IndexedDB database. Core tools do not depend on storage availability. Workspace records contain plain validated data, never DOM/HTML or executable behavior. Transfer state is explicit, same-tab, short-lived sessionStorage data that is consumed and deleted on destination load.

## EP-006 container and Kubernetes domains

Dockerfile, Docker Compose, and Kubernetes Manifest analyzers follow the existing domain-owned analyzer/resource/example pattern. Compose and Kubernetes reuse the reviewed YAML parser with bounded aliases and document counts. No engine, registry, cluster, admission controller, or remote API is contacted. Universal Input sends recognized content to the specialized routes, and every route exposes the shared explicit-workspace contract.
