# SPEC-CG-001 — Architecture and staged plan

**State:** PLAN PROPOSED / IMPLEMENTATION NOT AUTHORIZED.

## Unified SIGA topology — CG-007 review
CG-007 clarifies that Context Guardian is **not** a separate executable skill or orchestrator. All proposed checks belong **inside SIGA**. The former standalone documentary directory is **retired** in M03=A; documentation now lives at `.github/skills/siga/context-guardian.md`. The canonical `SKILL.md` and all runtime routing remain untouched. ADR-CG-001 was published documentarily via PR #21; constitutional authority and implementation remain unapproved.

## Data flow
1. The SIGA invocation enters VERIFY-FIRST and reads available canonical state, an optional prior handoff and only the user-supplied/visible chat segment.
2. SIGA's proposed context/decision assessment labels every data source as `OBSERVED`, `HEURISTIC`, `IMPORTED`, or `UNAVAILABLE`.
3. Risk analysis emits evidence-linked advisory signals and separate confidence/coverage descriptors. No actual window-fill computation.
4. Decision integrity reconciles ledger IDs and source revisions; incompatible records go to original domain authority.
5. Inspector verifies objective invariants that already exist; Reporter prepares a sanitized portable CAVEMAN handoff.
6. SIGA alone chooses `RESUME/WATCH/ADVANCE` and owns any operational state transition.

## Internal SIGA functions (conceptual, not implemented)
- `SampleEstimator`: exact chars, heuristic tokens only when a sample is provided; label the token range as a coarse approximation.
- `CoverageProvenance`: track source type, observation timestamp, sample boundaries, verifiability.
- `DecisionLedger`: append-only conceptual history of proposed/approved/rejected/superseded decisions; never inferred approvals.
- `RiskRules`: deterministic, evidence-backed warnings without granting authority.
- `HandoffGuard`: checks CAVEMAN continuity fields and optional envelope extension against verified revision.
- `Presenter`: compact console/Markdown or Intelligent UI display with text fallback.

## Invocation and triggering
No continuous or truly proactive listening is available from the proposed native-chat SIGA capability. **CG-O02=A:** a SIGA-internal assessment is planned at every explicit SIGA invocation and each meaningful handoff boundary; an explicit audit request can also trigger it. This is an intended future behavior, **not currently active**. Automatic cross-chat capture, daemon schedules and token-level hooks are out of scope.

## Retention/privacy
**CG-O01=A:** store source references, sanitized decision IDs and compact handoffs within each owning project/workstream where authorized; use portable references across projects, not a mutable central ledger. Avoid full private chat text in `az1nn/az1nn` (public). Deduplicate decision IDs with explicit revisions and provenance; never rewrite a historical rejection into approval.

## Compatibility
- CAVEMAN HANDOFF v1: keep standard required fields. Optionally add namespaced **SIGA-internal** context-assessment data, not a separate Guardian handoff or authority.
- Observatory HandoffEnvelope v1: optional namespaced extension, not a replacement or required dependency. Observatory stays PoC only.
- **CG-O03=A:** Intelligent UI is progressive enhancement, Markdown is complete fallback; persistence belongs to the owning project.
- **CG-O04=A:** risk signals are advisory; only pre-existing authorized SIGA gates may block.
- Existing SIGA state machine: **exactly** `RESUME | WATCH | ADVANCE`. Guardian signals do not introduce a fourth continuation mode.
- Domain/constitutional conflicts: route to authorities; no self-ratification.

## Milestones and dependencies
- M0 — current: spec, plan, decisions, proposed contracts, acceptance checklist in draft PR; **no activation**.
- M1 — authorized later: deterministic text/coverage parser and fixture-based tests; no provider telemetry claims.
- M2 — authorized later: decision ledger/provenance and semantic-audit workflow with explicit uncertainty.
- M3 — authorized later: handoff extension and round-trip cross-session tests.
- M4 — authorized later: integrate internal checks **into canonical SIGA**, with Intelligent UI and Markdown fallback; do not register a separate Guardian skill. Assess constitutional implications before any authority/topology or blocking change.
- M5 — authorized later: regression/performance/security validations, staging and human acceptance.

## M02/M03 merge reconciliation
The two ADRs were merged separately through PR #21; this workstream must merge **only the remaining eight documentation files** after exact-head reconciliation. Relocate the proposed README to `.github/skills/siga/context-guardian.md`; do not register a second skill. Prior CG-007 pending-ADR language is preserved only as historical provenance. No reordering of SKR P0 / SIGA P1 is authorized.

## Existing roadmap conflict
PR #19 holds a draft `skills/ROADMAP.md` with P0 SKR and P1 SIGA flow verification. **CG-O05=A:** preserve existing P0 SKR and P1 SIGA verification priorities; do not add a second roadmap or reprioritize PR #19 from this PR. Schedule CG-001 only after future roadmap reconciliation.

## Risks
R1 false window occupancy metrics; R2 summaries treated as memory truth; R3 rejected decisions lost; R4 stale SHAs; R5 public repo sensitive data exposure; R6 conflicts between PR #18/#19; R7 over-blocking by advisory Guardian; R8 no continuous monitoring capability in native ChatGPT.

## Rollback
Delete/close the draft proposal branch/PR; main and all other PRs remain unchanged.
