# SPEC-CG-001 — Task ledger

## M0 — Documentary only (this proposed PR)
- [x] CG-001: Reconcile SIGA canonical skill, PR #18, PR #19 and Observatory PoC.
- [x] CG-002: Specify signals and precise measurement vs heuristic vs unavailable semantics.
- [x] CG-003: Define proposed DecisionRecord and optional handoff extension.
- [x] CG-004: Document authority, privacy, concurrency and human gates.
- [x] CG-005: Define acceptance and negative test scenarios.
- [x] CG-006: Inspect exact-head GitHub checks/status and record evidence (availability verified, **not** a CI pass).
- [ ] CG-007: Obtain documentary review and approve next phase explicitly.

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
