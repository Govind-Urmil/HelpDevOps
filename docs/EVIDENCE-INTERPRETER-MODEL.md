# Evidence Interpreter Model

HelpDevOps interpreters use five layers: recognition, observations, interpretations, unknowns, and next checks. Structured or deliberately formatted evidence is preferred. Human-readable output is accepted only as a bounded convenience format and is labelled accordingly. Detection uses explicit structural signals and never exposes probability percentages. Raw input remains local and is not saved automatically.

Resources own supported formats, recommended commands, limitations, privacy requirements, references, fixtures, and related journeys. Code owns parsing, normalization, collision handling, and bounded structural logic.

Every parser must reject or mark unsupported input when required structure is absent. A parser must never infer that a Terraform lock is stale, that a high disk percentage identifies the growth source, that a running container is healthy, that a Pod status proves root cause, or that a systemd failed state identifies application cause.
