# EP-019 — Guided Investigation Experience

## Objective

Make HelpDevOps behave like a careful DevOps guide: establish the symptom, collect the safest evidence, interpret it, choose an evidence-based branch, make a bounded change, and prove recovery.

## Scope

- Role-based entry points reuse existing tools, journeys, references, and Incident Brief.
- A shared Investigation Workbench extends every diagnostic journey.
- Optional environment context narrows guidance without establishing facts.
- Follow-up command output is classified locally and can suggest, but never select, a branch.
- Commands expose purpose, permissions, execution context, assumptions, placeholders, expected evidence, and risk.
- Before/after evidence comparison supports explicit verification.
- A compact local timeline, resume control, privacy clearing, branch feedback, and redacted exports support incident continuity.
- Universal Input internals use progressive disclosure.
- Journey routes expose breadcrumbs and user-facing review wording.
- GitHub Actions use checkout v5 and setup-node v5 while retaining Node 22.

## User flows

1. Choose a role or enter evidence directly.
2. Open an existing journey and confirm the symptom.
3. Optionally record environment context.
4. Run one read-only check after reviewing its prerequisites.
5. Paste redacted follow-up evidence and review the suggested branch.
6. Select the branch based on observed evidence.
7. Preserve rollback information before a change.
8. Compare before/after evidence and satisfy explicit verification criteria.
9. Recover, roll back, or escalate with preserved evidence.
10. Explicitly save locally, export a redacted handoff, or clear saved data.

## Data and schema changes

`src/investigations/experience.js` defines the EP-019 experience contract:

- investigation phases;
- command risk classes;
- environment context normalization and filtering;
- command prerequisite derivation;
- before/after comparison;
- timeline entries;
- branch-feedback values;
- redacted incident-channel and Markdown exports;
- per-journey local-storage keys.

The established investigation state and workspace schemas remain compatible. Resume data is an explicit local adjunct with `contractVersion: 1`; raw follow-up evidence is not automatically persisted.

## Accessibility requirements

- Native details/summary controls provide progressive disclosure.
- All inputs have visible or screen-reader labels.
- Status messages use live regions.
- Controls remain keyboard operable with visible focus.
- Mobile touch controls are at least 44 CSS pixels high.
- Sticky progress must not hide focused content.
- Risk is communicated with text, not colour alone.

## Privacy and security requirements

- No backend, telemetry, authentication, or runtime API.
- Nothing is stored until the user chooses “Save and resume locally.”
- Follow-up evidence remains memory-only unless represented by a user-created timeline summary.
- Clearing removes the per-journey resume record.
- Exports redact common credential forms and state that review is required.
- Private-key-like content remains blocked by the established sensitive-content policy.
- Branch feedback remains local unless explicitly exported.

## Performance requirements

- No new framework or runtime dependency.
- The workbench is static HTML plus a small vanilla-JavaScript module.
- No runtime network fetch.
- Existing transfer, request, and Lighthouse budgets remain authoritative.

## Acceptance criteria

- Four role starts route into existing product areas.
- Context normalization and narrowing are deterministic.
- Follow-up evidence never auto-selects a branch.
- Risk and prerequisite metadata are visible for applicable commands.
- Before/after comparison never equates changed output with recovery.
- Timeline save, resume, export, and clear remain browser-local.
- Exports redact supported credential-like patterns.
- Search accepts exact errors and output fragments already present in canonical registries.
- Destinations are descriptive links rather than raw path labels.
- Classification internals are collapsed under “Why this result?”
- Mobile progress and touch controls are usable.
- Branch feedback explicitly states that it is not transmitted.
- Review wording makes no unsupported expert or compatibility claim.
- CI action migrations retain the existing Node runtime.

## Explicit exclusions

Offline/PWA support, production launch, domain changes, monetization, backend services, accounts, telemetry, AI diagnosis, framework migration, broad dependency upgrades, and EP-020 hardening.

