# Guided Investigation Authoring

## Journey sequence

Author one decision at a time: symptom, read-only evidence, interpretation, branch, bounded action, verification, then recovery or escalation. Do not turn a journey into a command catalogue.

## Commands

Keep the existing `command` and `purpose` fields. Authors may add:

- `risk`: `read-only`, `reversible`, `service-impacting`, or `destructive`;
- `permissions`;
- `executionContext`;
- `platformAssumptions`;
- `expectedEvidence`.

Use visible `<placeholder>` tokens. Never provide secrets or customer identifiers in examples. A bundle is a review surface, not a recommendation to run every command.

## Environment rules

Optional `environments` rules may narrow an item to known context values. Absence of context must retain general guidance. Context must never increase diagnostic certainty by itself.

## Verification

State observable recovery criteria. A command returning successfully, a process being “running,” or output changing is not sufficient without service-level confirmation.

## Escalation

State when to stop, evidence to preserve, rollback preference, likely owner, and broad-impact or possible-P1 indicators. Do not invent team names.

## Freshness

Use only repository-supported review dates, sources, compatibility, and limitations. Never claim expert testing or current vendor compatibility without evidence.

## Feedback and exports

Feedback stays local. Exports redact common credential patterns but users must review every export before sharing. Raw evidence should not be copied into timeline summaries.

