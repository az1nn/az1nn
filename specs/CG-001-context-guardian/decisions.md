# SPEC-CG-001 — Decision ledger (design-level)

Prior design decisions CG-D01–CG-D07 remain traceable. CG-O01–CG-O05 and ADR-CG-002 have explicit **documentary approval** in CG-007; ADR-CG-001 was returned for revision.

| ID | Decision | Owner / authority | Evidence | Historical state |
|---|---|---|---|---|
| CG-D01 | Context Guardian belongs in SIGA operational workflow, not the Observatory | User / product intent | 2026-10-29 original design discussion | PROPOSED FOR DESIGN |
| CG-D02 | Portable proposal documented in `az1nn/az1nn/skills` | User / product intent | User selected skills location | PROPOSED FOR DESIGN; see CG-007 clarification |
| CG-D03 | Observatory remains PoC / future plans; no runtime dependency | User / product intent | User confirmation 2026-10-29 | PROPOSED FOR DESIGN |
| CG-D04 | Context-window telemetry must distinguish measurements, heuristics and unavailable information | User / product intent | Context Window Monitor request | PROPOSED FOR DESIGN |
| CG-D05 | Preserve existing SIGA authority, Inspector/Reporter boundaries and verifiable handoff | Existing canonical SIGA contract; draft Godot tree | `.github/skills/siga/SKILL.md`, PR #18 and Observatory PR #1 | REQUIRED COMPATIBILITY |
| CG-D06 | M0 is documentary and independent; no merge or implementation | Workstream scope | SIGA continuation + initial PR constraints | PROPOSED DOCUMENTATION |
| CG-D07 | New hard-blocking gates, changes in authority or constitution require human ratification | Constitutional authority | Draft Godot tree constitution section 25; active SIGA human gates | HUMAN_GATE IF APPLICABLE |

## Decision-record policy
Every change must retain decision ID, actor/authority, revision, evidence and explicit supersession where applicable. Preserve historical rejected/proposed records. Do not infer user authorization from an assistant summary. Design approval is narrower than constitutional ratification or implementation authorization.

## CG-007 — User approval ledger (2026-10-29)

**Source:** user response in the SIGA Context Guardian CG-007 review, supplied as `CG-O01=A, CG-O02=A, CG-O03=A, CG-O04=A, CG-O05=A; ADR-CG-001=B; ADR-CG-002=A`.

These are **explicit design/documentation approvals**, **not** authorization to implement M1, activate an autonomous capability, merge a PR, or ratify constitutional changes. Previous CG-D01–CG-D07 entries above retain their original statuses and historical provenance.

| ID | Selected option / approved design decision | State | Restriction |
|---|---|---|---|
| CG-O01 | A — Decision ledger resides in each owning project; use portable cross-project references | APPROVED — DOCUMENTARY | No central mutation authority or public chat dumps |
| CG-O02 | A — Include context/decision checks on each SIGA invocation and meaningful handoff boundary | APPROVED — DOCUMENTARY | Native ChatGPT has no continuous/background listener |
| CG-O03 | A — Intelligent UI when host supports it; Markdown fallback; persist only to canonical project sources | APPROVED — DOCUMENTARY | No UI dependency on host-private capabilities |
| CG-O04 | A — Advisory signals; only existing authorized SIGA gates may block | APPROVED — DOCUMENTARY | No new mandatory gates or constitutional ratification |
| CG-O05 | A — Preserve draft SKR P0 and SIGA P1 order; plan Guardian work only after roadmap reconciliation | APPROVED — DOCUMENTARY | Does not itself amend roadmap or prioritize M1 |
| ADR-CG-001 | B — Revision requested: "context guardian e siga devem ser um só" | REVISION REQUESTED / PENDING REAPPROVAL | Revised draft must describe a SIGA-internal capability, no separate skill/authority |
| ADR-CG-002 | A — Approve provenance, data availability taxonomy and portable handoff at documentary level | APPROVED — DOCUMENTARY | No implementation or constitutional ratification |

**Clarification for CG-D01/CG-D02:** target `az1nn/az1nn/skills/context-guardian/` identifies the **existing M0 documentation area only**. The user's latest design direction supersedes any reading of CG-D02 as approval to register an independently callable Guardian skill. Canonical runtime integration, if authorized later, belongs within **SIGA itself**.

## Pending items after CG-007
- **ADR-CG-001:** re-review revised single-SIGA architecture; no implied approval from its rewrite.
- **CG-007 final closure:** pending review of revised ADR-CG-001 and applicable governance assessment.
- **M1 and any constitutional change:** require separate explicit authorization.
- **Roadmap mutation:** not performed; future reconciliation with PR #19 needed.

## CG-008 — Reconciliation and documentary disposition (2026-10-29)

**New user decision:** `M01=A, M02=A, M03=A, M04=A`. Scope: correct PR #19 static CI; reconcile PR #20 and prepare merge of **remaining documentary files**; place SIGA context documentation under canonical SIGA directory; review PR #18 constitution before any merge. **No M1 implementation, automatic constitutional ratification, or Observatory merge.**

| Identifier | Documentary outcome | State / evidence |
|---|---|---|
| ADR-CG-001 | Single SIGA authority; Context Guardian as SIGA-internal checks | **Published to main as documentation** via PR #21, commit `4dafe3eca35a0416dc6300e02ac0cfa13e21bacb`. This supersedes the CG-007 **pending publication** status, **not** the distinct constitutional gate. |
| ADR-CG-002 | Provenance, sample-only measurements, portable handoff | **Published to main as documentation** via PR #21; same commit. |
| M01=A | Repair SKR validator against explicit G1=D approval | APPROVED correction on PR #19; test result to be checked at new exact HEAD |
| M02=A | Reconcile M0 documents against merged ADRs; prepare clean merge of remaining docs | APPROVED conditional documentary scope; no activation or M1 |
| M03=A | Place Context Guardian's design README with canonical SIGA documentation | APPROVED documentary relocation to `.github/skills/siga/context-guardian.md`, not change to `SKILL.md` |
| M04=A | Audit portable tree constitution and align draft before approval/merge | APPROVED audit, **NOT** constitutional ratification or PR #18 merge |

The original CG-007 rows and unapproved states above are **historical snapshots**, retained for audit. Their current disposition is specified here. The two ADR documents are already in `main` (same blob identities as PR #20).

### Pending, NOT authorized
- Any runtime/skill routing or execution integration of Guardian into SIGA; M1+.
- Any constitutional change to decision authority, topology, block/accept/execute rights, or a new mandatory gate.
- SKR PR #19 merge until exact-head CI plus outstanding behavioral checks and review satisfy gates.
- Godot PR #18 merge before completed constitutional review and explicit ratification where applicable.
- Observatory implementation/merge (PoC only).
