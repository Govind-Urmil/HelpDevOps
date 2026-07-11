# EP-003 Specification — Deterministic Core Tool Platform

## Purpose

EP-003 activates HelpDevOps' first production utilities while preserving the static Astro and vanilla-JavaScript architecture. It establishes a small resource-driven platform, a centralized tool registry, deterministic Universal Input analysis, and a reusable Result Contract.

## Scope

- Centralized tool registry for available and planned tools.
- Human-readable, versioned JSON resource packs.
- Build-time resource validation.
- Real Universal Input detection for JSON, YAML, and common cron input.
- Production Cron Analyzer.
- Production JSON & YAML Inspector and Formatter.
- Classification-only Docker Compose and Kubernetes signals.
- Local search discovery for available tools.
- Browser-local processing with bounded inputs and no persistence.

## Cron Support

The Cron Analyzer supports common five-field expressions, optional commands, wildcards, lists, ranges, steps, comments, blank lines, and common macros. It validates supported numeric ranges and explains the schedule at a field level. It does not calculate future runs, execute commands, validate permissions, or claim universal cron-dialect support.

## Structured Data Support

The JSON inspector performs strict native JSON parsing, root-type detection, structure statistics, pretty formatting, and compact formatting. Duplicate-key detection is explicitly outside scope.

The YAML inspector uses the maintained `yaml` parser with bounded alias handling. It supports multiple documents, root-type and structure analysis, error reporting, formatting, and classification signals. Parsing does not prove product-specific semantic validity.

## Result Contract

Every result answers: what happened, why, what the user can do, what was checked, what was not checked, and what comes next. Results expose deterministic evidence rather than fabricated statistical confidence.

## Safety

- Maximum input size: 256 KB.
- Maximum YAML documents: 20.
- YAML alias expansion is bounded.
- Input is not uploaded, persisted, or logged.
- User content is rendered as text.
- No arbitrary code execution or remote runtime APIs.

## Non-goals

Full Docker Compose validation, Kubernetes schemas, Dockerfile analysis, Jenkins syntax, Git, Bash, Terraform, multi-file Preflight, persistence, authentication, databases, backends, AI, and public deployment are excluded.

## Acceptance Criteria

- Astro and vanilla-JavaScript architecture remains intact.
- Universal Input performs genuine local analysis.
- Cron, JSON, and YAML tools work for the documented subset.
- Compose and Kubernetes remain classification-only.
- Resource validation runs in standard checks.
- Search discovers available tools truthfully.
- Unit, build, browser, accessibility, performance, security, and snapshot checks genuinely pass or limitations are reported.
- The final repository snapshot is Git commit-ready.
