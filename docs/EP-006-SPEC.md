# EP-006 Specification — Container & Kubernetes Engineering Tools

## Purpose

EP-006 turns the earlier Docker Compose and Kubernetes classification-only paths into production browser-local engineering tools and adds a Dockerfile Analyzer. The release must deepen practical container and Kubernetes value without pretending to replace Docker Build, Docker Compose resolution, a Kubernetes API server, admission policy, vulnerability scanners, or live runtime testing.

## Scope

EP-006 delivers three available tools:

1. Dockerfile Analyzer.
2. Docker Compose Analyzer.
3. Kubernetes Manifest Analyzer.

It also routes supported Universal Input results to the specialized tools, extends the tool/resource registry, preserves explicit workspace saving, and adds tests, owner documentation, and release validation.

### Dockerfile Analyzer

The analyzer performs bounded static inspection of logical Dockerfile instructions. It checks instruction structure, build stages, base-image references, final user declaration, selected secret-like ARG/ENV patterns, remote ADD usage, shell-form CMD/ENTRYPOINT, and a selected package-cache pattern. It does not execute a build, inspect context files, resolve images, scan vulnerabilities, or prove runtime correctness.

### Docker Compose Analyzer

The analyzer parses one Compose YAML document and inspects the services mapping, image/build declarations, obsolete top-level version usage, selected image-tag signals, privileged/host namespace settings, Docker socket and bind mounts, explicit root user settings, and secret-like environment literals. It does not resolve interpolation, env files, profiles, include/extends behavior, build contexts, referenced files, or engine runtime behavior.

### Kubernetes Manifest Analyzer

The analyzer parses up to twenty YAML documents and checks core object identity fields, selected Pod/workload template structure, container image references, resource declarations, probes, selected security context and host-access settings, hostPath volumes, common workload selector/template-label consistency, Services without selectors, and Secret handling warnings. It does not connect to a cluster or perform complete OpenAPI, CRD, admission, RBAC, quota, defaulting, or live-state validation.

## Architecture

The release extends the established domain-owned pattern:

- `src/tools/<tool>/analyzer.js` owns deterministic behavior.
- `resources.json` owns wording, limitations, and official references.
- `examples.json` owns maintained examples.
- `src/config/tools.js` remains the tool source of truth.
- Astro routes remain static and expose `data-tool-root` for explicit workspace saving.
- No backend, account, database server, remote runtime API, editor framework, or new runtime dependency is introduced.

## Safety and truthfulness

Every result must state what was and was not checked. Findings are review signals, not universal policy decisions. The tools must not claim that a Docker image is secure, a Compose project will run, or a Kubernetes manifest will be accepted by a target cluster. Secret-like detection remains conservative and incomplete. User input stays in the current browser unless the user explicitly saves a workspace.

## Acceptance Criteria

- All three routes are available and registry-driven.
- Universal Input routes Dockerfile, Compose, and Kubernetes input to the correct specialized tool.
- Dockerfile structural errors and selected review signals are deterministic and tested.
- Compose parsing and selected service/host/secret signals are deterministic and tested.
- Kubernetes multi-document parsing, common structural checks, selected workload/security/resource signals, and truthful cluster limitations are deterministic and tested.
- Existing EP-003–EP-005 tools and workspace behavior do not regress.
- Resource validation covers nine packs and nine available tools.
- Current release metadata is consistently EP-006 / v0.6.0.
- Operations documentation includes the new failure modes.
- No raw reports, dependencies, builds, screenshots, nested archives, secrets, or local paths enter the commit-ready snapshot.
- Core checks, unit tests, production build, static validation, budgets, snapshot validation, and commit hygiene pass.
- Browser/Lighthouse claims are made only if those checks genuinely execute.
