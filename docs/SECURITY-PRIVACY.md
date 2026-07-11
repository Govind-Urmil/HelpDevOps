# Security and Privacy

Process user data locally wherever practical. Do not upload input without approved need and clear disclosure. Keep secrets out of repository/client code. Minimize and review dependencies and third-party scripts. Treat pasted configuration as untrusted data. Fail safely and disclose limitations.

## EP-002 implementation

The Universal Input is a non-analysing foundation: content is not uploaded, persisted, classified, or executed. Search is a local static page index.

`src/config/security.js` is the authoritative application security-header policy. `npm run build` generates `dist/_headers` as an adapter only for hosts that support the `_headers` format. Future host adapters must consume the same policy instead of duplicating values. Inline structured data is authorized with build-derived SHA-256 hashes; application JavaScript remains external.

HSTS is intentionally disabled in generic development output. It may be enabled only after the real production domain, HTTPS availability, and rollback strategy are approved. `includeSubDomains` requires a separate deliberate review because it affects every subdomain and can make non-HTTPS services unreachable. The selected hosting adapter—not generic build output—will activate the approved value.

CI runs `npm audit --audit-level=high`. High and critical advisories fail without applying uncontrolled upgrades; remediation requires explicit package review and lockfile updates.

No third-party scripts, external fonts, analytics, advertising, backend, database, authentication, or required remote runtime API are present.
