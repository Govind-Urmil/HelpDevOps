# EP-019 Implementation Report

## Summary

EP-019 extends the existing investigation, Universal Input, workspace, Incident Brief, discovery, diagnostic, and design-system foundations into one Guided Investigation Experience. It does not add a parallel application, backend, framework, account, telemetry, or runtime API.

## Architecture

- `src/investigations/experience.js` is the shared experience contract for roles, environment context, risk, prerequisites, comparison, timelines, feedback, storage keys, redaction, and exports.
- `src/components/diagnostics/InvestigationWorkbench.astro` augments the canonical journey renderer.
- Established journey nodes, diagnostic registry, Universal Input classifier, investigation state, workspace storage, and sensitive-content policy remain authoritative.
- `src/investigations/coverage.js` provides bounded discovery starts for mandatory adjacent operational areas by linking to existing guidance.
- Existing workspace schema compatibility is unchanged. Explicit per-journey resume records use a separate versioned browser-local key.

## Product changes

- Four role-based starts.
- Optional AWS, Azure, GCP, Kubernetes distribution, OS, version, proxy, and registry context.
- Follow-up evidence interpretation that suggests but never selects a branch.
- Command-purpose, permission, execution-context, assumption, placeholder, expected-evidence, and risk disclosure.
- Before/after evidence comparison with an explicit “not proof of recovery” guard.
- Local timeline, explicit resume, privacy clearing, incident-channel export, Markdown export, and local branch feedback.
- Progressive classification disclosure under “Why this result?”
- Mobile sticky progress, responsive panels, touch-sized controls, and journey breadcrumbs.
- User-facing review wording and bounded operational coverage starts.
- GitHub Actions checkout/setup-node v5 with Node 22 retained.

## Schema changes

No migration of the established workspace or investigation-state schema was required. New local resume data uses `helpdevops.investigation.v1.<journey-id>` and stores structured state only after explicit user action. Follow-up evidence is not automatically persisted.

## Security and privacy

- All behavior remains browser-local and static-first.
- Exports redact supported bearer tokens, AWS keys, GitHub tokens, and sensitive assignments.
- The established sensitive-content scan remains active.
- Export text tells users to review before sharing.
- Feedback is explicitly local and not presented as transmitted.
- Clearing removes saved investigation state for the current journey.

## Known limitations

- Environment context narrows only authored rules; it does not inspect a live environment.
- Follow-up evidence uses deterministic canonical recognition and lexical branch assistance; the user must confirm the branch.
- Coverage starts intentionally reuse bounded existing guidance rather than claiming full vendor-specific runbooks.
- No backend feedback collection, account synchronization, PWA, or offline support.
- Live Cloudflare preview checks require a later deployment and are not part of this local snapshot.

## Deferred to EP-020

Production launch approval, production-domain validation, deployed-preview certification, production observability, and other launch hardening.


## Audit remediation pass

The pre-merge remediation now reuses the authoritative sensitive-content policy for export redaction; makes environment and role context change recommendations, command framing, prerequisites, references, branch emphasis, related links, ordering, and first journeys; replaces user-visible internal paths and publishing terms; supplies four distinct handoff formats; clears all investigation-prefixed local records; groups copy-ready commands by risk; expands local timeline events; and requires explicit verification criteria. Discovery now indexes existing journey command fragments while retaining bounded exact-error ranking. The nine adjacent operational starts now state concrete evidence and safe prerequisites.

Clear Investigation verifies removal before claiming success. Context remains advisory and never claims root cause or recovery. No backend, runtime fetch, framework, or EP-020 scope was added.