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
