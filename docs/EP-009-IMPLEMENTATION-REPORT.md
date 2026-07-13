# EP-009 Implementation Report

EP-009 adds five bounded, deterministic, browser-local evidence interpreters:

1. GNU/POSIX-like `df` block and inode output
2. Kubernetes Pod JSON and selected human-readable Pod evidence
3. Docker container State JSON, formatted list records, and bounded human-readable status rows
4. Terraform state-lock error blocks
5. systemd unit properties and bounded status output

The Evidence Interpreter uses an optional source selector, explicit collision handling, input limits, ANSI normalization, local-only processing, and a strict result model: recognition, observations, interpretations, unknowns, and next checks. Universal Input prioritizes strong structured evidence before exact-error discovery and can transfer evidence to `/interpret/` without uploading it.

Five crawlable explanation pages document reliable collection commands, supported formats, limitations, privacy concerns, and authoritative references. Evidence wording, examples, references, limitations, and fixtures are resource-owned; parsing and normalization remain reviewed code.

Workspace integration defaults to interpretation-only saving. Raw evidence is included only when the user explicitly selects it, after the existing sensitive-content review. Restored interpretation-only workspaces display the saved structured interpretation without pretending the original evidence remains available.

No runtime dependency, backend, database, account, AI system, remote parser, telemetry, command execution, ads, affiliate links, or EP-010 work was added.
