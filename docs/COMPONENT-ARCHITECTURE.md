# EP-002 Component Architecture

The authoritative component contract is `EP-002-SPEC.md`. Components are separated when they enforce reuse, accessibility, metadata, behavior, or future result contracts; purely local presentational fragments remain consolidated to avoid abstraction without reuse.

## Implemented boundaries

- Shell: SiteHeader, DesktopNav, MobileNav, SiteFooter, PageHeader, Breadcrumbs, Container.
- Controls/primitives: Button, LinkButton, Card, Badge.
- Search: SearchDialog, SearchInput, SearchResult; the small trigger remains in SiteHeader because it is the header-owned entry point.
- Input/workflow: UniversalInput, PrivacyPulse, SessionDockShell.
- Result Contract: ResultSummary, ReasonPanel, ActionPanel, CoveragePanel, LimitationsPanel, RelatedActions, WhySuggestion, ResultPreview.
- Metadata: SEOHead, StructuredData, OpenGraphMeta.
- Layouts: BaseLayout, DirectoryLayout, ProductLayout, PolicyLayout.

## Intentional consolidations

- `Section`: native `<section>` plus the shared `.section` token; a wrapper would add no semantics or behavior.
- `Alert`: the only current notice is UniversalInput-owned and remains there until a second alert use case establishes variants.
- `CodeBlock` and `TerminalPreview`: EP-002 has no real code result; introducing unused preview components would encourage fake capability.
- `EmptyState` and `ProductStatus`: truthful states are currently owned by StatusPage and SessionDockShell; extract when multiple interactive products share behavior.
- `StatusLabel`: represented by the reusable Badge primitive.
- `SearchTrigger`: remains header-owned; SearchDialog/Input/Result carry the reusable search behavior.
- `CategoryCard`: current quick-access cards are homepage-only and deliberately point to truthful platform status rather than fake categories.
- `PreflightFlow`: the three-step preview remains local to the single Preflight homepage preview.
- `TrustGrid`: the trust content remains homepage-local because it has no second consumer.

These are disclosed consolidations, not claims that every proposed filename exists. They preserve the specification’s responsibilities without creating unused one-line wrappers.


## EP-003 additions

`AnalysisResult.astro` is the shared production Result Contract. `ToolCard.astro` renders registry entries. Cron and structured-data pages own their input actions while reusing the shared result surface.

## EP-005 additions

`SessionDockShell` is the global explicit-save and local-workspace entry point. The Workspace route owns favorites/recent summaries, import/export, storage controls and destructive actions. `src/workspace/` separates configuration, plain-data models, sensitive-content warnings, import/export validation, storage adapters and cross-tab notifications. `workspace-client.js` coordinates browser-only behavior without making analyzers depend on persistence.
