# EP-005 Specification — Privacy-First DevOps Workspace

## Purpose
EP-005 adds useful local continuity without turning HelpDevOps into an automatic browser-history store. Navigation metadata may be remembered automatically; raw DevOps input is durably stored only after an explicit save action.

## Scope
- Session Dock with truthful local save state.
- Favorite tool IDs and up to ten recent tool IDs.
- Explicitly saved workspaces in IndexedDB.
- Versioned workspace schema, optimistic revisions, and safe limits.
- Sensitive-content warning before save/export/import; unmistakable private keys are blocked.
- Local JSON export and validated merge/replace import.
- Local Data & Privacy controls, including clear-all.
- Cross-tab invalidation through BroadcastChannel with storage-event fallback.
- Core analysis remains usable when storage is unavailable.

## Storage boundaries
`localStorage` is used only for small preference metadata. IndexedDB stores explicitly saved structured workspace records. No account, cloud synchronization, telemetry, server upload, or automatic input history is introduced.

## Safety
Stored and imported values are untrusted data and are rendered as text. No HTML, commands, functions, result DOM, or event objects are persisted. Sensitive-content detection is conservative and explicitly incomplete.

## Limits
- 10 recent tools.
- 100 workspaces.
- 25 tool states per workspace.
- 512 KB per workspace.
- 2 MB import file.
- 5 MB managed-data warning threshold.

## Non-goals
No backend, server database, authentication, cloud sync, collaboration, encryption/vault claim, automatic raw-input history, generic diff, drag-and-drop, PWA/service worker, analytics, or EP-006 work.

## Acceptance Criteria
- Core tools work when local storage is unavailable.
- No raw input is stored without explicit save.
- Favorites/recent records contain only tool metadata.
- Import is fully validated before replacement.
- Private-key material cannot be saved or imported.
- Export/import data is versioned and local.
- Clear-all removes the HelpDevOps preference namespace and IndexedDB database.
- Schema/model/sensitive-content/import logic has meaningful unit coverage.
- Build, resource, release, security, route, performance, snapshot and commit-hygiene checks pass.
- Browser, accessibility, mobile, cross-tab and Lighthouse verification is delegated to the independent ChatGPT Work verification pass where its environment adds value.
