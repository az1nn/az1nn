# ADR-CG-001 — Context protection is part of SIGA, not a second skill

Date: 2026-10-29
Status: **REVISION REQUESTED (CG-007: B) / REVISED DRAFT — NOT RATIFIED**

## Review history
- Original M0 proposal: Context Guardian as an advisory capability under SIGA, with no independent orchestration authority.
- User's CG-007 review: **ADR-CG-001=B** with explicit correction: **"context guardian e siga devem ser um só"**.
- This revision incorporates the requested design direction. It is **not** acceptance of the revised ADR, a constitutional ratification, runtime integration, or M1 authorization. Preserve the original revision in Git history.

## Architectural direction requested
**SIGA itself** owns context-risk inspection, decision-integrity checks and portable handoff checks within its existing operational flow. "Context Guardian" is a **feature/concern of SIGA**, not a separately invocable skill, parallel agent, standalone orchestrator, independently gated subsystem or separate authority.

The documentation folder `skills/context-guardian/` in this draft PR is a **transitional design artifact only**, not a canonical runtime skill. Any future executable behavior must be integrated into the existing canonical SIGA implementation, subject to review, rather than registering `Context Guardian` as another executable skill.

## Proposed workflow (not active)
`SIGA: RECONCILE -> [context/decision assessment] -> CLASSIFY -> EXECUTE -> VERIFY -> [decision + handoff assessment] -> HANDOFF`

Square brackets identify **internal SIGA checks**, not new states, actors, execution privileges or mandatory blocking gates.

## Invariants retained
- Exactly one process authority: SIGA (`.github/skills/siga/SKILL.md` on main).
- SIGA's classification remains exactly `RESUME | WATCH | ADVANCE`.
- Domain owners, INSPECTOR and REPORTER retain existing authority boundaries; SIGA does not invent approval or inspection evidence.
- Alerts are advisory; any stop/escalation must rely on an **already authorized** gate with verifiable evidence.
- New or modified constitutional authority, mandatory gates, ownership topology or execution rights remain subject to a **separate explicit human ratification**.
- No runtime implementation, skill registration, merge, constitutional modification or Observatory dependency in M0.

## Alternatives evaluated
- **Rejected for current design:** independently activatable Guardian skill/sub-orchestrator, even when described as advisory; it creates unnecessary conceptual separation from SIGA.
- **Rejected:** percentage of actual native ChatGPT context-window occupancy inferred from text length.
- **Preferred for review:** SIGA-internal capability sharing existing evidence, decision and handoff protocols.

## Pending review
1. Confirm the revised ADR wording and whether even the documentation should eventually move under SIGA's canonical skill directory (no move in this PR).
2. Determine whether future edits alter constitutional skill topology or authority; if so, obtain explicit constitutional approval **before** implementation.
3. Resolve M1-specific behavior separately; this ADR review is not authorization for M1.

References: SPEC-CG-001; CG-007; PR #18 and PR #19 remain independent draft workstreams; Observatory PR #1 is a PoC only.
