# Local Data and Privacy Model

## Principle
HelpDevOps analysis remains browser-local. Local continuity is optional and must never become a hidden history of DevOps input.

## Automatically remembered
When enabled, HelpDevOps may remember favorite tool IDs, recently opened tool IDs and timestamps, the Session Dock display state, and storage-policy preferences. It does not store the associated tool input or result.

## Explicitly saved
A saved workspace is created only after the user chooses **Save current tool**, reviews any sensitive-content warning, and supplies a title. Workspaces contain validated plain tool input/options, never rendered HTML.

## Storage locations
- `helpdevops.preferences.v1` in localStorage for small preference metadata.
- `helpdevops-workspace` IndexedDB database for explicitly saved workspaces.

## Persistence limits
Local browser data is not cloud backup. It may be cleared by the user, removed in private browsing, rejected because of browser policy, or evicted. Important workspaces should be exported.

## Sensitive content
The warning system checks a conservative set of private-key, token, credential-key and Secret-manifest patterns. It can miss secrets and can produce false positives. Private-key markers are blocked; other categories require explicit acknowledgement.

## Import and export
Workspace export is versioned JSON generated locally. Import files are untrusted, size-limited, schema-validated and previewed through warnings before an atomic merge or replacement.

## Failure behavior
Storage failures disable continuity, not core tools. Existing data is preserved when a write or import fails.
