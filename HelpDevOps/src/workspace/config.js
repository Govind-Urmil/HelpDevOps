export const workspaceConfig = Object.freeze({
  preferenceKey: 'helpdevops.preferences.v1',
  databaseName: 'helpdevops-workspace',
  databaseVersion: 1,
  workspaceStore: 'workspaces',
  metadataStore: 'metadata',
  schemaVersion: 1,
  exportFormat: 'helpdevops-workspace',
  exportFormatVersion: 1,
  maxRecentTools: 10,
  maxWorkspaces: 100,
  maxTitleChars: 120,
  maxNoteChars: 20_000,
  maxToolStatesPerWorkspace: 25,
  maxWorkspaceBytes: 512 * 1024,
  maxImportBytes: 2 * 1024 * 1024,
  managedWarningBytes: 5 * 1024 * 1024
});

export const defaultPreferences = Object.freeze({
  schemaVersion: 1,
  favorites: [],
  recentTools: [],
  rememberFavorites: true,
  rememberRecentTools: true,
  workspaceEnabled: true,
  sessionDock: { collapsed: false },
  storageNoticeAcknowledged: false
});
