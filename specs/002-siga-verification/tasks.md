# Tasks — Feature 002 SIGA verification

Status: PROPOSED. No SIGA canonical mutation authorized in this session.

## P0 prerequisite — close existing SKR PR #19 gates
- [x] ST00 Read canonical SIGA and adjacent proposed trees; capture real-session SKR evidence (discovery only).
- [ ] ST00b Finish SKR interactive/negative E2E and review/human gates in PR #19.

## P1 — testable flow / acceptance
- [ ] ST01 (FR-001, CT01) Verify one canonical definition and routing.
- [ ] ST02 (FR-002, CT02–CT04) Create fixture-based RESUME/WATCH/ADVANCE behavioral tests.
- [ ] ST03 (FR-003, CT05) Implement approved G1 D scope resolution: auto-select only a uniquely verified target; otherwise ask, with no mutation. Decision approved; implementation NOT_RUN.
- [ ] ST04 (FR-004, CT06–CT07) Test stale HEAD and overlapping ownership refusal.
- [ ] ST05 (FR-005, CT08) Test human gate and REJECT invariants.
- [ ] ST06 (FR-006, CT09) Check exact HEAD and honest evidence classifications.
- [ ] ST07 (FR-007, CT10) Test CAVEMAN handoff and new-session resume.
- [ ] ST08 (FR-008, CT11) Document and test draft ORCHESTRATOR compatibility once constitutional review permits.
- [ ] ST09 (FR-009, CT12) Validate Spec Kit traceability and roadmap priority under exact ref.
- [ ] ST10 Run end-to-end agent exercise and attach real observed output; do not mark from scripted text checks.

Human gate: G1 D APPROVED 2026-10-09. Implementation, tests and any other constitutional gates remain pending. Implement only in an owned branch/workstream after existing PR #19/PR #18 compatibility has been reconciled.
