# SPEC-CG-001 — Decision ledger (design-level)

Status of every entry below: **USER-CONFIRMED INTENT**, not constitutional ratification or implementation authorization.

| ID | Decision | Owner / authority | Evidence | State |
|---|---|---|---|---|
| CG-D01 | Context Guardian belongs in SIGA operational workflow, not the Observatory | User / product intent | Current conversation 2026-10-29; persist here as proposed design statement | PROPOSED FOR DESIGN |
| CG-D02 | Portable capability under `az1nn/az1nn/skills` | User / product intent | User explicitly selected target path | PROPOSED FOR DESIGN |
| CG-D03 | Observatory remains PoC / future plans; no runtime dependency | User / product intent | User confirmation 2026-10-29 | PROPOSED FOR DESIGN |
| CG-D04 | Context-window telemetry must distinguish measurements, heuristics and unavailable information | User / product intent | Context Window Monitor request | PROPOSED FOR DESIGN |
| CG-D05 | Preserve existing SIGA authority, Inspector/Reporter boundaries and verifiable handoff | Existing canonical SIGA contract; draft Godot tree | `.github/skills/siga/SKILL.md`, PR #18 and Observatory PR #1 | REQUIRED COMPATIBILITY |
| CG-D06 | M0 is documentary and independent; no merge or implementation | Workstream scope | SIGA continuation + current PR constraints | PROPOSED DOCUMENTATION |
| CG-D07 | New hard-blocking gates, changes in authority or constitution require human ratification | Constitutional authority | Draft Godot tree constitution, section 25; active SIGA human gates | HUMAN_GATE PENDING if proposed later |

## Policy
A future decision update must identify `decision_id`, provenance/actor, effective revision, explicit supersession link and whether authority to change was present. Preserve `REJECTED` records. Do not promote a proposed item to approved solely from an assistant summary.

## Open decisions
- CG-O01: source/ownership of a shared decision ledger across multiple project repositories.
- CG-O02: trigger cadence for routine checkpoint audit (SIGA invocation vs milestone boundary).
- CG-O03: choice of UI host support and privacy-respecting storage.
- CG-O04: whether an existing Inspector gate should block execution on a concrete decision conflict, as opposed to advisory warning. Requires constitutional review if semantics change.
- CG-O05: admission of CG-001 into the roadmap after PR #19 reconciliation, without displacing SKR P0 and SIGA P1.
