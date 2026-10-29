# ADR-CG-001 — Guardian is advisory; SIGA retains authority

Date: 2026-10-29
Status: **PROPOSED — NOT RATIFIED**

## Context
Context-risk warnings, decision comparisons and handoff verification must assist SIGA without silently changing who decides or blocks execution. The canonical SIGA skill exists on main, while the portable Godot authority tree remains a separate draft PR #18.

## Decision proposed
Context Guardian emits evidence-backed **advisory** signals only. SIGA remains the sole process orchestrator; existing domain owners retain decision authority; INSPECTOR owns objective evidence verification; REPORTER presents resumable state. Guardian warnings cannot independently create blocking gates, overwrite approved/rejected decisions or classify SIGA continuation modes.

## Consequences
- No change to `RESUME/WATCH/ADVANCE`.
- A concrete conflict is routed to the already applicable authority/gate, not self-resolved.
- If a future iteration changes blocking power, skill topology or authority, that change is **constitutional** and requires a separate explicit human approval.
- M0 ships no runtime registration or skill invocation.

## Alternatives rejected for this proposal
- Independent Guardian orchestrator: duplicates SIGA authority.
- Automatic stop on heuristic token threshold: would fabricate a runtime risk based on unobservable telemetry.

## Relationship
SPEC-CG-001. Does not alter PR #18/#19 or Observatory PoC PR #1.
