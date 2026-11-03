# SPEC-CG-001 — Task ledger

## M0 — Documentary only (this proposed PR)
- [x] CG-001: Reconcile SIGA canonical skill, PR #18, PR #19 and Observatory PoC.
- [x] CG-002: Specify signals and precise measurement vs heuristic vs unavailable semantics.
- [x] CG-003: Define proposed DecisionRecord and optional handoff extension.
- [x] CG-004: Document authority, privacy, concurrency and human gates.
- [x] CG-005: Define acceptance and negative test scenarios.
- [x] CG-006: Inspect exact-head GitHub checks/status and record evidence (availability verified, **not** a CI pass).
- [x] CG-007: Design-review decisions recorded; ADR-CG-001 and ADR-CG-002 subsequently published **documentarily** via PR #21. Constitutional and M1 gates remain open.

- [x] CG-007a: Persist five approved choices and documentary approval of ADR-CG-002, preserve ADR-CG-001 revision request.
- [x] CG-007b: Verify conditional documentary publication of revised ADR-CG-001 via PR #21. **Separate constitutional ratification has not occurred** and remains outside this M0 task.

## M1+ — NOT AUTHORIZED
- [ ] CG-101: Build deterministic estimator with documented heuristics and coverage markers.
- [ ] CG-102: Add fixture/unit tests and schema validation.
- [ ] CG-201: Implement append-only decision ledger and provenance checks.
- [ ] CG-301: Validate round-trip CAVEMAN handoff and optional envelope extension.
- [ ] CG-401: Integrate invocation boundaries with SIGA under governance review.
- [ ] CG-402: Implement portable UI and text-only fallback.
- [ ] CG-501: Security, concurrency, performance and multi-session E2E verification.

## Dependencies and conflict policy
- PR #19's draft skills roadmap puts SKR P0 ahead of SIGA verification P1; do not silently reorder either.
- PR #18's portable tree is not merged; Guardian must work without assuming it exists on main.
- Observatory is independent PoC only.
- No M1 task may start based solely on this ledger.

## CG-006 — Evidence register (2026-10-29)
- Source revision inspected: `c1094596d5d79e3f411c371924be3bd460ac68d7` (PR #20 before this documentation update).
- [GitHub Check Runs](https://github.com/az1nn/az1nn/commit/c1094596d5d79e3f411c371924be3bd460ac68d7/checks): `Vercel Preview Comments` = SUCCESS (completed).
- [GitHub combined status](https://api.github.com/repos/az1nn/az1nn/commits/c1094596d5d79e3f411c371924be3bd460ac68d7/status): `Vercel` = SUCCESS (deployment completed).
- GitHub Actions PR-triggered workflow runs returned **none** at this SHA (NOT_RUN / not evidence of successful validation).
- Neither status validates Spec Kit, JSON Schema contracts, or runtime behavior. No approval, merge, or M1 authorization follows.
- Since this record itself changes HEAD, reconcile and re-inspect the **new exact HEAD** after committing. Record its status in the PR discussion without changing HEAD again.

## CG-007 — Review outcome (2026-10-29)
- Selected: `CG-O01=A`, `CG-O02=A`, `CG-O03=A`, `CG-O04=A`, `CG-O05=A`.
- `ADR-CG-001=B`: revision requested — 'context guardian e siga devem ser um só'. Revised ADR was subsequently published documentarily via PR #21; SIGA-internal capability only, no separate executable skill. **No constitutional ratification.**
- `ADR-CG-002=A`: **APPROVED FOR DOCUMENTARY DESIGN**, without granting M1 or constitutional authority.
- Protected dependencies: PR #18 and #19 unchanged; Observatory PR #1 PoC only; SKR P0 / SIGA P1 preserved.
- CG-007 documentary disposition complete after PR #21. M1 activation and constitutional ratification remain pending separate authorizations.

## CG-008 — User-selected closeout actions
- [x] M01=A: Identify cause of exact-head SKR `static-contract` failure (validator demanded stale `G1 HUMAN_GATE` instead of approved `G1 D APPROVED`); correction applied in PR #19. CI exact-head verification remains separately required.
- [x] M02=A: Reconcile PR #20 branch after PR #21 ADR merge; preserve historical decisions.
- [x] M03=A: Locate SIGA-internal documentation under `.github/skills/siga/context-guardian.md` without changing `SKILL.md` or adding a callable skill.
- [ ] M02 merge gate: verify only eight remaining documentary paths, no unrelated diff, check exact-head CI/reviews and merge only if eligible.
- [ ] M04=A: Finish constitutional/compatibility audit of PR #18; preserve human gate before any PR #18 merge.
- [ ] M1 implementation and constitutional ratification: NOT AUTHORIZED.
