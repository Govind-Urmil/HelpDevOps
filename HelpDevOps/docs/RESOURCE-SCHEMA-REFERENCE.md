# Resource Schema Reference

## Common resource-pack fields

- `schemaVersion`: semantic version of the expected resource shape.
- `resourceVersion`: semantic version of the domain content.
- `tool`: stable tool ID matching the centralized registry.
- `messages`: user-facing domain wording.
- `references`: authoritative sources.
- `limitations`: mandatory truthful coverage boundaries.

## Example fields

- `id`: unique stable identifier within the example file.
- `label`: short user-facing name.
- `input`: exact local example input.
- `kind`: optional expected format such as JSON or YAML.

## Tool registry fields

- `id`, `title`, `path`, `category`
- `capabilities`, `inputKinds`
- `status`: `available` or `planned`
- `description`, `aliases`

## Validation rules

`npm run validate:resources` checks resource versions, tool ownership, known capability/input enums, valid status, required and uniquely identified references, limitations, example structure, duplicate IDs, related-tool references, available routes/analyzers, and planned-tool integrity.

## Security rule

Resources are data only. They must never contain executable JavaScript, remote scripts, tokens, credentials, or hidden matching logic.
