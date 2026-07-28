# EP-022 trust, reference, safety, and privacy audit

## Trust and references

The audit inspected journey dates, review windows, compatibility, limitations, and official references. Launch metadata uses HTTPS official documentation for Kubernetes, Docker, Terraform, Git, Jenkins, Linux, POSIX Cron, networking standards, and YAML. Internal validation checks unique routes, known journey relationships, dates, boundaries, and sources.

External availability remains a manual or scheduled check so builds do not depend on vendor uptime. Reachability alone does not prove a source supports every claim; content review remains an owner responsibility.

## Safety

Patterns reviewed include `chmod 777`, recursive permission changes, TLS bypass, firewall disabling, state deletion or blind force-unlock, shared-branch force push, premature Kubernetes deletion, broad Docker pruning, root execution, credential exposure, evidence deletion, blind restart loops, destructive deletion, and security-control bypass.

Launch guides reject relevant shortcuts. Existing validation requires read-only checks, unknown/escalation branches, rollback for moderate/high-risk actions, and verification. Advanced operations remain possible only through owned, scoped, reversible procedures.

## Privacy

Inspected surfaces include Universal Input, interpreters, follow-up evidence, search, Workspace, storage, clipboard, imports, exports, Incident Brief transfer, URLs, fixtures, scripts, and analytics hooks.

- Evidence and search text stay browser-local and out of URLs.
- No third-party runtime script or analytics integration was added.
- Persistence requires explicit save; imports are validated before merge or replace.
- Sensitive-content checks block private-key material in persistence and handoff.
- Clipboard actions are explicit and provide failure recovery.
- Exports may contain operational context and must be redacted before sharing.
- Fixtures are synthetic and marked as containing no real environment data.

Browser extensions, compromised devices, and copied exports are outside application control. Evidence, Workspace content, and search text must never be captured by analytics.
