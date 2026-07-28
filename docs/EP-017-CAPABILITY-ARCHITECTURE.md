# EP-017 Connected Guided Operations

## Source of truth

`src/core/capability-registry.js` extends the existing tool registry with invocation policy, accepted evidence, supported workflows, privacy metadata, and a versioned result envelope. A capability delegates to the existing analyzer used by its standalone page; parsing and calculation logic must not be copied into Universal Input or investigations.

The supported policies are `automatic-safe`, `user-input`, and `confirmation-required`. Automatic invocation is limited to deterministic, non-mutating, browser-local analysis. Capability output never proves live environment state.

`src/investigations/state.js` is the shared state contract. It records original evidence, capability results, observed/confirmed/unknown/excluded findings, actions, verification, risks, source metadata, and the next action. Workspace persists this contract only after explicit save. Storage failure leaves analysis available. Incident Brief receives an editable projection and excludes raw evidence by default.

## Adding or updating a capability

1. Maintain one deterministic analyzer under `src/tools`.
2. Register its user-facing route in `src/config/tools.js`.
3. Add the smallest adapter and correct invocation policy in `capability-registry.js`.
4. Declare only workflows that can represent its result truthfully.
5. Add contract, direct-versus-workflow equality, malformed-input, privacy, and interface tests.
6. Add an investigation connection only when the operation materially advances a branch.

Do not introduce runtime network access, arbitrary execution, hidden persistence, or a parallel registry.

## Investigation lifecycle

Connected journeys use Observe → Scope → Explain → Test → Act → Verify → Preserve. Findings change state explicitly; a missing result remains unknown. Five or more journeys embed a compact capability check so users can add structured evidence without leaving the investigation. Commands requiring a real environment remain instructions for the user to execute there.

## Tool audit

### Integrated capabilities

Cron, JSON/YAML, Dockerfile, Docker Compose, Kubernetes manifest, IPv4/CIDR, Linux permissions, Git reference, and encoding/hash share the registry. Encoding/hash requires explicit confirmation in connected workflows.

### Direct-use utilities

All nine tools retain their standalone routes. Direct use remains valuable and no route was removed.

### Future integration candidates

Git revision explanation and additional encoding/hash modes may be connected when a reviewed journey needs them. Existing evidence interpreters remain specialized evidence capabilities rather than being forced into the tool envelope.

### Orphan candidates

None. No tool met the removal criteria.

## Owner maintenance and limitations

- Keep capability adapters thin and capability-specific output typed by the analyzer.
- Increase the result contract version only for incompatible changes.
- Preserve local-only behavior and explicit saving.
- Connected checks validate supplied artifacts only; they do not contact hosts, clusters, repositories, registries, CI systems, or clouds.
- Cross-file change analysis is intentionally excluded.
