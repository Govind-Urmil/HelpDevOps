# EP-009 Specification — Evidence Interpreter Foundation

## Objective
Connect bounded command output to transparent observations, interpretations, unknowns, safe next checks, and reviewed diagnostic journeys.

## Scope
Five browser-local interpreters: df filesystem usage, Kubernetes Pod evidence, Docker container state, Terraform state-lock errors, and systemd unit state. Includes structured versus human-readable recognition, source selection, bounded parsing, privacy review, workspace compatibility, /interpret/ hub, five static explanation pages, validation, fixtures, and tests.

## Safety
Parsers separate observation from interpretation, require unknowns, do not claim root cause, avoid confidence percentages, perform no command execution, transmit no evidence, and never recommend destructive collection commands.

## Privacy
Raw evidence is never saved automatically. Explicit workspace saving remains subject to sensitive-content scanning. Users are told to redact operational details before saving or sharing.

## Non-goals
No AI, arbitrary log parsing, screenshots, OCR, mixed-command parsing, shell execution, backend, live infrastructure, ads, affiliates, or EP-010 work.

## Acceptance Criteria
- Five reviewed interpreter resources validate.
- Strong structured evidence takes precedence over exact-error discovery.
- Human-readable formats are labelled best-effort.
- Every result contains observations, interpretations, unknowns, and safe next checks.
- Workspace save remains explicit and browser-local.
- Six interpret routes build and are crawlable.
- Tests, build, budgets, snapshot portability, and commit hygiene pass.

Implementation remains resource-driven and bounded.
