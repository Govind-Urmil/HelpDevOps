Exit code: 0
Wall time: 2.5 seconds
Output:
# EP-002 Specification — Command Center Platform

**Project:** HelpDevOps  
**Release:** EP-002 / v0.2.0  
**Status:** Engineering Contract for ChatGPT Work

## Mission
Build the first production-quality HelpDevOps implementation: a static, browser-first Command Center Platform that future tools, guides, references, Workspace, and Preflight inherit.

The owner is a practicing DevOps engineer who intends to use HelpDevOps daily. Quality gate: would the owner genuinely use it during real work, feel proud every time it opens, and confidently recommend it?

## Product Position
HelpDevOps is a browser-first DevOps task workspace. Its long-term signature is Universal Input + explainable deterministic detection + Decision Layer + transparent results + workflow continuity + cross-file Preflight.

## Frozen Principles
- Trust and accuracy before feature count.
- Static-first, browser-first, local processing where practical.
- Single source of truth.
- Simple Surface, Deep Capability.
- Evidence over fake confidence percentages.
- Zero Dead Ends.
- Never discard user work unnecessarily.
- Truthful empty states.
- No architecture changes without approval.
- Build for years.
- Every EP is evidence-tested and delivered as a full repository snapshot.

## Roles
Govind owns product vision and final approval. ChatGPT owns research, design, architecture, specification, and audit. ChatGPT Work owns implementation, automated tests, manual site testing, bug fixes, and evidence reporting. ChatGPT Work must stop and report specification-level issues rather than changing product scope or architecture.

## Required Architecture
Use Astro static output, vanilla JavaScript, Node LTS, npm with committed lockfile, official Astro sitemap integration, Vitest, Playwright, and minimal approved audit tooling.

Do not use React/Vue/Svelte/Angular, SSR, backend, database, authentication, paid/required remote APIs, CSS/UI frameworks, analytics, remote search, external fonts, or unnecessary dependencies.

## Required Pages
Homepage, Tools, Workspace, Preflight, Guides, References, About, Privacy, Terms, and custom 404.

## Homepage
Create a precise dark engineering Command Center, not a SaaS marketing page. Primary interaction: “What are you working on?” with Universal Input/search foundation. Include quick access, clearly labeled product preview, Preflight marked In Development, workspace continuity concept, Guides/References discovery, trust section, and structured footer. No fake tools, counts, intelligence, personalization, testimonials, or giant empty sections.

## Universal Input and Decision Layer
Establish contracts for future detection of YAML, JSON, Kubernetes, Dockerfile, Compose, .env, JWT, CIDR/IP, cron, timestamps, checksums, Git errors/commands, Bash scripts/errors, Jenkinsfiles/pipeline errors, Kubernetes failure states, Terraform diagnostics, and CI/CD errors.

Future flow: Input → Deterministic Detection → Evidence → Decision Layer → Recommended/Alternative Actions → Tool/Troubleshoot/Guide/Reference → Next Action.

EP-002 must establish architecture and UI contracts, not broad real detection.

## Result Contract
Reusable result architecture must support:
1. What happened?
2. Why?
3. What can I do?
4. What was checked?
5. What was not checked?
6. What next?

Implement reusable summary, reason, action, coverage, limitation, related-action, and why-suggestion components without fake validation.

## Session Dock, Send To, Privacy Pulse
Establish a minimal Session Dock shell/data contract for future local continuity. Establish contextual one-click “Send to…” contracts without a workflow builder. Add a subtle Privacy Pulse whose wording always matches actual behavior.

## Capability Language
VALIDATE, FORMAT, CONVERT, CALCULATE, DECODE, GENERATE, COMPARE, INSPECT, TROUBLESHOOT, PREFLIGHT. Use consistently.

## Visual System
Dark, precise, calm, fast, engineering-focused. Character: GitHub practicality + Cloudflare clarity + Linear polish + DevOps terminal language.

Tokens: background #0B1220; elevated #111A2E; card #151F34; primary #2563EB; success #22C55E; warning #F59E0B; error #EF4444; primary text #E6EDF7; secondary #9EACC0; border rgba(148,163,184,.22).

Use system and monospace stacks only. Spacing: 4/8/12/16/24/32/48/64/96px. Container max 1180px; reading 760px. Avoid WebGL, excessive glass, animated gradients, parallax, cursor effects, looping/fake terminal animations.

## Required Components
SiteHeader, DesktopNav, MobileNav, SiteFooter, PageHeader, Section, Container, Button, LinkButton, Card, Badge, Alert, CodeBlock, TerminalPreview, EmptyState, StatusLabel, Breadcrumbs, UniversalInput, SearchTrigger/Dialog/Input/Result, CategoryCard, ResultSummary, ReasonPanel, ActionPanel, CoveragePanel, LimitationsPanel, RelatedActions, WhySuggestion, PreflightFlow, TrustGrid, ProductStatus, PrivacyPulse, SessionDockShell, SEOHead, StructuredData, OpenGraphMeta.

## Accessibility and Responsive Design
Target WCAG 2.2 AA. Semantic landmarks, skip link, visible focus, no keyboard traps, real links/buttons, focus not obscured. Mobile nav must correctly manage aria-expanded, Escape, outside click, focus return, body scroll, and logical tab order. Site must reflow at 200% zoom without horizontal overflow. Honor reduced motion.

Breakpoints: <640, 640–899, 900–1199, >=1200px.

## Search
Build unified search UI/architecture only. Ctrl/Cmd+K plus visible access. Accessible dialog, input focus on open, Escape close, prior focus restoration, honest empty/no-results states. Future index is build-generated and queried browser-side.

