# EP-018 Implementation Report

EP-018 refines homepage hierarchy and primary navigation, expands the diagnostic registry to 30 journeys, improves Universal Input recovery language, adds contextual cross-linking, and strengthens exact-error discovery.

Sixteen high-frequency journeys are declared in `src/diagnostics/expanded-journeys.js` and built through one shared journey factory. The factory produces the strict object shape consumed by the existing registry and static route generator. Repeated safety structure stays centralized while symptoms, evidence, fixes, verification, prevention, tools, and sources remain journey-specific.

The connected flow is Troubleshoot → journey → evidence → guarded action → verification → prevention, with contextual routes to tools, references, official documentation, and related journeys. Reference URLs remain stable but are no longer a primary navigation or homepage destination.

## Pre-merge audit and remediation

The source tree, generated diagnostic indexes, tests, and release documents were audited for common UTF-8 mojibake. Confirmed corruption was normalized to intended punctuation. `scripts/validate-source.mjs` now scans release text files using constructed Unicode signatures, so the validator does not contain the forbidden fragments it detects. `tests/ep018-platform.test.js` independently covers the same boundary.

The existing `TechnologyMark` component and registry remain unchanged. Its nine local SVG assets were replaced in place with lightweight, recognizable brand-color renditions, preserving cache paths, layout, decorative `alt` behavior, and zero runtime third-party requests. Vendor guidance, colors, and rights notes are documented in `docs/TECHNOLOGY-MARK-SOURCES.md`.

The shared journey factory remains the default for the 16 generated journeys. A small `evidenceBranches` specialization layer adds three concrete, read-only evidence outcomes to the six highest-priority journeys. These branch nodes rejoin the existing owner approval, reversible correction, rollback, verification, escalation, and prevention flow, avoiding duplicate page components or parallel schemas.

The release adds no runtime dependency and preserves browser-only processing, deterministic recognition, explicit persistence, accessibility semantics, and existing performance and security budgets.
