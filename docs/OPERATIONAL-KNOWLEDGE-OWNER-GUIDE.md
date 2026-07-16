# Operational knowledge owner guide

## Add or update guidance

1. Add one concise seed to the correct technology array in `src/resources/operational-knowledge/catalog.js`. Choose a stable slug and existing taxonomy family. Provide specific positive indicators, required technology context, an exclusion, a read-only command, expected signal, and version note when behavior differs.
2. The catalog constructor supplies the common HOKS fields. Review every rendered field; do not accept generic text when the issue needs specific safety or compatibility language.
3. Fixtures are generated for every issue by `fixtures.js`. Add a dedicated regression test when a real false positive, near match, version difference, or collision needs more detail.
4. Update the official technology reference only from the primary vendor/upstream documentation. Never store credentials or copied production output.
5. Run `npm run validate:knowledge`, `npm run validate:coverage`, and the focused `tests/operational-knowledge.test.js` test. Open `/knowledge/<issue-id>/` locally and verify progressive disclosure and the read-only command.

## Safety and false positives

The first command must remain observation/read-only. Never make delete, force, unlock, state removal, destroy, manual state editing, or recursive deletion a default. Add prerequisites, impact, verification, recovery, rollback boundaries, and escalation criteria before publishing any later state-changing option. To correct a false positive, add the smallest exclusion and a regression fixture; do not lower global confidence boundaries.

## Versions, gaps, and deprecation

Refresh versions only after checking current official documentation and representative fixtures. Update the reviewed range, review date, compatibility statement, version notes, and deprecations together. View `coverageSummary` through `/knowledge/` and run coverage validation to find missing fixtures, references, safety fields, or maturity. Mark obsolete guidance as deprecated with a replacement path; do not silently repurpose stable IDs.

An ordinary issue addition should change resource data and tests only. If it requires page-specific rendering or matcher code, stop and determine whether HOKS itself genuinely lacks a reusable field.