## SEO
Central metadata system: title, description, canonical, page type, robots, Open Graph, valid structured data. Automate missing/duplicate metadata, accidental noindex, broken internal links, and sitemap coverage checks. Use official sitemap integration. Initial schema support: WebSite, Organization, BreadcrumbList. No thin/fake SEO pages.

## Security and Privacy
Treat pasted content as untrusted, do not execute arbitrary pasted code, upload nothing without approved need/disclosure, keep secrets out of client/repo, minimize dependencies/scripts, fail safely, disclose limits. Establish deployment-portable CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and appropriate HSTS strategy. Test actual build policy. Avoid unsafe-eval and avoid unsafe-inline unless explicitly justified and approved.

## Performance Budgets
Initial client JS <=40KB compressed; CSS <=35KB compressed; homepage transfer <=250KB excluding optional social image; zero third-party scripts; zero external font requests; <=15 homepage requests.

Representative Lighthouse thresholds: Performance/Accessibility/Best Practices/SEO each >=95; aim for 100 Accessibility and SEO.

## Testing and CI
Vitest for logic; Playwright for browser behavior. Automated Chromium, Firefox, WebKit. Manual Chrome, Edge, representative mobile/responsive, and keyboard testing.

Every feature requires positive, negative, boundary, regression, useful mutation-style, and error-handling tests.

One GitHub Actions workflow: checkout → Node setup → npm ci → static checks → unit tests → Astro build → output validation → Playwright → accessibility → SEO/link checks → performance budgets → useful failure artifacts.

## UX Quality Gates
10-second comprehension: visitor understands DevOps focus, paste/search interaction, action guidance, privacy, and workspace differentiation.

30-second task test: future core tasks should be usable by newcomers without documentation.

Expert efficiency: repeat tasks require minimal clicks and unnecessary explanation.

## Versioning
EP-001=v0.1.0 through EP-009=v0.9.0; EP-010=v1.0.0. Maintain release-meta.json with product/version/ep/releaseDate/commit/status. Automate package.json/release-meta/EP version consistency.

Every EP artifact is a full repository snapshot named HelpDevOps-v0.X.0-EP00X-FULL-SNAPSHOT.zip.

## Future Domains
Architecture must support Cron Jobs (builder, validation, explanation, next runs, Jenkins triggers); Git (commands, recovery, commits, gitignore, branching/reset/revert, errors); Bash (inspection, feasible checking, quoting/variables, exit codes/pipelines, troubleshooting, Jenkins integration); Jenkins (Jenkinsfile helper/checking, snippets, cron triggers, troubleshooting, Docker/Kubernetes references); plus configuration, encoding, networking, Linux, Docker, Kubernetes, Terraform/cloud, CI/CD, and Preflight.

## Competitive/Uniqueness Gate
Every major future feature spec must document existing alternatives, baseline parity, HelpDevOps advantage, evidence method, and whether HelpDevOps could honestly be recommended over the strongest alternative. Differentiation is the integrated combination of DevOps-specific Universal Input, explainable detection, Decision Layer, transparent Result Contract, contextual actions, local continuity, and cross-file Preflight.

## MUST IMPLEMENT
Complete Astro project/routes; approved visual system; shared layouts/components; accessible navigation/footer; Command Center homepage; Universal Input/search foundation; registry/interface/Decision Layer contracts; explainability, Result, coverage/limitations, Related Actions/Send-to contracts; Session Dock shell; Privacy Pulse; keyboard shortcuts; SEO/sitemap/robots; security architecture; budgets; Vitest/Playwright; CI; release checks; documentation; evidence report.

## MAY IMPLEMENT
Only low-risk helpful static preview data, reusable components, accessibility improvements, build-time validators, and developer-experience scripts that do not expand scope or compromise budgets.

## MUST NOT IMPLEMENT
Production DevOps tools, broad detection, fake validation, real Preflight, complex persistence, accounts/cloud sync, backend/database/SSR/authentication, AI classification, remote search, analytics, ads, monetization scripts, UI/CSS frameworks, unnecessary dependencies, fake content/usage/testimonials, unapproved architecture changes, or public launch.

## Acceptance Criteria
Clean npm ci and production build; all routes; no broken links/accidental noindex; correct sitemap/robots; consistent versions; passing unit and Chromium/Firefox/WebKit tests; reported manual QA; accessible navigation/search focus; no overflow; 200% zoom usability; reduced motion; Lighthouse/budgets pass or exceptions explicitly approved; zero third-party scripts/fonts; tested/documented security policy; no fake capability; previews labeled; future-domain architecture preserved; complete ChatGPT Work evidence report; ChatGPT audit passes; Govind approves.

## Required ChatGPT Work Report
1. Scope Implemented
2. Files Added
3. Files Modified
4. Architecture Decisions
5. Dependencies Added + Justification
6. Automated Tests Run
7. Automated Test Results
8. Manual Tests Performed
9. Browser / Viewport Coverage
10. Accessibility Results
11. Lighthouse Results
12. Known Limitations
13. Deviations From Specification
14. Security / Privacy Impact
15. Regression Risk
16. Recommended Reviewer Focus

Use actual evidence only. If not applicable, state “Not applicable.”

## Stop Conditions
ChatGPT Work must stop/report if architecture conflicts, dependencies introduce significant risk, MUST requirements are unrealistic, performance/security materially conflict, ambiguity requires product decisions, or EP-001 conflicts with EP-002.

## Final Standard
The target reaction is not “Nice website.” It is:

> “I want to keep this open while I work.”
