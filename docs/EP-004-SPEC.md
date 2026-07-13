# EP-004 — Developer Essentials

Owner: Govind  
Release: v0.4.0  
Status: implementation candidate pending independent audit and owner approval

## Objective

EP-004 expands the deterministic, privacy-first browser workspace with four narrowly bounded developer utilities. All processing remains local in the browser. The release must preserve the static Astro architecture, vanilla JavaScript runtime, transparent result boundaries, resource validation, accessibility, responsive behavior, and clean snapshot workflow established by earlier episodes.

## Scope

The Encoding & Hash Workbench provides UTF-8 aware Base64, Base64URL, hexadecimal and URI-component encode/decode operations plus SHA-256, SHA-384 and SHA-512 hashing through Web Crypto. Decode behavior distinguishes strict validation from explicitly selected tolerant handling and never describes hashing as encryption.

The IPv4 CIDR Calculator accepts unambiguous dotted-decimal IPv4 with a prefix or contiguous subnet mask. It reports mask, wildcard, network, broadcast, first/last addresses, counts, binary form, and resource-driven IANA special-purpose classifications. It explains the context-sensitive meaning of /31 and /32 and does not claim reachability, ownership, geolocation, DNS, port, firewall or cloud-policy checks.

The Linux Permissions Calculator converts three- and four-digit octal modes and symbolic rwx forms, including setuid, setgid, sticky and uppercase S/T representations. It reports owner/group/other and special-bit meaning while warning that effective access also depends on ownership, ACLs, mount options and execution context.

The Git Reference Toolkit validates branch or ref syntax, offers conservative reversible suggestions, and explains a documented subset of HEAD, relative, range, fully qualified ref and object-like hexadecimal forms. It does not execute Git, inspect a repository, resolve objects, check remotes, or assert that a ref exists.

Universal Input may route only high-confidence exact forms: IPv4 CIDR, complete symbolic permissions, fully qualified Git refs and supported Git revision expressions. Ambiguous decimal, hexadecimal and Base64-looking strings remain unclassified. Tool discovery must use the centralized registry and local search/categories.

## Data and maintenance

Every new tool has versioned resources and examples. References, limitations, supported algorithms, diagnostics, cautions and the curated IANA classification table are validated at build time. Resource documentation must explain provenance, update expectations and truthful limitations. No runtime network request is required for analysis.

## Acceptance Criteria

- Four new available tool routes build and operate using local browser processing.
- Encoding and hashing handle Unicode and malformed inputs deterministically.
- IPv4 calculations use unsigned 32-bit arithmetic and reject leading-zero octets, invalid prefixes and non-contiguous masks.
- Linux permission conversion correctly represents special bits and rejects incomplete or invalid forms.
- Git syntax checks distinguish validation and explanation from repository resolution.
- Universal Input routes only conservative, supported exact forms.
- Unit, browser, accessibility, mobile, resource, build, link, metadata, budget and Lighthouse checks run against the final source state.
- Documentation and UI state exactly what was and was not checked.
- A complete portable `HelpDevOps-v0.4.0-EP004-COMMIT-READY.zip` is produced with a SHA-256 digest.
- No commit, push, deployment, backend, database, authentication, EP-005 work, new feature outside scope, or self-approval occurs.

## Out of scope

IPv6, password cracking, encryption, repository execution, filesystem permission mutation, remote API lookup, cloud network planning, deployment and shared persistence are out of scope. Favorites and recent usage are not introduced unless already approved elsewhere; this release prioritizes the four deterministic essentials and their evidence.
