# EP-018 Release Notes — v0.18.0

HelpDevOps v0.18.0 turns the existing tools and guidance into a connected troubleshooting platform while retaining the static, browser-only architecture.

## Highlights

- Refined the homepage around Universal Input, troubleshooting, featured tools, trust boundaries, and clear starting actions; removed the standalone homepage References entry point.
- Simplified primary navigation to Troubleshoot, Tools, Interpret, and Workspace. References remain available contextually and by direct URL.
- Expanded the diagnostic catalog from 14 to 30 journeys across Linux, Docker, Kubernetes, Terraform, Git, Jenkins, Cron, networking, Bash, and YAML.
- Standardized every added journey around symptom confirmation, read-only evidence, branching, guarded remediation, rollback, verification, prevention, related tools, and an official source.
- Added exact-error and symptom filtering to the troubleshooting directory.
- Connected journey pages to related deterministic tools, operational references, official documentation, and sibling journeys.
- Improved Universal Input messages for ambiguous and unsupported input without adding AI or network processing.

## Pre-merge remediation

- Repaired user-facing UTF-8 punctuation corrupted by single and repeated mojibake conversions, including separators, arrows, and em dashes. Source validation and EP-018 regressions now reject common corruption signatures.
- Replaced monochrome emerald technology glyphs with lightweight local official-color renditions for every technology displayed through the shared technology-mark registry. Source, color, licensing, and trademark notes are recorded in `docs/TECHNOLOGY-MARK-SOURCES.md`; no runtime asset fetch was added.
- Reworked the generic evidence gate for Docker networking, Kubernetes ImagePullBackOff, Kubernetes Service reachability, Terraform provider initialization, network timeouts, and TLS certificate verification. Each now branches on three concrete observed evidence classes before the existing guarded action, rollback, verification, and prevention stages.

No backend, authentication, analytics, remote execution, AI feature, or unrelated technology domain was introduced.
