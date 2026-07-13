# Workspace Schema Reference

## Preferences
Key: `helpdevops.preferences.v1`

Fields: `schemaVersion`, `favorites`, `recentTools`, `rememberFavorites`, `rememberRecentTools`, `workspaceEnabled`, `sessionDock`, and `storageNoticeAcknowledged`.

## Database
Name: `helpdevops-workspace`; version: `1`.

Stores:
- `workspaces`, keyed by `id`, indexed by `updatedAt`.
- `metadata`, reserved for versioned migration metadata.

## Workspace record
Required fields: `id`, `schemaVersion`, `revision`, `title`, `createdAt`, `updatedAt`, `lastOpenedAt`, `toolStates`, `notes`, `source`, and `sensitivity`.

## Tool state
Required fields: `toolId`, `toolSchemaVersion`, `input`, `options`, and `resultSnapshot`. EP-005 always writes `resultSnapshot: null`; analyzers regenerate current results after reopening in a future compatible workflow.

## Export envelope
`format: helpdevops-workspace`, `formatVersion: 1`, `exportedAt`, `applicationVersion`, and `workspaces`.

## Compatibility
Unknown schema/export versions are rejected without deleting existing data. IDs are immutable. Revision conflicts must not silently overwrite a newer record.
