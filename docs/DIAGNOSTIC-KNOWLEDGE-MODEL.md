# Diagnostic Knowledge Model

HelpDevOps stores each diagnostic journey as a reviewed resource bundle containing metadata, nodes, examples, and references. A journey has one immutable ID, one canonical route, one entry node, compatibility metadata, review dates, aliases, exact-error tokens, limitations, and official references.

Nodes use stable IDs and one of these kinds: question, check, interpretation, action, verification, completion, or escalation. Choices reference the next node by ID. Build-time validation confirms that every reference exists, every node is reachable, questions have an unclear path, higher-risk actions have rollback guidance, and verification nodes define observable recovery criteria.

Journey-owned resources remain local until identical meaning is reused by multiple journeys. This avoids premature abstraction. Generated search and registry indexes are derived artifacts committed as source because the build and snapshot validators require deterministic output.

The model is static-first. It does not use a graph database, server API, account, AI inference, live infrastructure access, or command execution. The “knowledge graph” is the reviewed relationship model, not a storage technology.
