# SPEC-CG-001 — Architecture and staged plan

**State:** PLAN PROPOSED / IMPLEMENTATION NOT AUTHORIZED.

## Data flow
1. The SIGA invocation enters VERIFY-FIRST and reads available canonical state, an optional prior handoff and only the user-supplied/visible chat segment.
2. Context Guardian labels every data source as `OBSERVED`, `HEURISTIC`, `IMPORTED`, or `UNAVAILABLE`.
3. Risk analysis emits evidence-linked advisory signals and separate confidence/coverage descriptors. No actual window-fill computation.
4. Decision integrity reconciles ledger IDs and source revisions; incompatible records go to original domain authority.
5. Inspector verifies objective invariants that already exist; Reporter prepares a sanitized portable CAVEMAN handoff.
6. SIGA alone chooses `RESUME/WATCH/ADVANCE` and owns any operational state transition.

## Modules (conceptual, not implemented)
- `SampleEstimator`: exact chars, heuristic tokens only when a sample is provided; label the token range as a coarse approximation.
- `CoverageProvenance`: track source type, observation timestamp, sample boundaries, verifiability.
- `DecisionLedger`: append-only conceptual history of proposed/approved/rejected/superseded decisions; never inferred approvals.
- `RiskRules`: deterministic, evidence-backed warnings without granting authority.
- `HandoffGuard`: checks CAVEMAN continuity fields and optional envelope extension against verified revision.
- `Presenter`: compact console/Markdown or Intelligent UI display with text fallback.

## Invocation and triggering
No continuous or truly proactive listening is possible from a standalone native ChatGPT skill. A Guardian assessment runs only when SIGA is invoked, or the user explicitly requests an audit, and can be attached to routine SIGA checkpoints. Automatic cross-chat capture, daemon schedules and token-level hooks are out of scope.

## Retention/privacy
Store source references, sanitized decision IDs and compact handoffs within the owning project/workstream where authorized. Avoid full private chat text in `az1nn/az1nn` (public). Deduplicate decision IDs with explicit revisions and provenance; never rewrite a historical rejection into approval.

## Compatibility
- CAVEMAN HANDOFF v1: keep standard required fields, add optional `CONTEXT_GUARDIAN` section when supported.
- Observatory HandoffEnvelope v1: optional namespaced extension, not a replacement or required dependency.
- Existing SIGA state machine: **exactly** `RESUME | WATCH | ADVANCE`. Guardian signals do not introduce a fourth continuation mode.
- Domain/constitutional conflicts: route to authorities; no self-ratification.

## Milestones and dependencies
- M0 — current: spec, plan, decisions, proposed contracts, acceptance checklist in draft PR; **no activation**.
- M1 — authorized later: deterministic text/coverage parser and fixture-based tests; no provider telemetry claims.
- M2 — authorized later: decision ledger/provenance and semantic-audit workflow with explicit uncertainty.
- M3 — authorized later: handoff extension and round-trip cross-session tests.
- M4 — authorized later: SIGA integration and visual UI, with explicit governance review for any changed blocking semantics.
- M5 — authorized later: regression/performance/security validations, staging and human acceptance.

## Existing roadmap conflict
PR #19 holds a draft `skills/ROADMAP.md` with P0 SKR and P1 SIGA flow verification. Do not add a second roadmap or reprioritize this one from another PR. Include CG-001 only after future roadmap reconciliation/approval.

## Risks
R1 false window occupancy metrics; R2 summaries treated as memory truth; R3 rejected decisions lost; R4 stale SHAs; R5 public repo sensitive data exposure; R6 conflicts between PR #18/#19; R7 over-blocking by advisory Guardian; R8 no continuous monitoring capability in native ChatGPT.

## Rollback
Delete/close the draft proposal branch/PR; main and all other PRs remain unchanged.
