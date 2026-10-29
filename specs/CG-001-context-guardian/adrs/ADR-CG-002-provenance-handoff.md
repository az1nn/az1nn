# ADR-CG-002 — Explicit provenance and portable handoff, no native telemetry assumption

Date: 2026-10-29
Status: **PROPOSED — NOT RATIFIED**

## Context
Native ChatGPT sessions do not expose an API-free, verified measurement of actual context-window occupancy or continuous cross-chat history capture. Relying on heuristic thresholds as utilization creates false confidence. Summaries can omit or distort decisions.

## Decision proposed
- Distinguish `MEASURED_SAMPLE` (e.g., characters in user-provided excerpt), `HEURISTIC` (token approximation), `IMPORTED`, `UNAVAILABLE`.
- Always label sample coverage and origin; no context-window percentage or compaction event claim.
- Keep versioned decision references, evidence provenance and explicit supersession. Preserve rejected records.
- Enrich CAVEMAN HANDOFF v1 with optional Guardian metadata. Observatory HandoffEnvelope v1 is compatibility-only, never an operational dependency.
- On session resume, VERIFY-FIRST reconstructs live system reality. A previous handoff is not proof of current HEAD, authorization or open-gate status.
- Sanitize before persistence to a public repository; never store full private transcripts/secrets by default.

## Consequences
- Advisories can run per explicit SIGA invocation, not continuously in the background.
- Missing history/evidence is reported as `UNKNOWN` or `INSUFFICIENT_EVIDENCE`, never as a false zero or implicit approval.
- Execution and integration remain blocked pending separate M1 authorization and applicable governance.

## Alternatives rejected for this proposal
- Inventing a provider utilization meter.
- Treating chat memory as source of truth.
- Making Observatory mandatory.
