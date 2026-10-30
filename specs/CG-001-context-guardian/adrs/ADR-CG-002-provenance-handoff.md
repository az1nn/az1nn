# ADR-CG-002 — Explicit provenance and portable handoff, no native telemetry assumption

Date: 2026-10-29
Status: **APPROVED FOR DOCUMENTATION (CG-007: A)**  
Scope: **Design direction only — NOT implemented; NOT constitutional ratification; NO M1 or merge authorization.**

## Context
Native ChatGPT sessions do not expose an API-free, verified measurement of actual context-window occupancy or continuous cross-chat history capture. Relying on heuristic thresholds as utilization creates false confidence. Summaries can omit or distort decisions.

## Approved documentary decision
- Distinguish `MEASURED_SAMPLE` (e.g., characters in user-provided excerpt), `HEURISTIC` (token approximation), `IMPORTED`, `UNAVAILABLE`.
- Always label sample coverage and origin; no context-window percentage or compaction event claim.
- Keep versioned decision references, evidence provenance and explicit supersession. Preserve rejected records.
- SIGA's existing CAVEMAN HANDOFF v1 may gain **optional SIGA-internal context-check metadata**; it remains the canonical handoff format. Observatory HandoffEnvelope v1 is compatibility-only, never an operational dependency.
- On session resume, VERIFY-FIRST reconstructs live system reality. A previous handoff is not proof of current HEAD, authorization or open-gate status.
- Sanitize before persistence to public repositories; never store full private transcripts or secrets by default.
- Approved CG-O01: decision evidence belongs to the owning project; cross-project references are portable without centralizing sensitive state.
- Approved CG-O03: render through Intelligent UI when available, with equivalent Markdown text fallback.

## Consequences
- SIGA-internal advisory checks may be proposed for each explicit SIGA invocation and significant handoff boundary (CG-O02). This is a plan, not a running continuous monitor.
- Missing history/evidence is reported as `UNKNOWN` or `INSUFFICIENT_EVIDENCE`, never as a false zero or implicit approval.
- Signal severity is not a new execution gate (CG-O04).
- Execution, CLI/contract validation, deployment and runtime integration remain subject to separate M1 authorization and applicable governance.

## Alternatives not adopted
- Inventing a provider utilization meter.
- Treating chat memory as source of truth.
- Making Observatory mandatory.
- Creating a second Guardian orchestrator/skill; ADR-CG-001 revision remains **pending approval**.

## Approval provenance
User CG-007 selection `ADR-CG-002=A` on 2026-10-29; no constitutional change ratified.
