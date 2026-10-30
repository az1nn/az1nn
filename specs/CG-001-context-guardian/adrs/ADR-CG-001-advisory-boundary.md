# ADR-CG-001 — Context protection is part of SIGA, not a second skill

Date: 2026-10-29
Status: **APPROVED FOR DOCUMENTARY MERGE (CONDITIONAL AUTHORIZATION) — NOT CONSTITUTIONALLY RATIFIED**

## Review history
- Original M0 proposal: Context Guardian as an advisory capability under SIGA, with no independent orchestration authority.
- User's CG-007 review: **ADR-CG-001=B** with explicit correction: **"context guardian e siga devem ser um só"**.
- This revision incorporates the requested design direction. The user's subsequent conditional instruction authorizes merging the ADRs **only if no conflicts remain**. This allows documentary publication after verification; it **does not** ratify the Constitution, authorize runtime integration, approve M1 or broaden scope to other PR #20 files. Preserve the original revision in Git history.

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

## Publication and remaining gates
- **Documentary merge condition:** verify no material incompatibility with SIGA canonical authority and no Git merge conflicts; merge only the two ADR files, never all 10 PR #20 files under this authorization.
- **Constitutional review:** any future change to canonical SIGA execution semantics, topology, authority or new blocking gates requires explicit human ratification before implementation.
- **Placement:** this ADR is documentary. Any later relocation/integration into canonical SIGA files must undergo separate scoped review; no runtime activation here.
- **M1:** remains not authorized.

References: SPEC-CG-001; CG-007; PR #18 and PR #19 remain independent draft workstreams; Observatory PR #1 is a PoC only.
